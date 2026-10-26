/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Currency, Tour, BookingData, WebsiteContentConfig } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { TourDetailModal } from './components/TourDetailModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { TransitPlannerModal } from './components/TransitPlannerModal';

import { HomeScreen } from './screens/HomeScreen';
import { DesertSafarisScreen } from './screens/DesertSafarisScreen';
import { DhowCruisesScreen } from './screens/DhowCruisesScreen';
import { CultureScreen } from './screens/CultureScreen';
import { PrivateLuxuryScreen } from './screens/PrivateLuxuryScreen';
import { AboutScreen } from './screens/AboutScreen';
import { ContactScreen } from './screens/ContactScreen';

import { AuthProvider } from './context/AuthContext';
import { AdminPanel } from './admin/AdminPanel';
import { testConnection } from './lib/firebase';
import { seedInitialDataIfEmpty, getExperiences, getWebsiteContent, DEFAULT_WEBSITE_CONTENT } from './services/db';

export function AppContent() {
  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [currency, setCurrency] = useState<Currency>('QAR');
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');

  // Dynamic database resources
  const [liveExperiences, setLiveExperiences] = useState<Tour[]>([]);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContentConfig>(DEFAULT_WEBSITE_CONTENT);

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingTourId, setBookingTourId] = useState<string | undefined>(undefined);

  const [selectedTourForDetail, setSelectedTourForDetail] = useState<Tour | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [isTransitPlannerOpen, setIsTransitPlannerOpen] = useState<boolean>(false);
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState<boolean>(false);

  // Saved bookings in local storage (for offline drawer cache)
  const [savedBookings, setSavedBookings] = useState<BookingData[]>(() => {
    try {
      const stored = localStorage.getItem('mz_tourism_bookings') || localStorage.getItem('m2_tourism_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const loadData = async () => {
    try {
      const [exp, cms] = await Promise.all([getExperiences(false), getWebsiteContent()]);
      setLiveExperiences(exp);
      setWebsiteContent(cms);
    } catch (err) {
      console.warn('Data load notice:', err);
    }
  };

  // 1. Connection test, database seeding, and real-time event listeners on boot
  useEffect(() => {
    async function boot() {
      // Validate Firestore connection
      await testConnection();
      // Ensure initial experiences, locations, vehicles, CMS content, and superadmin exist
      await seedInitialDataIfEmpty();
      // Load live experiences and CMS
      await loadData();
    }
    boot();

    const handleDataUpdated = () => {
      loadData();
    };
    window.addEventListener('mz-data-updated', handleDataUpdated);
    window.addEventListener('focus', handleDataUpdated);
    return () => {
      window.removeEventListener('mz-data-updated', handleDataUpdated);
      window.removeEventListener('focus', handleDataUpdated);
    };
  }, []);

  // 2. Browser path & history synchronization
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (!path.startsWith('/admin')) {
        const screen = path.replace(/^\//, '') || 'home';
        setCurrentScreen(screen);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mz_tourism_bookings', JSON.stringify(savedBookings));
    } catch {
      // storage unavailable
    }
  }, [savedBookings]);

  const navigateTo = (destination: string) => {
    if (destination === 'admin' || destination.startsWith('/admin')) {
      const fullPath = destination === 'admin' ? '/admin' : destination;
      setCurrentPath(fullPath);
      window.history.pushState(null, '', fullPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentScreen(destination);
      const publicPath = destination === 'home' ? '/' : `/${destination}`;
      setCurrentPath(publicPath);
      window.history.pushState(null, '', publicPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveBooking = (newBooking: BookingData) => {
    setSavedBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (ref: string) => {
    setSavedBookings((prev) => prev.filter((b) => b.bookingRef !== ref));
  };

  const openBookingModalWithTour = (tourId?: string) => {
    setBookingTourId(tourId);
    setIsBookingModalOpen(true);
  };

  const openTourDetail = (tour: Tour) => {
    setSelectedTourForDetail(tour);
    setIsDetailModalOpen(true);
  };

  const handleTransitPlanBooking = () => {
    setBookingTourId('transit-layover');
    setIsBookingModalOpen(true);
  };

  // Check if we are on an admin route
  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminPanel
        currentPath={currentPath}
        onNavigatePath={(newPath) => {
          setCurrentPath(newPath);
          window.history.pushState(null, '', newPath);
        }}
        onExitToPublic={() => navigateTo('home')}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[#111317] text-[#e2e2e8] flex flex-col ${language === 'AR' ? 'font-arabic' : 'font-sans'}`}>
      
      {/* Top Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenBookingModal={openBookingModalWithTour}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'EN' ? 'AR' : 'EN'))}
        savedBookingsCount={savedBookings.length}
        onOpenBookingsDrawer={() => setIsBookingsDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20">
        {currentScreen === 'home' && (
          <HomeScreen
            currency={currency}
            onOpenBookingModal={openBookingModalWithTour}
            onOpenTourDetail={openTourDetail}
            onOpenTransitPlanner={() => setIsTransitPlannerOpen(true)}
            onNavigate={navigateTo}
            experiences={liveExperiences}
            websiteContent={websiteContent}
          />
        )}

        {currentScreen === 'desert-safaris' && (
          <DesertSafarisScreen
            currency={currency}
            onOpenBookingModal={openBookingModalWithTour}
            onOpenTourDetail={openTourDetail}
            experiences={liveExperiences}
          />
        )}

        {currentScreen === 'dhow-cruises' && (
          <DhowCruisesScreen
            currency={currency}
            onOpenBookingModal={openBookingModalWithTour}
            onOpenTourDetail={openTourDetail}
            experiences={liveExperiences}
          />
        )}

        {currentScreen === 'doha-culture' && (
          <CultureScreen
            currency={currency}
            onOpenBookingModal={openBookingModalWithTour}
            onOpenTourDetail={openTourDetail}
            experiences={liveExperiences}
          />
        )}

        {currentScreen === 'private-luxury' && (
          <PrivateLuxuryScreen
            currency={currency}
            onOpenBookingModal={openBookingModalWithTour}
            onOpenTourDetail={openTourDetail}
            onOpenTransitPlanner={() => setIsTransitPlannerOpen(true)}
            experiences={liveExperiences}
          />
        )}

        {currentScreen === 'about' && (
          <AboutScreen
            onOpenBookingModal={() => openBookingModalWithTour()}
          />
        )}

        {currentScreen === 'contact' && (
          <ContactScreen />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenBookingModal={openBookingModalWithTour}
      />

      {/* Floating WhatsApp VIP Button (Desktop) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <a
          href={`https://wa.me/${(websiteContent.whatsappNumber || '+97455128899').replace(/[^0-9]/g, '')}?text=Hello%20MZ%20Tourism%20Concierge,%20I%20would%20like%20to%20plan%20a%20private%20Qatar%20experience.`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with VIP Concierge"
          className="w-14 h-14 rounded-full bg-[#1e2024] border border-[#ecc15a] text-[#ecc15a] flex items-center justify-center shadow-[0_0_24px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px] group-hover:text-[#ffdf99]">
            forum
          </span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecc15a] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ecc15a] text-[#3f2e00] text-[9px] font-bold items-center justify-center">
              VIP
            </span>
          </span>
        </a>
      </div>

      {/* Compact Mobile Bottom Bar (Under 15% Viewport height) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e12]/95 backdrop-blur-xl border-t border-[#ecc15a]/20 px-4 py-2.5 flex items-center gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
        <a
          href={`https://wa.me/${(websiteContent.whatsappNumber || '+97455128899').replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[42px] flex items-center justify-center gap-1.5 rounded-md bg-[#282a2e] border border-[#ecc15a]/30 text-[#e2e2e8] hover:text-[#ecc15a] text-[12px] font-semibold"
        >
          <span className="material-symbols-outlined text-[#ecc15a] text-[16px]">chat</span>
          <span>WhatsApp Us</span>
        </a>

        <button
          onClick={() => openBookingModalWithTour()}
          className="flex-1 min-h-[42px] flex items-center justify-center gap-1.5 rounded-md bg-[#ecc15a] text-[#3f2e00] text-[12px] uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(236,193,90,0.3)] active:scale-95 cursor-pointer"
        >
          <span>Book Experience</span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialTourId={bookingTourId}
        currency={currency}
        onSaveBooking={handleSaveBooking}
        availableTours={liveExperiences}
      />

      <TourDetailModal
        tour={selectedTourForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        currency={currency}
        onBookNow={(tourId) => openBookingModalWithTour(tourId)}
      />

      <TransitPlannerModal
        isOpen={isTransitPlannerOpen}
        onClose={() => setIsTransitPlannerOpen(false)}
        currency={currency}
        onBookTransitTour={handleTransitPlanBooking}
      />

      <BookingsDrawer
        isOpen={isBookingsDrawerOpen}
        onClose={() => setIsBookingsDrawerOpen(false)}
        bookings={savedBookings}
        currency={currency}
        onNewBooking={() => openBookingModalWithTour()}
        onCancelBooking={handleCancelBooking}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
