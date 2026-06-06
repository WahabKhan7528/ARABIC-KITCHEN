import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Truck, Store, Coffee, MapPin, User, Phone } from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../../../components/ui/ArabicPattern';
import { getCart, parsePrice } from '../../../utils/orderStorage';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'delivery', // dine-in, takeaway, delivery
    table: '',
    address: '',
    requests: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const items = getCart();
    setCart(items);
    // Redirect if cart is empty
    if (items.length === 0) {
      window.location.hash = '#cart';
    }

    // Load draft if exists
    const draft = sessionStorage.getItem('arabic_kitchen_checkout_draft');
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        console.error('Error parsing draft', e);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, type, table: '', address: '' }));
    setErrors({});
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    
    const phoneRegex = /^((\+92)?(92)?(0)?3[0-9]{9})$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      tempErrors.phone = 'Invalid Pakistan phone (e.g. 03001234567)';
    }

    if (formData.type === 'dine-in' && !formData.table.trim()) {
      tempErrors.table = 'Table assignment is required for Dine-in';
    }
    
    if (formData.type === 'delivery' && !formData.address.trim()) {
      tempErrors.address = 'Delivery address is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Save draft checkout info
    sessionStorage.setItem('arabic_kitchen_checkout_draft', JSON.stringify(formData));
    
    // Navigate to payment page
    window.location.hash = '#payment';
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    return sum + (parsePrice(item.price) * item.quantity);
  }, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const deliveryFee = formData.type === 'delivery' ? 200 : 0;
  const grandTotal = subtotal + tax + deliveryFee;

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

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Back Link */}
        <a 
          href="#cart" 
          className="inline-flex items-center gap-2 text-label-sm uppercase tracking-widest text-gold hover:text-gold-light transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </a>

        {/* Header Block */}
        <header className="text-center mb-12">
          <span className="font-arabic text-[#C9952A] text-body-sm tracking-[0.25em] mb-1 block uppercase">
            إتمام الطلب
          </span>
          <h1 className="font-display italic text-title-xl text-ivory tracking-tight leading-tight mb-2">
            Checkout Details
          </h1>
          <MuqarnasArch color="#C9952A" size={40} className="mx-auto" />
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Checkout Fields */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Contact Details */}
            <div className="border border-gold/20 bg-[#1F1108]/90 rounded-[2px] p-6 shadow-md relative overflow-hidden text-left">
              <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />
              
              <h3 className="text-label-sm uppercase tracking-widest text-gold mb-6 border-b border-gold/10 pb-3 font-semibold flex items-center gap-2 font-body">
                <User className="w-4 h-4" /> Guest Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Muhammad Yousaf"
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold font-body"
                  />
                  {errors.name && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.name}</span>}
                </div>

                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60">Phone (Pakistan)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 03001234567"
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold font-body"
                  />
                  {errors.phone && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* 2. Order Mode Toggle */}
            <div className="border border-gold/20 bg-[#1F1108]/90 rounded-[2px] p-6 shadow-md relative overflow-hidden text-left">
              <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />
              
              <h3 className="text-label-sm uppercase tracking-widest text-gold mb-6 border-b border-gold/10 pb-3 font-semibold font-body">
                Select Order Fulfillment Type
              </h3>

              {/* Order Mode Tab selectors */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                
                {/* Delivery */}
                <button
                  type="button"
                  onClick={() => handleTypeChange('delivery')}
                  className={`py-3.5 border rounded-[2px] flex flex-col items-center justify-center gap-2 transition-all duration-300 font-body ${
                    formData.type === 'delivery'
                      ? 'border-[#C9952A] bg-gold/10 text-gold shadow-sm'
                      : 'border-gold/10 hover:border-gold/30 bg-[#1A0A00]/50 text-cream/70 hover:text-ivory'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-label-xs uppercase font-bold tracking-widest">Home Delivery</span>
                </button>

                {/* Takeaway */}
                <button
                  type="button"
                  onClick={() => handleTypeChange('takeaway')}
                  className={`py-3.5 border rounded-[2px] flex flex-col items-center justify-center gap-2 transition-all duration-300 font-body ${
                    formData.type === 'takeaway'
                      ? 'border-[#C9952A] bg-gold/10 text-gold shadow-sm'
                      : 'border-gold/10 hover:border-gold/30 bg-[#1A0A00]/50 text-cream/70 hover:text-ivory'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-label-xs uppercase font-bold tracking-widest">Takeaway</span>
                </button>

                {/* Dine-In */}
                <button
                  type="button"
                  onClick={() => handleTypeChange('dine-in')}
                  className={`py-3.5 border rounded-[2px] flex flex-col items-center justify-center gap-2 transition-all duration-300 font-body ${
                    formData.type === 'dine-in'
                      ? 'border-[#C9952A] bg-gold/10 text-gold shadow-sm'
                      : 'border-gold/10 hover:border-gold/30 bg-[#1A0A00]/50 text-cream/70 hover:text-ivory'
                  }`}
                >
                  <Coffee className="w-5 h-5" />
                  <span className="text-label-xs uppercase font-bold tracking-widest">Dine-In</span>
                </button>

              </div>

              {/* Conditional fulfillment fields */}
              <div className="space-y-4 text-left">
                
                {formData.type === 'delivery' && (
                  <div className="flex flex-col items-start gap-1 w-full animate-fade-in">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold" /> Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter full physical address, street name, house number, landmarks..."
                      className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold font-body resize-none"
                    />
                    {errors.address && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.address}</span>}
                    <span className="text-label-xs text-gold/60 mt-1 font-body">A flat delivery fee of PKR 200 will be added.</span>
                  </div>
                )}

                {formData.type === 'takeaway' && (
                  <div className="p-4 border border-gold/10 bg-[#1A0A00]/40 rounded-[2px] text-center animate-fade-in">
                    <p className="text-body-sm text-cream/80 leading-relaxed font-body">
                      Your order will be packaged for pickup at our Model Town branch. Preparing time is approximately <span className="text-gold font-bold">25-35 minutes</span>.
                    </p>
                  </div>
                )}

                {formData.type === 'dine-in' && (
                  <div className="flex flex-col items-start gap-1 w-full animate-fade-in text-left">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60">Table Number / Section</label>
                    <input
                      type="text"
                      name="table"
                      value={formData.table}
                      onChange={handleInputChange}
                      placeholder="e.g. Table 5 / Majlis A"
                      className="w-2/3 sm:w-1/2 bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold font-body"
                    />
                    {errors.table && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.table}</span>}
                    <span className="text-label-xs text-cream/50 mt-1 font-body">Please specify the exact table number you are seated at or have reserved.</span>
                  </div>
                )}

              </div>
            </div>

            {/* 3. Cooking Requests */}
            <div className="border border-gold/20 bg-[#1F1108]/90 rounded-[2px] p-6 shadow-md relative overflow-hidden text-left">
              <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />
              <h3 className="text-label-sm uppercase tracking-widest text-gold mb-4 border-b border-gold/10 pb-3 font-semibold font-body">
                Special Requests / Kitchen Instructions
              </h3>
              <textarea
                name="requests"
                value={formData.requests}
                onChange={handleInputChange}
                rows="2"
                placeholder="e.g. Make it extra spicy, allergy warnings, no onions..."
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold font-body resize-none"
              />
            </div>

          </div>

          {/* Right Column: Order Pricing Receipt */}
          <div className="lg:col-span-4">
            <div className="border border-gold/25 bg-[#1F1108]/95 p-6 rounded-[2px] shadow-[0_15px_30px_rgba(0,0,0,0.7)] relative overflow-hidden sticky top-32 text-left">
              <div className="absolute inset-2 border border-gold/10 pointer-events-none" />

              <h3 className="font-display italic text-title-sm text-gold mb-6 border-b border-gold/15 pb-3">
                Checkout Summary
              </h3>

              <div className="space-y-3 font-body text-body-sm text-cream/80 border-b border-gold/10 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-ivory">PKR {formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono text-ivory">PKR {formatPKR(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-mono text-ivory">
                    {deliveryFee > 0 ? `PKR ${formatPKR(deliveryFee)}` : 'PKR 0'}
                  </span>
                </div>
                
                {/* Service mode badge */}
                <div className="flex justify-between items-center text-label-xs text-cream/40 pt-2 font-mono">
                  <span>FULFILLMENT TYPE</span>
                  <span className="uppercase text-gold font-bold">{formData.type}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 mb-6">
                <span className="text-label-sm uppercase tracking-widest text-gold font-semibold">Grand Total</span>
                <span className="font-mono text-title-sm font-bold text-gold-light">PKR {formatPKR(grandTotal)}</span>
              </div>

              {/* Checkout CTA */}
              <button 
                type="submit"
                className="w-full py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-body text-label-sm font-bold uppercase tracking-[0.2em] rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Proceed to Payment
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
