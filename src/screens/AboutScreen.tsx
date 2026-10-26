import React from 'react';

interface AboutScreenProps {
  onOpenBookingModal: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="w-full text-[#e2e2e8]">
      {/* Hero */}
      <section className="relative w-full pt-32 pb-20 overflow-hidden bg-[#111317]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#ecc15a] block mb-2">
            The Heritage &amp; Ethos of MZ Tourism
          </span>
          <h1 className="font-serif text-[38px] sm:text-[52px] font-semibold text-[#e2e2e8] max-w-3xl leading-tight">
            Curators of Authentic Qatari Hospitality &amp; Executive Travel
          </h1>
          <p className="text-[16px] text-[#d1c5b1] max-w-2xl mt-4 leading-relaxed">
            Founded in Doha with a commitment to pristine discretion, MZ Tourism redefines luxury experiential travel across the State of Qatar.
          </p>
        </div>
      </section>

      {/* Main Story & Values */}
      <section className="w-full py-16 bg-[#1a1c20] border-t border-[#4e4636]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-[11px] uppercase tracking-widest text-[#ecc15a] font-bold block">
                Official Certification
              </span>
              <h2 className="font-serif text-[30px] sm:text-[36px] font-semibold text-[#e2e2e8] leading-tight">
                Fully Licensed Qatar Tourism Operator #QT-8829
              </h2>
              <p className="text-[14px] text-[#d1c5b1] leading-relaxed">
                We operate under the rigorous regulatory standards established by the Qatar National Tourism Council. This guarantees that every vehicle in our fleet is fully insured, every desert safari chauffeur is certified in high-angle dune safety, and every cultural guide is a licensed historian fluent in multiple languages.
              </p>
              <div className="p-4 rounded-lg bg-[#282a2e] border border-[#ecc15a]/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">verified</span>
                <div>
                  <span className="text-[13px] font-bold text-[#e2e2e8] block">Qatar Tourism Certified Partner</span>
                  <span className="text-[11px] text-[#d1c5b1]">Registered Commercial Entity • Doha, State of Qatar</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-[#4e4636]/40 shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkdf1sdjjkm25Js9fFohnKFBWlf2Zy2TBw8nylJd95kjvN1HHdI9GrphYTv0xCWAhyqaqveFGe6Z06ScM5GUGa8e0fySV0Pjr0OsZM86rkQIYO6QG7WscLptyrbVCw6mfq4z4Myt-yyvCYftNg8qzSTXcUbYq_KBcgSuHg7Pj4On7TgkgpOZxHy-VIq7dXNJp60p2ae0fOwMm4qgBuAsE1zJqoh3HT41mgQkw2I-qUeBYWELRUvacQ"
                alt="Qatari Cultural Guide at Souq Waqif"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            <div className="p-6 rounded-xl bg-[#282a2e] border border-[#4e4636]/30 space-y-3">
              <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">handshake</span>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Karam &amp; Dheyafa (Generosity)</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                Hospitality is not a transaction in Qatar; it is an ancestral honor. From the moment you are greeted with warm rosewater towels and cardamom Gahwa, our guests are treated as esteemed family.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#282a2e] border border-[#4e4636]/30 space-y-3">
              <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">lock</span>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Absolute Discretion</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                We frequently host royal entourages, diplomatic delegations, and high-profile celebrities. Non-disclosure agreements, private routes, and tarmac VIP transfers are standard practice.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#282a2e] border border-[#4e4636]/30 space-y-3">
              <span className="material-symbols-outlined text-[#ecc15a] text-[28px]">eco</span>
              <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Desert Stewardship</h3>
              <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
                We actively protect the delicate ecosystem of Khor Al Adaid. All waste is removed from our beachfront majlis sites, and we adhere to strict wildlife conservation protocols.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#0c0e12] border border-[#ecc15a]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-[24px] font-semibold text-[#e2e2e8]">
                Begin Your Journey With Us
              </h3>
              <p className="text-[13px] text-[#d1c5b1] mt-1">
                Our private concierge is available 24/7 on WhatsApp for custom itineraries.
              </p>
            </div>
            <button
              onClick={onOpenBookingModal}
              className="px-6 py-3 rounded-md bg-[#ecc15a] text-[#3f2e00] font-bold text-[13px] uppercase tracking-wider hover:bg-[#c29b38] transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-[#ecc15a]/20"
            >
              Plan Private Itinerary
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};
