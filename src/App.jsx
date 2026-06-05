import React, { useState, useEffect } from 'react';
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
import WorkerDashboard from './components/sections/WorkerDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('guest'); // 'guest' or 'staff'

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#dashboard' || hash === '#staff') {
        setCurrentView('staff');
      } else {
        setCurrentView('guest');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mount Lenis Smooth Scroll only for public guest view
  useLenis(currentView === 'guest');

  return (
    <div className="relative min-h-screen bg-[#1A0A00] overflow-x-hidden text-ivory">
      {/* 1. GPU-optimized film-grain texture canvas overlay */}
      <GrainOverlay />

      {/* 2. Lagging custom trailing cursor (desktop cursor devices) */}
      <CustomCursor />

      {currentView === 'staff' ? (
        <WorkerDashboard />
      ) : (
        <>
          {/* Sticky shrinking navbar */}
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
        </>
      )}
    </div>
  );
}
