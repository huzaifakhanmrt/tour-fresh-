import React, { useState, useEffect } from 'react';
import { Currency, Tour, BookingData, LocationItem, VehicleItem } from '../types';
import { TOURS_DATA } from '../data/tours';
import { formatPrice } from '../utils/currency';
import { saveBooking, getLocations, getVehicles } from '../services/db';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTourId?: string;
  currency: Currency;
  onSaveBooking: (booking: BookingData) => void;
  availableTours?: Tour[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialTourId,
  currency,
  onSaveBooking,
  availableTours,
}) => {
  const toursList = availableTours && availableTours.length > 0 ? availableTours : TOURS_DATA;

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);

  const [selectedTourId, setSelectedTourId] = useState<string>('inland-sea');
  const [travelDate, setTravelDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [departureWindow, setDepartureWindow] = useState<string>('Afternoon Golden Hour & Sunset (Recommended)');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedVehicleName, setSelectedVehicleName] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [guideLanguage, setGuideLanguage] = useState<string>('English (Fluent Qatar Tourism Certified Guide)');
  const [childSeat, setChildSeat] = useState<boolean>(false);
  const [gourmetMeal, setGourmetMeal] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);

  // Load locations and vehicles from Firestore
  useEffect(() => {
    async function loadResources() {
      try {
        const [lData, vData] = await Promise.all([getLocations(), getVehicles()]);
        const activeLocs = lData.filter((l) => l.active);
        const activeVehs = vData.filter((v) => v.active);
        setLocations(activeLocs);
        setVehicles(activeVehs);
        if (activeLocs.length > 0) setSelectedLocationId(activeLocs[0].id);
        if (activeVehs.length > 0) setSelectedVehicleName(activeVehs[0].name);
      } catch (err) {
        console.warn('BookingModal resource load notice:', err);
      }
    }
    if (isOpen) {
      loadResources();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialTourId) {
      setSelectedTourId(initialTourId);
    }
  }, [initialTourId]);

  if (!isOpen) return null;

  const currentTour: Tour = toursList.find((t) => t.id === selectedTourId) || toursList[0];

  // Dynamic price calculation using database vehicle multiplier & location fee
  const tourBase = currentTour.basePriceQar || 450;
  const chosenVehicle = vehicles.find((v) => v.name === selectedVehicleName);
  const vehicleMultiplier = chosenVehicle?.priceMultiplier || 1.0;
  const vehicleFixedAddon = chosenVehicle?.fixedAddonQar || 0;

  const chosenLocation = locations.find((l) => l.id === selectedLocationId);
  const locationFee = chosenLocation?.extraFeeQar || 0;

  const totalQar = Math.round(tourBase * guestsCount * vehicleMultiplier + vehicleFixedAddon + locationFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const refCode = `MZ-QA-${Math.floor(1000 + Math.random() * 9000)}`;
      const locName = chosenLocation ? chosenLocation.name : 'Central Doha Hotel';

      const newBooking: BookingData = {
        bookingRef: refCode,
        tourId: currentTour.id,
        tourTitle: currentTour.title,
        date: travelDate,
        departureWindow,
        guestsCount,
        vehicleType: selectedVehicleName || currentTour.vehicle || 'Private 4x4 Land Cruiser',
        pickupLocation: locName + (flightNumber ? ` (Flight ${flightNumber})` : ''),
        flightNumber,
        guideLanguage,
        specialRequests,
        fullName: fullName || 'Distinguished Guest',
        phone: phone || '+974 5512 8899',
        email: email || 'guest@example.com',
        childSeat,
        gourmetMeal,
        totalPriceQar: totalQar,
        amountPaidQar: 0,
        remainingBalanceQar: totalQar,
        paymentStatus: 'pending',
        status: 'pending',
        bookingSource: 'website',
        createdAt: new Date().toISOString(),
      };

      // Save to Cloud Firestore
      await saveBooking(newBooking);

      setConfirmedBooking(newBooking);
      setIsSubmitted(true);
      onSaveBooking(newBooking);
    } catch (err) {
      console.error('Failed to submit booking:', err);
      alert('Error recording reservation in database. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!confirmedBooking) return '#';
    const text = `Hello MZ Tourism Concierge,
I would like to confirm my VIP Booking:
• Reference: ${confirmedBooking.bookingRef}
• Experience: ${confirmedBooking.tourTitle}
• Date: ${confirmedBooking.date}
• Window: ${confirmedBooking.departureWindow}
• Guests: ${confirmedBooking.guestsCount}
• Vehicle: ${confirmedBooking.vehicleType}
• Pickup: ${confirmedBooking.pickupLocation}
• Guest Name: ${confirmedBooking.fullName}
• Phone: ${confirmedBooking.phone}
• Total: ${formatPrice(confirmedBooking.totalPriceQar, currency)}

Kindly confirm private chauffeur dispatch and voucher.`;
    return `https://wa.me/97455128899?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0c0e12]/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#1e2024] border border-[#ecc15a]/30 rounded-xl shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto z-10 flex flex-col text-[#e2e2e8]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#282a2e]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between border-b border-[#4e4636]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ecc15a] text-[#3f2e00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
            <div>
              <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold text-[#e2e2e8]">
                VIP Concierge Reservation
              </h3>
              <span className="text-[11px] text-[#ecc15a] uppercase tracking-wider font-semibold">
                Direct Operator • Live Cloud Firestore Dispatch
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-md bg-[#1e2024] hover:bg-[#333539] text-[#d1c5b1] hover:text-[#e2e2e8] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Step Indicator Ribbon */}
        <div className="px-5 py-2.5 bg-[#0c0e12] flex items-center justify-between text-[11px] font-semibold text-[#d1c5b1] border-b border-[#4e4636]/20 overflow-x-auto whitespace-nowrap">
          <span className="text-[#ecc15a]">1. Experience</span>
          <span>•</span>
          <span className="text-[#ecc15a]">2. Timing</span>
          <span>•</span>
          <span className="text-[#ecc15a]">3. Fleet & Preferences</span>
          <span>•</span>
          <span className="text-[#ecc15a]">4. Contact</span>
          <span>•</span>
          <span className="text-[#ecc15a]">5. Instant Confirmation</span>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            {/* STEP 1: Experience Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="modalExpSelect"
                  className="text-[12px] font-bold uppercase tracking-wider text-[#d1c5b1]"
                >
                  Step 1: Selected Experience
                </label>
                <span className="text-[#ecc15a] font-bold text-[13px]">
                  {formatPrice(currentTour.basePriceQar, currency)} / person
                </span>
              </div>
              <div className="relative">
                <select
                  id="modalExpSelect"
                  value={selectedTourId}
                  onChange={(e) => setSelectedTourId(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 pr-8 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer"
                >
                  {toursList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 text-[#d1c5b1] pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* STEP 2: Date & Flexible Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#d1c5b1]">
                  Step 2: Preferred Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                  className="w-full min-h-[46px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#d1c5b1]">
                  Departure Window
                </label>
                <select
                  value={departureWindow}
                  onChange={(e) => setDepartureWindow(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer"
                >
                  <option value="Afternoon Golden Hour & Sunset (Recommended)">
                    Afternoon Golden Hour & Sunset (Recommended)
                  </option>
                  <option value="Morning Sunrise & Dune Awakening (05:00 AM)">
                    Morning Sunrise & Dune Awakening (05:00 AM)
                  </option>
                  <option value="Nighttime Campfire & Stargazing (07:00 PM)">
                    Nighttime Campfire & Stargazing (07:00 PM)
                  </option>
                  <option value="Custom VIP Flight Layover Schedule">
                    Custom VIP Flight Layover Schedule
                  </option>
                </select>
              </div>
            </div>

            {/* STEP 3: Vehicle & Customizations */}
            <div className="space-y-3">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#d1c5b1] block">
                Step 3: Vehicle Fleet, Guests & Preferences
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-[#d1c5b1] uppercase font-semibold block mb-1">
                    Guests Count
                  </span>
                  <div className="flex items-center gap-3 bg-[#282a2e] p-2 rounded-md border border-[#4e4636]/40">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-8 h-8 rounded bg-[#1e2024] hover:bg-[#333539] text-[#ecc15a] font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-[14px]">
                      {guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.min(16, guestsCount + 1))}
                      className="w-8 h-8 rounded bg-[#1e2024] hover:bg-[#333539] text-[#ecc15a] font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#d1c5b1] uppercase font-semibold block mb-1">
                    Private Vehicle Fleet
                  </span>
                  <select
                    value={selectedVehicleName}
                    onChange={(e) => setSelectedVehicleName(e.target.value)}
                    className="w-full min-h-[46px] px-3 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[12px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer"
                  >
                    {vehicles.length > 0 ? (
                      vehicles.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name} ({v.passengerCapacity} Pax max)
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Private Toyota Land Cruiser 4x4">
                          Private Toyota Land Cruiser 4x4 (Included)
                        </option>
                        <option value="Mercedes-Maybach S-Class VIP Chauffeur">
                          Mercedes-Maybach S-Class (+Premium)
                        </option>
                        <option value="Cadillac Escalade Platinum Edition">
                          Cadillac Escalade Platinum (+Premium)
                        </option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Add-ons checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[12px]">
                <label className="flex items-center gap-2 p-2.5 rounded-md bg-[#282a2e] cursor-pointer border border-[#4e4636]/30 hover:border-[#ecc15a]/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={childSeat}
                    onChange={(e) => setChildSeat(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ecc15a] bg-[#1e2024] border-[#4e4636]"
                  />
                  <span>Complimentary Child Safety Seat</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-md bg-[#282a2e] cursor-pointer border border-[#4e4636]/30 hover:border-[#ecc15a]/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={gourmetMeal}
                    onChange={(e) => setGourmetMeal(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ecc15a] bg-[#1e2024] border-[#4e4636]"
                  />
                  <span>Halal / Vegetarian Gourmet Menu</span>
                </label>
              </div>

              {/* Guide language */}
              <div>
                <span className="text-[11px] text-[#d1c5b1] uppercase font-semibold block mb-1">
                  Guide Language Preference
                </span>
                <select
                  value={guideLanguage}
                  onChange={(e) => setGuideLanguage(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer"
                >
                  <option value="English (Fluent Qatar Tourism Certified Guide)">
                    English (Fluent Qatar Tourism Certified Guide)
                  </option>
                  <option value="Arabic (Native Qatari Cultural Specialist)">
                    Arabic (Native Qatari Cultural Specialist)
                  </option>
                  <option value="French (Français Guide Diplômé)">French (Français Guide Diplômé)</option>
                  <option value="German (Deutschsprachiger Reiseleiter)">
                    German (Deutschsprachiger Reiseleiter)
                  </option>
                  <option value="Mandarin (中文专业导游)">Mandarin (中文专业导游)</option>
                  <option value="Russian (Русскоязычный гид)">Russian (Русскоязычный гид)</option>
                </select>
              </div>
            </div>

            {/* STEP 4: Primary Guest Contact */}
            <div className="space-y-3">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#d1c5b1] block">
                Step 4: Primary Guest Contact & Pick-up
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Lord Alexander Wright)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full min-h-[46px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] placeholder:text-[#9a907d] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp / Phone (+974 / Int'l)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full min-h-[46px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] placeholder:text-[#9a907d] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email for Confirmation Voucher"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full min-h-[46px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] placeholder:text-[#9a907d] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                />

                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full min-h-[46px] px-3 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[12px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer"
                >
                  {locations.length > 0 ? (
                    locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.isFreePickup ? '(Free Pickup)' : `(+${loc.extraFeeQar} QAR)`}
                      </option>
                    ))
                  ) : (
                    <option value="west-bay">West Bay / Diplomatic Area Luxury Hotel</option>
                  )}
                </select>
              </div>

              {chosenLocation?.category === 'airport' && (
                <input
                  type="text"
                  placeholder="Inbound Flight # (e.g. QR 004 / BA 123) for live gate tracking"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] placeholder:text-[#9a907d] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                />
              )}

              <textarea
                placeholder="Special requests (e.g., anniversary congratulations, custom catering, airport meet & greet)"
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-3 rounded-md bg-[#282a2e] text-[#e2e2e8] placeholder:text-[#9a907d] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
              />
            </div>

            {/* Estimated Total Bar */}
            <div className="p-4 rounded-md bg-[#0c0e12] border border-[#ecc15a]/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#d1c5b1] block">
                  Estimated Private All-Inclusive Total ({currency})
                </span>
                <span className="text-[11px] text-[#ecc15a]">
                  {guestsCount} Guests • Includes chauffeur, fuel, fees &amp; catering
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif text-[24px] font-bold text-[#ecc15a]">
                  {formatPrice(totalQar, currency)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] rounded-md bg-[#ecc15a] hover:bg-[#c29b38] text-[#3f2e00] text-[13px] uppercase tracking-wider font-bold transition-all shadow-xl shadow-[#ecc15a]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Recording Reservation in Firestore...' : 'Submit VIP Reservation'}</span>
                <span className="material-symbols-outlined text-[19px]">send</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <div>
              <h4 className="font-serif text-2xl font-bold text-white">VIP Reservation Registered</h4>
              <p className="text-xs text-[#ecc15a] font-mono mt-1">
                Booking Reference: {confirmedBooking?.bookingRef}
              </p>
              <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
                Your reservation has been securely saved to our Qatar operations database. Our concierge team has received your itinerary and will connect with your chauffeur.
              </p>
            </div>

            <div className="bg-[#0c0e12] p-4 rounded-xl border border-[#282a2e] text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-[#282a2e] pb-1.5">
                <span className="text-neutral-400">Experience:</span>
                <span className="text-white font-medium">{confirmedBooking?.tourTitle}</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-1.5">
                <span className="text-neutral-400">Travel Date:</span>
                <span className="text-white font-mono">{confirmedBooking?.date}</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-1.5">
                <span className="text-neutral-400">Guests & Vehicle:</span>
                <span className="text-white">{confirmedBooking?.guestsCount} Pax • {confirmedBooking?.vehicleType}</span>
              </div>
              <div className="flex justify-between border-b border-[#282a2e] pb-1.5">
                <span className="text-neutral-400">Pickup Location:</span>
                <span className="text-white">{confirmedBooking?.pickupLocation}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span className="text-neutral-400">Total Price:</span>
                <span className="text-[#ecc15a] font-mono text-sm">
                  {formatPrice(confirmedBooking?.totalPriceQar || 0, currency)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/30"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Open WhatsApp Dispatch</span>
              </a>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-lg bg-[#282a2e] hover:bg-[#333539] text-white font-semibold text-xs border border-[#4e4636]/40 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
