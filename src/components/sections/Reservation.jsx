import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Phone, Calendar, Clock, Users, MessageSquare, Check, User } from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';
import { addReservation } from '../../utils/reservationStorage';

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: '2',
    requests: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate fields manually for absolute React 19 compatibility
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    
    // Pakistan Phone Regex (Matches 03xxxxxxxxx, +923xxxxxxxxx, 923xxxxxxxxx)
    const phoneRegex = /^((\+92)?(92)?(0)?3[0-9]{9})$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      tempErrors.phone = "Invalid Pakistan phone number (e.g. 03001234567)";
    }

    if (!formData.date) tempErrors.date = "Reservation date is required";
    if (!formData.time) tempErrors.time = "Reservation time is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error immediately on keystroke
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Save reservation to local storage
    addReservation(formData);

    // Trigger canvas starburst confetti cascade on success
    setIsSuccess(true);
    triggerStarConfetti();

    // Reset form after delay
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '19:00',
        guests: '2',
        requests: ''
      });
      setIsSuccess(false);
    }, 5000);
  };

  // Luxury Gold Canvas Confetti Stars Trigger
  const triggerStarConfetti = () => {
    const end = Date.now() + 1.8 * 1000;
    const colors = ['#C9952A', '#E8BA5A', '#FAF3E0', '#FAF3E0'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
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

  // Compile URL string for WhatsApp reservation alternative
  const getWhatsAppLink = () => {
    const defaultNum = "923001234567"; // Standard Pakistani business number
    const text = encodeURIComponent(
      `Hello Arabic Kitchen! I'd like to reserve a table under the name *${formData.name || 'Valued Guest'}* for *${formData.guests || '2'}* guests on *${formData.date || 'TBD'}* at *${formData.time || 'TBD'}*. (Special request: ${formData.requests || 'None'})`
    );
    return `https://wa.me/${defaultNum}?text=${text}`;
  };

  return (
    <section
      id="reserve"
      className="relative min-h-screen bg-[#3D1200] text-ivory py-24 px-6 md:px-12 flex items-center justify-center select-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #2C0F00 0%, #0F0500 100%)',
      }}
    >
      {/* Background Tiling decoration */}
      <KhatamPattern opacity={0.06} />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Royal Invitation (5 cols) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col items-start text-left relative z-10">
          <span className="font-arabic text-gold text-kicker tracking-[0.2em] mb-1 block">
            حجز طاولة
          </span>
          <h2 className="font-display italic text-title-xl text-ivory mb-4 tracking-tight leading-tight">
            Reserve A Royal Table
          </h2>
          <MuqarnasArch color="#C9952A" size={50} className="mb-6 !self-start" />
          
          <p className="text-body-md text-cream/80 max-w-md mb-6 leading-relaxed font-body">
            Experience our magnificent dining hall. Secure your sanctuary table inside Model Town's premier fine dining venue, where centuries-old slow-cooked recipes meet gold-standard royal hospitality.
          </p>

          <p className="text-body-sm text-gold-light/95 max-w-sm mb-10 leading-relaxed font-body">
            For private catering concierges, bespoke family gatherings, or events larger than 10 guests, please contact our guest host directly.
          </p>

          {/* WhatsApp Direct CTA */}
          <div className="flex flex-col gap-1.5 pt-6 border-t border-gold/15 w-full">
            <span className="text-label-xs uppercase tracking-widest text-cream/40 font-body">Instant Booking</span>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="text-label-sm font-semibold text-gold hover:text-gold-light font-body flex items-center gap-2 group transition-colors"
            >
              Prefer WhatsApp? Message Concierge &rarr;
            </a>
          </div>
        </div>

        {/* Right Column: Reservation Card Form (7 cols) */}
        <div className="col-span-1 lg:col-span-7 relative z-10">
          <div className="border border-gold/25 p-8 md:p-10 bg-[#1F1108]/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-[2px]">
            {/* Subtle inside frame */}
            <div className="absolute inset-2.5 border border-gold/10 pointer-events-none" />

            {isSuccess ? (
              /* Success State view */
              <div className="flex flex-col items-center justify-center py-16 text-center relative z-10 animate-scale-up">
                <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-gold animate-pulse" />
                </div>
                <h3 className="font-display italic text-title-md text-gold mb-2">
                  A Royal Acknowledgment
                </h3>
                <p className="text-body-sm text-cream/80 leading-relaxed font-body max-w-xs">
                  Your reservation request has been received. Our host will contact you shortly to confirm your booking details.
                </p>
                <p className="text-label-xs text-gold/60 uppercase tracking-widest mt-6 font-body">
                  We await your arrival
                </p>
              </div>
            ) : (
              /* Standard reservation form view */
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                
                {/* Grid Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                      <User className="w-3 h-3 text-gold" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Muhammad Ahmad"
                      className="w-full bg-[#1A0A00]/60 border border-gold/20 rounded-[2px] px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body focus:ring-1 focus:ring-gold/30"
                    />
                    {errors.name && <span className="text-label-xs text-accent-red mt-0.5">{errors.name}</span>}
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gold" /> Phone (Pakistan)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 03001234567"
                      className="w-full bg-[#1A0A00]/60 border border-gold/20 rounded-[2px] px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body focus:ring-1 focus:ring-gold/30"
                    />
                    {errors.phone && <span className="text-label-xs text-accent-red mt-0.5">{errors.phone}</span>}
                  </div>
                </div>

                {/* Grid Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-gold" /> Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A0A00]/60 border border-gold/20 rounded-[2px] px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body focus:ring-1 focus:ring-gold/30 [color-scheme:dark]"
                    />
                    {errors.date && <span className="text-label-xs text-accent-red mt-0.5">{errors.date}</span>}
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gold" /> Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A0A00]/60 border border-gold/20 rounded-[2px] px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body focus:ring-1 focus:ring-gold/30 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Grid Guests & Requests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-start gap-1 sm:col-span-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-gold" /> Guests
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2.5 text-body-sm text-ivory focus:outline-none focus:border-gold transition-colors font-body focus:ring-1 focus:ring-gold/30"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num} className="bg-charcoal text-ivory">{num} Guests</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col items-start gap-1 sm:col-span-2">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-gold" /> Special Requests
                    </label>
                    <input
                      type="text"
                      name="requests"
                      value={formData.requests}
                      onChange={handleInputChange}
                      placeholder="e.g. Birthday setup, window table"
                      className="w-full bg-[#1A0A00]/60 border border-gold/20 rounded-[2px] px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                </div>

                {/* Submit triggers */}
                <div className="pt-4 flex flex-col gap-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-body text-label-sm font-bold uppercase tracking-[0.2em] rounded-full transition-colors cursor-pointer select-none"
                  >
                    Reserve My Table
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}