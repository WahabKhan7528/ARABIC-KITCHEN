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

    let rect = null;
    let cachedScrollY = 0;
    let cachedScrollX = 0;

    const updateRect = () => {
      rect = el.getBoundingClientRect();
      cachedScrollY = window.scrollY;
      cachedScrollX = window.scrollX;
    };

    // Get initial rect
    updateRect();

    // Only update bounding rect on scroll and resize (avoid layout reflow on mousemove)
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });

    const handleMouseMove = (e) => {
      if (!rect) return;

      // Adjust viewport coords based on scroll delta since last rect update
      const scrollDiffY = window.scrollY - cachedScrollY;
      const scrollDiffX = window.scrollX - cachedScrollX;

      const elX = rect.left - scrollDiffX + rect.width / 2;
      const elY = rect.top - scrollDiffY + rect.height / 2;

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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, radius]);

  return elementRef;
}
