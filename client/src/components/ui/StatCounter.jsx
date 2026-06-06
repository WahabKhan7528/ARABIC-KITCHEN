import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StatCounter({ target, label, duration = 1.8, suffix = '' }) {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const parsedTarget = parseFloat(target);
    const isFloat = target.toString().includes('.');
    const counterObj = { val: 0 };

    const ctx = gsap.context(() => {
      // 1. Underscore line drawing in width 0% -> 100%
      gsap.fromTo(
        lineRef.current,
        { width: '0%', opacity: 0 },
        {
          width: '100%',
          opacity: 1,
          duration: duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 2. Numerical counter progression
      gsap.to(counterObj, {
        val: parsedTarget,
        duration: duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          setCurrentVal(isFloat ? counterObj.val.toFixed(1) : Math.floor(counterObj.val));
        },
      });
    }, el);

    return () => ctx.revert();
  }, [target, duration]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center p-4 min-w-[140px]">
      {/* Visual Number Stack */}
      <div className="text-title-xl font-semibold text-gold font-display flex items-baseline gap-0.5 select-none">
        <span>{currentVal}</span>
        {suffix && <span className="text-title-md text-gold-light ml-0.5">{suffix}</span>}
      </div>

      {/* Drawing Line Accent */}
      <div ref={lineRef} className="h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mt-2 mb-1 w-0 opacity-0" />

      {/* Label descriptive text */}
      <span className="text-label-sm tracking-[0.2em] text-cream uppercase text-center font-body mt-1 select-none">
        {label}
      </span>
    </div>
  );
}
