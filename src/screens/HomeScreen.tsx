import React, { useState } from 'react';
import { Currency, Tour, WebsiteContentConfig } from '../types';
import { TOURS_DATA, TESTIMONIALS, FAQ_LIST } from '../data/tours';
import { formatPrice } from '../utils/currency';
import { BookingBar } from '../components/BookingBar';

interface HomeScreenProps {
  currency: Currency;
  onOpenBookingModal: (tourId?: string) => void;
  onOpenTourDetail: (tour: Tour) => void;
  onOpenTransitPlanner: () => void;
  onNavigate: (screen: string) => void;
  experiences?: Tour[];
  websiteContent?: WebsiteContentConfig;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currency,
  onOpenBookingModal,
  onOpenTourDetail,
  onOpenTransitPlanner,
  onNavigate,
  experiences,
  websiteContent,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const sourceTours = experiences && experiences.length > 0 ? experiences : TOURS_DATA;
  const publishedTours = sourceTours.filter((tour) => tour.status === 'published' || !tour.status);

  const filteredTours = publishedTours.filter((tour) => {
    if (activeCategory === 'all') return true;
    return tour.category === activeCategory;
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full text-[#e2e2e8]">
      
      {/* ==========================================
          SECTION 1: HERO & CINEMATIC SPLENDOR
          ========================================== */}
      <section className="relative w-full -mt-20 pt-28 pb-16 lg:pb-28 overflow-hidden flex flex-col justify-between min-h-[920px]">
        
        {/* Background Cinematic Scrim & Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
            style={{
              backgroundImage: `url('${
                websiteContent?.heroImage ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuC2Dqaj9vhrEu1AhIYGG07l33tIuCB3VP0q9-kwfxV_obMEb7BlCIxq_WOlDdRkZa1JKUy8c2O9EZSFWz7fV_jVO0Gr4bEUsE4ruJ4hOKwvdqFXPAXv1btAUj2ZeKsi807OBlEc2XWkhaTI54aJ0CsSmJOdm5E7_B_6yN3re2VVh5_L_DjIUyYlJ265sQd55SouBVHnoYe2kkdEpj-_iVZcLHmcxMkJmKii_xV796bse_4E2lbmfq-g'
              }')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-[#111317]/70 to-[#0c0e12]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#111317]/40 to-[#111317]" />
        </div>

        {/* Ambient Floating Glows */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-[#ecc15a]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#872439]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 flex-1 flex flex-col justify-center">
          
          {/* Top Credentials Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282a2e]/90 backdrop-blur-md text-[#ecc15a] text-[11px] font-bold tracking-widest uppercase shadow-md shadow-black/40 border border-[#4e4636]/30">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              {websiteContent?.heroBadge || 'Licensed by Qatar Tourism #QT-8829'}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282a2e]/90 backdrop-blur-md text-[#d1c5b1] text-[11px] font-bold tracking-widest uppercase shadow-md shadow-black/40 border border-[#4e4636]/30">
              <span className="material-symbols-outlined text-[#ecc15a] text-[15px]">directions_car</span>
              Private Fleet &amp; Chauffeur Included
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282a2e]/90 backdrop-blur-md text-[#e2e2e8] text-[11px] font-bold tracking-widest uppercase shadow-md shadow-black/40 border border-[#4e4636]/30">
              <span className="w-2 h-2 rounded-full bg-[#ecc15a] animate-pulse" />
              Instant WhatsApp Confirmation
            </span>
          </div>

          {/* Fluid Hero Typography */}
          <div className="max-w-4xl space-y-4">
            <p className="text-[13px] font-semibold tracking-[0.2em] text-[#ecc15a] uppercase flex items-center gap-2">
              <span className="w-8 h-px bg-[#ecc15a]" />
              Bespoke Concierge &amp; Private Expeditions
            </p>
            <h1 className="font-serif text-[40px] sm:text-[50px] lg:text-[62px] leading-[1.12] text-[#e2e2e8] tracking-tight">
              {websiteContent?.heroHeadline || 'Experience the Soul of Qatar in Uncompromising Luxury.'}
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#d1c5b1] max-w-2xl leading-relaxed pt-1">
              {websiteContent?.heroSubtitle ||
                'Curated desert safaris to the singing sands of Khor Al Adaid, private royal dhow cruises across West Bay, and elite VIP cultural access through Doha’s iconic sanctuaries.'}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-8">
            <a
              href="#experiences"
              className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-md bg-[#ecc15a] text-[#3f2e00] text-[13px] uppercase tracking-wider font-bold shadow-xl shadow-[#ecc15a]/20 hover:bg-[#c29b38] transition-all active:scale-[0.98]"
            >
              <span>Explore Signature Tours</span>
              <span className="material-symbols-outlined ml-2 text-[20px]">arrow_downward</span>
            </a>

            <a
              href={`https://wa.me/${(websiteContent?.whatsappNumber || '+97455128899').replace(
                /[^0-9]/g,
                ''
              )}?text=Hello%20MZ%20Tourism%20Concierge,%20I%20would%20like%20to%20plan%20a%20private%20Qatar%20experience.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[52px] px-7 rounded-md bg-[#282a2e]/90 hover:bg-[#333539] border border-[#4e4636]/40 text-[#e2e2e8] hover:text-[#ecc15a] text-[13px] uppercase tracking-wider font-semibold transition-all shadow-lg active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[#ecc15a] mr-2 text-[20px]">chat</span>
            </a>
          </div>

          {/* Social Proof Ribbon */}
          <div className="pt-10 flex flex-wrap items-center gap-y-3 gap-x-8 text-[#d1c5b1] text-[12px]">
            <div className="flex items-center gap-2">
              <div className="flex text-[#ecc15a]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                ))}
              </div>
              <span className="font-semibold text-[#e2e2e8]">4.9/5</span>
              <span>(850+ Verified Reviews)</span>
            </div>

            <div className="flex items-center gap-4 text-[#9a907d]">
              <span className="h-3 w-px bg-[#4e4636]" />
              <span>Hamad Int&apos;l VIP Meet &amp; Greet</span>
              <span className="h-3 w-px bg-[#4e4636]" />
              <span>100% Private Departures</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 2: MOBILE-FIRST BOOKING ENGINE
          ========================================== */}
      <BookingBar
        onCheckAvailability={(details) => {
          onOpenBookingModal(details.tourId);
        }}
      />

      {/* ==========================================
          SECTION 3: SIGNATURE EXPERIENCES SHOWCASE
          ========================================== */}
      <section className="w-full py-12 lg:py-20 bg-[#111317]" id="experiences">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
            <div>
              <span className="text-[12px] uppercase tracking-widest text-[#ecc15a] font-bold block mb-2">
                Curated Itineraries
              </span>
              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#e2e2e8] leading-tight font-semibold">
                Signature Qatar Expeditions
              </h2>
              <p className="text-[14px] text-[#d1c5b1] max-w-xl mt-2 leading-relaxed">
                Each itinerary is operated with certified English, Arabic, and multilingual private guides, guaranteed private vehicle dispatches, and premier safety standards.
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Experiences' },
                { id: 'desert', label: 'Desert & Dunes' },
                { id: 'sea', label: 'Sea & Cruises' },
                { id: 'culture', label: 'Culture & Heritage' },
                { id: 'vip', label: 'VIP Air & Fleet' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#ecc15a] text-[#3f2e00] shadow-md shadow-[#ecc15a]/20'
                      : 'bg-[#282a2e] text-[#d1c5b1] hover:text-[#e2e2e8] border border-[#4e4636]/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Tours */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((tour) => (
              <article
                key={tour.id}
                className="group flex flex-col bg-[#1e2024] rounded-xl overflow-hidden shadow-xl shadow-black/40 hover:-translate-y-1.5 transition-all duration-300 border border-[#4e4636]/30"
              >
                {/* Tour Card Image */}
                <div
                  className="relative w-full aspect-[16/10] overflow-hidden cursor-pointer"
                  onClick={() => onOpenTourDetail(tour)}
                >
                  <img
                    src={tour.image}
                    alt={tour.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2024] via-transparent to-black/30" />

                  {tour.badge && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-1 rounded bg-[#872439]/90 backdrop-blur-md text-[#ffd9dc] text-[10px] uppercase tracking-wider font-bold">
                        {tour.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-[#0c0e12]/80 backdrop-blur-md text-[#ecc15a] text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>{tour.duration}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[#d1c5b1] text-[11px] pb-2 font-medium">
                      <span className="flex items-center gap-1 text-[#ecc15a]">
                        <span className="material-symbols-outlined text-[15px]">star</span>
                        <span className="font-bold text-[#e2e2e8]">{tour.rating}</span> ({tour.reviewsCount}+ reviews)
                      </span>
                      <span>{tour.location}</span>
                    </div>

                    <h3
                      onClick={() => onOpenTourDetail(tour)}
                      className="font-serif text-[18px] font-semibold text-[#e2e2e8] group-hover:text-[#ecc15a] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {tour.title}
                    </h3>

                    <p className="text-[13px] text-[#d1c5b1] mt-2 line-clamp-3 leading-relaxed">
                      {tour.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3">
                      {tour.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#282a2e] text-[#d1c5b1] text-[10px] font-medium border border-[#4e4636]/30"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Price & CTA */}
                  <div className="pt-5 mt-4 flex items-center justify-between border-t border-[#4e4636]/30">
                    <div>
                      <span className="text-[10px] uppercase text-[#d1c5b1] block">From</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-[20px] text-[#ecc15a] font-bold">
                          {formatPrice(tour.basePriceQar, currency)}
                        </span>
                        <span className="text-[11px] text-[#9a907d]">/ person</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenTourDetail(tour)}
                        className="min-h-[40px] px-3 rounded bg-[#282a2e] hover:bg-[#333539] text-[#e2e2e8] text-[11px] font-semibold transition-colors cursor-pointer"
                        title="View Full Itinerary"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenBookingModal(tour.id)}
                        className="min-h-[40px] px-4 rounded bg-[#ecc15a] text-[#3f2e00] hover:bg-[#c29b38] text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer active:scale-95"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Marquee Transit Layover Callout */}
          <div className="mt-12 text-center">
            <button
              onClick={onOpenTransitPlanner}
              className="inline-flex items-center gap-2 text-[13px] text-[#ecc15a] hover:text-[#ffdf99] uppercase tracking-wider font-bold group cursor-pointer"
            >
              <span>Inquire About Bespoke Transit Layovers &amp; Custom VIP Helicopters</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                east
              </span>
            </button>
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 4: WHY CHOOSE MZ TOURISM QATAR
          ========================================== */}
      <section className="w-full py-16 lg:py-24 bg-[#0c0e12] relative overflow-hidden border-t border-[#4e4636]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-widest text-[#ecc15a] font-bold block mb-2">
              The Standard of Excellence
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] text-[#e2e2e8] font-semibold">
              Why Distinguished Travelers Choose MZ
            </h2>
            <p className="text-[14px] text-[#d1c5b1] mt-3 leading-relaxed">
              Rooted in authentic Qatari hospitality and engineered for executive comfort, we craft uncompromised journeys across land and sea.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 sm:p-7 rounded-xl bg-[#1a1c20] shadow-lg hover:bg-[#1e2024] transition-all border border-[#4e4636]/30">
              <div className="w-12 h-12 rounded-lg bg-[#282a2e] text-[#ecc15a] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[28px]">directions_car</span>
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8] mb-2">100% Private Fleet</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Every departure utilizes our meticulously maintained Land Cruisers, Mercedes-Maybach sedans, or luxury Sprinters. No shared stranger groups.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-xl bg-[#1a1c20] shadow-lg hover:bg-[#1e2024] transition-all border border-[#4e4636]/30">
              <div className="w-12 h-12 rounded-lg bg-[#282a2e] text-[#ecc15a] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8] mb-2">Licensed Expert Guides</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Certified Qatar Tourism cultural specialists fluent in English, Arabic, French, German, and Mandarin with desert master driver qualifications.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-xl bg-[#1a1c20] shadow-lg hover:bg-[#1e2024] transition-all border border-[#4e4636]/30">
              <div className="w-12 h-12 rounded-lg bg-[#282a2e] text-[#ecc15a] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[28px]">sell</span>
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8] mb-2">Guaranteed Direct Rates</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Direct local operator pricing with zero middleman commissions, no surprise service fees, and crystal clear upfront quotes.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-xl bg-[#1a1c20] shadow-lg hover:bg-[#1e2024] transition-all border border-[#4e4636]/30">
              <div className="w-12 h-12 rounded-lg bg-[#282a2e] text-[#ecc15a] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[28px]">event_repeat</span>
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8] mb-2">Flexible 24h Cancellation</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Travel plans shift. Enjoy effortless date rescheduling and 100% full refund guarantee on private itineraries canceled up to 24 hours prior.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: VERIFIED GUEST TESTIMONIALS
          ========================================== */}
      <section className="w-full py-16 lg:py-24 bg-[#111317]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-12 gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#ecc15a] font-bold block mb-2">
                Guest Testimonials
              </span>
              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#e2e2e8] font-semibold">
                Praised by Discerning Travelers
              </h2>
            </div>

            {/* Rating Stat Pills */}
            <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#282a2e] border border-[#4e4636]/30">
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-[24px] text-[#ecc15a] font-bold">4.9</span>
                <div className="flex flex-col text-[#d1c5b1] text-[11px] leading-tight">
                  <span className="font-semibold text-[#e2e2e8]">Google &amp; TripAdvisor</span>
                  <span>Over 850 verified reviews</span>
                </div>
              </div>
              <div className="h-6 w-px bg-[#4e4636]" />
              <div className="flex text-[#ecc15a]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((testimonial, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-xl bg-[#1e2024] flex flex-col justify-between shadow-xl border border-[#4e4636]/30"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#ecc15a]">
                      {[...Array(testimonial.rating)].map((_, r) => (
                        <span key={r} className="material-symbols-outlined text-[16px]">star</span>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#d1c5b1]">{testimonial.location}</span>
                  </div>
                  <p className="text-[14px] text-[#e2e2e8] italic leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-4 flex items-center gap-3 border-t border-[#4e4636]/30">
                  <div className="w-10 h-10 rounded-full bg-[#ecc15a]/20 text-[#ecc15a] font-bold flex items-center justify-center text-[12px]">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#e2e2e8]">{testimonial.name}</p>
                    <p className="text-[11px] text-[#d1c5b1]">{testimonial.tour}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 6: QATAR TRAVEL ADVISORY & FAQS
          ========================================== */}
      <section className="w-full py-16 lg:py-24 bg-[#1a1c20] border-t border-[#4e4636]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[11px] uppercase tracking-widest text-[#ecc15a] font-bold block">
                Guest Advisory
              </span>
              <h2 className="font-serif text-[32px] sm:text-[38px] text-[#e2e2e8] font-semibold leading-tight">
                Essential Planning Insights for Qatar
              </h2>
              <p className="text-[14px] text-[#d1c5b1] leading-relaxed">
                Our concierge team curates seamless journeys. Here are answers to common questions regarding local customs, desert attire, and custom transit logistics.
              </p>

              <div className="p-6 rounded-xl bg-[#282a2e] border border-[#ecc15a]/20 shadow-lg space-y-3">
                <div className="flex items-center gap-3 text-[#ecc15a]">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                  <span className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Need Custom Assistance?</span>
                </div>
                <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                  Traveling with infants, senior guests, or diplomatic entourages? Our private travel liaison can prepare bespoke adaptations.
                </p>
                <a
                  href="https://wa.me/97455128899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 pt-2 text-[#ecc15a] text-[12px] font-bold uppercase tracking-wider hover:text-[#ffdf99]"
                >
                  <span>Connect with Chief Concierge</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Right Accordion Column */}
            <div className="lg:col-span-7 space-y-3">
              {FAQ_LIST.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#1e2024] border border-[#4e4636]/30 shadow-md overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4.5 text-left flex items-center justify-between text-[#e2e2e8] hover:text-[#ecc15a] transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="font-serif text-[17px] font-medium pr-4">
                        {faq.question}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[#ecc15a] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 bg-[#282a2e]/30 border-t border-[#4e4636]/20">
                        <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 7: VIP INVITATION BANNER
          ========================================== */}
      <section className="w-full py-16 bg-[#111317] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="relative rounded-2xl bg-gradient-to-r from-[#282a2e] via-[#1e2024] to-[#282a2e] p-8 sm:p-12 shadow-2xl border border-[#ecc15a]/30 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-[11px] text-[#ecc15a] uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ecc15a]" />
                VIP Concierge Desk
              </span>
              <h2 className="font-serif text-[30px] sm:text-[36px] font-semibold text-[#e2e2e8]">
                Ready to Craft Your Qatar Story?
              </h2>
              <p className="text-[14px] text-[#d1c5b1] leading-relaxed">
                Connect directly with our local travel specialists in Doha. We confirm private vehicles, custom timings, and dietary arrangements in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => onOpenBookingModal()}
                className="min-h-[50px] px-8 rounded-md bg-[#ecc15a] hover:bg-[#c29b38] text-[#3f2e00] text-[13px] uppercase tracking-wider font-bold shadow-lg shadow-[#ecc15a]/20 transition-all cursor-pointer active:scale-95"
              >
                Open Booking Form
              </button>
              <a
                href="https://wa.me/97455128899"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[50px] px-6 rounded-md bg-[#333539] text-[#e2e2e8] hover:text-[#ecc15a] text-[13px] uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all border border-[#4e4636]/40"
              >
                <span className="material-symbols-outlined text-[#ecc15a] text-[20px]">chat</span>
                <span>+974 5512 8899</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
