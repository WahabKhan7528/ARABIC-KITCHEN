import React, { useState, useEffect } from 'react';
import useLenis from './hooks/useLenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/public/landing/LandingPage';
import CustomCursor from './components/ui/CustomCursor';
import GrainOverlay from './components/ui/GrainOverlay';
import WorkerDashboard from './pages/dashboard/WorkerDashboard';
import CartPage from './pages/public/checkout/CartPage';
import CheckoutPage from './pages/public/checkout/CheckoutPage';
import PaymentPage from './pages/public/checkout/PaymentPage';
import ConfirmationPage from './pages/public/checkout/ConfirmationPage';

export default function App() {
  const [currentView, setCurrentView] = useState('guest'); // guest, staff, cart, checkout, payment, confirmation

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#dashboard') || hash.startsWith('#staff')) {
        setCurrentView('staff');
      } else if (hash.startsWith('#cart')) {
        setCurrentView('cart');
      } else if (hash.startsWith('#checkout')) {
        setCurrentView('checkout');
      } else if (hash.startsWith('#payment')) {
        setCurrentView('payment');
      } else if (hash.startsWith('#confirmation')) {
        setCurrentView('confirmation');
      } else {
        setCurrentView('guest');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mount Lenis Smooth Scroll only for public guest landing page view
  useLenis(currentView === 'guest');

  return (
    <div className="relative min-h-screen bg-[#1A0A00] overflow-x-hidden text-ivory">
      {/* 1. GPU-optimized film-grain texture canvas overlay */}
      <GrainOverlay />

      {/* 2. Lagging custom trailing cursor (desktop cursor devices) */}
      <CustomCursor />

      {currentView === 'staff' ? (
        <WorkerDashboard />
      ) : currentView === 'cart' ? (
        <>
          <Navbar />
          <CartPage />
        </>
      ) : currentView === 'checkout' ? (
        <>
          <Navbar />
          <CheckoutPage />
        </>
      ) : currentView === 'payment' ? (
        <>
          <Navbar />
          <PaymentPage />
        </>
      ) : currentView === 'confirmation' ? (
        <>
          <Navbar />
          <ConfirmationPage />
        </>
      ) : (
        <>
          {/* Sticky shrinking navbar */}
          <Navbar />

          {/* Main single page content layout */}
          <LandingPage />

          {/* Opulent footer */}
          <Footer />
        </>
      )}
    </div>
  );
}
