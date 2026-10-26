import React, { useState, useEffect } from 'react';
import { getBookings, saveBooking, updateBooking, deleteBooking, getExperiences, getVehicles, getLocations, logAudit } from '../../services/db';
import { BookingData, Tour, VehicleItem, LocationItem, BookingStatus, PaymentStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const BookingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [experiences, setExperiences] = useState<Tour[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBooking, setEditingBooking] = useState<BookingData | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form Fields
  const [formRef, setFormRef] = useState('');
  const [formTourId, setFormTourId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formWindow, setFormWindow] = useState('');
  const [formGuestsCount, setFormGuestsCount] = useState<number>(2);
  const [formVehicleType, setFormVehicleType] = useState('');
  const [formVehicleId, setFormVehicleId] = useState('');
  const [formPickupLocation, setFormPickupLocation] = useState('');
  const [formDropoffLocation, setFormDropoffLocation] = useState('');
  const [formFlightNumber, setFormFlightNumber] = useState('');
  const [formGuideLanguage, setFormGuideLanguage] = useState('English');
  const [formFullName, setFormFullName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCountry, setFormCountry] = useState('Qatar');
  const [formChildSeat, setFormChildSeat] = useState<boolean>(false);
  const [formGourmetMeal, setFormGourmetMeal] = useState<boolean>(false);
  const [formTotalPriceQar, setFormTotalPriceQar] = useState<number>(0);
  const [formAmountPaidQar, setFormAmountPaidQar] = useState<number>(0);
  const [formPaymentStatus, setFormPaymentStatus] = useState<PaymentStatus>('pending');
  const [formStatus, setFormStatus] = useState<BookingStatus>('pending');
  const [formCustomerRequests, setFormCustomerRequests] = useState('');
  const [formInternalNotes, setFormInternalNotes] = useState('');
  const [formBookingSource, setFormBookingSource] = useState<'website' | 'whatsapp' | 'concierge' | 'ota' | 'phone'>('website');

  // WhatsApp voucher modal
  const [voucherBooking, setVoucherBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setIsLoading(true);
    try {
      const [bData, expData, vData, lData] = await Promise.all([
        getBookings(),
        getExperiences(true),
        getVehicles(),
        getLocations(),
      ]);
      setBookings(bData);
      setExperiences(expData);
      setVehicles(vData);
      setLocations(lData);
    } catch (err) {
      console.error('Failed to load bookings data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const openNewBooking = () => {
    setEditingBooking(null);
    const newRef = `MZ-QA-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormRef(newRef);
    setFormTourId(experiences[0]?.id || 'inland-sea');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormWindow('Afternoon Sunset (14:30 - 19:30)');
    setFormGuestsCount(2);
    setFormVehicleType(vehicles[0]?.name || 'Toyota Land Cruiser V8');
    setFormVehicleId(vehicles[0]?.id || '');
    setFormPickupLocation(locations[0]?.name || 'Hamad International Airport');
    setFormDropoffLocation(locations[1]?.name || 'West Bay Hotel');
    setFormFlightNumber('');
    setFormGuideLanguage('English (Certified Qatar Tourism Guide)');
    setFormFullName('');
    setFormPhone('+974 ');
    setFormEmail('');
    setFormCountry('Qatar');
    setFormChildSeat(false);
    setFormGourmetMeal(true);
    setFormTotalPriceQar(experiences[0]?.basePriceQar ? experiences[0].basePriceQar * 2 : 900);
    setFormAmountPaidQar(0);
    setFormPaymentStatus('pending');
    setFormStatus('confirmed');
    setFormCustomerRequests('');
    setFormInternalNotes('VIP Concierge booking created via admin panel.');
    setFormBookingSource('concierge');
    setIsModalOpen(true);
  };

  const openEditBooking = (b: BookingData) => {
    setEditingBooking(b);
    setFormRef(b.bookingRef);
    setFormTourId(b.tourId);
    setFormDate(b.date);
    setFormWindow(b.departureWindow || '');
    setFormGuestsCount(b.guestsCount || 1);
    setFormVehicleType(b.vehicleType || '');
    setFormVehicleId(b.vehicleId || '');
    setFormPickupLocation(b.pickupLocation || '');
    setFormDropoffLocation(b.dropoffLocation || '');
    setFormFlightNumber(b.flightNumber || '');
    setFormGuideLanguage(b.guideLanguage || 'English');
    setFormFullName(b.fullName || '');
    setFormPhone(b.phone || '');
    setFormEmail(b.email || '');
    setFormCountry(b.country || '');
    setFormChildSeat(b.childSeat || false);
    setFormGourmetMeal(b.gourmetMeal || false);
    setFormTotalPriceQar(b.totalPriceQar || 0);
    setFormAmountPaidQar(b.amountPaidQar || 0);
    setFormPaymentStatus(b.paymentStatus || 'pending');
    setFormStatus(b.status || 'pending');
    setFormCustomerRequests(b.specialRequests || '');
    setFormInternalNotes(b.internalNotes || '');
    setFormBookingSource(b.bookingSource || 'website');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const selectedTour = experiences.find((t) => t.id === formTourId);
      const remaining = Math.max(0, formTotalPriceQar - formAmountPaidQar);

      const bookingPayload: BookingData = {
        id: editingBooking?.id || formRef,
        bookingRef: formRef,
        tourId: formTourId,
        tourTitle: selectedTour?.title || editingBooking?.tourTitle || 'Qatar Private Tour',
        date: formDate,
        departureWindow: formWindow,
        guestsCount: Number(formGuestsCount),
        vehicleType: formVehicleType,
        vehicleId: formVehicleId,
        pickupLocation: formPickupLocation,
        dropoffLocation: formDropoffLocation,
        flightNumber: formFlightNumber,
        guideLanguage: formGuideLanguage,
        fullName: formFullName,
        phone: formPhone,
        email: formEmail,
        country: formCountry,
        childSeat: formChildSeat,
        gourmetMeal: formGourmetMeal,
        totalPriceQar: Number(formTotalPriceQar),
        amountPaidQar: Number(formAmountPaidQar),
        remainingBalanceQar: remaining,
        paymentStatus: formPaymentStatus,
        status: formStatus,
        specialRequests: formCustomerRequests,
        internalNotes: formInternalNotes,
        bookingSource: formBookingSource,
        createdAt: editingBooking?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveBooking(bookingPayload);
      await logAudit(
        editingBooking ? 'update_booking' : 'create_booking',
        user?.email || 'admin',
        `Booking Ref: ${formRef} - ${formFullName}`
      );

      await loadAll();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save booking:', err);
      alert('Error saving booking.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStatus = async (booking: BookingData, newStatus: BookingStatus) => {
    try {
      await updateBooking(booking.id || booking.bookingRef, { status: newStatus });
      await logAudit('booking_status_quick_update', user?.email || 'admin', `${booking.bookingRef} -> ${newStatus}`);
      await loadAll();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (b: BookingData) => {
    if (!confirm(`Delete booking ${b.bookingRef} for ${b.fullName}?`)) return;
    try {
      await deleteBooking(b.id || b.bookingRef);
      await logAudit('delete_booking', user?.email || 'admin', `Deleted booking: ${b.bookingRef}`);
      await loadAll();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // WhatsApp notification link builder
  const getWhatsAppNotifyLink = (b: BookingData) => {
    const cleanPhone = (b.phone || '').replace(/[^0-9]/g, '');
    const message = `Hello ${b.fullName},
Greetings from MZ Tourism Qatar VIP Concierge.
Your luxury booking is confirmed:
• Ref: ${b.bookingRef}
• Experience: ${b.tourTitle}
• Date: ${b.date} (${b.departureWindow})
• Guests: ${b.guestsCount} Pax
• Pickup: ${b.pickupLocation}
• Vehicle: ${b.vehicleType}
• Total: ${b.totalPriceQar} QAR (Paid: ${b.amountPaidQar || 0} QAR)

Our master chauffeur will arrive 10 minutes prior to departure. Should you require any custom catering or schedule adjustments, reply directly to this concierge line.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Filtered List
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || b.paymentStatus === paymentFilter;
    const matchDate = !dateFilter || b.date === dateFilter;
    const matchSearch =
      b.bookingRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tourTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchPayment && matchDate && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Reservations & VIP Itineraries
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time itinerary dispatch, chauffeur assignments, payment status, and guest communication.
          </p>
        </div>

        <button
          onClick={openNewBooking}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span>New VIP Reservation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#111317] p-3 rounded-xl border border-[#282a2e]">
        {/* Status Filter */}
        <div>
          <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#1e2024] text-xs text-white border border-[#282a2e] rounded-lg px-2.5 py-1.5 focus:border-[#ecc15a] outline-none"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div>
          <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">Payment</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-[#1e2024] text-xs text-white border border-[#282a2e] rounded-lg px-2.5 py-1.5 focus:border-[#ecc15a] outline-none"
          >
            <option value="all">All Payments</option>
            <option value="paid">Fully Paid</option>
            <option value="deposit_paid">Deposit Paid</option>
            <option value="pending">Pending Payment</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">Travel Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-[#1e2024] text-xs text-white border border-[#282a2e] rounded-lg px-2.5 py-1.5 focus:border-[#ecc15a] outline-none"
          />
        </div>

        {/* Search */}
        <div>
          <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">Search</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-neutral-500 text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ref, Guest, Phone..."
              className="w-full bg-[#1e2024] border border-[#282a2e] text-xs text-white rounded-lg pl-8 pr-2.5 py-1.5 focus:border-[#ecc15a] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading reservations from Cloud Firestore...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#111317] border border-[#282a2e] p-12 text-center rounded-xl space-y-3">
          <span className="material-symbols-outlined text-4xl text-neutral-600">book_online</span>
          <div className="text-white font-medium text-sm">No bookings match the filter</div>
          <p className="text-xs text-neutral-400">
            Clear filters or create a new reservation using the button above.
          </p>
        </div>
      ) : (
        <div className="bg-[#111317] border border-[#282a2e] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0c0e12] uppercase text-[10px] text-neutral-400 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Guest Contact</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Date & Window</th>
                  <th className="px-4 py-3">Pax & Fleet</th>
                  <th className="px-4 py-3">Financials</th>
                  <th className="px-4 py-3">Workflow</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282a2e]">
                {filteredBookings.map((b) => (
                  <tr key={b.id || b.bookingRef} className="hover:bg-[#1e2024]/60 transition-colors">
                    {/* Reference */}
                    <td className="px-4 py-3">
                      <div className="font-mono text-[#ecc15a] font-bold">
                        {b.bookingRef}
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase">
                        Src: {b.bookingSource || 'web'}
                      </div>
                    </td>

                    {/* Guest Contact */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{b.fullName}</div>
                      <div className="text-[11px] text-neutral-400">{b.phone}</div>
                      <div className="text-[10px] text-neutral-500 truncate max-w-[150px]">{b.email}</div>
                    </td>

                    {/* Experience */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-white max-w-[180px] truncate" title={b.tourTitle}>
                        {b.tourTitle}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5 truncate max-w-[180px]">
                        <span className="material-symbols-outlined text-[12px] text-[#ecc15a]">location_on</span>
                        <span>{b.pickupLocation}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-neutral-200">{b.date}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                        {b.departureWindow}
                      </div>
                    </td>

                    {/* Pax & Fleet */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{b.guestsCount} Pax</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                        {b.vehicleType}
                      </div>
                    </td>

                    {/* Financials */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-white">
                        {b.totalPriceQar.toLocaleString()} QAR
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            b.paymentStatus === 'paid'
                              ? 'bg-emerald-950 text-emerald-400'
                              : b.paymentStatus === 'deposit_paid'
                              ? 'bg-blue-950 text-blue-400'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {b.paymentStatus || 'pending'}
                        </span>
                        {b.amountPaidQar ? (
                          <span className="text-[9px] text-neutral-400 font-mono">
                            Paid {b.amountPaidQar}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleQuickStatus(b, e.target.value as BookingStatus)}
                        className={`text-[10px] font-bold uppercase rounded px-2 py-1 border outline-none cursor-pointer ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                            : b.status === 'in_progress'
                            ? 'bg-blue-950 text-blue-300 border-blue-600/50'
                            : b.status === 'completed'
                            ? 'bg-purple-950 text-purple-300 border-purple-600/50'
                            : b.status === 'cancelled'
                            ? 'bg-red-950 text-red-300 border-red-600/50'
                            : 'bg-amber-950 text-amber-300 border-amber-600/50'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={getWhatsAppNotifyLink(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send VIP WhatsApp Confirmation"
                          className="p-1.5 rounded bg-[#1e2024] hover:bg-emerald-950 text-emerald-400 border border-[#282a2e] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                        </a>

                        <button
                          onClick={() => setVoucherBooking(b)}
                          title="View Itinerary Voucher"
                          className="p-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-[#ecc15a] border border-[#282a2e] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        </button>

                        <button
                          onClick={() => openEditBooking(b)}
                          title="Edit Full Booking"
                          className="p-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-white border border-[#282a2e] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(b)}
                          title="Delete Booking"
                          className="p-1.5 rounded bg-[#1e2024] hover:bg-red-950 text-red-400 border border-[#282a2e] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => !isSaving && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-3xl bg-[#111317] border border-[#ecc15a]/30 rounded-2xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#282a2e] flex items-center justify-between bg-[#16181d]">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {editingBooking ? `Edit Booking: ${editingBooking.bookingRef}` : 'Create VIP Reservation'}
                </h3>
                <p className="text-xs text-[#ecc15a]">
                  Directly saved to the live Firestore reservations database.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#282a2e]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Booking Ref *</label>
                  <input
                    type="text"
                    required
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-[#ecc15a] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Experience *</label>
                  <select
                    value={formTourId}
                    onChange={(e) => {
                      setFormTourId(e.target.value);
                      const t = experiences.find((x) => x.id === e.target.value);
                      if (t) setFormTotalPriceQar(t.basePriceQar * formGuestsCount);
                    }}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  >
                    {experiences.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.basePriceQar} QAR)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Travel Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Guest Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                    placeholder="Sheikh / Excellency / Mr. ..."
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Guest Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                    placeholder="+974 5512 8899"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Guest Email *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                    placeholder="guest@example.com"
                  />
                </div>
              </div>

              {/* Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Total Guests (Pax)</label>
                  <input
                    type="number"
                    min={1}
                    value={formGuestsCount}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setFormGuestsCount(count);
                      const t = experiences.find((x) => x.id === formTourId);
                      if (t) setFormTotalPriceQar(t.basePriceQar * count);
                    }}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Vehicle Assignment</label>
                  <select
                    value={formVehicleType}
                    onChange={(e) => setFormVehicleType(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} ({v.passengerCapacity} Pax max)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Departure Window</label>
                  <input
                    type="text"
                    value={formWindow}
                    onChange={(e) => setFormWindow(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                    placeholder="Afternoon Sunset (14:30 - 19:30)"
                  />
                </div>
              </div>

              {/* Pickup & Dropoff */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={formPickupLocation}
                    onChange={(e) => setFormPickupLocation(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Drop-off Location</label>
                  <input
                    type="text"
                    value={formDropoffLocation}
                    onChange={(e) => setFormDropoffLocation(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Flight Number (If Airport)</label>
                  <input
                    type="text"
                    value={formFlightNumber}
                    onChange={(e) => setFormFlightNumber(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono uppercase"
                    placeholder="QR 001"
                  />
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#282a2e] space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ecc15a]">
                  Pricing & Payment Status
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Total Agreed Price (QAR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formTotalPriceQar}
                      onChange={(e) => setFormTotalPriceQar(Number(e.target.value))}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Amount Collected (QAR)</label>
                    <input
                      type="number"
                      min={0}
                      value={formAmountPaidQar}
                      onChange={(e) => setFormAmountPaidQar(Number(e.target.value))}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Payment Status</label>
                    <select
                      value={formPaymentStatus}
                      onChange={(e) => setFormPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-semibold"
                    >
                      <option value="pending">Pending Payment</option>
                      <option value="deposit_paid">Deposit Paid</option>
                      <option value="paid">Fully Settled / Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Guest Special Requests</label>
                  <textarea
                    rows={2}
                    value={formCustomerRequests}
                    onChange={(e) => setFormCustomerRequests(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                    placeholder="Dietary requests, anniversary cake, child seats..."
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Internal Operations Notes</label>
                  <textarea
                    rows={2}
                    value={formInternalNotes}
                    onChange={(e) => setFormInternalNotes(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                    placeholder="Chauffeur dispatched, gate pass confirmed..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#282a2e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-lg bg-[#1e2024] hover:bg-[#282a2e] text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-lg bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Saving Reservation...' : 'Save Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {voucherBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setVoucherBooking(null)} />
          <div className="relative w-full max-w-lg bg-[#111317] border border-[#ecc15a]/40 rounded-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#ecc15a] flex items-center justify-center text-black font-serif font-black">
                  M2
                </div>
                <div>
                  <div className="font-serif font-bold text-white text-base">M2 Tourism Qatar</div>
                  <div className="text-[10px] text-[#ecc15a] uppercase tracking-wider">VIP Itinerary Voucher</div>
                </div>
              </div>
              <button onClick={() => setVoucherBooking(null)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs bg-[#0c0e12] p-4 rounded-xl border border-[#282a2e]">
              <div className="flex justify-between border-b border-[#282a2e] pb-2">
                <span className="text-neutral-400">Reference:</span>
                <span className="font-mono text-[#ecc15a] font-bold">{voucherBooking.bookingRef}</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-2">
                <span className="text-neutral-400">Guest:</span>
                <span className="text-white font-bold">{voucherBooking.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-2">
                <span className="text-neutral-400">Experience:</span>
                <span className="text-white text-right max-w-[65%]">{voucherBooking.tourTitle}</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-2">
                <span className="text-neutral-400">Date & Window:</span>
                <span className="font-mono text-neutral-200">{voucherBooking.date} ({voucherBooking.departureWindow})</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-2">
                <span className="text-neutral-400">Guests & Vehicle:</span>
                <span className="text-neutral-200">{voucherBooking.guestsCount} Pax • {voucherBooking.vehicleType}</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-2">
                <span className="text-neutral-400">Pickup:</span>
                <span className="text-neutral-200 text-right">{voucherBooking.pickupLocation}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-400">Total Price:</span>
                <span className="font-mono font-bold text-[#ecc15a] text-sm">{voucherBooking.totalPriceQar.toLocaleString()} QAR</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={getWhatsAppNotifyLink(voucherBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Send on WhatsApp</span>
              </a>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#1e2024] hover:bg-[#282a2e] text-white text-xs font-semibold border border-[#282a2e]"
              >
                Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
