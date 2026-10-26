import React from 'react';
import { Currency, Tour } from '../types';
import { TOURS_DATA } from '../data/tours';
import { formatPrice } from '../utils/currency';

interface DhowCruisesScreenProps {
  currency: Currency;
  onOpenBookingModal: (tourId?: string) => void;
  onOpenTourDetail: (tour: Tour) => void;
  experiences?: Tour[];
}

export const DhowCruisesScreen: React.FC<DhowCruisesScreenProps> = ({
  currency,
  onOpenBookingModal,
  onOpenTourDetail,
  experiences,
}) => {
  const sourceTours = experiences && experiences.length > 0 ? experiences : TOURS_DATA;
  const dhowTours = sourceTours.filter(
    (t) => (t.status === 'published' || !t.status) && (t.category === 'sea' || t.id === 'luxury-yacht')
  );

  return (
    <div className="w-full text-[#e2e2e8]">
      {/* Hero Header */}
      <section className="relative w-full pt-32 pb-20 overflow-hidden bg-[#111317]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqahxGX-jt2oHExfZeYoyxeg5WgS7zVh-2ztoyDkOK9g2zpzMnNJI4ZfOltiJwsdd9kihJrU4iCfSMyoyEUHSyr4Z03-P2KoS_xpdVUkgqt7QUVhKcrcFhD7BzwIBBVkgKSXHkxvL4SWmnhKhPcPE1VLhMhf7CQqoTbePh-CPVvEMPA4yJ1l1QfdLWVzfNM7dBmKa5fTDoVJehDnQHBqgpQLk1fhrbVFIE052T2Zqzkgp2X2-ByExJ"
            alt="Dhow Cruises along Doha Bay Corniche"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-[#111317]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#ecc15a] block mb-2">
            Maritime Heritage &amp; Gulf Escapes
          </span>
          <h1 className="font-serif text-[38px] sm:text-[52px] font-semibold text-[#e2e2e8] max-w-3xl leading-tight">
            Royal Wooden Dhow &amp; Luxury Yacht Charters across Doha Bay
          </h1>
          <p className="text-[16px] text-[#d1c5b1] max-w-2xl mt-4 leading-relaxed">
            Glide past the dazzling illuminated towers of West Bay, the Museum of Islamic Art, and Al Safliya Island aboard handcrafted traditional vessels and modern Italian motor yachts.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-8">
            <button
              onClick={() => onOpenBookingModal('royal-dhow')}
              className="px-6 py-3 rounded-md bg-[#ecc15a] text-[#3f2e00] font-bold text-[13px] uppercase tracking-wider hover:bg-[#c29b38] transition-all cursor-pointer shadow-lg shadow-[#ecc15a]/20"
            >
              Book Sunset Dhow Dinner
            </button>
            <a
              href="https://wa.me/97455128899?text=Hello%20MZ%20Tourism,%20I%20would%20like%20to%20reserve%20a%20private%20Dhow%20or%20Yacht%20charter."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] hover:text-[#ecc15a] font-semibold text-[13px] uppercase tracking-wider transition-all border border-[#4e4636]/40 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">chat</span>
              WhatsApp Maritime Desk
            </a>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="w-full py-16 bg-[#111317]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dhowTours.map((tour) => (
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
                      {tour.badge || 'Maritime'}
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

          {/* Dhow Culinary & Atmosphere Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-xl bg-[#1e2024] border border-[#4e4636]/30 space-y-3">
              <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">restaurant</span>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Five-Star Charcoal BBQ</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Prepared live on the lower deck grill: spiced Gulf lamb chops, chicken shish tawook, grilled tiger prawns, hummus, fattoush, and warm Arabian bread.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#1e2024] border border-[#4e4636]/30 space-y-3">
              <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">nightlife</span>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">West Bay Illuminations</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Take in unhindered panoramic photography as the towers of Doha glow against the midnight blue waters with acoustic oud ambience.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#1e2024] border border-[#4e4636]/30 space-y-3">
              <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">anchor</span>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Private VIP Charters</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Reserve the entire vessel for family gatherings, diplomatic receptions, corporate events, or private sunset celebrations with customized menus.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
