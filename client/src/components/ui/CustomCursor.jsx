import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHidden, setIsHidden] = useState(true);

  // Mouse position targets
  const mouseRef = useRef({ x: 0, y: 0 });
  // Interpolated cursor positions
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable on touch devices completely
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    setIsHidden(false);

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // On first mouse move, make cursors visible
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = '1';
        ringRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = '0';
        ringRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = '1';
        ringRef.current.style.opacity = '1';
      }
    };

    // Stately LERP loop (Linear Interpolation) for butter smooth lagging tracking
    let animationFrameId;
    
    const updatePosition = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      // Inner dot follows tightly (lerp = 0.25)
      dotPos.current.x += (targetX - dotPos.current.x) * 0.25;
      dotPos.current.y += (targetY - dotPos.current.y) * 0.25;

      // Outer ring lags gracefully behind (lerp = 0.1)
      ringPos.current.x += (targetX - ringPos.current.x) * 0.1;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    // Interactive element hover selectors (directly manipulating classes to avoid React re-renders)
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .interactive-hover, .menu-card-wrapper, .group');
      if (isInteractive && ringRef.current) {
        ringRef.current.classList.add('cursor-hovered');
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .interactive-hover, .menu-card-wrapper, .group');
      if (isInteractive && ringRef.current) {
        ringRef.current.classList.remove('cursor-hovered');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      <style>{`
        .custom-cursor-ring {
          width: 28px;
          height: 28px;
          margin-left: -14px;
          margin-top: -14px;
          background-color: transparent;
          border-color: #C9952A;
        }
        .custom-cursor-ring.cursor-hovered {
          width: 56px;
          height: 56px;
          margin-left: -28px;
          margin-top: -28px;
          background-color: rgba(201, 149, 42, 0.15);
          border-color: #E8BA5A;
        }
        .custom-cursor-symbol {
          opacity: 0;
        }
        .custom-cursor-ring.cursor-hovered .custom-cursor-symbol {
          opacity: 1;
        }
      `}</style>

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-[#C9952A] rounded-full pointer-events-none z-[10000] opacity-0 transition-[opacity] duration-300 select-none"
        style={{
          transform: 'translate3d(0,0,0)',
        }}
      />
      {/* Outer Lagging Ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring fixed top-0 left-0 rounded-full pointer-events-none z-[10000] opacity-0 flex items-center justify-center transition-[width,height,margin,background-color,border-color,opacity] duration-300 ease-out border"
        style={{
          transform: 'translate3d(0,0,0)',
        }}
      >
        <span className="custom-cursor-symbol text-label-xs font-bold tracking-[0.2em] text-[#FAF3E0] pointer-events-none select-none transition-opacity duration-300 font-body">
          ✦
        </span>
      </div>
    </>
  );
}
