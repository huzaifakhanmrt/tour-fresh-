import React from 'react';
import { Tour, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface TourDetailModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onBookNow: (tourId: string) => void;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  isOpen,
  onClose,
  currency,
  onBookNow,
}) => {
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0c0e12]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-[#1e2024] border border-[#ecc15a]/30 rounded-xl shadow-2xl shadow-black/90 max-h-[90vh] overflow-y-auto z-10 text-[#e2e2e8] flex flex-col">
        
        {/* Header Hero Image */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] overflow-hidden">
          <img
            src={tour.image}
            alt={tour.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e2024] via-transparent to-black/40" />
          
          <button
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2.5 py-1 rounded bg-[#ecc15a] text-[#3f2e00] text-[11px] uppercase font-bold tracking-wider">
              {tour.categoryLabel}
            </span>
            {tour.badge && (
              <span className="px-2.5 py-1 rounded bg-[#872439] text-[#ffd9dc] text-[11px] uppercase font-bold tracking-wider">
                {tour.badge}
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3 text-[12px] text-[#d1c5b1]">
              <span className="flex items-center gap-1 text-[#ecc15a]">
                <span className="material-symbols-outlined text-[16px]">star</span>
                <span className="font-bold text-[#e2e2e8]">{tour.rating}</span> ({tour.reviewsCount} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                {tour.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">location_on</span>
                {tour.location}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title & Price Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4e4636]/30">
            <div>
              <h2 className="font-serif text-[22px] sm:text-[26px] font-semibold text-[#e2e2e8] leading-tight">
                {tour.title}
              </h2>
              <p className="text-[14px] text-[#ecc15a] mt-1">{tour.subtitle}</p>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[11px] text-[#d1c5b1] uppercase block">Direct Operator Rate</span>
              <div className="flex items-baseline sm:justify-end gap-1">
                <span className="font-serif text-[26px] font-bold text-[#ecc15a]">
                  {formatPrice(tour.basePriceQar, currency)}
                </span>
                <span className="text-[12px] text-[#d1c5b1]">/ person</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Overview</h3>
            <p className="text-[14px] text-[#d1c5b1] leading-relaxed">
              {tour.fullDescription}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Key Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tour.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[13px] text-[#d1c5b1]">
                  <span className="material-symbols-outlined text-[#ecc15a] text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Itinerary Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Curated Itinerary Timeline</h3>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#4e4636]/40">
              {tour.itinerary.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#ecc15a] ring-4 ring-[#1e2024]" />
                  <div className="p-3.5 rounded-lg bg-[#282a2e] border border-[#4e4636]/30 flex-1">
                    <div className="flex items-center justify-between text-[11px] text-[#ecc15a] font-bold mb-1">
                      <span>{step.time}</span>
                    </div>
                    <h4 className="text-[14px] font-semibold text-[#e2e2e8] mb-1">{step.title}</h4>
                    <p className="text-[12px] text-[#d1c5b1]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2 p-4 rounded-lg bg-[#282a2e]/60 border border-[#4e4636]/20">
              <h4 className="text-[13px] uppercase font-bold text-[#ecc15a] tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px]">verified</span>
                What&apos;s Included
              </h4>
              <ul className="space-y-1.5 text-[12px] text-[#d1c5b1]">
                {tour.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#ecc15a]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-[#282a2e]/60 border border-[#4e4636]/20">
              <h4 className="text-[13px] uppercase font-bold text-[#d1c5b1] tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px]">info</span>
                Good to Know
              </h4>
              <ul className="space-y-1.5 text-[12px] text-[#d1c5b1]">
                {tour.notIncluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#9a907d]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <span className="text-[#ecc15a]">✓</span>
                  <span>Vehicle: {tour.vehicle}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Modal Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#4e4636]/30">
            <div className="flex items-center gap-2 text-[12px] text-[#d1c5b1]">
              <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">verified_user</span>
              <span>Complimentary 24-Hour Free Cancellation Guaranteed</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 min-h-[44px] rounded-md bg-[#282a2e] hover:bg-[#333539] text-[#e2e2e8] text-[12px] font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookNow(tour.id);
                }}
                className="flex-1 sm:flex-none px-6 min-h-[44px] rounded-md bg-[#ecc15a] text-[#3f2e00] hover:bg-[#c29b38] text-[12px] uppercase tracking-wider font-bold shadow-lg shadow-[#ecc15a]/20 cursor-pointer active:scale-95 transition-all"
              >
                Book This Experience
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
