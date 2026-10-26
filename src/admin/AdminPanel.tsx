import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from './AdminLogin';

import { DashboardScreen } from './screens/DashboardScreen';
import { ExperiencesScreen } from './screens/ExperiencesScreen';
import { BookingsScreen } from './screens/BookingsScreen';
import { LocationsScreen } from './screens/LocationsScreen';
import { VehiclesScreen } from './screens/VehiclesScreen';
import { GuestsScreen } from './screens/GuestsScreen';
import { AvailabilityScreen } from './screens/AvailabilityScreen';
import { PricingScreen } from './screens/PricingScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { WebsiteContentScreen } from './screens/WebsiteContentScreen';
import { MediaScreen } from './screens/MediaScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AutomatedTestsScreen } from './screens/AutomatedTestsScreen';

interface AdminPanelProps {
  currentPath: string;
  onNavigatePath: (path: string) => void;
  onExitToPublic: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentPath,
  onNavigatePath,
  onExitToPublic,
}) => {
  const { user, isAdmin, isLoading } = useAuth();

  // Map route path to tab ID
  const getTabFromPath = (path: string): string => {
    const clean = path.replace(/^\/admin\/?/, '');
    if (!clean || clean === 'login') return 'dashboard';
    return clean;
  };

  const [activeTab, setActiveTab] = useState<string>(() => getTabFromPath(currentPath));

  useEffect(() => {
    setActiveTab(getTabFromPath(currentPath));
  }, [currentPath]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newPath = tabId === 'dashboard' ? '/admin' : `/admin/${tabId}`;
    onNavigatePath(newPath);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#ecc15a] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#ecc15a]">
            Verifying Administrative Credentials...
          </span>
        </div>
      </div>
    );
  }

  // If not logged in or not authorized, show Login screen
  if (!user || !isAdmin) {
    return (
      <AdminLogin
        onSuccess={() => {
          onNavigatePath('/admin');
        }}
        onBackToSite={onExitToPublic}
      />
    );
  }

  // Render the authorized Admin dashboard with active screen
  return (
    <AdminLayout
      currentTab={activeTab}
      onNavigateTab={handleTabChange}
      onExitToPublic={onExitToPublic}
    >
      {activeTab === 'dashboard' && <DashboardScreen onNavigateTab={handleTabChange} />}
      {activeTab === 'experiences' && <ExperiencesScreen />}
      {activeTab === 'bookings' && <BookingsScreen />}
      {activeTab === 'locations' && <LocationsScreen />}
      {activeTab === 'vehicles' && <VehiclesScreen />}
      {activeTab === 'guests' && <GuestsScreen />}
      {activeTab === 'availability' && <AvailabilityScreen />}
      {activeTab === 'pricing' && <PricingScreen />}
      {activeTab === 'customers' && <CustomersScreen />}
      {activeTab === 'website-content' && <WebsiteContentScreen />}
      {activeTab === 'media' && <MediaScreen />}
      {activeTab === 'reviews' && <ReviewsScreen />}
      {activeTab === 'reports' && <ReportsScreen />}
      {activeTab === 'settings' && <SettingsScreen />}
      {activeTab === 'automated-tests' && <AutomatedTestsScreen />}
    </AdminLayout>
  );
};
