import React from 'react';
import { Currency, Tour } from '../types';
import { TOURS_DATA } from '../data/tours';
import { formatPrice } from '../utils/currency';

interface PrivateLuxuryScreenProps {
  currency: Currency;
  onOpenBookingModal: (tourId?: string) => void;
  onOpenTourDetail: (tour: Tour) => void;
  onOpenTransitPlanner: () => void;
  experiences?: Tour[];
}

export const PrivateLuxuryScreen: React.FC<PrivateLuxuryScreenProps> = ({
  currency,
  onOpenBookingModal,
  onOpenTourDetail,
  onOpenTransitPlanner,
  experiences,
}) => {
  const sourceTours = experiences && experiences.length > 0 ? experiences : TOURS_DATA;
  const vipTours = sourceTours.filter(
    (t) =>
      (t.status === 'published' || !t.status) &&
      (t.category === 'vip' ||
        t.category === 'airport_transfers' ||
        t.category === 'hotel_transfers' ||
        t.category === 'parties' ||
        t.category === 'resort_stays')
  );

  return (
    <div className="w-full text-[#e2e2e8]">
      {/* Hero Header */}
      <section className="relative w-full pt-32 pb-20 overflow-hidden bg-[#111317]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHVhxgB-d53FhiA-wzB0d3wzWNC6Qk9ue92zVVmaVftkURihBftJyLpYR6O4at-n5vv-3m7Km4Z8cC0HR5bTkWUEeuJHmLTiuJg6PcmqQ7Dpso0tpsTow4AY4KpIDCmKSXxRuDUGXu2P9NZnoykcuM8g3Kx-suxwbv72Jo3Fr7OG0qPw7Urgay-8jSI4srGdJJUfPH1Gwnnmmq9_rFNQShIjY1B2Qg1ESATSslIDMMuz7ANB73VdR9"
            alt="VIP Private Luxury Fleet and Motor Yacht"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-[#111317]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#ecc15a] block mb-2">
            Executive Fleet &amp; Private Aviation
          </span>
          <h1 className="font-serif text-[38px] sm:text-[52px] font-semibold text-[#e2e2e8] max-w-3xl leading-tight">
            Uncompromising VIP Concierge, Private Yachts &amp; Chauffeur Fleet
          </h1>
          <p className="text-[16px] text-[#d1c5b1] max-w-2xl mt-4 leading-relaxed">
            From seamless tarmac arrivals at Hamad International Airport to bespoke Italian motor yacht cruises and chauffeur-driven Mercedes-Maybach sedans, experience Qatar at the apex of comfort.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-8">
            <button
              onClick={() => onOpenBookingModal('luxury-yacht')}
              className="px-6 py-3 rounded-md bg-[#ecc15a] text-[#3f2e00] font-bold text-[13px] uppercase tracking-wider hover:bg-[#c29b38] transition-all cursor-pointer shadow-lg shadow-[#ecc15a]/20"
            >
              Charter Luxury Yacht
            </button>
            <button
              onClick={onOpenTransitPlanner}
              className="px-6 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] hover:text-[#ecc15a] font-semibold text-[13px] uppercase tracking-wider transition-all border border-[#4e4636]/40 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">flight_takeoff</span>
              Plan Hamad Airport Layover
            </button>
          </div>
        </div>
      </section>

      {/* VIP Tours Grid */}
      <section className="w-full py-16 bg-[#111317]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vipTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-[#1e2024] rounded-xl overflow-hidden border border-[#4e4636]/30 flex flex-col sm:flex-row group shadow-xl"
              >
                <div
                  className="sm:w-1/2 relative aspect-[16/10] sm:aspect-auto overflow-hidden cursor-pointer"
                  onClick={() => onOpenTourDetail(tour)}
                >
                  <img
                    src={tour.image}
                    alt={tour.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#ecc15a] text-[#3f2e00] text-[10px] uppercase font-bold">
                      {tour.badge || 'VIP'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-[#0c0e12]/80 text-[#ecc15a] text-[11px] font-semibold">
                    {tour.duration}
                  </div>
                </div>

                <div className="p-6 sm:w-1/2 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-[#ecc15a] text-[11px] font-bold mb-1">
                      <span className="material-symbols-outlined text-[15px]">star</span>
                      <span>{tour.rating}</span>
                      <span className="text-[#d1c5b1]">({tour.reviewsCount} reviews)</span>
                    </div>

                    <h3
                      onClick={() => onOpenTourDetail(tour)}
                      className="font-serif text-[18px] sm:text-[20px] font-semibold text-[#e2e2e8] group-hover:text-[#ecc15a] transition-colors cursor-pointer"
                    >
                      {tour.title}
                    </h3>

                    <p className="text-[13px] text-[#d1c5b1] mt-2 line-clamp-3 leading-relaxed">
                      {tour.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tour.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#282a2e] text-[#d1c5b1] text-[10px] border border-[#4e4636]/30"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#4e4636]/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#d1c5b1] uppercase block">Rate From</span>
                      <span className="font-serif text-[22px] font-bold text-[#ecc15a]">
                        {formatPrice(tour.basePriceQar, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenTourDetail(tour)}
                        className="px-3 py-2 rounded bg-[#282a2e] hover:bg-[#333539] text-[#e2e2e8] text-[11px] font-semibold"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenBookingModal(tour.id)}
                        className="px-4 py-2 rounded bg-[#ecc15a] text-[#3f2e00] hover:bg-[#c29b38] text-[11px] font-bold uppercase tracking-wider"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Luxury Chauffeur Fleet Showcase */}
          <div className="p-8 rounded-xl bg-[#1a1c20] border border-[#4e4636]/30 space-y-6">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-widest text-[#ecc15a] font-bold block mb-1">
                Executive Chauffeur Fleet
              </span>
              <h2 className="font-serif text-[26px] font-semibold text-[#e2e2e8]">
                Meticulously Maintained Private Transport
              </h2>
              <p className="text-[13px] text-[#d1c5b1] mt-2">
                Available for hourly hire, airport transfers, VIP diplomatic escorts, or full-day private itineraries across Qatar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-lg bg-[#282a2e] border border-[#4e4636]/20 space-y-3">
                <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">directions_car</span>
                <h4 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Mercedes-Maybach S-Class</h4>
                <p className="text-[12px] text-[#d1c5b1] leading-relaxed">
                  First-class executive seating with massage calf-rests, ambient cabin filtration, onboard Wi-Fi, and suited private chauffeur.
                </p>
                <span className="text-[12px] font-bold text-[#ecc15a] block">Ideal for 1-3 Executive Guests</span>
              </div>

              <div className="p-5 rounded-lg bg-[#282a2e] border border-[#4e4636]/20 space-y-3">
                <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">airport_shuttle</span>
                <h4 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Cadillac Escalade Platinum</h4>
                <p className="text-[12px] text-[#d1c5b1] leading-relaxed">
                  Commanding presence with captain chairs, expansive luggage volume for international arrivals, rear entertainment, and privacy glass.
                </p>
                <span className="text-[12px] font-bold text-[#ecc15a] block">Ideal for 1-5 VIP Travelers</span>
              </div>

              <div className="p-5 rounded-lg bg-[#282a2e] border border-[#4e4636]/20 space-y-3">
                <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">groups</span>
                <h4 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">VIP Mercedes Sprinter Lounge</h4>
                <p className="text-[12px] text-[#d1c5b1] leading-relaxed">
                  High-roof custom boardroom configuration with Maybach-style reclining leather seats, espresso machine, refrigerator, and HDMI presentation screen.
                </p>
                <span className="text-[12px] font-bold text-[#ecc15a] block">Ideal for 6-12 Family / Delegation</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
