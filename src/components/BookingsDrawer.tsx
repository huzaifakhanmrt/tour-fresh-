import React from 'react';
import { BookingData, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingData[];
  currency: Currency;
  onNewBooking: () => void;
  onCancelBooking: (ref: string) => void;
}

export const BookingsDrawer: React.FC<BookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  currency,
  onNewBooking,
  onCancelBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0c0e12]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-md bg-[#1a1c20] border-l border-[#ecc15a]/20 p-6 flex flex-col justify-between overflow-y-auto z-10 text-[#e2e2e8]">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#4e4636]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ecc15a] text-[24px]">receipt_long</span>
              <div>
                <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">My Reservations</h3>
                <span className="text-[11px] text-[#ecc15a] uppercase font-semibold">
                  MZ VIP Concierge Desk
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="w-8 h-8 rounded-md bg-[#282a2e] hover:bg-[#333539] text-[#d1c5b1] hover:text-[#e2e2e8] flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* List of bookings */}
          {bookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#282a2e] text-[#d1c5b1] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">event_busy</span>
              </div>
              <p className="text-[14px] text-[#d1c5b1]">No active reservations yet</p>
              <p className="text-[12px] text-[#9a907d]">
                Explore our signature desert safaris, dhow dinner cruises, and private cultural tours.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewBooking();
                }}
                className="mt-2 px-4 py-2 rounded-md bg-[#ecc15a] text-[#3f2e00] text-[12px] font-bold uppercase tracking-wider"
              >
                Explore Tours
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.bookingRef}
                  className="p-4 rounded-lg bg-[#282a2e] border border-[#ecc15a]/30 space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[11px] text-[#ecc15a] font-bold block">
                        REF: {booking.bookingRef}
                      </span>
                      <h4 className="font-semibold text-[14px] text-[#e2e2e8] mt-0.5">
                        {booking.tourTitle}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => booking.bookingRef && onCancelBooking(booking.bookingRef)}
                      title="Cancel reservation"
                      className="text-[#9a907d] hover:text-[#ffb4ab] text-[12px] p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#d1c5b1]">
                    <div>
                      <span className="text-[#9a907d] block">Date</span>
                      <span className="font-medium text-[#e2e2e8]">{booking.date}</span>
                    </div>
                    <div>
                      <span className="text-[#9a907d] block">Guests</span>
                      <span className="font-medium text-[#e2e2e8]">{booking.guestsCount} Guests</span>
                    </div>
                    <div>
                      <span className="text-[#9a907d] block">Vehicle</span>
                      <span className="font-medium text-[#e2e2e8]">{booking.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-[#9a907d] block">Total</span>
                      <span className="font-bold text-[#ecc15a] text-[13px]">
                        {formatPrice(booking.totalPriceQar, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#4e4636]/30 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Confirmed with Concierge
                    </span>
                    <a
                      href={`https://wa.me/97455128899?text=${encodeURIComponent(
                        `Hello MZ Concierge, inquiring about booking ref ${booking.bookingRef} for ${booking.tourTitle}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ecc15a] hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <span>WhatsApp Desk</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer footer */}
        <div className="pt-6 border-t border-[#4e4636]/30 space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNewBooking();
            }}
            className="w-full min-h-[44px] rounded-md bg-[#ecc15a] text-[#3f2e00] font-bold text-[12px] uppercase tracking-wider hover:bg-[#c29b38] transition-colors"
          >
            + Create Another Reservation
          </button>
          <p className="text-[11px] text-center text-[#d1c5b1]">
            Need immediate changes? Call +974 5512 8899
          </p>
        </div>
      </aside>
    </div>
  );
};
