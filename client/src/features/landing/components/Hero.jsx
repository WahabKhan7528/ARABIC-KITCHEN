import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import HeroParticles from '../../../shared/ui/HeroParticles';
import { KhatamPattern } from '../../../shared/ui/ArabicPattern';

export default function Hero() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageContainerRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);

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
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 max-w-7xl mx-auto w-full relative z-10 py-16 pb-32">

        {/* Left Side: Text Content Block */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-4 w-full">
            <h2 className="font-arabic text-gold text-2xl tracking-[0.2em]">مأدبة ملكية</h2>
            <div className="h-px w-16 bg-gold/50 hidden lg:block"></div>
          </div>

          <h1
            ref={headlineRef}
            className="font-display italic text-hero text-ivory leading-[1.1] flex flex-wrap justify-center lg:justify-start overflow-hidden mb-6"
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

          <div ref={subtitleRef} className="flex flex-col items-center lg:items-start opacity-0 transform-gpu w-full">
            <p className="font-body text-body-md text-cream/80 max-w-lg leading-relaxed text-center lg:text-left px-4 lg:px-0">
              Step into an opulent culinary sanctuary. We draw inspiration from centuries-old spice routes to bring you masterfully prepared mutton mandi, sizzling grills, and elite contemporary fast food.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-8">
              <a href="#menu" className="bg-[#C9952A] text-[#1A0A00] font-body text-label-sm font-bold px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-[#E8BA5A] transition-colors">
                EXPLORE MENU
              </a>
              <a href="#reserve" className="border border-gold/50 text-gold font-body text-label-sm font-bold px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-gold/10 transition-colors">
                RESERVE TABLE
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Image Cards */}
        <div className="w-full lg:w-1/2 flex flex-col items-end gap-8 relative z-30 mt-12 lg:mt-0">

          {/* Right Slider Cards */}
          <div ref={imageContainerRef} className="flex h-64 md:h-80 lg:h-96 xl:h-[420px] gap-2 md:gap-3 transform-gpu justify-end w-full md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] md:-mr-12 lg:-mr-16">
            {[
              { title: 'Mutton Ribs', label: 'SIGNATURE', src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
              { title: 'Spicy Penne', label: 'POPULAR', src: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80' },
              { title: 'Baklava', label: 'DESSERT', src: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80' }
            ].map((card, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveCard(index)}
                className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer relative rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shrink-0 group ${activeCard === index ? 'w-[55vw] sm:w-[60vw] md:w-72 lg:w-96' : 'w-[12vw] sm:w-[15vw] md:w-24 lg:w-32'
                  }`}
              >
                <img alt={card.title} className="absolute inset-0 w-full h-full object-cover" src={card.src} />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#1A0A00]/90 via-[#1A0A00]/40 to-transparent transition-opacity duration-300 flex items-end pb-6 pr-6 pt-6 ${index === 0 ? 'pl-10 md:pl-12' : 'pl-6'} ${activeCard === index ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-gold font-body text-label-xs whitespace-nowrap tracking-widest block">{card.label}</span>
                    <h4 className="text-ivory font-display text-title-sm whitespace-nowrap leading-tight">{card.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Motto Line */}
          <div className="w-full flex justify-end mt-4 md:mt-6 pr-2 md:pr-0 -mr-6 md:-mr-12 lg:-mr-16">
            <div className="flex items-center gap-3 lg:gap-4 opacity-90">
              <div className="h-[1px] w-8 md:w-16 lg:w-24 bg-gradient-to-r from-transparent to-[#C9952A]/60"></div>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8BA5A] via-[#C9952A] to-[#E8BA5A] text-xs md:text-sm lg:text-base tracking-[0.2em] md:tracking-[0.3em] font-display italic uppercase font-bold drop-shadow-md text-center md:text-right">
                Taste the essence of Arabian royalty <span className="mx-1 md:mx-2 text-[#C9952A]/50">✦</span> Authentic flavors, timeless tradition
              </p>
              <div className="h-[1px] w-8 md:w-16 lg:w-24 bg-gradient-to-l from-transparent to-[#C9952A]/60"></div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}