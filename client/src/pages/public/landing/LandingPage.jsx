import React from 'react';
import Hero from './Hero';
import Marquee from './Marquee';
import Menu from './Menu';
import About from './About';
import SignatureDishes from './SignatureDishes';
import Gallery from './Gallery';
import Reservation from './Reservation';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function LandingPage() {
  return (
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
  );
}
