export type Currency = 'QAR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rateAgainstQar: number; // Multiply QAR by this to get local amount
}

export type ExperienceCategory =
  | 'desert'
  | 'sea'
  | 'culture'
  | 'vip'
  | 'airport_transfers'
  | 'hotel_transfers'
  | 'resort_stays'
  | 'horse_riding'
  | 'parties'
  | 'desert_tents'
  | 'saudi_trips'
  | 'bahrain_trips'
  | 'gcc_trips';

export interface OptionalAddon {
  id: string;
  title: string;
  priceQar: number;
  perPerson: boolean;
  description?: string;
}

export interface Tour {
  id: string;
  title: string;
  subtitle: string;
  category: ExperienceCategory;
  categoryLabel: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  location: string;
  basePriceQar: number;
  childPriceQar?: number;
  infantPriceQar?: number;
  privateBookingAllowed?: boolean;
  groupBookingAllowed?: boolean;
  badge?: string;
  image: string;
  alt?: string;
  gallery?: string[];
  shortDescription: string;
  fullDescription: string;
  amenities: string[];
  vehicle: string;
  highlights: string[];
  itinerary: {
    time: string;
    title: string;
    description: string;
  }[];
  included: string[];
  notIncluded: string[];
  minGuests?: number;
  maxGuests?: number;
  timeSlots?: string[];
  pickupDropoffOptions?: string[];
  optionalAddons?: OptionalAddon[];
  cancellationPolicy?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: 'published' | 'draft' | 'archived';
  publishedAt?: string;
  publishedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  sizeKb: number;
  type: string;
  category?: 'experience' | 'hero' | 'vehicle' | 'logo' | 'general';
  dimensions?: string;
  uploadedBy?: string;
  createdAt: string;
  usedIn?: string[];
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  category: 'airport' | 'hotel' | 'area' | 'port' | 'desert_hub' | 'custom';
  applicableExperiences: string[]; // Tour IDs or ['all']
  canPickup: boolean;
  canDropoff: boolean;
  extraFeeQar: number;
  isFreePickup: boolean;
  mapLink?: string;
  active: boolean;
}

export interface VehicleItem {
  id: string;
  name: string;
  type:
    | '4x4_safari'
    | 'suv_luxury'
    | 'sedan_luxury'
    | 'van_luxury'
    | 'minibus'
    | 'bus'
    | 'yacht'
    | 'dhow'
    | 'custom';
  passengerCapacity: number;
  luggageCapacity: number;
  plateNumber?: string;
  driverName?: string;
  driverPhone?: string;
  priceMultiplier: number;
  fixedAddonQar: number;
  active: boolean;
}

export interface GuestCategoryPolicy {
  id: string;
  title: string;
  description: string;
  minAge: number;
  maxAge: number;
  pricePercentage: number;
}

export type PaymentStatus = 'pending' | 'deposit_paid' | 'paid' | 'refunded' | 'cancelled';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type BookingSource = 'website' | 'whatsapp' | 'concierge' | 'ota' | 'phone';

export interface BookingData {
  id?: string;
  bookingRef: string;
  tourId: string;
  tourTitle: string;
  date: string;
  departureWindow: string;
  guestsCount: number;
  adultsCount?: number;
  childrenCount?: number;
  infantsCount?: number;
  vehicleType: string;
  vehicleId?: string;
  pickupLocation: string;
  dropoffLocation?: string;
  flightNumber?: string;
  guideLanguage: string;
  specialRequests?: string;
  fullName: string;
  phone: string;
  email: string;
  country?: string;
  childSeat: boolean;
  gourmetMeal: boolean;
  totalPriceQar: number;
  amountPaidQar?: number;
  remainingBalanceQar?: number;
  paymentStatus?: PaymentStatus;
  status?: BookingStatus;
  internalNotes?: string;
  bookingSource?: BookingSource;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingRuleItem {
  id: string;
  code: string;
  title: string;
  type: 'percentage' | 'fixed' | 'seasonal';
  value: number;
  startDate?: string;
  endDate?: string;
  minSpendQar?: number;
  active: boolean;
}

export interface AvailabilityRuleItem {
  id: string;
  title: string;
  blackoutDates: string[];
  operatingHours: string;
  cutoffHoursNotice: number;
  maxDailyBookings: number;
}

export interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  vipStatus?: boolean;
  totalBookings: number;
  totalSpendQar: number;
  notes?: string;
  lastBookingDate?: string;
}

export interface WebsiteContentConfig {
  heroHeadline: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImage: string;
  whatsappNumber: string;
  phoneContact: string;
  emailContact: string;
  addressText: string;
  aboutStoryTitle: string;
  aboutStoryP1: string;
  aboutStoryP2: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  cancellationPolicyText: string;
  termsPolicyText: string;
  privacyPolicyText: string;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'manager' | 'operations' | 'concierge';
  active: boolean;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  tour: string;
  initials?: string;
  isApproved: boolean;
  createdAt?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface Testimonial {
  name: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  tour: string;
  initials: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
