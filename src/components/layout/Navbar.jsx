import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else if (window.scrollY < 20) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Our Story', href: '#about' },
    { name: 'Signatures', href: '#signatures' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reserve', href: '#reserve' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed z-[990] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between select-none left-1/2 -translate-x-1/2 animate-fade-in ${
          isScrolled
            ? 'h-16 top-4 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-5xl rounded-full border border-[#C9952A]/40 bg-[#1A0A00]/85 backdrop-blur-lg shadow-[0_15px_35px_rgba(0,0,0,0.6)] px-6'
            : 'h-24 top-0 w-full bg-transparent border border-transparent px-6 md:px-12'
        }`}
      >
        {/* Left Side: Brand Logo & Editorial Typography */}
        <a href="#home" className="flex items-center gap-3 group">
          <img 
            src="/logo.webp" 
            alt="Arabic Kitchen Logo" 
            className="h-10 w-10 md:h-11 md:w-11 object-cover rounded-full border border-[#C9952A]/30 transition-transform duration-300 group-hover:scale-105 shadow-sm" 
          />
          <div className="flex flex-col items-start leading-none">
            <span className="font-display italic text-title-sm text-ivory tracking-wide transition-colors duration-300 group-hover:text-gold">
              Arabic Kitchen
            </span>
            <span className="font-arabic text-label-xs text-gold/80 tracking-[0.12em] -mt-0.5 self-end">
              المطبخ العربي
            </span>
          </div>
        </a>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-label-sm uppercase tracking-[0.2em] font-body font-semibold text-cream/80 hover:text-gold transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-gold after:transition-all after:duration-300 hover:after:w-4"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side: CTA Button (Desktop) & Hamburger (Mobile) */}
        <div className="flex items-center gap-4">
          <a
            href="#reserve"
            className="hidden sm:inline-block px-5 py-2 rounded-full border border-[#C9952A]/50 bg-transparent text-label-sm font-bold uppercase tracking-[0.18em] text-[#C9952A] hover:bg-[#C9952A] hover:text-[#1A0A00] hover:shadow-[0_0_15px_rgba(201,149,42,0.3)] transition-all duration-300 font-body cursor-pointer select-none"
          >
            Book Table
          </a>

          {/* Hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gold hover:text-gold-light focus:outline-none p-1.5 transition-colors z-[1000] relative cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </nav>

      {/* Fullscreen Staggered Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 w-full h-full bg-[#1A0A00] z-[980] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background tiling overlay in menu drawer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#281005_0%,#0F0500_100%)] opacity-95" />
        
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-display italic text-title-lg text-ivory hover:text-gold transition-colors duration-300 py-1.5 flex flex-col items-center tracking-wide"
              style={{
                animationDelay: `${idx * 0.08}s`,
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isOpen ? 1 : 0,
                transition: 'all 0.5s ease-out',
              }}
            >
              {link.name}
            </a>
          ))}
          
          <a
            href="#reserve"
            onClick={() => setIsOpen(false)}
            className="mt-6 px-8 py-3 rounded-full bg-[#C9952A] text-[#1A0A00] font-body font-bold text-label-sm uppercase tracking-[0.2em] hover:bg-[#E8BA5A] transition-colors"
            style={{
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isOpen ? 1 : 0,
              transition: 'all 0.6s ease-out 0.3s',
            }}
          >
            Book Table
          </a>

          <a
            href="#dashboard"
            onClick={() => setIsOpen(false)}
            className="mt-2 text-gold/60 hover:text-gold text-label-sm uppercase font-semibold tracking-widest font-body"
            style={{
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isOpen ? 1 : 0,
              transition: 'all 0.6s ease-out 0.4s',
            }}
          >
            Staff Dashboard &rarr;
          </a>
        </div>
      </div>
    </>
  );
}
