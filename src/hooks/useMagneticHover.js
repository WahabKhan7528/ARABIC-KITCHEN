import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function useMagneticHover(strength = 0.35, radius = 80) {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check if hover is supported (mouse device)
    const isMobile = window.matchMedia('(hover: none)').matches;
    if (isMobile) return;

    // Fast GSAP setters for performance
    const quickX = gsap.quickTo(el, 'x', { duration: strength, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: strength, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;

      const dx = e.clientX - elX;
      const dy = e.clientY - elY;
      const distance = Math.hypot(dx, dy);

      if (distance < radius) {
        // Pull towards cursor proportionally
        quickX(dx * 0.4);
        quickY(dy * 0.4);
      } else {
        // Return to center when out of range
        quickX(0);
        quickY(0);
      }
    };

    const handleMouseLeave = () => {
      // Elastic spring back on leave
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, radius]);

  return elementRef;
}
