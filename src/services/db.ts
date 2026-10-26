import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, ROOT_ADMIN_EMAIL } from '../lib/firebase';
import {
  Tour,
  BookingData,
  LocationItem,
  VehicleItem,
  CustomerRecord,
  PricingRuleItem,
  AvailabilityRuleItem,
  WebsiteContentConfig,
  ReviewItem,
  AuditLogItem,
  AdminUser,
  MediaItem,
  GuestCategoryPolicy,
} from '../types';
import { TOURS_DATA, TESTIMONIALS } from '../data/tours';

// Initial default CMS content
export const DEFAULT_WEBSITE_CONTENT: WebsiteContentConfig = {
  heroHeadline: 'Curated Desert Safaris, Royal Dhows & VIP Concierge',
  heroSubtitle:
    'Experience the timeless dunes of Khor Al Adaid, the glittering waters of Doha Bay, and private VIP heritage expeditions crafted for distinguished travelers.',
  heroBadge: 'Exclusive Qatar Experiences • Licensed Luxury Tour Operator',
  heroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWXZL8dMJARl7egedwhd2V4ZTjc3fwO0H1KhNvBTKWXTUTcJb-J13eELb9M__jpCdvTX5xj8WDQwhGmiEVWbzO9SRaBGi0DwI9GQw3FsH28ziVrIcuO7bA_LNiS3vkzOm2701xDhQ8AKlfwZIzsZCX0G-QXevg2ndZLzRqvIZZIx3FXJg_YZ5mc0lWibEveKUVpmjmvkuA1HSW-RhzvMFOgIJQPlOjH29UJIBYVdjsydbaQd5f1wd',
  whatsappNumber: '+974 5512 8899',
  phoneContact: '+974 4499 5500',
  emailContact: 'concierge@mztourism.qa',
  addressText: 'Building 14, Porto Arabia Promenade, The Pearl-Qatar, Doha, State of Qatar',
  aboutStoryTitle: 'A Decade of Uncompromising Qatari Hospitality',
  aboutStoryP1:
    'Founded in Doha by luxury hospitality pioneers, MZ Tourism Qatar blends centuries-old Bedouin generosity with modern five-star concierge excellence.',
  aboutStoryP2:
    'Every journey—from private sunset dune bashing across UNESCO Khor Al Adaid to bespoke wooden dhow banquets along the illuminated Corniche—is orchestrated with absolute discretion, safety, and elegance.',
  seoMetaTitle: 'MZ Tourism Qatar | Luxury Tours, Desert Safaris & VIP Concierge Doha',
  seoMetaDescription:
    'Book premier desert safaris, royal dhow cruises, airport transit layover tours, and private luxury charters in Doha, Qatar with MZ Tourism.',
  cancellationPolicyText:
    'Free cancellation up to 24 hours before your scheduled tour departure. 100% refund for weather-related maritime or desert cancellations.',
  termsPolicyText:
    'All tours are conducted by Qatar Tourism certified guides in fully insured luxury vehicles adhering to civil defense and maritime regulations.',
  privacyPolicyText:
    'Your personal information and itinerary details are protected with strict confidentiality and never shared with third parties.',
};

