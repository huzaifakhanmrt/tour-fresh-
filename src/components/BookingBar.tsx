import React, { useState } from 'react';
import { TOURS_DATA } from '../data/tours';

interface BookingBarProps {
  onCheckAvailability: (details: {
    tourId: string;
    date: string;
    guests: string;
    pickup: string;
  }) => void;
}

export const BookingBar: React.FC<BookingBarProps> = ({ onCheckAvailability }) => {
  const [selectedTour, setSelectedTour] = useState('inland-sea');
  const [selectedDate, setSelectedDate] = useState('2025-05-18');
  const [guestsVehicle, setGuestsVehicle] = useState('2-private');
  const [pickupLocation, setPickupLocation] = useState('hotel-westbay');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckAvailability({
      tourId: selectedTour,
      date: selectedDate,
      guests: guestsVehicle,
      pickup: pickupLocation,
    });
  };

  return (
    <section className="relative z-20 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 -mt-6 sm:-mt-10 mb-16">
      <div className="bg-[#1a1c20]/95 backdrop-blur-2xl rounded-xl p-5 sm:p-7 shadow-2xl shadow-black/80 border border-[#4e4636]/30">
        
        {/* Header Indicator */}
        <div className="flex items-center justify-between pb-4 mb-4 bg-[#1e2024]/40 px-4 py-2.5 rounded-lg border border-[#4e4636]/20">
          <div className="flex items-center gap-2 text-[#ecc15a] text-[11px] font-bold tracking-widest uppercase">
            <span className="material-symbols-outlined text-[17px]">travel_explore</span>
            <span>Direct Concierge Booking Engine • Instant Confirmation</span>
          </div>
          <span className="hidden md:inline-flex text-[#d1c5b1] text-[12px]">
            No cancellation fees up to 24h
          </span>
        </div>

        {/* Booking Form Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-end">
          
          {/* Experience Select */}
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="bookingExp" className="text-[12px] font-semibold uppercase tracking-wider text-[#d1c5b1] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ecc15a] text-[16px]">explore</span>
              Experience
            </label>
            <div className="relative w-full">
              <select
                id="bookingExp"
                value={selectedTour}
                onChange={(e) => setSelectedTour(e.target.value)}
                className="w-full min-h-[48px] px-3.5 pr-9 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] appearance-none focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer transition-colors border border-[#4e4636]/30"
              >
                {TOURS_DATA.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-[#d1c5b1] pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="bookingDate" className="text-[12px] font-semibold uppercase tracking-wider text-[#d1c5b1] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ecc15a] text-[16px]">calendar_month</span>
              Date
            </label>
            <div className="relative w-full">
              <input
                id="bookingDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full min-h-[48px] px-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer transition-colors border border-[#4e4636]/30"
              />
            </div>
          </div>

          {/* Guests & Vehicle Selector */}
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="bookingGuests" className="text-[12px] font-semibold uppercase tracking-wider text-[#d1c5b1] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ecc15a] text-[16px]">group</span>
              Guests & Vehicle
            </label>
            <div className="relative w-full">
              <select
                id="bookingGuests"
                value={guestsVehicle}
                onChange={(e) => setGuestsVehicle(e.target.value)}
                className="w-full min-h-[48px] px-3.5 pr-9 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] appearance-none focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer transition-colors border border-[#4e4636]/30"
              >
                <option value="2-private">2 Guests • Private 4x4 Land Cruiser</option>
                <option value="4-private">4 Guests • Luxury Fleet Edition</option>
                <option value="6-family">6 Guests • Family VIP Sprinter</option>
                <option value="1-solo">1 Guest • Private Chauffeur</option>
                <option value="vip-delegation">VIP Delegation (7+ Guests)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-[#d1c5b1] pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Pick-up Location */}
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="bookingPickup" className="text-[12px] font-semibold uppercase tracking-wider text-[#d1c5b1] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ecc15a] text-[16px]">location_on</span>
              Pick-up
            </label>
            <div className="relative w-full">
              <select
                id="bookingPickup"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full min-h-[48px] px-3.5 pr-9 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] appearance-none focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer transition-colors border border-[#4e4636]/30"
              >
                <option value="hotel-westbay">West Bay / Diplomatic Hotel</option>
                <option value="airport-doh">Hamad Int&apos;l Airport (DOH Meet &amp; Greet)</option>
                <option value="the-pearl">The Pearl-Qatar / Porto Arabia</option>
                <option value="lusail">Lusail Marina Residence</option>
                <option value="doha-cruise">Doha Port Cruise Passenger Terminal</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-[#d1c5b1] pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Submission Trigger */}
          <div className="w-full flex flex-col justify-end">
            <button
              type="submit"
              className="w-full min-h-[48px] px-4 rounded-md bg-[#ecc15a] hover:bg-[#c29b38] text-[#3f2e00] text-[12px] uppercase tracking-wider font-bold transition-all shadow-lg shadow-[#ecc15a]/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Check Availability</span>
              <span className="material-symbols-outlined text-[19px]">bolt</span>
            </button>
          </div>
        </form>

        {/* Mobile Fast-Action Link */}
        <div className="mt-4 pt-3.5 flex flex-wrap items-center justify-between text-[#d1c5b1] text-[12px] border-t border-[#4e4636]/20 gap-2">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ecc15a] text-[16px]">shield</span>
            Official Qatar Tourism Certified Partner
          </span>
          <a
            href="https://wa.me/97455128899?text=Hello%20MZ%20Tourism,%20please%20check%20fast%20booking%20for%20today."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ecc15a] hover:text-[#ffdf99] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>One-Tap WhatsApp Booking</span>
            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
          </a>
        </div>
      </div>
    </section>
  );
};
