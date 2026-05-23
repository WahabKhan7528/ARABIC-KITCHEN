import React, { useEffect, useRef } from 'react';

export default function GrainOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Create a small pattern canvas for highly optimized grain generation
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 128;
    patternCanvas.height = 128;
    const pCtx = patternCanvas.getContext('2d');
    const pData = pCtx.createImageData(128, 128);
    const d = pData.data;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const updateNoise = () => {
      for (let i = 0; i < d.length; i += 4) {
        const val = Math.floor(Math.random() * 255);
        d[i] = val;     // Red
        d[i + 1] = val; // Green
        d[i + 2] = val; // Blue
        d[i + 3] = 16;  // Opacity (Alpha in scale of 255)
      }
      pCtx.putImageData(pData, 0, 0);
    };

    const render = () => {
      if (canvas.width === 0 || canvas.height === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fast update noise occasionally (randomize grain visual)
      if (Math.random() > 0.3) {
        updateNoise();
      }

      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.save();
        // Translate randomly to animate film grain tactile feel
        ctx.translate(Math.random() * 128, Math.random() * 128);
        ctx.fillRect(-128, -128, canvas.width + 256, canvas.height + 256);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'overlay', opacity: 0.035 }}
    />
  );
}
