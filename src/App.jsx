import React from 'react';
import useLenis from './hooks/useLenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Marquee from './components/sections/Marquee';
import Menu from './components/sections/Menu';
import About from './components/sections/About';
import SignatureDishes from './components/sections/SignatureDishes';
import Gallery from './components/sections/Gallery';
import Reservation from './components/sections/Reservation';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
import CustomCursor from './components/ui/CustomCursor';
import GrainOverlay from './components/ui/GrainOverlay';

export default function App() {
  // Mount Lenis Smooth Scroll + GSAP ticking sync bridge
  useLenis();

  return (
    <div className="relative min-h-screen bg-[#1A0A00] overflow-x-hidden text-ivory">
      {/* 1. GPU-optimized film-grain texture canvas overlay */}
      <GrainOverlay />

      {/* 2. Lagging custom trailing cursor (desktop cursor devices) */}
      <CustomCursor />

      {/* Sticky shinking navbar */}
      <Navbar />

      {/* Main single page content layout */}
      <main>
        <Hero />
        <Marquee />
        <Menu />
        <About />
        <SignatureDishes />
        <Gallery />
        <Reservation />
        <Testimonials />
        <Contact />
      </main>

      {/* Opulent footer */}
      <Footer />
    </div>
  );
}