// Initial default locations
export const DEFAULT_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-hamad-airport',
    name: 'Hamad International Airport (DOH)',
    address: 'Arrivals Gate 3 & VIP Terminal, Doha',
    category: 'airport',
    applicableExperiences: ['all'],
    canPickup: true,
    canDropoff: true,
    extraFeeQar: 0,
    isFreePickup: true,
    mapLink: 'https://maps.google.com/?q=Hamad+International+Airport',
    active: true,
  },
  {
    id: 'loc-west-bay',
    name: 'West Bay & Diplomatic Area Hotels',
    address: 'Four Seasons, St. Regis, Sheraton, W Doha, Ritz-Carlton',
    category: 'hotel',
    applicableExperiences: ['all'],
    canPickup: true,
    canDropoff: true,
    extraFeeQar: 0,
    isFreePickup: true,
    mapLink: 'https://maps.google.com/?q=West+Bay+Doha',
    active: true,
  },
  {
    id: 'loc-the-pearl',
    name: 'The Pearl-Qatar & Porto Arabia Marina',
    address: 'Porto Arabia Boardwalk & Marsa Malaz Kempinski',
    category: 'hotel',
    applicableExperiences: ['all'],
    canPickup: true,
    canDropoff: true,
    extraFeeQar: 0,
    isFreePickup: true,
    mapLink: 'https://maps.google.com/?q=The+Pearl+Qatar',
    active: true,
  },
  {
    id: 'loc-souq-waqif',
    name: 'Souq Waqif Heritage District',
    address: 'Souq Waqif Boutique Hotels & Corniche Roundabout, Doha',
    category: 'area',
    applicableExperiences: ['all'],
    canPickup: true,
    canDropoff: true,
    extraFeeQar: 0,
    isFreePickup: true,
    mapLink: 'https://maps.google.com/?q=Souq+Waqif+Doha',
    active: true,
  },
  {
    id: 'loc-sealine-resort',
    name: 'Sealine Beach & Desert Hub',
    address: 'Sealine Beach Resort Gate, Mesaieed',
    category: 'desert_hub',
    applicableExperiences: ['inland-sea', 'overnight-glamping', 'desert-quad'],
    canPickup: true,
    canDropoff: true,
    extraFeeQar: 100,
    isFreePickup: false,
    mapLink: 'https://maps.google.com/?q=Sealine+Beach+Resort',
    active: true,
  },
  {
    id: 'loc-banana-island-ferry',
    name: 'Banana Island Ferry Terminal (Al Shyoukh Port)',
    address: 'Corniche St, opposite Souq Waqif, Doha',
    category: 'port',
    applicableExperiences: ['all'],
    canPickup: true,
    canDropoff: true,
    extraFeeQar: 0,
    isFreePickup: true,
    mapLink: 'https://maps.google.com/?q=Banana+Island+Ferry+Terminal',
    active: true,
  },
  {
    id: 'loc-lusail-city',
    name: 'Lusail Marina & Waldorf Astoria',
    address: 'Lusail Marina Promenade, Lusail City',
    category: 'hotel',
    applicableExperiences: ['all'],
    canPickup: true,
    canDropoff: true,
    extraFeeQar: 0,
    isFreePickup: true,
    mapLink: 'https://maps.google.com/?q=Lusail+Marina',
    active: true,
  },
];

// Initial default vehicles
export const DEFAULT_VEHICLES: VehicleItem[] = [
  {
    id: 'veh-land-cruiser-v8',
    name: 'Toyota Land Cruiser V8 4x4 (Safari Spec)',
    type: '4x4_safari',
    passengerCapacity: 6,
    luggageCapacity: 4,
    plateNumber: 'QA-88219',
    driverName: 'Tariq Al-Kuwari',
    driverPhone: '+974 5512 8801',
    priceMultiplier: 1.0,
    fixedAddonQar: 0,
    active: true,
  },
  {
    id: 'veh-nissan-patrol',
    name: 'Nissan Patrol Super Safari Platinum',
    type: '4x4_safari',
    passengerCapacity: 6,
    luggageCapacity: 4,
    plateNumber: 'QA-77341',
    driverName: 'Hamad Mansoor',
    driverPhone: '+974 5512 8802',
    priceMultiplier: 1.0,
    fixedAddonQar: 0,
    active: true,
  },
  {
    id: 'veh-mercedes-maybach',
    name: 'Mercedes-Maybach S-Class Limousine',
    type: 'sedan_luxury',
    passengerCapacity: 3,
    luggageCapacity: 3,
    plateNumber: 'QA-VIP-01',
    driverName: 'Rashid Al-Naimi',
    driverPhone: '+974 5512 8803',
    priceMultiplier: 1.6,
    fixedAddonQar: 450,
    active: true,
  },
  {
    id: 'veh-cadillac-escalade',
    name: 'Cadillac Escalade Platinum Edition',
    type: 'suv_luxury',
    passengerCapacity: 6,
    luggageCapacity: 6,
    plateNumber: 'QA-VIP-07',
    driverName: 'Fahad Al-Marri',
    driverPhone: '+974 5512 8804',
    priceMultiplier: 1.4,
    fixedAddonQar: 300,
    active: true,
  },
  {
    id: 'veh-mercedes-v-class',
    name: 'Mercedes-Benz V-Class Exclusive Chauffeur',
    type: 'van_luxury',
    passengerCapacity: 7,
    luggageCapacity: 7,
    plateNumber: 'QA-55420',
    driverName: 'Nasser Al-Sulaiti',
    driverPhone: '+974 5512 8805',
    priceMultiplier: 1.3,
    fixedAddonQar: 200,
    active: true,
  },
  {
    id: 'veh-mercedes-sprinter',
    name: 'Mercedes-Benz Sprinter Executive Jet Class',
    type: 'minibus',
    passengerCapacity: 14,
    luggageCapacity: 14,
    plateNumber: 'QA-22991',
    driverName: 'Salem Al-Dosari',
    driverPhone: '+974 5512 8806',
    priceMultiplier: 1.5,
    fixedAddonQar: 350,
    active: true,
  },
  {
    id: 'veh-royal-dhow',
    name: 'Royal Handcrafted Wooden Teak Dhow',
    type: 'dhow',
    passengerCapacity: 45,
    luggageCapacity: 20,
    plateNumber: 'QA-MAR-12',
    driverName: 'Captain Jaber',
    driverPhone: '+974 5512 8807',
    priceMultiplier: 1.0,
    fixedAddonQar: 0,
    active: true,
  },
  {
    id: 'veh-azimut-yacht',
    name: '55ft Azimut Italian Flybridge Yacht',
    type: 'yacht',
    passengerCapacity: 12,
    luggageCapacity: 10,
    plateNumber: 'QA-YACHT-88',
    driverName: 'Captain Marco',
    driverPhone: '+974 5512 8808',
    priceMultiplier: 1.0,
    fixedAddonQar: 0,
    active: true,
  },
];

