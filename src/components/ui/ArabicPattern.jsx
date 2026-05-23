import React from 'react';

// Khatam pattern (8-pointed star geometric tiling)
export function KhatamPattern({ className = '', opacity = 0.08, color = '#C9952A' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="khatam" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Main 8-pointed star */}
            <path
              d="M40 0 L52 12 L68 12 L68 28 L80 40 L68 52 L68 68 L52 68 L40 80 L28 68 L12 68 L12 52 L0 40 L12 28 L12 12 L28 12 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.75"
            />
            {/* Outer overlapping square lines for authentic Girih look */}
            <rect x="12" y="12" width="56" height="56" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="1 3" />
            <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke={color} strokeWidth="0.5" />
            
            {/* Inner octagon */}
            <path
              d="M40 25 L50 29 L55 40 L50 51 L40 55 L30 51 L25 40 L30 29 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
            />
            {/* Center dot */}
            <circle cx="40" cy="40" r="2.5" fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#khatam)" />
      </svg>
    </div>
  );
}

// Girih geometric tile border (fits exactly inside absolute containers like cards)
export function GirihBorder({ className = '', color = '#C9952A', opacity = 0.25 }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Outer framing line */}
      <rect
        x="6"
        y="6"
        width="calc(100% - 12px)"
        height="calc(100% - 12px)"
        fill="none"
        stroke={color}
        strokeWidth="1.25"
      />
      {/* Inner dashed line */}
      <rect
        x="10"
        y="10"
        width="calc(100% - 20px)"
        height="calc(100% - 20px)"
        fill="none"
        stroke={color}
        strokeWidth="0.75"
        strokeDasharray="4 3"
      />
      {/* Decorative corners */}
      {/* Top Left */}
      <path d="M6 18 L18 18 L18 6" fill="none" stroke={color} strokeWidth="1" />
      {/* Top Right */}
      <path d="Mcalc(100% - 6px) 18 Lcalc(100% - 18px) 18 Lcalc(100% - 18px) 6" fill="none" stroke={color} strokeWidth="1" />
      {/* Bottom Left */}
      <path d="M6 calc(100% - 18px) L18 calc(100% - 18px) L18 calc(100% - 6px)" fill="none" stroke={color} strokeWidth="1" />
      {/* Bottom Right */}
      <path d="Mcalc(100% - 6px) calc(100% - 18px) Lcalc(100% - 18px) calc(100% - 18px) Lcalc(100% - 18px) calc(100% - 6px)" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
}

// Muqarnas Arch motif decoration (header ornaments)
export function MuqarnasArch({ className = '', color = '#C9952A', size = 80 }) {
  return (
    <div className={`flex flex-col items-center select-none pointer-events-none my-2 ${className}`}>
      <svg width={size} height={size * 0.375} viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Arch curvature */}
        <path
          d="M0 30 C15 30 23 17 40 4 C57 17 65 30 80 30"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        {/* Inner parallel lines */}
        <path
          d="M8 30 C20 30 28 21 40 10 C52 21 60 30 72 30"
          stroke={color}
          strokeWidth="0.75"
          strokeDasharray="2 2"
          fill="none"
        />
        {/* Center geometric drop diamond */}
        <polygon points="40,0 43,5 40,10 37,5" fill={color} />
        <circle cx="25" cy="27" r="1.5" fill={color} />
        <circle cx="55" cy="27" r="1.5" fill={color} />
      </svg>
    </div>
  );
}
