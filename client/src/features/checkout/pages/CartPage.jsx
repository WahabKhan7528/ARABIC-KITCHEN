import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ChevronRight, Utensils } from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../../../shared/ui/ArabicPattern';
import { getCart, updateCartQuantity, removeFromCart, parsePrice } from '../../../utils/orderStorage';

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
    const handleCartUpdate = () => {
      setCart(getCart());
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleQtyChange = (name, amount) => {
    updateCartQuantity(name, amount);
  };

  const handleRemove = (name) => {
    removeFromCart(name);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    return sum + (parsePrice(item.price) * item.quantity);
  }, 0);

  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + tax;

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
          href="#menu" 
          className="inline-flex items-center gap-2 text-label-sm uppercase tracking-widest text-gold hover:text-gold-light transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </a>

        {/* Header Block */}
        <header className="text-center mb-12">
          <span className="font-arabic text-[#C9952A] text-body-sm tracking-[0.25em] mb-1 block uppercase">
            سلة المشتريات
          </span>
          <h1 className="font-display italic text-title-xl text-ivory tracking-tight leading-tight mb-2">
            Your Royal Order List
          </h1>
          <MuqarnasArch color="#C9952A" size={40} className="mx-auto" />
        </header>

        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="border border-gold/25 bg-[#1F1108]/85 p-12 text-center rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute inset-2 border border-gold/10 pointer-events-none" />
            <Utensils className="w-12 h-12 text-gold/50 mx-auto mb-6 animate-pulse" />
            <h3 className="font-display italic text-title-lg text-gold mb-3">Your Cart is Empty</h3>
            <p className="text-body-sm text-cream/70 leading-relaxed mb-8">
              You haven't selected any culinary delights yet. Browse our menu to add exquisite Arabian dishes to your order.
            </p>
            <a 
              href="#menu"
              className="inline-block px-8 py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] text-label-sm font-bold uppercase tracking-[0.2em] rounded-full transition-colors font-body"
            >
              Explore Featured Menu
            </a>
          </div>
        ) : (
          /* Cart items layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="border border-gold/20 bg-[#1F1108]/90 rounded-[2px] p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />
                <h3 className="text-label-sm uppercase tracking-widest text-gold mb-6 border-b border-gold/10 pb-3 font-semibold font-body">
                  Items Selection ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                </h3>

                <div className="divide-y divide-gold/10">
                  {cart.map((item) => {
                    const itemPrice = parsePrice(item.price);
                    const itemTotal = itemPrice * item.quantity;

                    return (
                      <div key={item.name} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                        {/* Dish Details */}
                        <div className="flex gap-4 items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover border border-gold/20 rounded-[2px]" 
                          />
                          <div className="flex flex-col text-left">
                            <span className="font-display italic text-body-lg text-ivory">{item.name}</span>
                            <span className="text-label-xs text-cream/50 uppercase tracking-wider mt-0.5">{item.category}</span>
                            <span className="text-body-sm text-gold font-mono font-medium mt-1">PKR {item.price}</span>
                          </div>
                        </div>

                        {/* Adjusters & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gold/25 rounded-[2px] bg-[#1A0A00]/60 overflow-hidden">
                            <button 
                              onClick={() => handleQtyChange(item.name, -1)}
                              className="px-2.5 py-1.5 hover:bg-gold/10 text-gold-light transition-colors active:scale-90"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-body-sm font-mono font-bold text-ivory">{item.quantity}</span>
                            <button 
                              onClick={() => handleQtyChange(item.name, 1)}
                              className="px-2.5 py-1.5 hover:bg-gold/10 text-gold-light transition-colors active:scale-90"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Total Cost & Trash */}
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-body-sm font-bold text-ivory w-24 text-right">
                              PKR {formatPKR(itemTotal)}
                            </span>
                            <button 
                              onClick={() => handleRemove(item.name)}
                              className="p-1.5 border border-accent-red/20 text-accent-red/60 hover:text-ivory hover:bg-accent-red rounded-[2px] transition-all cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="border border-gold/25 bg-[#1F1108]/95 p-6 rounded-[2px] shadow-[0_15px_30px_rgba(0,0,0,0.7)] relative overflow-hidden sticky top-32">
                <div className="absolute inset-2 border border-gold/10 pointer-events-none" />

                <h3 className="font-display italic text-title-sm text-gold mb-6 border-b border-gold/15 pb-3 text-left">
                  Summary Receipt
                </h3>

                <div className="space-y-3 font-body text-body-sm text-cream/80 border-b border-gold/10 pb-4 text-left">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-ivory">PKR {formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-mono text-ivory">PKR {formatPKR(tax)}</span>
                  </div>
                  <div className="flex justify-between text-label-xs text-cream/40 italic">
                    <span>Delivery Charges</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 mb-6">
                  <span className="text-label-sm uppercase tracking-widest text-gold font-semibold">Grand Total</span>
                  <span className="font-mono text-title-sm font-bold text-gold-light">PKR {formatPKR(grandTotal)}</span>
                </div>

                {/* Checkout CTA */}
                <a 
                  href="#checkout"
                  className="w-full py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-body text-label-sm font-bold uppercase tracking-[0.2em] rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4" />
                </a>

                {/* Return CTA */}
                <a 
                  href="#menu"
                  className="w-full mt-3 py-2.5 border border-gold/20 hover:bg-gold/5 text-cream/70 hover:text-gold font-body text-label-xs font-bold uppercase tracking-[0.2em] rounded-full transition-colors flex items-center justify-center cursor-pointer"
                >
                  Continue Dining
                </a>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
