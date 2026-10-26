import React, { useState } from 'react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface TransitPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onBookTransitTour: (plan: { layoverHours: number; flightNumber: string; routeTitle: string }) => void;
}

export const TransitPlannerModal: React.FC<TransitPlannerModalProps> = ({
  isOpen,
  onClose,
  currency,
  onBookTransitTour,
}) => {
  const [layoverHours, setLayoverHours] = useState<number>(6);
  const [arrivalFlight, setArrivalFlight] = useState<string>('QR 004');
  const [departureFlight, setDepartureFlight] = useState<string>('QR 818');
  const [partySize, setPartySize] = useState<number>(2);

  if (!isOpen) return null;

  // Compute recommended route based on hours
  let recommendedRoute = {
    title: 'Doha Icons & Souq Waqif Express',
    duration: '3.5 Hours in City',
    description: 'Chauffeur pickup at DOH arrivals, scenic drive along Corniche, 1.5h guided walking inside Souq Waqif & Falcon Hospital, Gahwa coffee break, and return to terminal 2.5h before departure.',
    stops: ['Hamad Terminal Greeting', 'Corniche Skyline Viewpoint', 'Souq Waqif & Falcon Market', 'Karak & Gahwa Tasting', 'Direct Departures Drop-off'],
    basePriceQar: 420,
  };

  if (layoverHours >= 8) {
    recommendedRoute = {
      title: 'Grand Qatar Grandeur: Desert Dunes & Cultural Capital',
      duration: '5.5 Hours in City & Dunes',
      description: 'Private 4x4 Land Cruiser pickup at arrivals, express run down to the Inland Sea desert dunes for quick bashing & camel photo, followed by Katara Cultural Village and Souq Waqif dinner.',
      stops: ['Airport Chauffeur VIP Meet', 'Khor Al Adaid Dune Bashing & Inland Sea', 'Camel Photo & Tea', 'Souq Waqif Evening Walk', 'Smooth Departures Delivery'],
      basePriceQar: 680,
    };
  } else if (layoverHours <= 4) {
    recommendedRoute = {
      title: 'Panoramic Doha Skyline & Corniche Blitz',
      duration: '2.0 Hours in City',
      description: 'Rapid luxury private sedan excursion through West Bay towers, Katara Cultural amphitheater exterior, and Dhow harbour with zero stress on missing your gate.',
      stops: ['Fast Tarmac/Arrivals Greeting', 'National Museum Desert Rose Exterior', 'Corniche Photo Stop', 'Express Gate Return'],
      basePriceQar: 320,
    };
  }

  const handleBook = () => {
    onBookTransitTour({
      layoverHours,
      flightNumber: arrivalFlight,
      routeTitle: recommendedRoute.title,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0c0e12]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-[#1e2024] border border-[#ecc15a]/30 rounded-xl shadow-2xl shadow-black/90 max-h-[90vh] overflow-y-auto z-10 text-[#e2e2e8] p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#4e4636]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ecc15a] text-[#3f2e00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">flight_land</span>
            </div>
            <div>
              <h3 className="font-serif text-[20px] font-semibold text-[#e2e2e8]">
                Hamad Airport Layover Concierge
              </h3>
              <p className="text-[12px] text-[#ecc15a]">
                Tailored private itineraries guaranteed to return you on time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-md bg-[#282a2e] hover:bg-[#333539] text-[#d1c5b1] hover:text-[#e2e2e8] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Layover Configuration Form */}
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#d1c5b1] block mb-2">
              Select Your Transit Duration at Hamad Int&apos;l (DOH): <span className="text-[#ecc15a]">{layoverHours} Hours</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 6, 8, 12].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setLayoverHours(hours)}
                  className={`py-2.5 rounded-md text-[13px] font-bold transition-all cursor-pointer ${
                    layoverHours === hours
                      ? 'bg-[#ecc15a] text-[#3f2e00] shadow-md shadow-[#ecc15a]/20'
                      : 'bg-[#282a2e] text-[#d1c5b1] hover:text-[#e2e2e8]'
                  }`}
                >
                  {hours} Hours
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-[#d1c5b1] uppercase font-semibold block mb-1">Inbound Flight #</span>
              <input
                type="text"
                value={arrivalFlight}
                onChange={(e) => setArrivalFlight(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#d1c5b1] uppercase font-semibold block mb-1">Outbound Flight #</span>
              <input
                type="text"
                value={departureFlight}
                onChange={(e) => setDepartureFlight(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#d1c5b1] uppercase font-semibold block mb-1">Party Size</span>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer"
              >
                <option value={1}>1 Guest (Solo)</option>
                <option value={2}>2 Guests</option>
                <option value={4}>4 Guests (Family)</option>
                <option value={6}>6+ Guests (VIP)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Recommended Layover Route Card */}
        <div className="p-5 rounded-lg bg-[#282a2e] border border-[#ecc15a]/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#4e4636]/40">
            <div>
              <span className="text-[10px] bg-[#ecc15a] text-[#3f2e00] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Recommended For {layoverHours}h Layover
              </span>
              <h4 className="font-serif text-[18px] font-semibold text-[#e2e2e8] mt-1">
                {recommendedRoute.title}
              </h4>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-[#d1c5b1] block uppercase">From</span>
              <span className="font-serif text-[22px] font-bold text-[#ecc15a]">
                {formatPrice(recommendedRoute.basePriceQar, currency)}
              </span>
              <span className="text-[11px] text-[#d1c5b1]"> / person</span>
            </div>
          </div>

          <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
            {recommendedRoute.description}
          </p>

          <div>
            <span className="text-[11px] font-bold uppercase text-[#ecc15a] block mb-2">
              Route Sequence & Guaranteed Schedule:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#e2e2e8]">
              {recommendedRoute.stops.map((stop, i) => (
                <React.Fragment key={i}>
                  <span className="px-2.5 py-1 rounded bg-[#1e2024] border border-[#4e4636]/40">
                    {stop}
                  </span>
                  {i < recommendedRoute.stops.length - 1 && (
                    <span className="text-[#ecc15a]">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-[#1a1c20] text-[11px] text-[#d1c5b1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">verified_user</span>
            <span>
              Includes terminal gate luggage care & live gate monitoring. Guaranteed return 2.5h before boarding.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#282a2e] text-[#d1c5b1] hover:text-[#e2e2e8] text-[13px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleBook}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#ecc15a] text-[#3f2e00] hover:bg-[#c29b38] text-[13px] uppercase tracking-wider font-bold shadow-lg shadow-[#ecc15a]/20 cursor-pointer active:scale-95 transition-all"
          >
            Book This Transit Itinerary
          </button>
        </div>

      </div>
    </div>
  );
};
