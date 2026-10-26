import React from 'react';
import { Currency, Tour } from '../types';
import { TOURS_DATA } from '../data/tours';
import { formatPrice } from '../utils/currency';

interface DesertSafarisScreenProps {
  currency: Currency;
  onOpenBookingModal: (tourId?: string) => void;
  onOpenTourDetail: (tour: Tour) => void;
  experiences?: Tour[];
}

export const DesertSafarisScreen: React.FC<DesertSafarisScreenProps> = ({
  currency,
  onOpenBookingModal,
  onOpenTourDetail,
  experiences,
}) => {
  const sourceTours = experiences && experiences.length > 0 ? experiences : TOURS_DATA;
  const desertTours = sourceTours.filter(
    (t) => (t.status === 'published' || !t.status) && t.category === 'desert'
  );

  return (
    <div className="w-full text-[#e2e2e8]">
      {/* Hero Header */}
      <section className="relative w-full pt-32 pb-20 overflow-hidden bg-[#111317]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPWXZL8dMJARl7egedwhd2V4ZTjc3fwO0H1KhNvBTKWXTUTcJb-J13eELb9M__jpCdvTX5xj8WDQwhGmiEVWbzO9SRaBGi0DwI9GQw3FsH28ziVrIcuO7bA_LNiS3vkzOm2701xDhQ8AKlfwZIzsZCX0G-QXevg2ndZLzRqvIZZIx3FXJg_YZ5mc0lWibEveKUVpmjmvkuA1HSW-RhzvMFOgIJQPlOjH29UJIBYVdjsydbaQd5f1wd"
            alt="Desert Safaris Khor Al Adaid"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-[#111317]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#ecc15a] block mb-2">
            The Singing Dunes &amp; Inland Sea
          </span>
          <h1 className="font-serif text-[38px] sm:text-[52px] font-semibold text-[#e2e2e8] max-w-3xl leading-tight">
            Curated Desert Expeditions into the Heart of Khor Al Adaid
          </h1>
          <p className="text-[16px] text-[#d1c5b1] max-w-2xl mt-4 leading-relaxed">
            Where soaring 50-meter golden sand dunes meet the crystal turquoise waters of the Arabian Gulf. Every safari is strictly 100% private with certified master drivers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-8">
            <button
              onClick={() => onOpenBookingModal('inland-sea')}
              className="px-6 py-3 rounded-md bg-[#ecc15a] text-[#3f2e00] font-bold text-[13px] uppercase tracking-wider hover:bg-[#c29b38] transition-all cursor-pointer shadow-lg shadow-[#ecc15a]/20"
            >
              Book Sunset Desert Safari
            </button>
            <a
              href="https://wa.me/97455128899?text=Hello%20MZ%20Tourism,%20I%20would%20like%20to%20inquire%20about%20a%20private%20desert%20safari."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] hover:text-[#ecc15a] font-semibold text-[13px] uppercase tracking-wider transition-all border border-[#4e4636]/40 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">chat</span>
              WhatsApp Desert Liaison
            </a>
          </div>
        </div>
      </section>

      {/* Desert Tours List */}
      <section className="w-full py-16 bg-[#111317]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {desertTours.map((tour) => (
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
                    <span className="px-2.5 py-1 rounded bg-[#872439] text-[#ffd9dc] text-[10px] uppercase font-bold">
                      {tour.badge || 'Desert Safari'}
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
                      <span className="text-[10px] text-[#d1c5b1] uppercase block">All-Inclusive</span>
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

          {/* Desert Fleet & Safety Standards Bento */}
          <div className="p-8 rounded-xl bg-[#1a1c20] border border-[#4e4636]/30 space-y-6">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-widest text-[#ecc15a] font-bold block mb-1">
                Fleet &amp; Safety Protocol
              </span>
              <h2 className="font-serif text-[26px] font-semibold text-[#e2e2e8]">
                Engineered for High-Angle Sand Dunes
              </h2>
              <p className="text-[13px] text-[#d1c5b1] mt-2">
                Traversing Khor Al Adaid requires specialized 4x4 engineering and licensed drivers who undergo seasonal Qatar Tourism off-road exams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-lg bg-[#282a2e] border border-[#4e4636]/20 space-y-2">
                <span className="material-symbols-outlined text-[#ecc15a] text-[24px]">tire_repair</span>
                <h4 className="font-serif text-[16px] font-semibold text-[#e2e2e8]">Pressure Deflation & Inflation</h4>
                <p className="text-[12px] text-[#d1c5b1]">
                  Tires are carefully deflated to 15 PSI at Sealine entrance for optimal sand traction, and refilled via onboard compressors before highway re-entry.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#282a2e] border border-[#4e4636]/20 space-y-2">
                <span className="material-symbols-outlined text-[#ecc15a] text-[24px]">health_and_safety</span>
                <h4 className="font-serif text-[16px] font-semibold text-[#e2e2e8]">Full Safety Cage & Satellite</h4>
                <p className="text-[12px] text-[#d1c5b1]">
                  Vehicles carry roll-over cage reinforcements, first aid trauma packs, sand recovery winches, and two-way satellite emergency beacons.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#282a2e] border border-[#4e4636]/20 space-y-2">
                <span className="material-symbols-outlined text-[#ecc15a] text-[24px]">coffee</span>
                <h4 className="font-serif text-[16px] font-semibold text-[#e2e2e8]">Bedouin Majlis Sanctuary</h4>
                <p className="text-[12px] text-[#d1c5b1]">
                  Our private desert camp features shaded woven majlis tents, hygienic restrooms, handwashing stations, and freshly prepared hot Arabian refreshments.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
