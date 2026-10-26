import { Tour, CurrencyConfig, Testimonial, FAQItem } from '../types';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  QAR: { code: 'QAR', symbol: '﷼', rateAgainstQar: 1 },
  USD: { code: 'USD', symbol: '$', rateAgainstQar: 0.2747 },
  EUR: { code: 'EUR', symbol: '€', rateAgainstQar: 0.252 },
  GBP: { code: 'GBP', symbol: '£', rateAgainstQar: 0.2118 },
};

export const TOURS_DATA: Tour[] = [
  {
    id: 'inland-sea',
    title: 'Khor Al Adaid Luxury Dune Bashing & Inland Sea Sunset',
    subtitle: 'Epic desert dunes rolling directly into the deep blue Arabian Gulf',
    category: 'desert',
    categoryLabel: 'Desert & Dunes',
    duration: '4 - 6 Hours',
    rating: 5.0,
    reviewsCount: 284,
    location: 'Sealine • Khor Al Adaid',
    basePriceQar: 450,
    badge: 'Most Popular',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWXZL8dMJARl7egedwhd2V4ZTjc3fwO0H1KhNvBTKWXTUTcJb-J13eELb9M__jpCdvTX5xj8WDQwhGmiEVWbzO9SRaBGi0DwI9GQw3FsH28ziVrIcuO7bA_LNiS3vkzOm2701xDhQ8AKlfwZIzsZCX0G-QXevg2ndZLzRqvIZZIx3FXJg_YZ5mc0lWibEveKUVpmjmvkuA1HSW-RhzvMFOgIJQPlOjH29UJIBYVdjsydbaQd5f1wd',
    alt: 'Toyota Land Cruiser 4x4 on towering red sand dunes in Khor Al Adaid at sunset',
    shortDescription: 'Adrenaline-fueled dune cruising in custom 4x4 Land Cruisers, traditional Bedouin camel ride, sandboarding, and an authentic Arabian Majlis campfire dinner beside the water.',
    fullDescription: 'Journey south into the UNESCO-recognized Khor Al Adaid (Inland Sea), one of the rare places in the world where the desert dunes meet the ocean. Driven by Qatar Tourism certified master desert chauffeurs, traverse towering sand waves, pause for exhilarating sandboarding, experience falconry and camel rides, and relax in a private luxury Bedouin beachfront Majlis as the sunset casts an amber glow over the Arabian Gulf.',
    amenities: ['4x4 Private Car', 'Camel Ride', 'Dinner Included', 'Gahwa & Dates', 'Sandboarding Gear'],
    vehicle: 'Private Toyota Land Cruiser V8 / Nissan Patrol Super Safari',
    highlights: [
      'UNESCO-recognized inland sea where tidal waters embrace golden desert dunes',
      'Professional dune bashing with licensed master drivers and tire pressure adjustment',
      'Bedouin hospitality with aromatic Arabic coffee (Gahwa), fresh dates, and Karak tea',
      'Authentic sandboarding from 50-meter desert crests',
      'Private sunset Majlis relaxation with optional five-star live barbecue'
    ],
    itinerary: [
      { time: '14:00', title: 'Private Chauffeur Doorstep Pickup', description: 'VIP pickup from any hotel in Doha, The Pearl, or Hamad International Airport terminal.' },
      { time: '15:15', title: 'Sealine Desert Gateway & Camel Greeting', description: 'Brief stop to deflate tires for dune terrain, meet local falcons, and take an optional camel trek.' },
      { time: '16:00', title: 'High-Roller Dune Bashing & Sandboarding', description: 'Thrilling traversal across sweeping crests with adrenaline-pumping sandboarding stops.' },
      { time: '17:30', title: 'Inland Sea Horizon & Sunset Majlis', description: 'Arrive at the pristine Khor Al Adaid shoreline overlooking Saudi Arabian borders in peaceful silence.' },
      { time: '18:30', title: 'Bedouin Campfire Dinner & Karak', description: 'Freshly grilled kebabs, hummus, warm flatbreads, and aromatic tea under the emerging desert stars.' },
      { time: '20:30', title: 'Smooth Return Journey to Doha', description: 'Relax in air-conditioned comfort as your private chauffeur returns you to your doorstep.' }
    ],
    included: [
      'Doorstep private hotel/airport pickup & return in 4x4 Land Cruiser',
      'Qatar Tourism certified desert safari guide and driver',
      'Chilled bottled mineral water, soft drinks, Karak tea, and Arabic Gahwa',
      'Traditional camel ride and sandboarding equipment',
      'Gourmet Arabian barbecue dinner at private beachfront camp',
      'Comprehensive passenger desert expedition insurance'
    ],
    notIncluded: [
      'Quad bike or ATV rental (available on-site for direct upgrade)',
      'Gratuities for driver and camp staff'
    ]
  },
  {
    id: 'royal-dhow',
    title: 'Royal Wooden Dhow Dinner Cruise along Doha Corniche',
    subtitle: 'Classic handcrafted Qatari maritime heritage under illuminated skyline',
    category: 'sea',
    categoryLabel: 'Sea & Cruises',
    duration: '3.5 Hours',
    rating: 4.9,
    reviewsCount: 198,
    location: 'Doha Bay • Corniche',
    basePriceQar: 380,
    badge: 'Heritage Maritime',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqahxGX-jt2oHExfZeYoyxeg5WgS7zVh-2ztoyDkOK9g2zpzMnNJI4ZfOltiJwsdd9kihJrU4iCfSMyoyEUHSyr4Z03-P2KoS_xpdVUkgqt7QUVhKcrcFhD7BzwIBBVkgKSXHkxvL4SWmnhKhPcPE1VLhMhf7CQqoTbePh-CPVvEMPA4yJ1l1QfdLWVzfNM7dBmKa5fTDoVJehDnQHBqgpQLk1fhrbVFIE052T2Zqzkgp2X2-ByExJ',
    alt: 'Handcrafted luxury wooden dhow cruising Doha Corniche at dusk with glowing West Bay skyline',
    shortDescription: 'Cruise aboard an authentic teak dhow gliding past the illuminated West Bay skyline. Enjoy a 5-star live barbecue buffet, Arabic sweets, and ambient coastal hospitality.',
    fullDescription: 'Step aboard a traditionally crafted wooden dhow, historically sailed by Qatari pearl divers and now restored with opulent cushions, ambient bronze lanterns, and shaded open-air upper observation decks. Glide silently across the mirror-like waters of Doha Bay as dusk transforms the West Bay skyline, Museum of Islamic Art, and Katara into a glittering amphitheater of light.',
    amenities: ['Skyline Views', 'Live BBQ Buffet', 'Upper Deck Lounge', 'Arabic Sweets', 'Air-Conditioned Saloon'],
    vehicle: 'Private Handcrafted Teak Dhow Yacht with Dual Decks',
    highlights: [
      'Panoramic 360-degree views of Doha illuminated skyscrapers and Museum of Islamic Art',
      'Sumptuous 5-star open buffet with live charcoal barbecue stations',
      'Traditional Arabic acoustic oud melodies drifting across the upper deck lounge',
      'Safety equipment, life vests, and Coast Guard certified maritime captain',
      'Private seating pods or full private charter configurations'
    ],
    itinerary: [
      { time: '17:30', title: 'Corniche Dhow Harbour Welcome', description: 'Chauffeur escort to the historic Dhow Harbour jetty near Souq Waqif.' },
      { time: '18:00', title: 'Cast Off & Skyline Sunset Sail', description: 'Glide across the calm bay as the sun dips behind the towering towers of West Bay.' },
      { time: '19:00', title: 'Five-Star Barbecue Buffet Service', description: 'Indulge in freshly prepared shish tawook, kofta, spiced Gulf prawns, and mezze.' },
      { time: '20:30', title: 'Stargazing & Return to Berth', description: 'Sip cardamom-spiced Karak tea and Umm Ali dessert while gently sailing back to port.' }
    ],
    included: [
      'Round-trip private transfers between your hotel and Corniche harbour',
      'Full 3.5 hour evening sailing in Doha Bay',
      'Gourmet live charcoal barbecue buffet, salads, and traditional desserts',
      'Unlimited beverages, juices, mineral water, and tea/coffee',
      'Full access to upper open lounge deck and air-conditioned lower salon'
    ],
    notIncluded: [
      'Alcoholic beverages (strictly dry cruise as per cultural guidelines)',
      'Personal souvenir purchases'
    ]
  },
  {
    id: 'doha-culture',
    title: 'Souq Waqif & Katara Cultural Village VIP Guided Walking Tour',
    subtitle: 'Private historian escort through centuries of Qatari heritage, falconry, and art',
    category: 'culture',
    categoryLabel: 'Culture & Heritage',
    duration: '5 Hours',
    rating: 5.0,
    reviewsCount: 142,
    location: 'Souq Waqif • Katara • Msheireb',
    basePriceQar: 290,
    badge: 'Cultural Access',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkdf1sdjjkm25Js9fFohnKFBWlf2Zy2TBw8nylJd95kjvN1HHdI9GrphYTv0xCWAhyqaqveFGe6Z06ScM5GUGa8e0fySV0Pjr0OsZM86rkQIYO6QG7WscLptyrbVCw6mfq4z4Myt-yyvCYftNg8qzSTXcUbYq_KBcgSuHg7Pj4On7TgkgpOZxHy-VIq7dXNJp60p2ae0fOwMm4qgBuAsE1zJqoh3HT41mgQkw2I-qUeBYWELRUvacQ',
    alt: 'Atmospheric night view of Souq Waqif Doha with warm lantern lights and traditional architecture',
    shortDescription: 'Private historian escort through the historic Falcon Souq, spice alleys, perfume masteries, Katara Amphitheatre, and Arabic coffee ceremonies with royal sweets.',
    fullDescription: 'Discover Doha beyond the glass facades. Accompanied by a certified Qatari cultural historian, walk the ancient labyrinthine mud-rendered passageways of Souq Waqif. Step inside the revered Falcon Souq and state-of-the-art Falcon Hospital, experience bespoke oud and agarwood perfumery blending, admire Katara Cultural Village’s Greco-Roman amphitheater and gold-tiled mosque, and conclude with authentic Gahwa tasting.',
    amenities: ['Falcon Hospital', 'Gahwa Tasting', 'Private Guide', 'Perfume Mastery', 'Golf Cart Katara'],
    vehicle: 'Luxury Mercedes-Benz V-Class / Chauffeur Sedan',
    highlights: [
      'Insider access to the exclusive Falcon Hospital and master falcon handlers',
      'Aromatherapeutic immersion in the historic Oud, Bakhoor, and Persian saffron souqs',
      'Private tour of Katara Cultural Village art galleries and the iconic Golden Masjid',
      'Traditional Qatari Gahwa brewing demonstration with cardamom and medjool dates',
      'Visit to Msheireb Downtown, the worlds first sustainable downtown regeneration project'
    ],
    itinerary: [
      { time: '09:00', title: 'Hotel Chauffeur Pickup', description: 'Meet your private licensed historian guide in the lobby of your residence.' },
      { time: '09:30', title: 'Souq Waqif Heritage Alleys', description: 'Walk through traditional spice stalls, textiles, and authentic copper workshops.' },
      { time: '11:00', title: 'Falcon Souq & Hospital VIP Access', description: 'Learn the ancient desert hunting tradition and interact with trained royal falcons.' },
      { time: '12:15', title: 'Katara Cultural Village & Amphitheatre', description: 'Tour the maritime heritage museum, Pigeon Towers, and architectural wonders.' },
      { time: '13:30', title: 'Traditional Qatari Gahwa & Delicacies', description: 'Savor authentic spiced coffee and traditional pastries in a secluded private majlis.' }
    ],
    included: [
      'Private dedicated licensed Qatar Tourism cultural historian guide',
      'All transfers in executive Mercedes-Benz vehicle with personal chauffeur',
      'VIP entrance to Falcon Hospital and cultural landmarks',
      'Traditional Gahwa coffee tasting, fresh dates, and local refreshments',
      'Katara club car / golf cart transportation'
    ],
    notIncluded: [
      'Personal perfume and antique purchases at Souq Waqif'
    ]
  },
  {
    id: 'luxury-yacht',
    title: 'Private Luxury Yacht & Banana Island Escapade',
    subtitle: 'Exclusive 55ft Italian motor yacht charter across the turquoise Persian Gulf',
    category: 'vip',
    categoryLabel: 'VIP Charter',
    duration: 'Full Day / 8h',
    rating: 5.0,
    reviewsCount: 68,
    location: 'The Pearl • Banana Island',
    basePriceQar: 1800,
    badge: 'VIP Charter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHVhxgB-d53FhiA-wzB0d3wzWNC6Qk9ue92zVVmaVftkURihBftJyLpYR6O4at-n5vv-3m7Km4Z8cC0HR5bTkWUEeuJHmLTiuJg6PcmqQ7Dpso0tpsTow4AY4KpIDCmKSXxRuDUGXu2P9NZnoykcuM8g3Kx-suxwbv72Jo3Fr7OG0qPw7Urgay-8jSI4srGdJJUfPH1Gwnnmmq9_rFNQShIjY1B2Qg1ESATSslIDMMuz7ANB73VdR9',
    alt: '55-foot sleek white luxury yacht anchored in turquoise waters near Banana Island Doha',
    shortDescription: 'Exclusive 55ft Italian motor yacht charter with private captain, swimming stopovers in azure waters, gourmet chef catering, and water sports access.',
    fullDescription: 'Indulge in the ultimate seafaring indulgence departing from Porto Arabia marina in The Pearl-Qatar. Your private crew of captain, first mate, and private onboard chef cater to every whim aboard a master-crafted 55ft motor yacht. Anchor in the crystal-clear sandbars of Al Safliya and Banana Island for private swimming, seabob adventures, and sunset champagne dining.',
    amenities: ['Private Chef', 'Jet Ski Option', 'Up to 12 Guests', 'Porto Arabia Berth', 'Snorkel Equipment'],
    vehicle: '55ft Azimut / Ferretti Luxury Motor Yacht',
    highlights: [
      'Full private charter for up to 12 esteemed guests with experienced maritime crew',
      'Secluded anchorage at crystal sandbars near Banana Island and Al Safliya',
      'Custom gourmet three-course lunch or dinner prepared by private chef onboard',
      'Complimentary snorkeling equipment, paddleboards, and floating lounge mats',
      'State-of-the-art Fusion surround sound system with Bluetooth connectivity'
    ],
    itinerary: [
      { time: '10:00', title: 'Porto Arabia Boarding & Champagne Welcome', description: 'Step aboard at the exclusive Pearl-Qatar marina with chilled refreshments.' },
      { time: '11:00', title: 'Gulf Cruising & Marine Sightseeing', description: 'Cruise past Lusail towers and the Doha skyline towards secluded sandbars.' },
      { time: '12:30', title: 'Azure Waters Anchorage & Water Activities', description: 'Swim, snorkel, or paddleboard in calm 28°C azure waters.' },
      { time: '14:00', title: 'Gourmet Chef Lunch on Aft Deck', description: 'Fresh seafood, beef tenderloin, artisanal salads, and exotic fruits.' },
      { time: '16:30', title: 'Golden Hour Sunset Cruise', description: 'Slow drift back into The Pearl canal as the lights of Doha begin to glow.' }
    ],
    included: [
      'Full yacht charter with licensed captain and 2 professional crew members',
      'All fuel and marina docking permissions',
      'Gourmet chef service with choice of tailored menu',
      'Stand-up paddleboards, snorkeling masks, and inflatable sea loungers',
      'Unlimited soft drinks, artisan juices, mineral waters, and gourmet coffee'
    ],
    notIncluded: [
      'High-speed Jet Ski rental (available on request for 600 QAR/hour)'
    ]
  },
  {
    id: 'transit-layover',
    title: 'Hamad Int’l Airport VIP Transit Layover Express Odyssey',
    subtitle: 'Seamless tarmac-to-city private journey designed for layovers from 4 to 12 hours',
    category: 'vip',
    categoryLabel: 'VIP Air & Fleet',
    duration: '4 - 8 Hours',
    rating: 4.9,
    reviewsCount: 312,
    location: 'Hamad Airport • City Highlights',
    basePriceQar: 550,
    badge: 'Express Layover',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2Dqaj9vhrEu1AhIYGG07l33tIuCB3VP0q9-kwfxV_obMEb7BlCIxq_WOlDdRkZa1JKUy8c2O9EZSFWz7fV_jVO0Gr4bEUsE4ruJ4hOKwvdqFXPAXv1btAUj2ZeKsi807OBlEc2XWkhaTI54aJ0CsSmJOdm5E7_B_6yN3re2VVh5_L_DjIUyYlJ265sQd55SouBVHnoYe2kkdEpj-_iVZcLHmcxMkJmKii_xV796bse_4E2lbmfq-g',
    alt: 'Hamad International Airport VIP meet and greet passenger transfer',
    shortDescription: 'Turn transit hours into an unforgettable Arabian memory. Chauffeur meets you inside the arrivals terminal, safeguards your luggage, and guides you through Doha’s highlights.',
    fullDescription: 'If you have 4 hours or more between flights at Hamad International Airport (DOH), do not stay locked in the terminal. Our VIP transit liaison meets you at arrivals, manages your luggage securely in your private luxury vehicle, and drives you directly to Doha Corniche, the National Museum of Qatar, and Souq Waqif. We monitor your return flight gate in real time, guaranteeing a swift, stress-free return with plenty of buffer before boarding.',
    amenities: ['Airport Meet & Greet', 'Luggage Care', 'Flexible Timings', 'Fast-Track Advisory', 'Maybach/Escalade'],
    vehicle: 'Mercedes-Maybach S-Class / Cadillac Escalade Platinum',
    highlights: [
      'Direct gate/arrivals hall greeting with personalized name board',
      'Secure in-vehicle luggage custody throughout the tour',
      'Optimized 4, 6, or 8-hour routes adjusted to your flight schedule',
      'Visits to Corniche, National Museum of Qatar, Souq Waqif, and Katara',
      'Guaranteed on-time drop-off back at Hamad International Airport departures'
    ],
    itinerary: [
      { time: 'Flight +30m', title: 'Hamad Airport Terminal Welcome', description: 'Meet your personal chauffeur at the arrivals lounge right after baggage claim.' },
      { time: 'Transit +1h', title: 'National Museum of Qatar & Corniche', description: 'Admire Jean Nouvels desert rose architecture and skyline views.' },
      { time: 'Transit +2.5h', title: 'Souq Waqif & Gahwa Break', description: 'Explore bustling spice markets and sip authentic saffron tea.' },
      { time: 'Transit +4h', title: 'Guaranteed On-Time Airport Return', description: 'Smooth delivery to Hamad International Airport Departures for your onward connection.' }
    ],
    included: [
      'Hamad Airport personalized Meet & Greet service',
      'Private chauffeur in luxury executive vehicle for the entire layover duration',
      'Live flight tracking and schedule contingency planning',
      'Secure luggage storage inside the vehicle',
      'Complimentary Wi-Fi, chilled water, and cold refreshing towels'
    ],
    notIncluded: [
      'Museum entrance tickets (can be arranged on request)'
    ]
  },
  {
    id: 'overnight-glamping',
    title: 'Overnight Bedouin Royal Majlis Glamping in the Singing Dunes',
    subtitle: 'Sleep under a canopy of desert stars with five-star Arabian comforts',
    category: 'desert',
    categoryLabel: 'Desert & Dunes',
    duration: '18 Hours (Overnight)',
    rating: 5.0,
    reviewsCount: 88,
    location: 'Khor Al Adaid Deep Desert',
    basePriceQar: 890,
    badge: 'Exclusive Glamping',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWXZL8dMJARl7egedwhd2V4ZTjc3fwO0H1KhNvBTKWXTUTcJb-J13eELb9M__jpCdvTX5xj8WDQwhGmiEVWbzO9SRaBGi0DwI9GQw3FsH28ziVrIcuO7bA_LNiS3vkzOm2701xDhQ8AKlfwZIzsZCX0G-QXevg2ndZLzRqvIZZIx3FXJg_YZ5mc0lWibEveKUVpmjmvkuA1HSW-RhzvMFOgIJQPlOjH29UJIBYVdjsydbaQd5f1wd',
    alt: 'Luxury Arabian glamping tent camp under a sky of stars in Khor Al Adaid',
    shortDescription: 'Unrivaled overnight tranquility in private climate-controlled Arabian tents, five-star candlelit desert dining, telescope stargazing, and dawn dune awakening.',
    fullDescription: 'Experience the ancient romance of the Qatari desert with contemporary five-star indulgence. Stay in private hand-woven Bedouin royal tents fitted with plush king bedding, ensuite bathroom amenities, and climate control. As twilight settles, gather around an open bonfire for slow-roasted lamb Shuwa, listen to Qatari storytelling, and gaze through astronomical telescopes at the Milky Way.',
    amenities: ['Private Tent Suite', 'Ensuite Bath', 'Dinner & Breakfast', 'Bonfire & Oud', 'Stargazing Telescope'],
    vehicle: 'Private 4x4 Chauffeur Land Cruiser',
    highlights: [
      'Luxury air-conditioned tent with authentic Qatari woven tapestries and king bed',
      'Gourmet sunset BBQ dinner with slow-cooked Arabian specialties',
      'Nighttime campfire gathering with acoustic oud and stargazing session',
      'Sunrise dune climb with panoramic views of the turquoise Inland Sea',
      'Lavish morning breakfast spread featuring freshly baked bread and Shakshuka'
    ],
    itinerary: [
      { time: '14:30', title: 'Doha Pickup & Dune Bashing Journey', description: 'Thrilling private desert transit to the secluded overnight camp.' },
      { time: '17:00', title: 'Check-in to Private Royal Tent', description: 'Freshen up with rosewater towels and Arabian welcome drinks.' },
      { time: '19:30', title: 'Candlelit Desert Dinner by the Sea', description: 'Exquisite multi-course feast served under the canopy of stars.' },
      { time: '21:30', title: 'Campfire Gathering & Astronomy Guide', description: 'Observe celestial constellations through high-powered telescope lenses.' },
      { time: '05:45', title: 'Sunrise Over Inland Sea & Breakfast', description: 'Watch dawn break in pure silence followed by a full breakfast.' },
      { time: '09:00', title: 'Return Transfer to Doha', description: 'Smooth morning return to your hotel or airport.' }
    ],
    included: [
      'Round-trip 4x4 transportation from Doha',
      'Overnight accommodation in private luxury air-conditioned tent suite',
      'Gourmet dinner, campfire barbecue, and hot sunrise breakfast',
      'Sandboarding and camel experiences',
      'Unlimited beverages, bottled water, tea, and coffee'
    ],
    notIncluded: [
      'Alcoholic beverages'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Alexander & Lady Linley',
    location: 'United Kingdom • March 2025',
    date: 'March 2025',
    rating: 5,
    text: 'The Inland Sea Safari was pure perfection. Our driver Tariq handled the dunes with absolute mastery. The sunset majlis setup with fresh Karak tea and dates under the Arabian sky was unforgettable.',
    tour: 'Private Dune Bashing Expedition',
    initials: 'AL'
  },
  {
    name: 'Fatima Al-Nuaimi',
    location: 'Dubai, UAE • April 2025',
    date: 'April 2025',
    rating: 5,
    text: 'We booked the private wooden dhow for a family celebration. The crew, the barbecue, and the nighttime views of West Bay were exemplary. MZ’s WhatsApp concierge replied within 2 minutes.',
    tour: 'Royal Sunset Dhow Dinner',
    initials: 'FA'
  },
  {
    name: 'Markus Schmidt',
    location: 'Frankfurt, Germany • May 2025',
    date: 'May 2025',
    rating: 5,
    text: 'Had an 8-hour layover in Hamad Airport. MZ picked us up straight from the terminal in a clean Maybach, showed us the National Museum, Souq Waqif, and Katara, and returned us smoothly. 10/10.',
    tour: 'VIP Transit Layover Tour',
    initials: 'MS'
  },
  {
    name: 'Sarah & Jean-Paul Dupont',
    location: 'Paris, France • June 2025',
    date: 'June 2025',
    rating: 5,
    text: 'MZ Tourism arranged our entire 4-day private stay in Doha. From private yacht charter to the Falcon hospital and luxury glamping, their attention to privacy and detail is world-class.',
    tour: 'Bespoke Qatar Concierge Itinerary',
    initials: 'JD'
  }
];

export const FAQ_LIST: FAQItem[] = [
  {
    question: 'What should we wear during desert safaris and cultural tours?',
    answer: 'For desert safaris, comfortable lightweight clothing, closed footwear or sandals, sunglasses, and a sunhat are recommended. For Souq Waqif and mosques, modest clothing covering shoulders and knees respects local culture. We also provide light pashminas in our private vehicles.'
  },
  {
    question: 'Is hotel and airport pick-up included in all experiences?',
    answer: 'Yes. Every private experience comes standard with doorstep pick-up and return chauffeur service across all Doha hotels, The Pearl-Qatar, Lusail residences, Doha Cruise Port, and Hamad International Airport (DOH).'
  },
  {
    question: 'Can we arrange tours during a short transit layover in Doha?',
    answer: 'Absolutely. If you possess a layover of 4 hours or more at Hamad International Airport, we will meet you inside the arrivals hall, handle your luggage securely in the private vehicle, guide you through Qatar’s highlights, and return you safely with ample time for boarding.'
  },
  {
    question: 'What is MZ Tourism’s cancellation and refund guarantee?',
    answer: 'All private bookings enjoy complimentary cancellation with 100% full refund up to 24 hours prior to departure time. You can also reschedule your booking date or swap experiences instantly via WhatsApp without fees.'
  },
  {
    question: 'Are private vehicle upgrades (Mercedes-Maybach or Escalade) available?',
    answer: 'Yes. While all desert safaris utilize our specialized custom Toyota Land Cruisers for dune safety, city and transit layover tours can be upgraded to our executive Mercedes-Maybach S-Class, Cadillac Escalade Platinum, or VIP Sprinter.'
  }
];
