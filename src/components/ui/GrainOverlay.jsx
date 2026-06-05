import React, { useEffect, useState } from 'react';

export default function GrainOverlay() {
  const [grainBg, setGrainBg] = useState('');

  useEffect(() => {
    // Create a small pattern canvas for highly optimized grain generation (runs only once on mount)
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 128;
    patternCanvas.height = 128;
    const pCtx = patternCanvas.getContext('2d');
    const pData = pCtx.createImageData(128, 128);
    const d = pData.data;

    // Generate static random noise
    for (let i = 0; i < d.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      d[i] = val;     // Red
      d[i + 1] = val; // Green
      d[i + 2] = val; // Blue
      d[i + 3] = 18;  // Opacity (Alpha in scale of 255)
    }
    pCtx.putImageData(pData, 0, 0);

    // Convert pattern to base64 data URL for fast CSS background rendering
    setGrainBg(patternCanvas.toDataURL());
  }, []);

  if (!grainBg) return null;

  return (
    <>
      <style>{`
        @keyframes grain-movement {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -2%); }
          20% { transform: translate(-3%, 1%); }
          30% { transform: translate(-2%, -3%); }
          40% { transform: translate(-1%, 3%); }
          50% { transform: translate(-3%, 2%); }
          60% { transform: translate(-2%, 0); }
          70% { transform: translate(0, 2%); }
          80% { transform: translate(1%, 3%); }
          90% { transform: translate(-2%, 1%); }
        }
      `}</style>
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          backgroundImage: `url(${grainBg})`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
          opacity: 0.35, // Balanced subtle overlay opacity
          animation: 'grain-movement 0.8s steps(8) infinite',
        }}
      />
    </>
  );
}
