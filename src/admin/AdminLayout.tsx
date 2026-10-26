import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROOT_ADMIN_EMAIL } from '../lib/firebase';

interface AdminLayoutProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigateTab,
  onExitToPublic,
  children,
}) => {
  const { user, adminProfile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', badge: null },
    { id: 'experiences', label: 'Experiences & Tours', icon: 'explore', badge: null },
    { id: 'bookings', label: 'Bookings & Itineraries', icon: 'calendar_month', badge: 'Live' },
    { id: 'locations', label: 'Pick-up & Drop-off', icon: 'location_on', badge: null },
    { id: 'vehicles', label: 'Fleet & Chauffeurs', icon: 'directions_car', badge: null },
    { id: 'guests', label: 'Guest Policies', icon: 'group', badge: null },
    { id: 'availability', label: 'Availability & Blackouts', icon: 'event_busy', badge: null },
    { id: 'pricing', label: 'Pricing & Coupons', icon: 'payments', badge: null },
    { id: 'customers', label: 'VIP Guests & Clients', icon: 'person_pin', badge: null },
    { id: 'website-content', label: 'Website CMS', icon: 'auto_stories', badge: 'CMS' },
    { id: 'media', label: 'Media & Gallery', icon: 'photo_library', badge: null },
    { id: 'reviews', label: 'Guest Reviews', icon: 'star_rate', badge: null },
    { id: 'reports', label: 'Reports & Analytics', icon: 'analytics', badge: null },
    { id: 'settings', label: 'Settings & Staff', icon: 'admin_panel_settings', badge: null },
    { id: 'automated-tests', label: 'System Audit & QA', icon: 'verified_user', badge: 'QA' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#111317] border-r border-[#ecc15a]/20 sticky top-0 h-screen z-30 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#282a2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ecc15a] to-[#c29b38] flex items-center justify-center shadow-lg shadow-[#ecc15a]/10">
              <span className="font-serif font-black text-[#111317] text-xl tracking-tighter">MZ</span>
            </div>
            <div>
              <div className="font-serif font-bold text-white tracking-wider text-base leading-tight">
                MZ TOURISM
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#ecc15a] font-semibold">
                Admin Console
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ecc15a]/15 text-[#ecc15a] border border-[#ecc15a]/30">
            PRO
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Management & Operations
          </div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ecc15a] text-[#111317] font-semibold shadow-md shadow-[#ecc15a]/20'
                    : 'text-[#d1c5b1] hover:bg-[#1e2024] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-[#111317]' : 'text-[#ecc15a]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#111317] text-[#ecc15a]'
                        : 'bg-[#282a2e] text-[#ecc15a] border border-[#ecc15a]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Public Switcher Footer */}
        <div className="p-3 border-t border-[#282a2e] bg-[#0c0e12]/60 space-y-2">
          <button
            onClick={onExitToPublic}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1e2024] hover:bg-[#282a2e] border border-[#ecc15a]/20 text-[#ecc15a] text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Public Website</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#282a2e] border border-[#ecc15a]/30 flex items-center justify-center text-[#ecc15a] font-bold text-xs shrink-0">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-medium text-white truncate">
                  {user?.displayName || user?.email?.split('@')[0]}
                </div>
                <div className="text-[10px] text-[#ecc15a] truncate font-medium">
                  {adminProfile?.role?.toUpperCase() || (user?.email === ROOT_ADMIN_EMAIL ? 'SUPERADMIN' : 'ADMIN')}
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-[#282a2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[#111317]/90 backdrop-blur-md border-b border-[#282a2e] sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#ecc15a] bg-[#1e2024] border border-[#282a2e]"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white capitalize">
                {navItems.find((n) => n.id === currentTab)?.label || 'Console'}
              </h1>
              <span className="hidden sm:inline-block text-neutral-500">•</span>
              <span className="hidden sm:inline-block text-xs text-neutral-400">
                State of Qatar Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onExitToPublic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#282a2e] border border-[#ecc15a]/30 text-[#ecc15a] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span className="hidden sm:inline">Live Site</span>
            </button>

            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-700/40 text-red-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85%] bg-[#111317] border-r border-[#ecc15a]/20 h-full flex flex-col z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#282a2e]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#ecc15a] flex items-center justify-center font-bold text-black font-serif">
                  MZ
                </div>
                <div className="font-serif font-bold text-white text-sm">MZ Qatar Admin</div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left ${
                      isActive
                        ? 'bg-[#ecc15a] text-black font-bold'
                        : 'text-[#d1c5b1] hover:bg-[#1e2024]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#282a2e] space-y-2">
              <button
                onClick={() => {
                  onExitToPublic();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#1e2024] text-xs text-[#ecc15a] font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>View Public Website</span>
              </button>
              <button
                onClick={() => logout()}
                className="w-full py-2 rounded bg-red-950/50 text-red-300 text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
