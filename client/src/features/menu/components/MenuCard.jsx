import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Check, ShoppingBag } from "lucide-react";
import { GirihBorder } from "../../../shared/ui/ArabicPattern";
import { parsePrice } from "../../../utils/orderStorage";
import { addToCart } from "../../../utils/orderStorage";

gsap.registerPlugin(ScrollTrigger);

export default function MenuCard({ image, category, name, nameArabic, arabicName, price, description }) {
  const cardRef = useRef(null);
  const shimmerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Premium entrance animation for each card individually (helpful for mobile)
    const anim = gsap.fromTo(card,
      { y: 40, opacity: 0, rotateX: 5 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, []);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    // Skip tilt interaction on touch devices
    const isMobile = window.matchMedia('(hover: none)').matches;
    if (isMobile) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // cursor relative horizontal x coordinate
    const y = e.clientY - rect.top;  // cursor relative vertical y coordinate

    // Map coordinates to rotate angles (-8 to +8 degrees)
    const rotateX = -((y / rect.height) - 0.5) * 16;
    const rotateY = ((x / rect.width) - 0.5) * 16;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.25,
      ease: 'power2.out',
    });

    // Position gold specular shimmer spotlight
    if (shimmerRef.current) {
      gsap.to(shimmerRef.current, {
        left: `${x}px`,
        top: `${y}px`,
        opacity: 0.18,
        duration: 0.1,
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    setIsHovered(false);

    // Spring card smoothly back to rest angle
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'back.out(1.2)',
    });

    if (shimmerRef.current) {
      gsap.to(shimmerRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart({ image, category, name, price });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-[300px] h-[430px] md:w-[330px] md:h-[460px] lg:w-[290px] lg:h-[390px] xl:w-[310px] xl:h-[420px] bg-[#6B2E0E] border border-[#C9952A]/25 rounded-[2px] overflow-hidden flex flex-col justify-between group cursor-pointer transition-shadow duration-500 hover:shadow-[0_0_25px_rgba(201,149,42,0.25)] select-none transform-gpu shrink-0"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Specular Shimmer Spec Overlay */}
      <div
        ref={shimmerRef}
        className="absolute w-40 h-40 bg-[radial-gradient(circle_at_center,rgba(232,186,90,0.5)_0%,transparent_70%)] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none z-20"
      />

      {/* Intricate Girih SVG Border decoration */}
      <GirihBorder opacity={isHovered ? 0.45 : 0.2} color="#C9952A" />

      {/* Top 55%: Image Wrapper */}
      <div className="relative h-[55%] w-full overflow-hidden border-b border-[#C9952A]/15 bg-[#1F1108]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
          draggable="false"
          loading="lazy"
        />
        {/* Category Badge overlay */}
        <div className="absolute top-4 left-4 bg-[#1A0A00]/80 border border-[#C9952A]/30 px-3 py-1 rounded-[2px] text-label-xs font-body font-semibold tracking-widest text-[#FAF3E0] uppercase">
          {category}
        </div>
      </div>

      {/* Bottom 45%: Dish Metadata Details */}
      <div className="relative h-[45%] p-4 md:p-5 lg:p-4 xl:p-5 flex flex-col justify-between items-start w-full bg-[#1F1108]/95 z-10">
        
        <div className="w-full">
          {/* Sibling Titles: English + Arabic Calligraphy Accent */}
          <div className="flex items-start justify-between gap-2 w-full mb-1">
            <h3 className="font-display italic text-title-sm text-ivory tracking-wide truncate">
              {name}
            </h3>
            <span className="font-arabic text-body-sm text-gold/80 shrink-0 self-center">
              {nameArabic || arabicName}
            </span>
          </div>
          
          <p className="text-body-sm text-cream/70 line-clamp-2 leading-relaxed font-body mb-2 pr-2">
            {description}
          </p>
        </div>

        {/* Action Row: Price + Add Button */}
        <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-gold/10">
          <div className="flex flex-col">
            <span className="text-label-xs uppercase tracking-widest text-cream/50 font-body">Price</span>
            <span className="text-body-md font-semibold text-gold font-body">PKR {price}</span>
          </div>

          <div 
            onClick={handleAdd}
            className="relative overflow-hidden h-8 flex items-center justify-end w-[135px] shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-label-sm uppercase font-bold tracking-[0.15em] text-[#C9952A] group-hover:-translate-y-8 transition-transform duration-300 font-body block text-right w-full pr-1">
              ADD TO CART
            </span>
            <span className={`absolute right-0 translate-y-8 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5 text-label-xs font-bold tracking-[0.12em] w-full h-full rounded-[2px] font-body ${isAdded ? 'bg-emerald-700 text-ivory border border-emerald-500' : 'bg-[#C9952A] text-[#1A0A00]'}`}>
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-ivory" />
                  ADDED!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  ADD TO ORDER
                </>
              )}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
