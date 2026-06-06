import React, { useState, useEffect } from 'react';
import { 
  Check, Clock, Flame, ShieldAlert, CheckCircle, 
  MapPin, ShoppingBag, Phone, ArrowLeft, Coffee, Truck, UtensilsCrossed 
} from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../../../components/ui/ArabicPattern';
import { getOrders } from '../../../utils/orderStorage';

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null);

  const fetchOrder = () => {
    // Extract ID from URL hash e.g. #confirmation?id=ord_123
    const hash = window.location.hash;
    const parts = hash.split('?');
    let orderId = '';
    
    if (parts.length > 1) {
      const params = new URLSearchParams(parts[1]);
      orderId = params.get('id') || '';
    }
    
    // Fallback to last placed order in session
    if (!orderId) {
      orderId = sessionStorage.getItem('arabic_kitchen_last_order_id') || '';
    }

    if (orderId) {
      const orders = getOrders();
      const found = orders.find(ord => ord.id === orderId);
      setOrder(found || null);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Listen to database changes (e.g. when staff updates status)
    window.addEventListener('ordersUpdated', fetchOrder);
    window.addEventListener('hashchange', fetchOrder);
    
    return () => {
      window.removeEventListener('ordersUpdated', fetchOrder);
      window.removeEventListener('hashchange', fetchOrder);
    };
  }, []);

  if (!order) {
    return (
      <div 
        className="min-h-screen text-ivory font-body pt-32 pb-20 px-6 relative flex items-center justify-center bg-[#1A0A00]"
        style={{
          background: 'radial-gradient(ellipse at center, #2C1205 0%, #0F0500 100%)',
        }}
      >
        <KhatamPattern opacity={0.05} />
        <div className="text-center relative z-10 p-8 border border-gold/25 bg-[#1F1108]/90 max-w-sm rounded-[2px] shadow-lg">
          <ShieldAlert className="w-10 h-10 text-accent-red mx-auto mb-4" />
          <h3 className="font-display italic text-title-sm text-gold mb-2">Order Not Found</h3>
          <p className="text-body-sm text-cream/70 mb-6 font-body">We could not retrieve the details for this order. It may have been archived or deleted.</p>
          <a href="#" className="px-6 py-2.5 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors font-body">Return Home</a>
        </div>
      </div>
    );
  }

  // Determine active step index
  // pending (0) -> preparing (1) -> served (2) -> completed (3)
  const steps = [
    { label: 'Order Placed', desc: 'Received in kitchen', icon: Check },
    { label: 'Preparing', desc: 'Chefs are cooking', icon: Flame },
    { 
      label: order.type === 'delivery' ? 'Dispatched' : order.type === 'takeaway' ? 'Ready for Pickup' : 'Served to Table', 
      desc: order.type === 'delivery' ? 'Rider is en route' : order.type === 'takeaway' ? 'Awaiting pickup' : 'Bon appetite', 
      icon: order.type === 'delivery' ? Truck : order.type === 'takeaway' ? ShoppingBag : Coffee 
    },
    { label: 'Completed', desc: 'Feast finished', icon: CheckCircle }
  ];

  let activeStep = 0;
  if (order.status === 'preparing') activeStep = 1;
  else if (order.status === 'served') activeStep = 2;
  else if (order.status === 'completed') activeStep = 3;

  // Status message
  let statusMessage = 'We have received your order. Our chefs are preparing to cook your selection...';
  if (order.status === 'preparing') {
    statusMessage = 'Your feast is currently cooking in our royal kitchen. Master chefs are applying authentic Arabian spices...';
  } else if (order.status === 'served') {
    if (order.type === 'delivery') {
      statusMessage = 'Fantastic news! Your order has been dispatched. Our delivery rider is navigating to your address...';
    } else if (order.type === 'takeaway') {
      statusMessage = 'Your meal package is hot and ready at our pickup counter! Please collect it at your earliest convenience.';
    } else {
      statusMessage = 'Your dishes have been freshly served to your table. Enjoy your authentic dining experience!';
    }
  } else if (order.status === 'completed') {
    statusMessage = 'Your culinary journey is complete. Thank you for choosing Arabic Kitchen! We look forward to hosting you again.';
  } else if (order.status === 'cancelled') {
    statusMessage = 'This order has been cancelled by the staff. Please contact our front desk at +92 62 1234567 for support.';
  }

  const formatPKR = (num) => {
    return num.toLocaleString();
  };

  return (
    <div 
      className="min-h-screen text-ivory font-body pt-32 pb-20 px-6 md:px-12 relative overflow-hidden bg-[#1A0A00]"
      style={{
        background: 'radial-gradient(ellipse at center, #2C1205 0%, #0F0500 100%)',
      }}
    >
      <KhatamPattern opacity={0.05} />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation Link */}
        <a 
          href="#" 
          className="inline-flex items-center gap-2 text-label-sm uppercase tracking-widest text-gold hover:text-gold-light transition-colors mb-8 group font-body"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home Page
        </a>

        {/* Confirmation Banner */}
        <div className="border-2 border-gold/25 p-8 bg-[#1F1108]/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden rounded-[2px] mb-8 text-center">
          <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />
          
          <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mx-auto mb-4 bg-gold/5">
            <Check className="w-6 h-6 text-gold" />
          </div>
          
          <span className="font-arabic text-label-xs tracking-[0.25em] text-gold uppercase block">طلب مؤكد</span>
          <h2 className="font-display italic text-title-lg text-gold-light mt-1 mb-2">Order Confirmed!</h2>
          <p className="text-label-xs text-cream/50 uppercase tracking-widest font-mono">Order ID: {order.id}</p>
          
          <p className="text-body-sm text-cream/75 leading-relaxed max-w-lg mx-auto mt-4 font-body">
            Thank you, <strong>{order.name}</strong>. Your royal feast order has been placed. We are preparing everything to our highest culinary standards.
          </p>
        </div>

        {/* Live Order Tracker tracker */}
        {order.status !== 'cancelled' ? (
          <div className="border border-gold/20 bg-[#1F1108]/75 p-6 md:p-8 rounded-[2px] mb-8 shadow-md relative overflow-hidden text-left">
            <div className="absolute inset-1 border border-gold/5 pointer-events-none" />
            
            <h3 className="text-label-sm uppercase tracking-widest text-gold mb-8 border-b border-gold/10 pb-3 font-semibold text-center md:text-left font-body">
              Live Order Tracker
            </h3>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 relative">
              {/* Stepper Line (desktop) */}
              <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-[2px] bg-gold/15 z-0" />
              
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isCompleted = idx <= activeStep;
                const isCurrent = idx === activeStep;

                return (
                  <div key={idx} className="flex flex-col items-center text-center relative z-10">
                    {/* Circle Indicator */}
                    <div 
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 shadow-md ${
                        isCurrent 
                          ? 'border-gold bg-[#C9952A] text-[#1A0A00] scale-110 shadow-[0_0_15px_rgba(201,149,42,0.4)]' 
                          : isCompleted 
                            ? 'border-gold bg-gold/10 text-gold' 
                            : 'border-gold/20 bg-[#1A0A00]/80 text-cream/30'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                    </div>

                    {/* Step Labels */}
                    <h4 className={`text-label-sm font-bold uppercase tracking-wider mt-3.5 ${isCompleted ? 'text-gold-light' : 'text-cream/35'} font-body`}>
                      {step.label}
                    </h4>
                    <p className={`text-label-xs mt-0.5 max-w-[140px] leading-tight ${isCompleted ? 'text-cream/60' : 'text-cream/25'} font-body`}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Status Message */}
            <div className="mt-8 pt-6 border-t border-gold/10 text-center">
              <p className="text-body-sm text-gold italic font-semibold leading-relaxed px-4">
                "{statusMessage}"
              </p>
            </div>

          </div>
        ) : (
          /* Cancelled Order message */
          <div className="border border-accent-red/25 bg-[#8B1A1A]/10 p-6 rounded-[2px] mb-8 text-center flex items-center justify-center gap-3">
            <ShieldAlert className="w-5 h-5 text-accent-red animate-bounce" />
            <span className="text-body-sm text-accent-red font-bold uppercase tracking-wider">Order Cancelled: {statusMessage}</span>
          </div>
        )}

        {/* Invoice Receipt Receipt */}
        <div className="border border-gold/20 bg-[#1F1108]/90 p-6 md:p-8 rounded-[2px] shadow-md relative overflow-hidden text-left">
          <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />

          <h3 className="text-label-sm uppercase tracking-widest text-gold mb-6 border-b border-gold/10 pb-3 font-semibold font-body">
            Order Receipt & Invoice
          </h3>

          {/* Customer Metadata details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gold/15 mb-6 text-body-sm text-cream/80">
            <div className="space-y-2.5">
              <div>
                <span className="text-label-xs text-cream/40 uppercase block">Customer Name</span>
                <span className="font-semibold text-ivory">{order.name}</span>
              </div>
              <div>
                <span className="text-label-xs text-cream/40 uppercase block">Phone Number</span>
                <span className="font-semibold text-ivory font-mono">{order.phone}</span>
              </div>
              {order.requests && (
                <div>
                  <span className="text-label-xs text-cream/40 uppercase block">Special requests</span>
                  <span className="italic text-gold-light">"{order.requests}"</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <div>
                <span className="text-label-xs text-cream/40 uppercase block">Order Fulfillment Mode</span>
                <span className="font-semibold text-gold uppercase font-mono">{order.type}</span>
              </div>
              
              {order.type === 'dine-in' && (
                <div>
                  <span className="text-label-xs text-cream/40 uppercase block">Seated Table</span>
                  <span className="font-semibold text-ivory">{order.table}</span>
                </div>
              )}

              {order.type === 'delivery' && (
                <div>
                  <span className="text-label-xs text-cream/40 uppercase block">Delivery Address</span>
                  <span className="font-semibold text-ivory flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> {order.address}
                  </span>
                </div>
              )}

              <div>
                <span className="text-label-xs text-cream/40 uppercase block">Payment Method</span>
                <span className="font-semibold text-ivory uppercase font-mono flex items-center gap-1.5">
                  {order.paymentMethod} | 
                  <span className={`text-label-xs uppercase font-bold tracking-wide ${order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ({order.paymentStatus})
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Food items */}
          <div className="space-y-4 mb-6">
            <h4 className="text-label-xs uppercase tracking-widest text-gold font-bold">Ordered Dishes</h4>
            <div className="divide-y divide-gold/10 border-b border-gold/15 pb-4">
              {order.items.map((item) => (
                <div key={item.name} className="py-3.5 flex items-center justify-between gap-4 first:pt-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-10 h-10 object-cover border border-gold/15 rounded-[2px]" 
                    />
                    <div className="flex flex-col">
                      <span className="font-display italic text-body-md text-ivory">{item.name}</span>
                      <span className="text-label-xs text-cream/50">PKR {item.price} &times; {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono text-body-sm font-bold text-ivory">
                    PKR {formatPKR(parsePrice(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals sheet */}
          <div className="space-y-2.5 max-w-xs ml-auto text-body-sm text-cream/80 font-body">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-ivory">PKR {formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-mono text-ivory">PKR {formatPKR(order.deliveryFee > 0 ? Math.round(order.subtotal * 0.05) : order.total - order.subtotal)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-mono text-ivory">PKR {formatPKR(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-gold/20 pt-3 text-body-md font-semibold mt-2">
              <span className="uppercase text-gold font-bold">Grand Total</span>
              <span className="font-mono text-[#C9952A] text-title-sm font-bold">PKR {formatPKR(order.total)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
