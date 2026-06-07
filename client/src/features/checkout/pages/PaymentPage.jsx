import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Wallet, CheckCircle } from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../../../shared/ui/ArabicPattern';
import { getCart, clearCart, parsePrice } from '../../../utils/orderStorage';
import confetti from 'canvas-confetti';
import api from '../../../utils/api';

export default function PaymentPage() {
  const [cart, setCart] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, wallet, cash
  
  // Card Inputs
  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvv: '' });
  // Wallet Inputs
  const [walletNumber, setWalletNumber] = useState('');
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const items = getCart();
    setCart(items);
    
    const info = sessionStorage.getItem('arabic_kitchen_checkout_draft');
    if (!info || items.length === 0) {
      window.location.hash = '#cart';
      return;
    }
    setCheckoutInfo(JSON.parse(info));
  }, []);

  const handleCardInputChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'number') {
      value = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = value.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        value = parts.join(' ');
      } else {
        value = value;
      }
      value = value.substring(0, 19); // Cap at 16 digits + 3 spaces
    }

    // Format Expiry with slash (MM/YY)
    if (name === 'expiry') {
      value = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      value = value.substring(0, 5); // Cap at MM/YY
    }

    // Cap CVV at 3 digits
    if (name === 'cvv') {
      value = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      value = value.substring(0, 3);
    }

    setCardData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleWalletInputChange = (e) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').substring(0, 11);
    setWalletNumber(value);
    if (errors.wallet) {
      setErrors(prev => ({ ...prev, wallet: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    
    if (paymentMethod === 'card') {
      if (!cardData.name.trim()) tempErrors.name = 'Cardholder name is required';
      if (cardData.number.replace(/\s/g, '').length < 16) tempErrors.number = 'Invalid card number (16 digits required)';
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardData.expiry)) tempErrors.expiry = 'Invalid expiry date (MM/YY)';
      if (cardData.cvv.length < 3) tempErrors.cvv = 'CVV is required (3 digits)';
    } else if (paymentMethod === 'wallet') {
      const phoneRegex = /^((\+92)?(92)?(0)?3[0-9]{9})$/;
      if (!walletNumber) {
        tempErrors.wallet = 'Mobile wallet phone number is required';
      } else if (!phoneRegex.test(walletNumber)) {
        tempErrors.wallet = 'Invalid Pakistan phone number';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Gather Order Summary Details
    const subtotal = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = checkoutInfo.type === 'delivery' ? 200 : 0;
    const total = subtotal + tax + deliveryFee;

    const paymentStatus = paymentMethod === 'cash' ? 'pending' : 'paid';

    const newOrder = {
      name: checkoutInfo.name,
      phone: checkoutInfo.phone,
      type: checkoutInfo.type,
      table: checkoutInfo.table,
      address: checkoutInfo.address,
      requests: checkoutInfo.requests,
      items: cart,
      paymentMethod,
      paymentStatus,
      subtotal,
      deliveryFee,
      total
    };

    try {
      // Save order to backend
      const response = await api.post('/orders', newOrder);
      const saved = response.data.order || response.data; // Depending on backend response format
      
      // Trigger Success Confetti Stars
      triggerGoldConfetti();

      // Clear cart and drafts
      clearCart();
      sessionStorage.removeItem('arabic_kitchen_checkout_draft');
      
      // Save order ID to session storage to track on confirmation page
      sessionStorage.setItem('arabic_kitchen_last_order_id', saved._id);

      // Redirect to confirmation page after short delay
      setTimeout(() => {
        window.location.hash = `#confirmation?id=${saved._id}`;
      }, 1000);
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const triggerGoldConfetti = () => {
    const end = Date.now() + 1.5 * 1000;
    const colors = ['#C9952A', '#E8BA5A', '#FAF3E0'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (!checkoutInfo) return null;

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    return sum + (parsePrice(item.price) * item.quantity);
  }, 0);
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = checkoutInfo.type === 'delivery' ? 200 : 0;
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
          href="#checkout" 
          className="inline-flex items-center gap-2 text-label-sm uppercase tracking-widest text-gold hover:text-gold-light transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Checkout
        </a>

        {/* Header Block */}
        <header className="text-center mb-12">
          <span className="font-arabic text-[#C9952A] text-body-sm tracking-[0.25em] mb-1 block uppercase">
            بوابة الدفع
          </span>
          <h1 className="font-display italic text-title-xl text-ivory tracking-tight leading-tight mb-2">
            Secure Payment
          </h1>
          <MuqarnasArch color="#C9952A" size={40} className="mx-auto" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Payment Options Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Payment Method Selector card */}
            <div className="border border-gold/20 bg-[#1F1108]/90 rounded-[2px] p-6 shadow-md relative overflow-hidden text-left">
              <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />
              
              <h3 className="text-label-sm uppercase tracking-widest text-gold mb-6 border-b border-gold/10 pb-3 font-semibold flex items-center justify-between font-body">
                <span>Select payment method</span>
                <span className="text-label-xs text-cream/40 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-gold/60" /> 256-Bit SSL Secured
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                
                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-4 border rounded-[2px] flex flex-col items-center justify-center gap-2 transition-all duration-300 font-body ${
                    paymentMethod === 'card'
                      ? 'border-[#C9952A] bg-gold/10 text-gold shadow-sm'
                      : 'border-gold/10 hover:border-gold/30 bg-[#1A0A00]/50 text-cream/70 hover:text-ivory'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-label-xs uppercase font-bold tracking-widest">Credit / Debit Card</span>
                </button>

                {/* Mobile Wallet */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`py-4 border rounded-[2px] flex flex-col items-center justify-center gap-2 transition-all duration-300 font-body ${
                    paymentMethod === 'wallet'
                      ? 'border-[#C9952A] bg-gold/10 text-gold shadow-sm'
                      : 'border-gold/10 hover:border-gold/30 bg-[#1A0A00]/50 text-cream/70 hover:text-ivory'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-label-xs uppercase font-bold tracking-widest">Mobile Wallet</span>
                </button>

                {/* Cash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-4 border rounded-[2px] flex flex-col items-center justify-center gap-2 transition-all duration-300 font-body ${
                    paymentMethod === 'cash'
                      ? 'border-[#C9952A] bg-gold/10 text-gold shadow-sm'
                      : 'border-gold/10 hover:border-gold/30 bg-[#1A0A00]/50 text-cream/70 hover:text-ivory'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-label-xs uppercase font-bold tracking-widest text-center px-1">
                    {checkoutInfo.type === 'delivery' ? 'Cash on Delivery' : 'Pay at Restaurant'}
                  </span>
                </button>

              </div>

              {/* Conditional Inputs container */}
              <div className="space-y-4">
                
                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    
                    {/* Cardholder Name */}
                    <div className="flex flex-col items-start gap-1 w-full">
                      <label className="text-label-xs uppercase tracking-widest text-cream/60">Cardholder Name</label>
                      <input
                        type="text"
                        name="name"
                        value={cardData.name}
                        onChange={handleCardInputChange}
                        placeholder="e.g. Muhammad Yousaf"
                        className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body"
                      />
                      {errors.name && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.name}</span>}
                    </div>

                    {/* Card Number */}
                    <div className="flex flex-col items-start gap-1 w-full">
                      <label className="text-label-xs uppercase tracking-widest text-cream/60">Card Number</label>
                      <input
                        type="text"
                        name="number"
                        value={cardData.number}
                        onChange={handleCardInputChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body font-mono tracking-widest"
                      />
                      {errors.number && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.number}</span>}
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-start gap-1">
                        <label className="text-label-xs uppercase tracking-widest text-cream/60">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body font-mono"
                        />
                        {errors.expiry && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.expiry}</span>}
                      </div>

                      <div className="flex flex-col items-start gap-1">
                        <label className="text-label-xs uppercase tracking-widest text-cream/60">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardInputChange}
                          placeholder="***"
                          className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body font-mono"
                        />
                        {errors.cvv && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.cvv}</span>}
                      </div>
                    </div>

                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    <div className="p-4 border border-gold/15 bg-[#1A0A00]/40 rounded-[2px] text-body-sm text-cream/80 leading-relaxed font-body mb-2 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <span>Supports <strong>JazzCash</strong> and <strong>Easypaisa</strong>. Enter your registered wallet number. A secure PIN checkout prompt will appear directly on your handset screen.</span>
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                      <label className="text-label-xs uppercase tracking-widest text-cream/60">Wallet Mobile Number</label>
                      <input
                        type="tel"
                        value={walletNumber}
                        onChange={handleWalletInputChange}
                        placeholder="e.g. 03001234567"
                        className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2.5 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body font-mono"
                      />
                      {errors.wallet && <span className="text-label-xs text-accent-red font-semibold mt-0.5">{errors.wallet}</span>}
                    </div>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="p-5 border border-gold/10 bg-[#1A0A00]/40 rounded-[2px] text-center animate-fade-in space-y-2">
                    <p className="text-body-sm text-cream/85 font-body">
                      {checkoutInfo.type === 'delivery' ? (
                        <>You have selected <strong>Cash on Delivery</strong>. Please pay our rider <strong>PKR {formatPKR(grandTotal)}</strong> upon arrival at your doorstep.</>
                      ) : checkoutInfo.type === 'takeaway' ? (
                        <>You have selected <strong>Pay at Counter</strong>. Please pay our cashier upon picking up your order package.</>
                      ) : (
                        <>You have selected <strong>Pay at Table</strong>. Your order will be cooked immediately and billed to your table reservation.</>
                      )}
                    </p>
                    <p className="text-label-xs text-gold/60 uppercase tracking-widest font-mono">No advance payment required</p>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Column: Checkout Pricing Summary */}
          <div className="lg:col-span-4">
            <div className="border border-gold/25 bg-[#1F1108]/95 p-6 rounded-[2px] shadow-[0_15px_30px_rgba(0,0,0,0.7)] relative overflow-hidden sticky top-32 text-left">
              <div className="absolute inset-2 border border-gold/10 pointer-events-none" />

              <h3 className="font-display italic text-title-sm text-gold mb-6 border-b border-gold/15 pb-3">
                Final Invoice
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
              </div>

              <div className="flex justify-between items-center py-4 mb-6">
                <span className="text-label-sm uppercase tracking-widest text-gold font-semibold">Grand Total</span>
                <span className="font-mono text-title-sm font-bold text-gold-light">PKR {formatPKR(grandTotal)}</span>
              </div>

              {/* Complete Order CTA */}
              <button 
                onClick={handleCompleteOrder}
                className="w-full py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-body text-label-sm font-bold uppercase tracking-[0.2em] rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Complete Royal Order
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-label-xs text-cream/40 font-mono uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-gold/60" /> 100% Secure Checkout
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
