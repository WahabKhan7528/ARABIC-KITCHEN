import React from 'react';
import { MapPin, Phone, Clock, Globe } from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative text-ivory py-24 select-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #240C00 0%, #0C0300 100%)',
      }}
    >
      {/* Background Tiling decoration */}
      <KhatamPattern opacity={0.05} color="#C9952A" />

      {/* Main Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-16 relative z-10 flex flex-col items-center">
        <span className="font-arabic text-[#C9952A] text-kicker tracking-[0.2em] mb-1">
          اتصل بنا
        </span>
        <h2 className="font-display italic text-title-xl text-ivory mb-2 tracking-tight">
          Find The Royal Table
        </h2>
        <MuqarnasArch color="#C9952A" size={60} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-10">
        
        {/* Left Column: Google Maps Embed (7 cols) */}
        <div className="col-span-1 lg:col-span-7 border border-[#C9952A]/30 p-1 bg-[#1F1108]/90 relative h-[350px] lg:h-auto min-h-[350px] rounded-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Subtle inside frame */}
          <div className="absolute inset-2 border border-gold/10 pointer-events-none z-10" />
          
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13797.747190013994!2d71.69111165!3d29.39583315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393b90be8bfbf2cb%3A0xe510e14a8fa553!2sModel%20Town%20A%20Model%20Town%2C%20Bahawalpur%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Arabic Kitchen Google Maps location"
            className="filter invert-[90%] hue-rotate-[180deg] brightness-[0.95] contrast-[1.1] select-none pointer-events-auto rounded-[2px]"
          />
        </div>

        {/* Right Column: Contact Details (5 cols) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between gap-8 text-left">
          
          {/* Section 1: Contact Coordinates */}
          <div className="flex flex-col gap-6">
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0A00] flex items-center justify-center text-gold shrink-0 border border-gold/25 shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm uppercase tracking-widest text-cream/40 font-body">Address</span>
                <span className="text-body-md font-semibold text-ivory font-body mt-0.5 leading-relaxed">
                  Model Town A, Near Library Ground, Bahawalpur, Pakistan
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0A00] flex items-center justify-center text-gold shrink-0 border border-gold/25 shadow-md">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm uppercase tracking-widest text-cream/40 font-body">Call Us</span>
                <span className="text-body-md font-semibold text-ivory font-body mt-0.5">
                  +92 62 1234567 / +92 300 1234567
                </span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0A00] flex items-center justify-center text-gold shrink-0 border border-gold/25 shadow-md">
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm uppercase tracking-widest text-cream/40 font-body">Follow</span>
                <span className="text-body-md font-semibold text-ivory font-body mt-0.5">
                  @arabickitchen.theroyaltable
                </span>
              </div>
            </div>

          </div>

          {/* Section 2: Precise Opening Hours Grid */}
          <div className="border border-[#C9952A]/20 p-6 bg-[#1F1108]/90 rounded-[2px] w-full shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2 mb-4 border-b border-gold/10 pb-2">
              <Clock className="w-4 h-4 text-gold shrink-0" />
              <h4 className="font-display italic text-title-sm font-semibold text-ivory">
                Operational Hours
              </h4>
            </div>

            <div className="space-y-2 font-body text-body-sm text-cream/80">
              <div className="flex justify-between border-b border-gold/5 pb-1">
                <span>Monday – Thursday</span>
                <span className="font-semibold text-gold">4:00 PM – 11:30 PM</span>
              </div>
              <div className="flex justify-between border-b border-gold/5 pb-1">
                <span>Friday – Saturday</span>
                <span className="font-semibold text-gold">4:00 PM – 1:00 AM</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Sunday Platter Feast</span>
                <span className="font-semibold text-gold">1:00 PM – 12:00 AM</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
