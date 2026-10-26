import React, { useState } from 'react';

export const ContactScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Bespoke Desert Safari Expedition',
    date: '2025-05-18',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full text-[#e2e2e8]">
      {/* Hero */}
      <section className="relative w-full pt-32 pb-20 overflow-hidden bg-[#111317]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#ecc15a] block mb-2">
            24/7 Private Travel Liaison
          </span>
          <h1 className="font-serif text-[38px] sm:text-[52px] font-semibold text-[#e2e2e8] max-w-3xl leading-tight">
            Connect with the MZ VIP Concierge Desk in Doha
          </h1>
          <p className="text-[16px] text-[#d1c5b1] max-w-2xl mt-4 leading-relaxed">
            Whether arranging same-day desert dispatches, private airport tarmac greetings, or tailored corporate itineraries, our travel liaisons respond within minutes.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="w-full py-16 bg-[#1a1c20] border-t border-[#4e4636]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 className="font-serif text-[24px] font-semibold text-[#e2e2e8]">
                  Concierge Headquarters
                </h3>
                <p className="text-[13px] text-[#d1c5b1] mt-2 leading-relaxed">
                  Located in the prestigious diplomatic district of West Bay, overlooking the Arabian Gulf.
                </p>
              </div>

              <div className="space-y-4 text-[13px]">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#282a2e] border border-[#4e4636]/30">
                  <span className="material-symbols-outlined text-[#ecc15a] text-[22px] shrink-0">location_on</span>
                  <div>
                    <span className="font-bold text-[#e2e2e8] block">Diplomatic Area Office</span>
                    <span className="text-[#d1c5b1]">Al Funduq Street, West Bay, Doha, State of Qatar</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#282a2e] border border-[#4e4636]/30">
                  <span className="material-symbols-outlined text-[#ecc15a] text-[22px] shrink-0">chat</span>
                  <div>
                    <span className="font-bold text-[#e2e2e8] block">24/7 VIP WhatsApp Helpline</span>
                    <a
                      href="https://wa.me/97455128899"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ecc15a] hover:underline font-semibold"
                    >
                      +974 5512 8899 (Direct Real-Time Liaison)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#282a2e] border border-[#4e4636]/30">
                  <span className="material-symbols-outlined text-[#ecc15a] text-[22px] shrink-0">call</span>
                  <div>
                    <span className="font-bold text-[#e2e2e8] block">Executive Office Telephone</span>
                    <a href="tel:+97444001234" className="text-[#d1c5b1] hover:text-[#ecc15a]">
                      +974 4400 1234
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#282a2e] border border-[#4e4636]/30">
                  <span className="material-symbols-outlined text-[#ecc15a] text-[22px] shrink-0">mail</span>
                  <div>
                    <span className="font-bold text-[#e2e2e8] block">Electronic Dispatch</span>
                    <a href="mailto:vip@mztourism.qa" className="text-[#d1c5b1] hover:text-[#ecc15a]">
                      vip@mztourism.qa
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#0c0e12] border border-[#ecc15a]/20 space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#ecc15a] tracking-wider block">
                  Operating Hours
                </span>
                <p className="text-[13px] text-[#e2e2e8]">
                  Fleet Dispatches: <span className="text-[#ecc15a] font-semibold">24 Hours / 7 Days</span>
                </p>
                <p className="text-[12px] text-[#d1c5b1]">
                  Executive West Bay Lounge: Daily 08:00 AM – 10:00 PM (AST)
                </p>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-[#1e2024] p-8 sm:p-10 rounded-xl border border-[#4e4636]/30 shadow-2xl">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#ecc15a] tracking-widest block mb-1">
                      Direct Concierge Inquiry
                    </span>
                    <h3 className="font-serif text-[24px] font-semibold text-[#e2e2e8]">
                      Request a Customized Itinerary
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] uppercase font-bold text-[#d1c5b1]">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Countess Victoria Sterling"
                        className="w-full px-3.5 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] uppercase font-bold text-[#d1c5b1]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. victoria@luxurytravel.com"
                        className="w-full px-3.5 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] uppercase font-bold text-[#d1c5b1]">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+974 / +44 / +1..."
                        className="w-full px-3.5 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] uppercase font-bold text-[#d1c5b1]">Intended Travel Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3.5 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] uppercase font-bold text-[#d1c5b1]">Primary Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a] cursor-pointer"
                    >
                      <option value="Bespoke Desert Safari Expedition">Bespoke Desert Safari &amp; Inland Sea Sunset</option>
                      <option value="Royal Wooden Dhow Dinner Cruise">Royal Wooden Dhow Dinner Cruise along Corniche</option>
                      <option value="Souq Waqif & Katara Cultural Tour">Souq Waqif &amp; Katara Cultural VIP Tour</option>
                      <option value="Hamad Airport VIP Transit Layover">Hamad Airport VIP Transit Layover Express</option>
                      <option value="Private Luxury Yacht Charter">Private Luxury Yacht &amp; Banana Island Charter</option>
                      <option value="Chauffeur-Driven Mercedes-Maybach / Escalade Fleet">Chauffeur-Driven Mercedes-Maybach / Escalade Fleet</option>
                      <option value="Diplomatic / Corporate Group Delegation">Diplomatic / Corporate Group Delegation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] uppercase font-bold text-[#d1c5b1]">Special Requests or Requirements</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please note dietary preferences, flight numbers, children requiring safety seats, or custom hours..."
                      className="w-full p-3.5 rounded-md bg-[#282a2e] text-[#e2e2e8] text-[13px] border border-[#4e4636]/40 focus:outline-none focus:ring-1 focus:ring-[#ecc15a]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] rounded-md bg-[#ecc15a] hover:bg-[#c29b38] text-[#3f2e00] font-bold text-[13px] uppercase tracking-wider transition-all shadow-xl shadow-[#ecc15a]/20 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Send Concierge Inquiry</span>
                    <span className="material-symbols-outlined text-[19px]">send</span>
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#ecc15a]/20 text-[#ecc15a] mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                  </div>
                  <h4 className="font-serif text-[24px] font-semibold text-[#e2e2e8]">
                    Inquiry Successfully Dispatched
                  </h4>
                  <p className="text-[14px] text-[#d1c5b1] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-[#e2e2e8] font-semibold">{formData.name}</span>. A senior travel liaison at our West Bay office has received your request and will reach out via WhatsApp / Email within 15 minutes.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/97455128899?text=${encodeURIComponent(
                        `Hello MZ Tourism Concierge, I just submitted an inquiry regarding ${formData.service} on ${formData.date}. Name: ${formData.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-md bg-[#25D366] text-black font-bold text-[13px] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>Fast-Track on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-md bg-[#282a2e] text-[#d1c5b1] hover:text-[#e2e2e8] text-[13px] font-semibold"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
