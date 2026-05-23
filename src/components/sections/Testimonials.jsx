import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';

// Import essential Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-fade';

const testimonialsData = [
  {
    rating: 5,
    quote: "The Lamb Mandi at Arabic Kitchen is an absolute culinary miracle. The meat is so tender it literally slides off the bone, and the authentic smoke aroma transports you straight to Arabia. The best meal in Bahawalpur, hands down!",
    name: "Dr. Farooq Shah",
    city: "Bahawalpur"
  },
  {
    rating: 5,
    quote: "We were completely wowed by the opulent ambiance and cinematic vibe! Every single dish, from the Hummus Beiruti to the sizzling Mixed Grill, was masterfully prepared. They have raised the bar for premium dining in Pakistan.",
    name: "Zainab Malik",
    city: "Lahore"
  },
  {
    rating: 5,
    quote: "Arabic Kitchen is not just a restaurant; it is a true sensory experience. The charcoal grilled seekh kababs are packed with juicy spice blends. Their warm service and gold-standard hygiene deserve five stars!",
    name: "Hamza Abbasi",
    city: "Multan"
  }
];

export default function Testimonials() {

  return (
    <section
      id="testimonials"
      className="relative bg-[#1A0A00] text-ivory py-24 select-none overflow-hidden"
    >
      {/* Background Tiling decoration */}
      <KhatamPattern opacity={0.06} />

      {/* Main Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-12 relative z-10 flex flex-col items-center">
        <span className="font-arabic text-gold text-base tracking-[0.2em] mb-1">
          آراء العملاء
        </span>
        <h2 className="font-display italic text-4xl md:text-5xl text-ivory mb-2 tracking-tight">
          Royal Guest Testimonials
        </h2>
        <MuqarnasArch color="#C9952A" size={50} />
      </div>

      {/* Centered Swiper Carousel Card */}
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Main Swiper Component */}
        <div className="border border-gold/20 p-8 md:p-12 bg-[#1F1108]/90 shadow-xl rounded-[2px] relative overflow-hidden">
          <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

          <Swiper
            modules={[Autoplay, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            loop={true}
            navigation={{
              prevEl: '.swiper-prev-btn',
              nextEl: '.swiper-next-btn',
            }}
            className="w-full select-none"
          >
            {testimonialsData.map((t, idx) => (
              <SwiperSlide key={idx} className="flex flex-col items-center text-center">
                
                {/* 5 Gold Star Rating */}
                <div className="flex items-center gap-1.5 mb-6 justify-center">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold shrink-0" />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="font-display italic text-lg md:text-2xl text-cream/90 leading-relaxed max-w-xl mx-auto mb-8">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author Credentials */}
                <cite className="not-italic flex flex-col items-center">
                  <span className="font-body font-bold text-xs uppercase tracking-[0.2em] text-ivory">
                    {t.name}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-widest text-gold/80 mt-1">
                    {t.city}, Pakistan
                  </span>
                </cite>

              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Control Buttons */}
          <div className="flex items-center justify-between w-full mt-8 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 md:left-0 md:px-4 z-50 pointer-events-none">
            
            {/* Left Button */}
            <button
              className="swiper-prev-btn w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-primary-dark transition-all duration-300 pointer-events-auto cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Button */}
            <button
              className="swiper-next-btn w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-primary-dark transition-all duration-300 pointer-events-auto cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
