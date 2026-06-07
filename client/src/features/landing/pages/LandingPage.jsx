/**
 * @fileoverview Landing page — composes all public-facing sections.
 *
 * Renders the full single-page restaurant experience: hero, marquee,
 * menu, about, signatures, gallery, reservations, testimonials, and contact.
 */

import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Menu from '../components/Menu';
import About from '../components/About';
import SignatureDishes from '../components/SignatureDishes';
import Gallery from '../components/Gallery';
import Reservation from '../components/Reservation';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

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
