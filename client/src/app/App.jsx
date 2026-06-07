/**
 * @fileoverview Root application component — routing orchestrator.
 *
 * Uses hash-based routing (window.location.hash) to switch between
 * the public landing page, cart/checkout flow, and staff dashboard.
 * Mounts global overlays (GrainOverlay, CustomCursor) and conditionally
 * enables Lenis smooth scrolling on the landing page.
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthSession } from '../store/slices/authSlice';

// Global hooks
import useLenis from '../hooks/useLenis';

// Shared layout & UI
import Navbar from '../shared/layout/Navbar';
import Footer from '../shared/layout/Footer';
import CustomCursor from '../shared/ui/CustomCursor';
import GrainOverlay from '../shared/ui/GrainOverlay';
import SEO from '../shared/ui/SEO';

// Feature pages
import { LandingPage } from '../features/landing';
import { LoginPage } from '../features/auth';
import { DashboardPage } from '../features/dashboard';
import { CartPage, CheckoutPage, PaymentPage, ConfirmationPage } from '../features/checkout';

import CustomerDashboard from '../features/portal/pages/CustomerDashboard';

export default function App() {
  // Current view determines which feature is rendered
  const [currentView, setCurrentView] = useState('guest'); // guest | staff | cart | checkout | payment | confirmation | customer-dashboard
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check session on load
    dispatch(checkAuthSession());
  }, [dispatch]);

  /**
   * Listen for hash changes and update the current view accordingly.
   * This acts as a lightweight router without adding a dependency.
   */
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
      } else if (hash.startsWith('#customer-dashboard')) {
        setCurrentView('customer-dashboard');
      } else {
        setCurrentView('guest');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Enable Lenis smooth scroll only for the public landing page view
  useLenis(currentView === 'guest');

  return (
    <div className="relative min-h-screen bg-[#1A0A00] overflow-x-hidden text-ivory">
      {/* GPU-optimized film-grain texture canvas overlay */}
      <GrainOverlay />
      
      {/* Default SEO Tags */}
      <SEO title={currentView === 'guest' ? 'Home' : currentView.charAt(0).toUpperCase() + currentView.slice(1)} />

      {/* Lagging custom trailing cursor (desktop cursor devices only) */}
      <CustomCursor />

      {/* ─── View Router ──────────────────────────────────────────── */}
      {currentView === 'staff' ? (
        isAuthenticated ? <DashboardPage /> : <LoginPage />
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
      ) : currentView === 'customer-dashboard' ? (
        <CustomerDashboard />
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
