import React, { useState, useEffect } from 'react';
import { getBookings, getCustomers, saveCustomer, logAudit } from '../../services/db';
import { CustomerRecord, BookingData } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const CustomersScreen: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setIsLoading(true);
    try {
      const [cData, bData] = await Promise.all([getCustomers(), getBookings()]);
      setBookings(bData);

      // Merge saved customers with unique guest records from bookings
      const customerMap = new Map<string, CustomerRecord>();
      cData.forEach((c) => customerMap.set(c.email.toLowerCase(), c));

      bData.forEach((b) => {
        const email = b.email.toLowerCase().trim();
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            id: `cust-${email.replace(/[^a-z0-9]/g, '_')}`,
            fullName: b.fullName,
            email: b.email,
            phone: b.phone,
            country: b.country || 'Qatar',
            vipStatus: false,
            totalBookings: 1,
            totalSpendQar: b.totalPriceQar,
            notes: b.specialRequests || '',
            lastBookingDate: b.date,
          });
        } else {
          const existing = customerMap.get(email)!;
          customerMap.set(email, {
            ...existing,
            totalBookings: existing.totalBookings + 1,
            totalSpendQar: existing.totalSpendQar + (b.totalPriceQar || 0),
            lastBookingDate: b.date > (existing.lastBookingDate || '') ? b.date : existing.lastBookingDate,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleToggleVip = async (c: CustomerRecord) => {
    const updated = { ...c, vipStatus: !c.vipStatus };
    try {
      await saveCustomer(updated);
      await logAudit('toggle_vip', user?.email || 'admin', `${c.fullName} VIP: ${updated.vipStatus}`);
      setCustomers((prev) => prev.map((item) => (item.id === c.id ? updated : item)));
    } catch (err) {
      console.error('VIP toggle error:', err);
    }
  };

  const exportCustomersCsv = () => {
    if (customers.length === 0) return;
    const headers = ['Full Name', 'Email', 'Phone', 'Country', 'VIP Status', 'Total Bookings', 'Total Spend QAR', 'Last Booking Date'];
    const rows = customers.map((c) => [
      `"${c.fullName}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.country || ''}"`,
      c.vipStatus ? 'VIP' : 'Standard',
      c.totalBookings,
      c.totalSpendQar,
      c.lastBookingDate || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MZ_Qatar_VIP_Clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            VIP Clients & Guest Directory
          </h2>
          <p className="text-xs text-neutral-400">
            Secure client directory with aggregated lifetime reservations, VIP status flags, and export.
          </p>
        </div>

        <button
          onClick={exportCustomersCsv}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#282a2e] hover:bg-[#333539] border border-[#ecc15a]/30 text-white font-medium text-xs transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ecc15a]">download</span>
          <span>Export VIP Client List</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#111317] p-3 rounded-xl border border-[#282a2e] flex items-center gap-2">
        <span className="material-symbols-outlined text-neutral-500 text-[18px]">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, email or phone..."
          className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-500"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading client directory from Firestore...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111317] border border-[#282a2e] p-12 text-center rounded-xl space-y-3">
          <span className="material-symbols-outlined text-4xl text-neutral-600">group</span>
          <div className="text-white font-medium text-sm">No clients recorded yet</div>
          <p className="text-xs text-neutral-400">
            Guest profiles are automatically synthesized when reservations are made.
          </p>
        </div>
      ) : (
        <div className="bg-[#111317] border border-[#282a2e] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0c0e12] uppercase text-[10px] text-neutral-400 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Client Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">VIP Priority</th>
                  <th className="px-4 py-3">Reservations</th>
                  <th className="px-4 py-3">Lifetime Spend</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282a2e]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1e2024]/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{c.fullName}</span>
                        {c.vipStatus && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ecc15a] text-[#111317]">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400">{c.country || 'State of Qatar'}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-mono text-white text-[11px]">{c.phone}</div>
                      <div className="text-[10px] text-neutral-400">{c.email}</div>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleVip(c)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          c.vipStatus
                            ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                            : 'bg-[#1e2024] text-neutral-400 border border-[#282a2e]'
                        }`}
                      >
                        {c.vipStatus ? '★ VIP Elite' : 'Standard'}
                      </button>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-white">
                      {c.totalBookings} Trips
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-[#ecc15a]">
                      {c.totalSpendQar.toLocaleString()} QAR
                    </td>

                    <td className="px-4 py-3 font-mono text-neutral-400">
                      {c.lastBookingDate || 'Recent'}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-2.5 py-1 rounded bg-[#1e2024] hover:bg-[#282a2e] text-[#ecc15a] border border-[#282a2e] font-semibold text-[11px] cursor-pointer"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="relative w-full max-w-lg bg-[#111317] border border-[#ecc15a]/40 rounded-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
              <div>
                <h3 className="font-serif font-bold text-white text-base">{selectedCustomer.fullName}</h3>
                <p className="text-xs text-[#ecc15a] font-mono">{selectedCustomer.email} • {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Past Reservations</div>
              {bookings
                .filter((b) => b.email.toLowerCase() === selectedCustomer.email.toLowerCase())
                .map((b) => (
                  <div key={b.id || b.bookingRef} className="p-3 rounded-lg bg-[#0c0e12] border border-[#282a2e] text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{b.tourTitle}</span>
                      <span className="text-[#ecc15a] font-mono">{b.totalPriceQar} QAR</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 text-[11px]">
                      <span>Ref: {b.bookingRef}</span>
                      <span>{b.date} ({b.status})</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
