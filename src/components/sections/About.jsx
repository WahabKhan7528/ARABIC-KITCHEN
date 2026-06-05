import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StatCounter from '../ui/StatCounter';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const bgImgRef = useRef(null);
  const fgImgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Disable parallax layers on mobile for performance and layout stability
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // 1. Slow downward drift of deep background photo
      gsap.fromTo(bgImgRef.current,
        { y: -60 },
        {
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );

      // 2. Gentle upward float of foreground plate photo
      gsap.fromTo(fgImgRef.current,
        { y: 40 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );

      // 3. Subtle depth hover of text block
      gsap.fromTo(textRef.current,
        { y: 20 },
        {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-[#3D1200] text-ivory py-24 px-6 md:px-12 flex items-center select-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #3D1200 0%, #1A0A00 100%)',
      }}
    >
      {/* Arabic Geometric Khatam tiling */}
      <KhatamPattern opacity={0.06} />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
        
        {/* Left Side: Parallax depth image layout (5 cols) */}
        <div className="col-span-1 lg:col-span-5 flex justify-center items-center h-[480px] relative">
          
          {/* Layer 1: Background Ambiance (Slower scroll) */}
          <div
            ref={bgImgRef}
            className="absolute w-[220px] h-[300px] md:w-[260px] md:h-[360px] left-0 top-4 border border-gold/15 bg-[#1F1108]/90 overflow-hidden transform-gpu"
          >
            <div className="absolute inset-0 bg-primary-dark/30 z-10" />
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant Atmosphere"
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="lazy"
            />
          </div>

          {/* Layer 2: Foreground Sizzling Plate (Faster scroll) */}
          <div
            ref={fgImgRef}
            className="absolute w-[200px] h-[260px] md:w-[240px] md:h-[320px] right-0 bottom-4 border border-gold/30 p-1 bg-mid-wood overflow-hidden z-20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] transform-gpu"
          >
            <div className="absolute inset-1 border border-gold/10 pointer-events-none z-10" />
            <img
              src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80"
              alt="Sizzling Chicken Seekh Boti"
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="lazy"
            />
          </div>

        </div>

        {/* Right Side: Heritage Story Text Block (7 cols) */}
        <div
          ref={textRef}
          className="col-span-1 lg:col-span-7 flex flex-col items-start text-left transform-gpu"
        >
          {/* Header */}
          <span className="font-arabic text-gold text-kicker tracking-[0.2em] mb-1">
            قصتنا • تراثنا
          </span>
          <h2 className="font-display italic text-title-xl text-ivory mb-4 tracking-tight leading-none">
            Our Story & Heritage
          </h2>
          <MuqarnasArch color="#C9952A" size={50} className="mb-6 !self-start" />

          {/* Editorial Paragraph */}
          <p className="text-body-md text-cream/80 max-w-xl mb-6 leading-relaxed font-body">
            Founded with a vision to merge the majestic culinary history of Arabia with modern upscale casual dining, **Arabic Kitchen** has become a legendary landmark in Bahawalpur. We carefully slow-cook our dishes inside authentic stone ovens, charcoal roasting premium meats to locks in juices and rich, smoky, timeless flavor profiles.
          </p>

          <p className="text-body-md text-cream/70 max-w-xl mb-10 leading-relaxed font-body">
            Every spice is hand-selected from traditional Arabic souks and blended in house, creating an culinary tapestry that honors the traditional roots of Yemeni Mandi, Levant Mezze, and high-end street food favorites.
          </p>

          {/* Animated Numeric Counter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full border-t border-gold/15 pt-8">
            <StatCounter target="8" label="Years Heritage" suffix="+" />
            <StatCounter target="120" label="Unique Dishes" suffix="+" />
            <StatCounter target="4.9" label="Rating Score" suffix="★" />
            <StatCounter target="50" label="Happy Guests" suffix="k+" />
          </div>

        </div>

      </div>
    </section>
  );
}
