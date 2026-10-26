import React, { useState, useEffect } from 'react';
import { getBookings, getVehicles, getExperiences } from '../../services/db';
import { BookingData, VehicleItem, Tour } from '../../types';

export const ReportsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [experiences, setExperiences] = useState<Tour[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'this_month' | 'this_year'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [bData, vData, eData] = await Promise.all([
          getBookings(),
          getVehicles(),
          getExperiences(true),
        ]);
        setBookings(bData);
        setVehicles(vData);
        setExperiences(eData);
      } catch (err) {
        console.error('Failed to load reports data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const totalGrossQar = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalPriceQar || 0), 0);

  const totalPaidQar = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.amountPaidQar || 0), 0);

  const totalBalanceDueQar = Math.max(0, totalGrossQar - totalPaidQar);

  const exportReportCsv = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Reservations (Gross)', bookings.length],
      ['Confirmed Departures', bookings.filter((b) => b.status === 'confirmed').length],
      ['Completed Trips', bookings.filter((b) => b.status === 'completed').length],
      ['Cancelled Bookings', bookings.filter((b) => b.status === 'cancelled').length],
      ['Total Gross Value (QAR)', totalGrossQar],
      ['Total Revenue Collected (QAR)', totalPaidQar],
      ['Outstanding Balance Due (QAR)', totalBalanceDueQar],
    ];
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `MZ_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Executive Financial & Operations Reports
          </h2>
          <p className="text-xs text-neutral-400">
            Audit-grade reporting backed by real Cloud Firestore reservation entries.
          </p>
        </div>

        <button
          onClick={exportReportCsv}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#282a2e] hover:bg-[#333539] border border-[#ecc15a]/30 text-white font-medium text-xs transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ecc15a]">download</span>
          <span>Download Financial Summary (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl">
          <div className="text-xs text-neutral-400">Total Booked Gross Value</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalGrossQar.toLocaleString()} <span className="text-xs text-[#ecc15a]">QAR</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">From active itineraries</div>
        </div>

        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl">
          <div className="text-xs text-neutral-400">Collected Cash Revenue</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {totalPaidQar.toLocaleString()} <span className="text-xs text-emerald-300">QAR</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Deposits and paid in full</div>
        </div>

        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl">
          <div className="text-xs text-neutral-400">Outstanding Receivable Balance</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {totalBalanceDueQar.toLocaleString()} <span className="text-xs text-amber-400">QAR</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">To be collected upon doorstep pickup</div>
        </div>
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl space-y-3">
          <h3 className="font-bold text-white text-sm pb-2 border-b border-[#282a2e]">
            Reservation Workflow State
          </h3>
          {[
            { label: 'Confirmed Departures', count: bookings.filter((b) => b.status === 'confirmed').length, color: 'text-emerald-400' },
            { label: 'Pending Concierge Review', count: bookings.filter((b) => b.status === 'pending').length, color: 'text-amber-400' },
            { label: 'In Progress / Dispatched', count: bookings.filter((b) => b.status === 'in_progress').length, color: 'text-blue-400' },
            { label: 'Completed Expeditions', count: bookings.filter((b) => b.status === 'completed').length, color: 'text-purple-400' },
            { label: 'Cancelled Reservations', count: bookings.filter((b) => b.status === 'cancelled').length, color: 'text-red-400' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center py-1.5 text-xs">
              <span className="text-neutral-300">{item.label}</span>
              <span className={`font-mono font-bold ${item.color}`}>{item.count}</span>
            </div>
          ))}
        </div>

        {/* Fleet Allocation Readiness */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl space-y-3">
          <h3 className="font-bold text-white text-sm pb-2 border-b border-[#282a2e]">
            Fleet Capacity & Readiness
          </h3>
          <div className="space-y-2">
            {vehicles.map((v) => (
              <div key={v.id} className="flex justify-between items-center text-xs py-1">
                <div>
                  <div className="text-white font-medium">{v.name}</div>
                  <div className="text-[10px] text-neutral-400">{v.type.replace('_', ' ')} • {v.passengerCapacity} Pax max</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${v.active ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                  {v.active ? 'Available' : 'Maintenance'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
