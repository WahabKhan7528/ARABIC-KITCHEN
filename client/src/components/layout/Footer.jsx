import React from 'react';
import { Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1F1108] border-t border-[#C9952A]/20 pt-16 pb-8 px-6 md:px-12 select-none overflow-hidden">
      {/* Decorative Arabic Top Strip */}
      <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#C9952A] via-[#E8BA5A] to-[#C9952A] opacity-80" />
      
      {/* Footer Content Columns */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative z-10">
        
        {/* Column 1: Brand & Bio */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 group">
            <img 
              src="/logo.webp" 
              alt="Arabic Kitchen Logo" 
              className="h-10 w-10 object-cover rounded-full border border-[#C9952A]/30 transition-transform duration-300 group-hover:scale-105 shadow-sm" 
            />
            <div className="flex flex-col leading-none">
              <span className="font-display italic text-title-md text-ivory tracking-wide">
                Arabic Kitchen
              </span>
              <span className="font-arabic text-label-sm text-gold/80 tracking-widest -mt-0.5 self-start">
                المطبخ العربي
              </span>
            </div>
          </div>
          <p className="text-body-sm text-cream/70 leading-relaxed font-body">
            Indulge in the finest culinary heritage where authentic Arabian spices merge with upscale contemporary flavors. Experience dining fit for royalty in the heart of Bahawalpur.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-primary-dark transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-primary-dark transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-primary-dark transition-all duration-300"
              aria-label="WhatsApp"
            >
              {/* Custom SVG WhatsApp for precision */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.91.537 3.69 1.468 5.21L2 22l5.008-1.309c1.458.825 3.125 1.309 4.996 1.309 5.524 0 10.004-4.48 10.004-10S17.528 2 12.004 2zm0 1.636c4.636 0 8.368 3.733 8.368 8.364 0 4.631-3.732 8.364-8.368 8.364-1.636 0-3.155-.47-4.444-1.277L4.76 19.824l.732-2.736A8.28 8.28 0 013.636 12c0-4.631 3.733-8.364 8.368-8.364z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display italic text-title-sm text-ivory tracking-wider select-none border-b border-gold/10 pb-2">
            Navigation
          </h4>
          <div className="flex flex-col gap-2">
            <a href="#home" className="text-label-sm uppercase tracking-widest text-cream/70 hover:text-gold transition-colors duration-300 font-body">Home</a>
            <a href="#menu" className="text-label-sm uppercase tracking-widest text-cream/70 hover:text-gold transition-colors duration-300 font-body">Featured Menu</a>
            <a href="#about" className="text-label-sm uppercase tracking-widest text-cream/70 hover:text-gold transition-colors duration-300 font-body">Our Story</a>
            <a href="#signatures" className="text-label-sm uppercase tracking-widest text-cream/70 hover:text-gold transition-colors duration-300 font-body">Signature Dishes</a>
            <a href="#reserve" className="text-label-sm uppercase tracking-widest text-cream/70 hover:text-gold transition-colors duration-300 font-body">Reservations</a>
          </div>
        </div>

        {/* Column 3: Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display italic text-title-sm text-ivory tracking-wider select-none border-b border-gold/10 pb-2">
            Get in Touch
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <span className="text-body-sm text-cream/70 leading-relaxed font-body">
                Model Town A, Near Library Ground, Bahawalpur, Pakistan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <span className="text-body-sm text-cream/70 font-body">+92 62 1234567</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold shrink-0" />
              <span className="text-body-sm text-cream/70 font-body">www.arabickitchenroyal.com</span>
            </div>
          </div>
        </div>

        {/* Column 4: Operational Hours */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display italic text-title-sm text-ivory tracking-wider select-none border-b border-gold/10 pb-2">
            Opening Hours
          </h4>
          <div className="flex flex-col gap-2 font-body text-body-sm text-cream/70">
            <div className="flex justify-between border-b border-gold/10 pb-1">
              <span>Mon – Thu</span>
              <span className="text-gold">4:00 PM – 11:30 PM</span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1">
              <span>Fri – Sat</span>
              <span className="text-gold">4:00 PM – 1:00 AM</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Sunday</span>
              <span className="text-gold">1:00 PM – 12:00 AM</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom copyright and geometric watermark */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 font-body text-label-sm text-cream/50 tracking-wider">
        <span>&copy; {currentYear} Arabic Kitchen Restaurant. All Rights Reserved.</span>
        <div className="flex items-center gap-4">
          <span>Crafted in Bahawalpur, Pakistan</span>
          <span className="text-gold/20">|</span>
          <a href="#dashboard" className="text-gold hover:text-gold-light hover:underline transition-colors font-semibold">Dashboard</a>
        </div>
      </div>
    </footer>
  );
}
