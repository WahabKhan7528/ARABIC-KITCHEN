import React from 'react';

export default function Marquee() {
  const renderMarqueeItems = (textColor, starColor) => (
    <div className="flex items-center gap-8 pr-8">
      {Array(6).fill(null).map((_, idx) => (
        <React.Fragment key={idx}>
          <span className={`${textColor} font-display font-semibold tracking-[0.25em]`}>Arabic Kitchen</span>
          <span className={`${starColor} text-xs md:text-sm`}>✦</span>
          <span className={`${textColor} font-display font-semibold tracking-[0.25em]`}>Arabian Cuisine</span>
          <span className={`${starColor} text-xs md:text-sm`}>✦</span>
          <span className={`${textColor} font-display font-semibold tracking-[0.25em]`}>Bahawalpur</span>
          <span className={`${starColor} text-xs md:text-sm`}>✦</span>
          <span className={`${textColor} font-arabic font-bold text-lg md:text-xl lg:text-2xl tracking-[0.1em] normal-case`}>المطبخ العربي</span>
          <span className={`${starColor} text-xs md:text-sm`}>✦</span>
          <span className={`${textColor} font-display font-semibold tracking-[0.25em]`}>Fast Food</span>
          <span className={`${starColor} text-xs md:text-sm`}>✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="relative bg-[#1A0A00] py-10 md:py-14 overflow-hidden select-none border-y border-[#C9952A]/30 z-10 flex flex-col gap-6 md:gap-8">
      {/* Row 1: Scrolling Left */}
      <div className="flex w-full overflow-hidden relative cursor-pointer">
        <div className="flex animate-[marquee-left_60s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap text-sm md:text-base lg:text-lg uppercase">
          {renderMarqueeItems("text-gold-light/95", "text-gold")}
          {renderMarqueeItems("text-gold-light/95", "text-gold")}
        </div>
      </div>

      {/* Row 2: Scrolling Right */}
      <div className="flex w-full overflow-hidden relative cursor-pointer">
        <div className="flex animate-[marquee-right_60s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap text-sm md:text-base lg:text-lg uppercase">
          {renderMarqueeItems("text-cream/95", "text-gold-light")}
          {renderMarqueeItems("text-cream/95", "text-gold-light")}
        </div>
      </div>
    </section>
  );
}