// Initial Pricing & Promo Rules
export const DEFAULT_PRICING_RULES: PricingRuleItem[] = [
  {
    id: 'promo-doha-luxury',
    code: 'DOHA10',
    title: 'Autumn & Winter Qatar Special 10% Off',
    type: 'percentage',
    value: 10,
    minSpendQar: 500,
    active: true,
  },
  {
    id: 'promo-vip-welcome',
    code: 'VIPWELCOME',
    title: 'VIP Concierge Welcome 100 QAR Discount',
    type: 'fixed',
    value: 100,
    minSpendQar: 800,
    active: true,
  },
];

// Initial Availability Rules
export const DEFAULT_AVAILABILITY_RULES: AvailabilityRuleItem[] = [
  {
    id: 'default-availability',
    title: 'Standard Operating & Booking Buffer Rules',
    blackoutDates: [],
    operatingHours: '06:00 - 23:30 Daily',
    cutoffHoursNotice: 3,
    maxDailyBookings: 50,
  },
];

// ----------------------------------------------------
// EXPERIENCES CRUD
// ----------------------------------------------------
export async function getExperiences(includeUnpublished = false): Promise<Tour[]> {
  const path = 'experiences';
  let fetchedTours: Tour[] = [];
  let dbSuccess = false;

  try {
    const coll = collection(db, path);
    const snap = await getDocs(coll);
    if (!snap.empty) {
      snap.forEach((d) => {
        const data = d.data() as Tour;
        fetchedTours.push({ ...data, id: d.id });
      });
      dbSuccess = true;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }

  // If DB returned records, update local cache
  if (dbSuccess && fetchedTours.length > 0) {
    try {
      localStorage.setItem('mz_experiences_cache', JSON.stringify(fetchedTours));
    } catch {
      // storage quota or unavailable
    }
  } else {
    // If DB returned empty or network failed, check persistent local cache
    try {
      const cached = localStorage.getItem('mz_experiences_cache');
      if (cached) {
        fetchedTours = JSON.parse(cached);
      }
    } catch {
      // ignore
    }

    // If still empty, fall back to initial TOURS_DATA catalog
    if (fetchedTours.length === 0) {
      fetchedTours = TOURS_DATA.map((t) => ({ ...t, status: t.status || 'published' }));
      try {
        localStorage.setItem('mz_experiences_cache', JSON.stringify(fetchedTours));
      } catch {
        // ignore
      }
    }
  }

  // Filter published vs unpublished
  if (includeUnpublished) {
    return fetchedTours;
  }
  return fetchedTours.filter((t) => t.status === 'published' || !t.status);
}

export async function saveExperience(tour: Tour): Promise<void> {
  const path = `experiences/${tour.id}`;
  const now = new Date().toISOString();
  const normalizedTour: Tour = {
    ...tour,
    status: tour.status || 'published',
    updatedAt: now,
    createdAt: tour.createdAt || now,
    publishedAt: tour.status === 'published' ? (tour.publishedAt || now) : tour.publishedAt,
  };

  // 1. Write to Firestore
  try {
    const docRef = doc(db, 'experiences', tour.id);
    await setDoc(docRef, normalizedTour, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  // 2. Synchronize to local persistent cache mirror so edits survive any refresh or network delay
  try {
    const cached = localStorage.getItem('mz_experiences_cache');
    let list: Tour[] = cached ? JSON.parse(cached) : [...TOURS_DATA];
    const idx = list.findIndex((t) => t.id === tour.id);
    if (idx >= 0) {
      list[idx] = normalizedTour;
    } else {
      list.unshift(normalizedTour);
    }
    localStorage.setItem('mz_experiences_cache', JSON.stringify(list));
  } catch {
    // ignore
  }

  // 3. Broadcast global event so public site and preview re-render immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mz-data-updated', { detail: { type: 'experiences', tour: normalizedTour } }));
  }
}

export async function deleteExperience(id: string): Promise<void> {
  const path = `experiences/${id}`;
  try {
    await deleteDoc(doc(db, 'experiences', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
  try {
    const cached = localStorage.getItem('mz_experiences_cache');
    if (cached) {
      const list: Tour[] = JSON.parse(cached);
      localStorage.setItem('mz_experiences_cache', JSON.stringify(list.filter((t) => t.id !== id)));
    }
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mz-data-updated', { detail: { type: 'experiences', id } }));
  }
}

export async function duplicateExperience(source: Tour): Promise<Tour> {
  const newId = `${source.id}-copy-${Date.now().toString(36)}`;
  const duplicate: Tour = {
    ...source,
    id: newId,
    title: `${source.title} (Copy)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveExperience(duplicate);
  return duplicate;
}

// ----------------------------------------------------
// BOOKINGS CRUD
// ----------------------------------------------------
export async function getBookings(): Promise<BookingData[]> {
  const path = 'bookings';
  try {
    const coll = collection(db, path);
    const snap = await getDocs(coll);
    const list: BookingData[] = [];
    snap.forEach((d) => {
      list.push({ ...d.data(), id: d.id } as BookingData);
    });
    return list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveBooking(booking: BookingData): Promise<string> {
  const id = booking.id || booking.bookingRef || `MZ-${Date.now()}`;
  const path = `bookings/${id}`;
  const dataToSave: BookingData = {
    ...booking,
    id,
    bookingRef: booking.bookingRef || id,
    status: booking.status || 'pending',
    paymentStatus: booking.paymentStatus || 'pending',
    amountPaidQar: booking.amountPaidQar || 0,
    remainingBalanceQar: booking.remainingBalanceQar ?? booking.totalPriceQar,
    bookingSource: booking.bookingSource || 'website',
    createdAt: booking.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'bookings', id);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  // Sync to local cache
  try {
    const stored = localStorage.getItem('mz_tourism_bookings');
    const list: BookingData[] = stored ? JSON.parse(stored) : [];
    const idx = list.findIndex((b) => b.id === id || b.bookingRef === dataToSave.bookingRef);
    if (idx >= 0) list[idx] = dataToSave;
    else list.unshift(dataToSave);
    localStorage.setItem('mz_tourism_bookings', JSON.stringify(list));
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mz-data-updated', { detail: { type: 'bookings', booking: dataToSave } }));
  }

  return id;
}

export async function updateBooking(id: string, updates: Partial<BookingData>): Promise<void> {
  const path = `bookings/${id}`;
  try {
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteBooking(id: string): Promise<void> {
  const path = `bookings/${id}`;
  try {
    await deleteDoc(doc(db, 'bookings', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// LOCATIONS CRUD
// ----------------------------------------------------
export async function getLocations(): Promise<LocationItem[]> {
  const path = 'locations';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return DEFAULT_LOCATIONS;
    const items: LocationItem[] = [];
    snap.forEach((d) => items.push({ ...d.data(), id: d.id } as LocationItem));
    return items.length > 0 ? items : DEFAULT_LOCATIONS;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return DEFAULT_LOCATIONS;
  }
}

export async function saveLocation(loc: LocationItem): Promise<void> {
  const path = `locations/${loc.id}`;
  try {
    await setDoc(doc(db, 'locations', loc.id), loc, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteLocation(id: string): Promise<void> {
  const path = `locations/${id}`;
  try {
    await deleteDoc(doc(db, 'locations', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// VEHICLES CRUD
// ----------------------------------------------------
export async function getVehicles(): Promise<VehicleItem[]> {
  const path = 'vehicles';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return DEFAULT_VEHICLES;
    const items: VehicleItem[] = [];
    snap.forEach((d) => items.push({ ...d.data(), id: d.id } as VehicleItem));
    return items.length > 0 ? items : DEFAULT_VEHICLES;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return DEFAULT_VEHICLES;
  }
}

export async function saveVehicle(v: VehicleItem): Promise<void> {
  const path = `vehicles/${v.id}`;
  try {
    await setDoc(doc(db, 'vehicles', v.id), v, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  const path = `vehicles/${id}`;
  try {
    await deleteDoc(doc(db, 'vehicles', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// PRICING RULES CRUD
// ----------------------------------------------------
export async function getPricingRules(): Promise<PricingRuleItem[]> {
  const path = 'pricing_rules';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return DEFAULT_PRICING_RULES;
    const items: PricingRuleItem[] = [];
    snap.forEach((d) => items.push({ ...d.data(), id: d.id } as PricingRuleItem));
    return items.length > 0 ? items : DEFAULT_PRICING_RULES;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return DEFAULT_PRICING_RULES;
  }
}

export async function savePricingRule(rule: PricingRuleItem): Promise<void> {
  const path = `pricing_rules/${rule.id}`;
  try {
    await setDoc(doc(db, 'pricing_rules', rule.id), rule, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deletePricingRule(id: string): Promise<void> {
  const path = `pricing_rules/${id}`;
  try {
    await deleteDoc(doc(db, 'pricing_rules', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// AVAILABILITY RULES CRUD
// ----------------------------------------------------
export async function getAvailabilityRules(): Promise<AvailabilityRuleItem[]> {
  const path = 'availability_rules';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return DEFAULT_AVAILABILITY_RULES;
    const items: AvailabilityRuleItem[] = [];
    snap.forEach((d) => items.push({ ...d.data(), id: d.id } as AvailabilityRuleItem));
    return items.length > 0 ? items : DEFAULT_AVAILABILITY_RULES;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return DEFAULT_AVAILABILITY_RULES;
  }
}

export async function saveAvailabilityRule(rule: AvailabilityRuleItem): Promise<void> {
  const path = `availability_rules/${rule.id}`;
  try {
    await setDoc(doc(db, 'availability_rules', rule.id), rule, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// ----------------------------------------------------
// CUSTOMERS CRUD
// ----------------------------------------------------
export async function getCustomers(): Promise<CustomerRecord[]> {
  const path = 'customers';
  try {
    const snap = await getDocs(collection(db, path));
    const items: CustomerRecord[] = [];
    snap.forEach((d) => items.push({ ...d.data(), id: d.id } as CustomerRecord));
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveCustomer(c: CustomerRecord): Promise<void> {
  const path = `customers/${c.id}`;
  try {
    await setDoc(doc(db, 'customers', c.id), c, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// ----------------------------------------------------
// WEBSITE CMS CONTENT CRUD
// ----------------------------------------------------
export async function getWebsiteContent(): Promise<WebsiteContentConfig> {
  const path = 'website_content/main';
  try {
    const snap = await getDoc(doc(db, 'website_content', 'main'));
    if (snap.exists()) {
      const merged = { ...DEFAULT_WEBSITE_CONTENT, ...(snap.data().data || snap.data()) };
      try {
        localStorage.setItem('mz_website_content_cache', JSON.stringify(merged));
      } catch {}
      return merged;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }

  // Fallback to local persistent cache
  try {
    const cached = localStorage.getItem('mz_website_content_cache');
    if (cached) {
      return { ...DEFAULT_WEBSITE_CONTENT, ...JSON.parse(cached) };
    }
  } catch {}

  return DEFAULT_WEBSITE_CONTENT;
}

export async function saveWebsiteContent(
  content: WebsiteContentConfig,
  adminEmail: string
): Promise<void> {
  const path = 'website_content/main';
  const payload = {
    section: 'main',
    data: content,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };

  try {
    await setDoc(doc(db, 'website_content', 'main'), payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  // Local storage mirror
  try {
    localStorage.setItem('mz_website_content_cache', JSON.stringify(content));
  } catch {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mz-data-updated', { detail: { type: 'website_content', content } }));
  }
}

// ----------------------------------------------------
// GUEST POLICIES CRUD
// ----------------------------------------------------
export const DEFAULT_GUEST_POLICIES: GuestCategoryPolicy[] = [
  {
    id: 'adults',
    title: 'Adult Guests (Age 12+)',
    description: 'Standard full-fare passengers. Applicable for all dune bashing, dhow cruises, and yacht charters.',
    minAge: 12,
    maxAge: 99,
    pricePercentage: 100,
  },
  {
    id: 'children',
    title: 'Children (Age 3 to 11)',
    description: 'Reduced fare passenger tier. Special safety belts required for desert dune traversing.',
    minAge: 3,
    maxAge: 11,
    pricePercentage: 60,
  },
  {
    id: 'infants',
    title: 'Infants (Under 3 Years)',
    description: 'Complimentary on city tours and royal dhow cruises with prior notification. Gentle panoramic route substituted for desert safari.',
    minAge: 0,
    maxAge: 2,
    pricePercentage: 0,
  },
];

export async function getGuestPolicies(): Promise<GuestCategoryPolicy[]> {
  const path = 'website_content/guest_policies';
  try {
    const snap = await getDoc(doc(db, 'website_content', 'guest_policies'));
    if (snap.exists() && snap.data().policies) {
      return snap.data().policies as GuestCategoryPolicy[];
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
  return DEFAULT_GUEST_POLICIES;
}

export async function saveGuestPolicies(policies: GuestCategoryPolicy[], adminEmail: string): Promise<void> {
  const path = 'website_content/guest_policies';
  try {
    await setDoc(doc(db, 'website_content', 'guest_policies'), {
      section: 'guest_policies',
      policies,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

// ----------------------------------------------------
// MEDIA LIBRARY CRUD
// ----------------------------------------------------
export async function getMediaItems(): Promise<MediaItem[]> {
  const path = 'media_library';
  try {
    const snap = await getDocs(collection(db, path));
    const items: MediaItem[] = [];
    snap.forEach((d) => items.push({ ...d.data(), id: d.id } as MediaItem));
    if (items.length > 0) {
      try {
        localStorage.setItem('mz_media_library_cache', JSON.stringify(items));
      } catch {}
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }

  try {
    const cached = localStorage.getItem('mz_media_library_cache');
    if (cached) return JSON.parse(cached);
  } catch {}

  return [];
}

export async function getMediaItem(id: string): Promise<MediaItem | null> {
  const path = `media_library/${id}`;
  try {
    const snap = await getDoc(doc(db, 'media_library', id));
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as MediaItem;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
  return null;
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  const path = `media_library/${item.id}`;

  if (!auth.currentUser) {
    throw new Error('Authentication required: An authorized administrator session is required to save media items.');
  }

  try {
    await setDoc(doc(db, 'media_library', item.id), item, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }

  try {
    const cached = localStorage.getItem('mz_media_library_cache');
    const list: MediaItem[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex((m) => m.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.unshift(item);
    localStorage.setItem('mz_media_library_cache', JSON.stringify(list));
  } catch {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mz-data-updated', { detail: { type: 'media', item } }));
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  const path = `media_library/${id}`;

  if (!auth.currentUser) {
    throw new Error('Authentication required: An authorized administrator session is required to delete media items.');
  }

  try {
    await deleteDoc(doc(db, 'media_library', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }

  try {
    const cached = localStorage.getItem('mz_media_library_cache');
    if (cached) {
      const list: MediaItem[] = JSON.parse(cached);
      localStorage.setItem('mz_media_library_cache', JSON.stringify(list.filter((m) => m.id !== id)));
    }
  } catch {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mz-data-updated', { detail: { type: 'media', id } }));
  }
}

// ----------------------------------------------------
// REVIEWS CRUD
// ----------------------------------------------------
export async function getReviews(all = false): Promise<ReviewItem[]> {
  const path = 'reviews';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return TESTIMONIALS.map((t, i) => ({
        id: `rev-${i + 1}`,
        name: t.name,
        location: t.location,
        date: t.date,
        rating: t.rating,
        text: t.text,
        tour: t.tour,
        initials: t.initials,
        isApproved: true,
      }));
    }
    const items: ReviewItem[] = [];
    snap.forEach((d) => {
      const data = { ...d.data(), id: d.id } as ReviewItem;
      if (all || data.isApproved) {
        items.push(data);
      }
    });
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveReview(review: ReviewItem): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteReview(id: string): Promise<void> {
  const path = `reviews/${id}`;
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// AUDIT LOGS
// ----------------------------------------------------
export async function getAuditLogs(): Promise<AuditLogItem[]> {
  const path = 'audit_logs';
  try {
    const snap = await getDocs(collection(db, path));
    const items: AuditLogItem[] = [];
    snap.forEach((d) => items.push({ ...d.data(), id: d.id } as AuditLogItem));
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function logAudit(action: string, performedBy: string, details: string): Promise<void> {
  const id = `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const path = `audit_logs/${id}`;
  try {
    await setDoc(doc(db, 'audit_logs', id), {
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Audit logging is non-blocking
    console.warn('Audit log write skipped or restricted:', err);
  }
}

// ----------------------------------------------------
// ADMIN USERS
// ----------------------------------------------------
export async function getAdmins(): Promise<AdminUser[]> {
  const path = 'admins';
  try {
    const snap = await getDocs(collection(db, path));
    const list: AdminUser[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AdminUser));
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveAdmin(admin: AdminUser): Promise<void> {
  const path = `admins/${admin.id}`;
  try {
    await setDoc(doc(db, 'admins', admin.id), admin, { merge: true });
    // Also store by email key for instant Zero-Trust O(1) security rule evaluation
    if (admin.email) {
      const emailDocId = admin.email.toLowerCase().trim();
      if (emailDocId !== admin.id) {
        await setDoc(doc(db, 'admins', emailDocId), { ...admin, id: emailDocId }, { merge: true });
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteAdmin(id: string, email?: string): Promise<void> {
  const path = `admins/${id}`;
  try {
    await deleteDoc(doc(db, 'admins', id));
    if (email) {
      await deleteDoc(doc(db, 'admins', email.toLowerCase().trim()));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ----------------------------------------------------
// SEED INITIAL DATABASE CONTENT
// ----------------------------------------------------
export async function seedInitialDataIfEmpty(force = false): Promise<boolean> {
  try {
    const currentUser = auth.currentUser;
    const isSuperadmin = currentUser?.email?.toLowerCase().trim() === ROOT_ADMIN_EMAIL.toLowerCase().trim();
    if (!currentUser && !force) {
      // Unauthenticated visitors should not attempt mutations
      return false;
    }

    const expSnap = await getDocs(collection(db, 'experiences'));
    if (expSnap.empty) {
      console.log('Seeding initial experiences into Firestore...');
      for (const tour of TOURS_DATA) {
        await setDoc(doc(db, 'experiences', tour.id), {
          ...tour,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    const locSnap = await getDocs(collection(db, 'locations'));
    if (locSnap.empty) {
      console.log('Seeding initial locations into Firestore...');
      for (const loc of DEFAULT_LOCATIONS) {
        await setDoc(doc(db, 'locations', loc.id), loc);
      }
    }

    const vehSnap = await getDocs(collection(db, 'vehicles'));
    if (vehSnap.empty) {
      console.log('Seeding initial vehicles into Firestore...');
      for (const v of DEFAULT_VEHICLES) {
        await setDoc(doc(db, 'vehicles', v.id), v);
      }
    }

    const contentSnap = await getDoc(doc(db, 'website_content', 'main'));
    if (!contentSnap.exists()) {
      console.log('Seeding initial website CMS content...');
      await setDoc(doc(db, 'website_content', 'main'), {
        section: 'main',
        data: DEFAULT_WEBSITE_CONTENT,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system_bootstrap',
      });
    }

    const pricingSnap = await getDocs(collection(db, 'pricing_rules'));
    if (pricingSnap.empty) {
      for (const rule of DEFAULT_PRICING_RULES) {
        await setDoc(doc(db, 'pricing_rules', rule.id), rule);
      }
    }

    const availSnap = await getDocs(collection(db, 'availability_rules'));
    if (availSnap.empty) {
      for (const rule of DEFAULT_AVAILABILITY_RULES) {
        await setDoc(doc(db, 'availability_rules', rule.id), rule);
      }
    }

    // Seed initial root admin
    const rootAdminDoc = await getDoc(doc(db, 'admins', 'root-superadmin'));
    if (!rootAdminDoc.exists()) {
      await setDoc(doc(db, 'admins', 'root-superadmin'), {
        email: ROOT_ADMIN_EMAIL,
        displayName: 'Root Administrator',
        role: 'superadmin',
        active: true,
        createdAt: new Date().toISOString(),
      });
    }

    return true;
  } catch (err) {
    console.warn('Database auto-seed check notice:', err);
    return false;
  }
}
