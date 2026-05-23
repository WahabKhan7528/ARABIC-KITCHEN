import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import HeroParticles from '../ui/HeroParticles';
import { KhatamPattern } from '../ui/ArabicPattern';
import useMagneticHover from '../../hooks/useMagneticHover';

export default function Hero() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const ctaPrimary = useMagneticHover(0.35, 80);
  const ctaSecondary = useMagneticHover(0.35, 80);

  const headlineString = "A Royal Feast";

  useEffect(() => {
    const chars = headlineRef.current?.querySelectorAll('.char') || [];
    
    const ctx = gsap.context(() => {
      // 1. Staggered reveal for characters
      gsap.fromTo(
        chars,
        { y: 100, opacity: 0, rotateX: -60 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.4,
          stagger: 0.035,
          ease: 'power4.out',
          delay: 0.3,
        }
      );

      // 2. Subtitle, calligraphy, and CTAs reveal
      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.9,
        }
      );

      // 3. Image polygon clip-path reveal (starts center, grows full bounds)
      gsap.fromTo(
        imageContainerRef.current,
        { clipPath: 'polygon(45% 45%, 55% 45%, 55% 55%, 45% 55%)', scale: 1.15 },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.8,
          ease: 'expo.inOut',
          delay: 0.5,
        }
      );

      // 4. Bouncing scroll indicator reveal
      gsap.fromTo(
        bottomRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 1.6,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-8 px-6 md:px-12 bg-radial-gradient select-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #3D1200 0%, #1A0A00 100%)',
      }}
    >
      {/* 1. Opulent Arabic Khatam Background Tiling */}
      <KhatamPattern opacity={0.06} />

      {/* 2. Interactive Three.js Ambient Particle Field */}
      <HeroParticles />

      {/* Main Section Content Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 max-w-6xl mx-auto w-full relative z-10">
        
        {/* Left Side: Staggered Content Block (60% width) */}
        <div className="w-full lg:w-3/5 flex flex-col items-start text-left perspective-[800px]">
          
          {/* Authentic Arabic Accent Calligraphy */}
          <span className="font-arabic text-gold text-lg md:text-xl tracking-[0.25em] mb-3 select-none flex items-center gap-3">
            <span>مأدبة ملكية</span>
            <span className="h-[1px] w-8 bg-gold/60 inline-block" />
          </span>

          {/* Headline containing letter character splittings */}
          <h1
            ref={headlineRef}
            className="font-display italic text-6xl md:text-8xl text-ivory tracking-tight leading-[0.95] mb-6 overflow-hidden flex flex-wrap"
          >
            {headlineString.split("").map((char, index) => (
              <span
                key={index}
                className="char inline-block origin-bottom transform-gpu"
                style={{ display: char === " " ? "inline" : "inline-block", marginRight: char === " " ? "0.3em" : "0" }}
              >
                {char}
              </span>
            ))}
          </h1>

          {/* Subline and CTAs block */}
          <div ref={subtitleRef} className="flex flex-col items-start opacity-0 transform-gpu">
            <p className="text-sm md:text-base text-cream/80 max-w-lg mb-8 leading-relaxed font-body">
              Step into an opulent culinary sanctuary. We draw inspiration from centuries-old spice routes to bring you masterfully prepared mutton mandi, sizzling grills, and elite contemporary fast food.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <a
                ref={ctaPrimary}
                href="#menu"
                className="px-8 py-3.5 rounded-full bg-[#C9952A] text-[#1A0A00] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#E8BA5A] transition-all duration-300 font-body"
              >
                Explore Menu
              </a>
              <a
                ref={ctaSecondary}
                href="#reserve"
                className="px-8 py-3.5 rounded-full border border-gold/50 bg-transparent text-xs font-bold uppercase tracking-[0.2em] text-gold hover:bg-gold/10 transition-all duration-300 font-body"
              >
                Reserve Table
              </a>
            </div>
          </div>

        </div>

        {/* Right Side: Hero Image Composition (40% width) */}
        <div className="w-full lg:w-2/5 flex justify-center items-center relative mt-12 lg:mt-0">
          
          {/* Main Large Image */}
          <div
            ref={imageContainerRef}
            className="w-[260px] h-[340px] md:w-[320px] md:h-[420px] relative border border-[#C9952A]/30 p-1 flex items-center justify-center bg-[#1F1108]/90 overflow-hidden transform-gpu z-10 shadow-[0_0_40px_rgba(201,149,42,0.1)]"
            style={{
              clipPath: 'polygon(45% 45%, 55% 45%, 55% 55%, 45% 55%)',
            }}
          >
            {/* Fine framing border */}
            <div className="absolute inset-2 border border-gold/15 pointer-events-none z-10" />
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Arabic Kitchen Royal Platter"
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="eager"
            />
          </div>

          {/* Secondary Overlapping Image */}
          <div className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-12 w-[140px] h-[140px] md:w-[180px] md:h-[180px] border border-[#C9952A]/40 p-1 bg-[#1A0A00] z-20 shadow-2xl overflow-hidden hidden sm:block opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
             <div className="absolute inset-1.5 border border-[#C9952A]/20 pointer-events-none z-10" />
             <img
              src="https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=400&q=80"
              alt="Culinary detail"
              className="w-full h-full object-cover select-none pointer-events-none grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
          </div>

          {/* Rotating Quality Seal */}
          <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-24 h-24 md:w-32 md:h-32 z-30 animate-[spin_15s_linear_infinite] hidden sm:flex items-center justify-center bg-[#1A0A00] rounded-full border border-[#C9952A]/30 shadow-[0_0_20px_rgba(201,149,42,0.15)] opacity-0 animate-fade-in" style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}>
             <svg viewBox="0 0 100 100" className="w-full h-full text-[#C9952A] opacity-80">
                <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text fill="currentColor" fontSize="10.5" fontWeight="bold" letterSpacing="1.5" className="uppercase font-body">
                  <textPath href="#textPath" startOffset="0%">
                    • Royal Feast • Authentic Taste • Premium Quality
                  </textPath>
                </text>
             </svg>
             <div className="absolute inset-0 m-auto w-6 h-6 md:w-8 md:h-8 text-[#C9952A] flex items-center justify-center">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_5px_rgba(201,149,42,0.5)]">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.164.587l.992 5.438a.563.563 0 01-.84.61l-4.72-2.888a.562.562 0 00-.586 0l-4.72 2.888a.563.563 0 01-.84-.61l.992-5.438a.563.563 0 00-.164-.587l-4.204-3.602c-.38-.325-.178-.95.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
               </svg>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
