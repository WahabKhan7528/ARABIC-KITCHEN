/**
 * @fileoverview Landing page — composes all public-facing sections.
 *
 * Renders the full single-page restaurant experience: hero, marquee,
 * menu, about, signatures, gallery, reservations, testimonials, and contact.
 */

import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import LocalBusinessSchema from '../../../shared/ui/LocalBusinessSchema';

const Marquee = React.lazy(() => import('../components/Marquee'));
const Menu = React.lazy(() => import('../components/Menu'));
const About = React.lazy(() => import('../components/About'));
const SignatureDishes = React.lazy(() => import('../components/SignatureDishes'));
const Gallery = React.lazy(() => import('../components/Gallery'));
const Reservation = React.lazy(() => import('../components/Reservation'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const Contact = React.lazy(() => import('../components/Contact'));

export default function LandingPage() {
  return (
    <>
      <LocalBusinessSchema />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-24 bg-[#1A0A00]"></div>}>
          <Marquee />
          <Menu />
          <About />
          <SignatureDishes />
          <Gallery />
          <Reservation />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>
    </>
  );
}
