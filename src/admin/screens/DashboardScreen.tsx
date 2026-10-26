import React, { useEffect, useState } from 'react';
import { getBookings, getExperiences, getVehicles } from '../../services/db';
import { BookingData, Tour, VehicleItem } from '../../types';

interface DashboardScreenProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewBookingModal?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateTab }) => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [experiences, setExperiences] = useState<Tour[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [bData, expData, vData] = await Promise.all([
          getBookings(),
          getExperiences(true),
          getVehicles(),
        ]);
        setBookings(bData);
        setExperiences(expData);
        setVehicles(vData);
      } catch (err) {
        console.error('Dashboard load failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics from actual database
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.date === todayStr);
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const totalRevenueQar = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.paymentStatus === 'deposit_paid')
    .reduce((sum, b) => sum + (b.amountPaidQar || b.totalPriceQar || 0), 0);

  const pendingBalanceQar = bookings
    .filter((b) => b.status !== 'cancelled' && b.paymentStatus !== 'paid')
    .reduce((sum, b) => sum + (b.remainingBalanceQar ?? b.totalPriceQar), 0);

  // Popular experiences breakdown
  const experienceCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    experienceCounts[b.tourTitle] = (experienceCounts[b.tourTitle] || 0) + 1;
  });
  const popularExperiences = Object.entries(experienceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Booking source breakdown
  const sourceCounts: Record<string, number> = {
    website: 0,
    whatsapp: 0,
    concierge: 0,
    ota: 0,
  };
  bookings.forEach((b) => {
    const src = b.bookingSource || 'website';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const exportBookingsCsv = () => {
    if (bookings.length === 0) return;
    const headers = ['Booking Ref', 'Guest Name', 'Email', 'Phone', 'Experience', 'Date', 'Guests', 'Total QAR', 'Paid QAR', 'Status', 'Payment'];
    const rows = bookings.map((b) => [
      b.bookingRef,
      `"${b.fullName}"`,
      b.email,
      `"${b.phone}"`,
      `"${b.tourTitle}"`,
      b.date,
      b.guestsCount,
      b.totalPriceQar,
      b.amountPaidQar || 0,
      b.status,
      b.paymentStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MZ_Qatar_Bookings_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#ecc15a] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#ecc15a]">
            Loading Live Qatar Operations...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1e2024] to-[#111317] border border-[#ecc15a]/20 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ecc15a]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Firestore Database Connected
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            MZ Executive Command Centre
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time itinerary status, fleet readiness, and revenue performance across Qatar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportBookingsCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#282a2e] hover:bg-[#333539] border border-[#ecc15a]/30 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ecc15a]">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Manage Bookings</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl hover:border-[#ecc15a]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Today's Departures</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecc15a]/10 flex items-center justify-center text-[#ecc15a]">
              <span className="material-symbols-outlined text-[18px]">today</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            {todayBookings.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
            <span>{todayStr}</span>
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl hover:border-[#ecc15a]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-2 font-mono">
            {pendingBookings.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {confirmedBookings.length} confirmed active
          </div>
        </div>

        {/* Total Collected Revenue */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl hover:border-[#ecc15a]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Revenue Collected</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
            {totalRevenueQar.toLocaleString()} <span className="text-xs text-emerald-300">QAR</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Balance due: {pendingBalanceQar.toLocaleString()} QAR
          </div>
        </div>

        {/* Active Fleet */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl hover:border-[#ecc15a]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Fleet & Vessels</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            {vehicles.filter((v) => v.active).length} / {vehicles.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {experiences.filter((e) => e.status === 'published').length} published tours
          </div>
        </div>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Experiences Chart */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
            <div>
              <h3 className="font-bold text-white text-sm">Most Booked Experiences</h3>
              <p className="text-[11px] text-neutral-400">Database booking volume by experience</p>
            </div>
            <button
              onClick={() => onNavigateTab('experiences')}
              className="text-xs text-[#ecc15a] hover:underline cursor-pointer"
            >
              View Tours
            </button>
          </div>

          <div className="space-y-3">
            {popularExperiences.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-500">
                No bookings recorded yet. New reservations will calculate live metrics here.
              </div>
            ) : (
              popularExperiences.map(([title, count], idx) => {
                const percent = Math.round((count / (bookings.length || 1)) * 100);
                return (
                  <div key={title} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-200 truncate max-w-[80%]">
                        {idx + 1}. {title}
                      </span>
                      <span className="text-[#ecc15a] font-mono font-bold">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#1e2024] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#c29b38] to-[#ecc15a] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Booking Channels */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl space-y-4">
          <div className="pb-3 border-b border-[#282a2e]">
            <h3 className="font-bold text-white text-sm">Booking Channels</h3>
            <p className="text-[11px] text-neutral-400">Source attribution breakdown</p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'website', label: 'Website Direct', icon: 'language', color: 'text-emerald-400' },
              { key: 'whatsapp', label: 'VIP WhatsApp', icon: 'chat', color: 'text-green-400' },
              { key: 'concierge', label: 'Hotel Concierge', icon: 'room_service', color: 'text-amber-400' },
              { key: 'ota', label: 'Travel Trade / OTA', icon: 'airplane_ticket', color: 'text-blue-400' },
            ].map((channel) => {
              const count = sourceCounts[channel.key] || 0;
              const pct = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
              return (
                <div
                  key={channel.key}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#1e2024] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[16px] ${channel.color}`}>
                      {channel.icon}
                    </span>
                    <span className="text-neutral-300">{channel.label}</span>
                  </div>
                  <div className="font-mono font-bold text-white">
                    {count} <span className="text-[10px] text-neutral-500 font-normal">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Bookings Stream */}
      <div className="bg-[#111317] border border-[#282a2e] rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#282a2e] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Recent Reservations & Inquiries</h3>
            <p className="text-[11px] text-neutral-400">Latest activity from your live Firestore database</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs text-[#ecc15a] hover:underline font-semibold cursor-pointer"
          >
            All Bookings ({bookings.length})
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No booking records stored in Firestore yet. Click "Manage Bookings" to create a new reservation or test booking from the public website.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0c0e12] uppercase text-[10px] text-neutral-400 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Total QAR</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282a2e]">
                {bookings.slice(0, 6).map((b) => (
                  <tr key={b.id || b.bookingRef} className="hover:bg-[#1e2024]/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-[#ecc15a] font-semibold">
                      {b.bookingRef}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{b.fullName}</div>
                      <div className="text-[10px] text-neutral-400">{b.phone}</div>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[200px] text-neutral-200">
                      {b.tourTitle}
                    </td>
                    <td className="px-4 py-3 font-mono">{b.date}</td>
                    <td className="px-4 py-3 font-mono">{b.guestsCount} Pax</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">
                      {b.totalPriceQar.toLocaleString()} QAR
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/40'
                            : b.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-700/40'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.paymentStatus === 'paid'
                            ? 'bg-emerald-950 text-emerald-300'
                            : b.paymentStatus === 'deposit_paid'
                            ? 'bg-blue-950 text-blue-300'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {b.paymentStatus || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
