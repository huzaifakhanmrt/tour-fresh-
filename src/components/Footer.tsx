import React from 'react';

interface FooterProps {
  onNavigate: (screen: string) => void;
  onOpenBookingModal: (tourId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookingModal }) => {
  return (
    <footer className="w-full bg-[#0c0e12] border-t border-[#ecc15a]/20 pt-16 pb-24 md:pb-16 text-[#e2e2e8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#4e4636]/30">
          
          {/* Column 1: Brand & Credential */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwkBr_wGMdcfXGD2uAXzjQV2F6J7A_5mAmimUwo6UM9ptRPxNOVv_r7yCzgDLi34gvjc99kaRAK5K6d7sKgZiam1Aobv9Vfg9s1pFoJRIRQC12e7GnZ18K75RJSqTl0h6hoaMGBP5n2owjC7-Lfx0kdMd2iRlodUk5jexcnWe_S34Re1K_eaJWvXExhTkY0uSPhR8VI0CCidnPA61B5-89OliYVgnCLo214ltUWNjn686h7E7ybp8O"
                alt="MZ Tourism Qatar Luxury Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-serif text-[20px] font-semibold text-[#ecc15a]">MZ Tourism</span>
            </div>
            
            <p className="text-[13px] text-[#d1c5b1] leading-relaxed">
              Crafting peerless luxury expeditions, maritime escapes, and bespoke cultural itineraries across the State of Qatar. Licensed by Qatar Tourism.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-md bg-[#1a1c20] border border-[#ecc15a]/20 w-fit">
              <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">verified</span>
              <span className="text-[11px] font-semibold text-[#e2e2e8] uppercase tracking-wider">
                Licensed Qatar Tourism Operator #QT-8829
              </span>
            </div>

            <div className="flex items-start gap-2 text-[#d1c5b1] text-[13px]">
              <span className="material-symbols-outlined text-[#ecc15a] text-[18px] shrink-0 mt-0.5">location_on</span>
              <span>Al Funduq St, West Bay Diplomatic Area, Doha, State of Qatar</span>
            </div>
          </div>

          {/* Column 2: Signature Tours */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Signature Tours</h3>
            <ul className="flex flex-col gap-2 text-[13px] text-[#d1c5b1]">
              <li>
                <button
                  onClick={() => { onNavigate('desert-safaris'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Khor Al Adaid Inland Sea Safari
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('dhow-cruises'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Sunset Heritage Wooden Dhow Cruise
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('doha-culture'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Souq Waqif & Katara Cultural Walk
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('private-luxury'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  VIP Hamad Airport Transit Layover
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('private-luxury'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Private Luxury Yacht & Banana Island
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Guest Concierge */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">Guest Concierge</h3>
            <ul className="flex flex-col gap-2 text-[13px] text-[#d1c5b1]">
              <li>
                <button
                  onClick={() => onOpenBookingModal('transit-layover')}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Airport VIP Meet & Assist (Hamad Intl)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('private-luxury'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Chauffeur-Driven Maybach & Escalade Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Luxury Hotel & Resort Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBookingModal()}
                  className="hover:text-[#ecc15a] transition-colors text-left cursor-pointer"
                >
                  Cancellation & Refund Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: 24/7 VIP Helpline */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-[18px] font-semibold text-[#e2e2e8]">24/7 VIP Helpline</h3>
            <p className="text-[13px] text-[#d1c5b1]">
              Direct connection with our private liaison team in Doha for real-time bookings.
            </p>
            <div className="flex flex-col gap-2 text-[13px] font-medium">
              <a
                href="https://wa.me/97455128899"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#e2e2e8] hover:text-[#ecc15a] transition-colors"
              >
                <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">chat</span>
                +974 5512 8899 (WhatsApp)
              </a>
              <a
                href="mailto:vip@mztourism.qa"
                className="flex items-center gap-2 text-[#e2e2e8] hover:text-[#ecc15a] transition-colors"
              >
                <span className="material-symbols-outlined text-[#ecc15a] text-[18px]">mail</span>
                vip@mztourism.qa
              </a>
            </div>

            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#d1c5b1] block mb-2 font-semibold">
                Secured Payment Channels
              </span>
              <div className="flex flex-wrap gap-2 text-[#e2e2e8] text-[11px] font-semibold">
                <span className="px-2.5 py-1 rounded bg-[#1e2024] border border-[#4e4636]/40">Visa</span>
                <span className="px-2.5 py-1 rounded bg-[#1e2024] border border-[#4e4636]/40">Mastercard</span>
                <span className="px-2.5 py-1 rounded bg-[#1e2024] border border-[#4e4636]/40">Amex</span>
                <span className="px-2.5 py-1 rounded bg-[#1e2024] border border-[#4e4636]/40">Apple Pay</span>
                <span className="px-2.5 py-1 rounded bg-[#1e2024] border border-[#4e4636]/40">QPay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#d1c5b1] text-[12px]">
          <p>© 2025 MZ Tourism Qatar. All rights reserved. Registered Commercial Entity • Doha, Qatar.</p>
          <div className="flex items-center gap-6 font-medium">
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#ecc15a] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#ecc15a] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#ecc15a] transition-colors cursor-pointer"
            >
              Guest Assistance
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#ecc15a] hover:text-[#ffdf99] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Staff Admin Console</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
