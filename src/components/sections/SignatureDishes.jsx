import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';
import useMagneticHover from '../../hooks/useMagneticHover';

gsap.registerPlugin(ScrollTrigger);

const signaturesData = [
  {
    id: "mandi",
    title: "Al-Mandi Royal",
    arabicTitle: "مندي لحم ملكي",
    price: "2,850",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "Our signature Yemeni specialty. Mutton shoulder is marinated in secret herbs, slow-cooked to falling-off-the-bone tenderness for 6 hours in our deep stone pit oven, and served over a mountain of golden saffron-infused basmati rice."
  },
  {
    id: "shawarma",
    title: "Shawarma Arabic Kitchen",
    arabicTitle: "شاورما المطبخ العربي",
    price: "750",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80",
    description: "Slices of premium chicken breast marinated in organic yogurt, cardamom, and grated garlic, grilled slowly on a vertical spit, rolled in crisp saj flatbread with fresh pickled cucumbers and creamy house toum sauce."
  },
  {
    id: "burger",
    title: "The Royal Burger",
    arabicTitle: "البرجر الملكي",
    price: "1,150",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "A gourmet masterpiece bridging west and east. Pure grain-fed prime wagyu-style beef patty seasoned with house spices, flame-grilled, glazed with dark truffle butter, melted sharp cheddar, served on toasted brioche."
  }
];

export default function SignatureDishes() {
  const containerRef = useRef(null);

  useEffect(() => {
    const titles = containerRef.current?.querySelectorAll('.scrub-title') || [];

    const ctx = gsap.context(() => {
      titles.forEach((title) => {
        // Scroll scrub: scale letter spacing and fade in smoothly
        gsap.fromTo(title,
          { letterSpacing: '0.02em', opacity: 0.2 },
          {
            letterSpacing: '0.12em',
            opacity: 1,
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              end: 'bottom 40%',
              scrub: 1.5,
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="signatures"
      ref={containerRef}
      className="relative bg-[#1A0A00] text-ivory py-24 select-none overflow-hidden"
    >
      {/* Background Tiling decoration */}
      <KhatamPattern opacity={0.06} />

      {/* Main Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-16 relative z-10 flex flex-col items-center">
        <span className="font-arabic text-gold text-base tracking-[0.2em] mb-1">
          أطباقنا المميزة
        </span>
        <h2 className="font-display italic text-4xl md:text-5xl text-ivory mb-2 tracking-tight">
          Signature Masterpieces
        </h2>
        <MuqarnasArch color="#C9952A" size={60} />
      </div>

      {/* Alternating Dishes Grid */}
      <div className="max-w-5xl mx-auto flex flex-col gap-24 relative z-10 px-6 md:px-12">
        {signaturesData.map((dish, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={dish.id}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Left/Right Column: Plated Image with gold frame borders */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="w-full max-w-[420px] aspect-[4/3] border border-[#C9952A]/30 p-1.5 bg-[#1F1108]/90 overflow-hidden relative group">
                  <div className="absolute inset-2.5 border border-gold/15 pointer-events-none z-10" />
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Left/Right Column: Metadata Text Details */}
              <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                {/* Double title scrub-responsive */}
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-arabic text-gold/80 text-sm">{dish.arabicTitle}</span>
                  <div className="h-[1px] w-6 bg-gold/30" />
                </div>
                
                <h3 className="scrub-title font-display italic text-3xl md:text-4xl text-ivory leading-none mb-4 select-none">
                  {dish.title}
                </h3>
                
                <p className="text-sm text-cream/80 leading-relaxed font-body mb-6">
                  {dish.description}
                </p>

                <div className="flex items-center gap-6 border-t border-gold/10 pt-4 w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-cream/40 font-body">Price</span>
                    <span className="text-lg font-semibold text-gold font-body">PKR {dish.price}</span>
                  </div>
                  
                  <a
                    href="#reserve"
                    className="px-6 py-2.5 rounded-full bg-gold hover:bg-gold-light text-[#1A0A00] font-body text-xs font-bold uppercase tracking-[0.18em] transition-colors"
                  >
                    Order Now
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
