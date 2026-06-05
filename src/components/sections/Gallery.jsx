import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=800&q=80",
    alt: "Royal Yemeni Mandi Rice Platter"
  },
  {
    src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Hummus Beiruti Mezze Spread"
  },
  {
    src: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&h=800&q=80",
    alt: "Charcoal Grilled Kababs"
  },
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Arabic Kitchen Fine Dining Room"
  },
  {
    src: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&h=800&q=80",
    alt: "Syrupy Akawi Cheese Kunafa"
  },
  {
    src: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&h=450&q=80",
    alt: "Signature Barbecued Platters"
  },
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=800&q=80",
    alt: "Prime Wagyu Truffle Burgers"
  },
  {
    src: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Sparkling Mint Margarita Cooler"
  }
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="gallery"
      className="relative text-ivory py-24 select-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #200B01 0%, #0A0300 100%)',
      }}
    >
      {/* Background Tiling decoration */}
      <KhatamPattern opacity={0.05} color="#C9952A" />

      {/* Main Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-16 relative z-10 flex flex-col items-center">
        <span className="font-arabic text-[#C9952A] text-kicker tracking-[0.2em] mb-1">
          معرض الصور
        </span>
        <h2 className="font-display italic text-title-xl text-ivory mb-2 tracking-tight">
          Visual Culinary Art
        </h2>
        <MuqarnasArch color="#C9952A" size={60} />
      </div>

      {/* Masonry Columns Gallery Layout */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid relative border border-[#C9952A]/20 p-1 bg-[#1F1108]/90 overflow-hidden group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_24px_rgba(201,149,42,0.25)] transition-all duration-500 rounded-[2px]"
            >
              {/* Premium dark-gold hover curtain overlay */}
              <div className="absolute inset-0 bg-[#1F1108]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-center items-center p-4 text-center">
                {/* Gold boundary border */}
                <div className="absolute inset-3 border border-[#C9952A]/20 pointer-events-none" />
                <span className="font-arabic text-[#C9952A] text-label-sm tracking-[0.2em] mb-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">معرض الصور</span>
                <p className="font-display italic text-title-sm text-ivory tracking-wide max-w-[85%] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {img.alt}
                </p>
                <span className="mt-3 text-label-xs uppercase tracking-[0.25em] text-[#C9952A] border-t border-[#C9952A]/30 pt-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  Click to view
                </span>
              </div>
              
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto object-cover select-none pointer-events-none transition-all duration-700 ease-out group-hover:scale-95 rounded-[1px]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Fullscreen Focus Modal Overlay */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 w-full h-full bg-[#1A0A00]/95 backdrop-blur-md z-[1100] flex items-center justify-center p-6 animate-fade-in cursor-default"
        >
          {/* Close Trigger Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-ivory hover:text-gold transition-colors duration-300 p-2 cursor-pointer z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Handles */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-ivory hover:text-gold transition-colors duration-300 p-2 bg-[#1A0A00]/40 rounded-full border border-gold/10 hover:border-gold/30 cursor-pointer z-50"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-ivory hover:text-gold transition-colors duration-300 p-2 bg-[#1A0A00]/40 rounded-full border border-gold/10 hover:border-gold/30 cursor-pointer z-50"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image Render card container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[80vh] flex flex-col items-center animate-scale-up border border-[#C9952A]/30 p-2 bg-[#1F1108]/90 shadow-2xl rounded-[2px]"
          >
            {/* Fine border line */}
            <div className="absolute inset-3 border border-gold/15 pointer-events-none z-10" />

            <img
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              className="max-w-full max-h-[70vh] object-contain select-none pointer-events-none"
            />
            <div className="w-full text-center mt-3 py-1">
              <p className="font-display italic text-title-sm text-ivory tracking-wide">
                {galleryImages[lightboxIndex].alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
