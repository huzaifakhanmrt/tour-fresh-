import React, { useState } from 'react';
import { Currency } from '../types';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenBookingModal: (tourId?: string) => void;
  language: 'EN' | 'AR';
  onToggleLanguage: () => void;
  savedBookingsCount: number;
  onOpenBookingsDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  currency,
  onCurrencyChange,
  onOpenBookingModal,
  language,
  onToggleLanguage,
  savedBookingsCount,
  onOpenBookingsDrawer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: language === 'AR' ? 'الرئيسية' : 'Home' },
    { id: 'desert-safaris', label: language === 'AR' ? 'رحلات الصحراء' : 'Desert Safaris' },
    { id: 'dhow-cruises', label: language === 'AR' ? 'رحلات المحامل' : 'Dhow Cruises' },
    { id: 'doha-culture', label: language === 'AR' ? 'ثقافة الدوحة' : 'Doha City & Culture' },
    { id: 'private-luxury', label: language === 'AR' ? 'جولات كبار الشخصيات' : 'Private Luxury Tours' },
    { id: 'about', label: language === 'AR' ? 'من نحن' : 'About Us' },
    { id: 'contact', label: language === 'AR' ? 'اتصل بنا' : 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111317]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-[#ecc15a]/20">
        <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-6">
          
          {/* Brand Zone */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGui-SNU6_iwV5wzBpFtmS0AeG8ysteGedbKiEtyAByYkSsO_tqIkWix6ZvYrctEc4k6HWO15h_Sw1TgfTMPScLNKrJqNNNQY6gM9g2z62_wkzYcyXXsh8Vg47jAAyJeG2-Nag7EgVPGGXwS71uOZxt-PqczJKu05UdxC5lkiiHnkXT3zkkz_vWhTQgwoJGflopZ2DAfPhpAOi5CxTNmTeFvY0tnQln5b08dJc_eXE3SB85xDz0oMZ"
                alt="MZ Tourism Qatar Luxury Logo"
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif text-[20px] font-semibold text-[#ecc15a] tracking-wide leading-none group-hover:text-[#ffdf99] transition-colors whitespace-nowrap">
                  MZ TOURISM
                </span>
                <span className="text-[10px] text-[#d1c5b1] tracking-widest uppercase mt-0.5 whitespace-nowrap font-medium">
                  Qatar • Bespoke Concierge
                </span>
              </div>
            </button>
          </div>

          {/* Nav Links Zone (Desktop) */}
          <nav className="hidden xl:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = currentScreen === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-[12px] font-semibold uppercase tracking-wider py-1 transition-all whitespace-nowrap cursor-pointer relative ${
                    isActive
                      ? 'text-[#ecc15a]'
                      : 'text-[#d1c5b1] hover:text-[#ecc15a]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ecc15a] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="hidden md:flex items-center relative">
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                aria-label="Currency Selector"
                className="appearance-none bg-[#282a2e] text-[#e2e2e8] text-[12px] font-semibold px-3 py-2 pr-7 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ecc15a] border border-[#4e4636]/40"
              >
                <option value="QAR">QAR (﷼)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 text-[#d1c5b1] pointer-events-none text-[16px]">
                expand_more
              </span>
            </div>

            {/* Language Switch */}
            <button
              onClick={onToggleLanguage}
              className="hidden lg:flex items-center px-2.5 py-1.5 rounded-md bg-[#282a2e] text-[11px] font-bold text-[#ecc15a] hover:bg-[#333539] border border-[#4e4636]/40 transition-colors"
              title="Toggle Language"
            >
              {language === 'EN' ? '‏عربي' : 'EN'}
            </button>

            {/* Direct WhatsApp VIP button */}
            <a
              href="https://wa.me/97455128899?text=Hello%20MZ%20Tourism%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20VIP%20Qatar%20experience."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md bg-[#282a2e] hover:bg-[#1e2024] border border-[#ecc15a]/30 text-[#e2e2e8] hover:text-[#ecc15a] transition-all whitespace-nowrap"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecc15a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ecc15a]"></span>
              </span>
              <span className="text-[12px] font-semibold tracking-wider">WhatsApp VIP</span>
            </a>

            {/* Book Now Primary Button */}
            <button
              onClick={() => onOpenBookingModal()}
              className="inline-flex items-center justify-center min-h-[42px] px-5 rounded-md bg-[#ecc15a] text-[#3f2e00] hover:bg-[#c29b38] transition-all text-[12px] font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(236,193,90,0.25)] hover:shadow-[0_0_25px_rgba(236,193,90,0.45)] whitespace-nowrap cursor-pointer active:scale-95"
            >
              {language === 'AR' ? 'احجز الآن' : 'Book Now'}
            </button>

            {/* Saved Bookings / Inquiries Badge Icon */}
            <button
              onClick={onOpenBookingsDrawer}
              aria-label="View your active reservations"
              className="relative w-9 h-9 rounded-md bg-[#282a2e] hover:bg-[#333539] border border-[#4e4636]/40 flex items-center justify-center text-[#ecc15a] cursor-pointer transition-colors"
              title="My Inquiries & Itineraries"
            >
              <span className="material-symbols-outlined text-[19px]">receipt_long</span>
              {savedBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#872439] text-[#ffd9dc] text-[10px] font-bold flex items-center justify-center">
                  {savedBookingsCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => handleNavClick('admin')}
              aria-label="Admin Portal"
              title="MZ VIP Admin Console"
              className="w-9 h-9 rounded-md bg-[#282a2e] hover:bg-[#333539] border border-[#ecc15a]/30 flex items-center justify-center text-[#ecc15a] hover:text-[#ffdf99] cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">admin_panel_settings</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-md bg-[#282a2e] border border-[#4e4636]/40 text-[#ecc15a] hover:bg-[#1e2024] transition-colors focus:outline-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0c0e12]/80 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#1a1c20] border-l border-[#ecc15a]/20 p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#4e4636]/30">
              <div className="flex items-center gap-2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQSeUyz1Pd-B6KGd39Amp8uIaQPcIuuyVSMQHQijWOKsMYI3XitvaVPtJPL2E5gDEfXHlYhJSkZVGYffE1IIcxjl0CQXsNFYRwEqEk6Yn5THfQb-kV5g7bBast9rR4k0sqdyg2k7ZfXzwmybe6rJ3HXg8Rblo6ZcN4pIvVU-sZGgaptNx7jUGU0iiIeapf0LHLGVx6SrZy1ijTmIG40NZVvsFyu3pIc801ro4VhCnwKvU4wd3jxpEF"
                  alt="MZ Tourism Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="font-serif text-[18px] font-semibold text-[#ecc15a]">MZ Concierge</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#282a2e] text-[#e2e2e8] hover:text-[#ecc15a]"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Currency & Language Controls in Drawer */}
            <div className="flex items-center justify-between p-3 rounded-md bg-[#1e2024]">
              <span className="text-[11px] text-[#d1c5b1] uppercase font-semibold">Currency & Lang</span>
              <div className="flex items-center gap-3">
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                  className="bg-[#282a2e] text-[#ecc15a] text-[12px] font-bold px-2 py-1 rounded border border-[#4e4636]"
                >
                  <option value="QAR">QAR (﷼)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <button
                  onClick={onToggleLanguage}
                  className="text-[12px] font-bold text-[#ecc15a] px-2 py-1 rounded bg-[#282a2e] border border-[#4e4636]"
                >
                  {language === 'EN' ? '‏عربي' : 'EN'}
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = currentScreen === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-3 rounded-md text-left font-semibold text-[13px] uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-[#282a2e] text-[#ecc15a]'
                        : 'text-[#d1c5b1] hover:bg-[#282a2e] hover:text-[#e2e2e8]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer Actions */}
          <div className="flex flex-col gap-3 pt-6 border-t border-[#4e4636]/30">
            <a
              href="tel:+97444001234"
              className="flex items-center justify-center gap-2 min-h-[44px] rounded-md bg-[#282a2e] border border-[#4e4636]/40 text-[#e2e2e8] hover:text-[#ecc15a] text-[13px] font-medium"
            >
              <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">call</span>
              +974 4400 1234
            </a>
            <a
              href="https://wa.me/97455128899"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 min-h-[44px] rounded-md bg-[#282a2e] border border-[#ecc15a]/40 text-[#ecc15a] text-[13px] font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              Direct WhatsApp VIP
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="flex items-center justify-center min-h-[44px] rounded-md bg-[#ecc15a] text-[#3f2e00] text-[13px] uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(236,193,90,0.3)]"
            >
              Reserve Experience
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center justify-center gap-2 min-h-[42px] rounded-md bg-[#1e2024] border border-[#ecc15a]/30 text-[#ecc15a] text-[12px] font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>VIP Admin Console</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};
