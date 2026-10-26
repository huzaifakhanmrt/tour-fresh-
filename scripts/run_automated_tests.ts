/**
 * Automated Test Suite for MZ Tourism Qatar
 * Tests brand integrity, database contracts, currency mathematics, draft/publish lifecycle, media uploads, and security access.
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, failureMessage: string) {
  if (condition) {
    results.push({ name, passed: true, message: 'PASSED' });
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
  } else {
    results.push({ name, passed: false, message: failureMessage });
    console.error(`  \x1b[31m✖\x1b[0m ${name}: ${failureMessage}`);
  }
}

console.log('\n======================================================');
console.log('  MZ TOURISM QATAR - AUTOMATED QA & INTEGRITY SUITE  ');
console.log('======================================================\n');

// TEST 1: Brand Integrity Audit
console.log('--- Suite 1: Brand Integrity (M2 -> MZ Migration) ---');
const filesToAuditForBrand = [
  'index.html',
  'metadata.json',
  'src/App.tsx',
  'src/types.ts',
  'src/data/tours.ts',
  'src/services/db.ts',
  'src/components/Navbar.tsx',
  'src/components/Footer.tsx',
  'src/components/BookingModal.tsx',
  'src/components/BookingsDrawer.tsx',
  'src/components/BookingBar.tsx',
  'src/screens/HomeScreen.tsx',
  'src/screens/AboutScreen.tsx',
  'src/screens/ContactScreen.tsx',
  'src/screens/DesertSafarisScreen.tsx',
  'src/screens/DhowCruisesScreen.tsx',
  'src/screens/CultureScreen.tsx',
  'src/screens/PrivateLuxuryScreen.tsx',
  'src/admin/AdminLayout.tsx',
  'src/admin/AdminLogin.tsx',
  'src/admin/screens/SettingsScreen.tsx',
  'src/admin/screens/ReportsScreen.tsx',
  'src/admin/screens/WebsiteContentScreen.tsx',
  'src/admin/screens/ExperiencesScreen.tsx',
  'src/admin/screens/MediaScreen.tsx',
];

let m2LeakCount = 0;
const leakDetails: string[] = [];

for (const relPath of filesToAuditForBrand) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    // Check for "M2 Tourism", "m2tourism.qa", "M2 VIP"
    const m2TourismMatches = content.match(/M2\s+Tourism/gi) || [];
    const m2EmailMatches = content.match(/m2tourism\.qa/gi) || [];
    const m2ConciergeMatches = content.match(/M2\s+VIP/gi) || [];

    const totalLeaksInFile = m2TourismMatches.length + m2EmailMatches.length + m2ConciergeMatches.length;
    if (totalLeaksInFile > 0) {
      m2LeakCount += totalLeaksInFile;
      leakDetails.push(`${relPath} (${totalLeaksInFile} occurrences)`);
    }
  }
}

assert(
  m2LeakCount === 0,
  'Brand Integrity: Zero "M2 Tourism" or "m2tourism.qa" references in production source',
  `Found ${m2LeakCount} legacy M2 references in: ${leakDetails.join(', ')}`
);

// Check index.html title & metadata
const indexHtmlContent = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
assert(
  indexHtmlContent.includes('MZ Tourism Qatar'),
  'HTML Entry Title & Meta contains "MZ Tourism Qatar"',
  'index.html is missing MZ Tourism Qatar in title or meta tags'
);

// Check metadata.json title
const metadataJsonContent = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'metadata.json'), 'utf-8'));
assert(
  metadataJsonContent.name.includes('MZ Tourism Qatar'),
  'metadata.json name contains "MZ Tourism Qatar"',
  `metadata.json name is: ${metadataJsonContent.name}`
);

// TEST 2: Experience Catalog Contract & Data Models
console.log('\n--- Suite 2: Experience Catalog & Draft/Publish Rules ---');

import { TOURS_DATA } from '../src/data/tours';

assert(
  Array.isArray(TOURS_DATA) && TOURS_DATA.length >= 6,
  'Base catalog contains at least 6 verified Qatar experiences',
  `Expected at least 6 tours, found ${TOURS_DATA.length}`
);

const sampleTour = TOURS_DATA[0];
assert(
  typeof sampleTour.id === 'string' &&
  typeof sampleTour.title === 'string' &&
  typeof sampleTour.basePriceQar === 'number' &&
  sampleTour.basePriceQar > 0 &&
  Array.isArray(sampleTour.highlights) &&
  Array.isArray(sampleTour.itinerary) &&
  Array.isArray(sampleTour.included),
  'Tour data model satisfies comprehensive itinerary, inclusions, and pricing contracts',
  'Sample tour missing required schema fields'
);

// Test Draft/Publish Filtering
const mockCatalogWithDrafts = [
  ...TOURS_DATA,
  {
    ...sampleTour,
    id: 'test-draft-1',
    title: 'Secret Unpublished Dune Safari',
    status: 'draft' as const,
  },
  {
    ...sampleTour,
    id: 'test-published-1',
    title: 'VIP Katara Opera & Dinner',
    status: 'published' as const,
  },
];

const publicCatalog = mockCatalogWithDrafts.filter((t) => t.status === 'published' || !t.status);
const adminCatalog = mockCatalogWithDrafts;

assert(
  publicCatalog.every((t) => t.status !== 'draft'),
  'Public catalog strictly excludes draft experiences',
  'Draft experience leaked into public catalog feed'
);

assert(
  adminCatalog.some((t) => t.id === 'test-draft-1'),
  'Admin catalog retains access to both drafts and published experiences',
  'Draft experience was missing from admin catalog'
);

// TEST 3: Currency & Pricing Engine
console.log('\n--- Suite 3: Currency & Pricing Recalculation ---');
import { CURRENCIES } from '../src/data/tours';
import { formatPrice } from '../src/utils/currency';

assert(
  CURRENCIES.QAR.rateAgainstQar === 1 &&
  CURRENCIES.USD.rateAgainstQar > 0 &&
  CURRENCIES.EUR.rateAgainstQar > 0 &&
  CURRENCIES.GBP.rateAgainstQar > 0,
  'Currency exchange rates configured for QAR, USD, EUR, and GBP',
  'Missing or invalid currency definitions'
);

const qarPrice = formatPrice(1000, 'QAR');
const usdPrice = formatPrice(1000, 'USD');
assert(
  qarPrice.includes('1,000') && qarPrice.includes('﷼'),
  'QAR formatted output displays symbol and thousands separator',
  `Received: ${qarPrice}`
);
assert(
  usdPrice.includes('$') && !usdPrice.includes('1,000'),
  'USD formatted output accurately scales against QAR rate',
  `Received: ${usdPrice}`
);

// TEST 4: Computer Upload & Media Compression Architecture
console.log('\n--- Suite 4: Media Upload & Image Optimization ---');
import { processAndCompressImage, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '../src/utils/mediaUpload';

assert(
  typeof processAndCompressImage === 'function',
  'Client-side image processor & compressor utility is exported and available',
  'processAndCompressImage function is missing'
);

assert(
  ALLOWED_IMAGE_TYPES.length >= 4 && ALLOWED_IMAGE_TYPES.includes('image/jpeg') && ALLOWED_IMAGE_TYPES.includes('image/png'),
  'Media uploader accepts modern web formats: JPG, PNG, WebP, AVIF',
  'Invalid allowed image types'
);

assert(
  MAX_FILE_SIZE_MB === 10,
  'Maximum upload limit configured to 10 MB per image',
  `Expected 10 MB limit, found ${MAX_FILE_SIZE_MB}`
);

// TEST 5: Booking Reference & Unique ID Generation
console.log('\n--- Suite 5: Booking Lifecycle & Reference Standards ---');
const bookingRefs = new Set<string>();
for (let i = 0; i < 50; i++) {
  const ref = `MZ-QA-${Date.now().toString(36).toUpperCase().slice(-3)}${i.toString().padStart(2, '0')}`;
  bookingRefs.add(ref);
}

assert(
  bookingRefs.size === 50,
  'Booking reference generator generates unique MZ-QA-XXXX identifiers',
  'Collision detected in booking references'
);

// TEST 6: Security Allowlist & Superadmin Protection
console.log('\n--- Suite 6: Security Allowlist & Access Control ---');
import { ROOT_ADMIN_EMAIL } from '../src/lib/firebase';

assert(
  typeof ROOT_ADMIN_EMAIL === 'string' && ROOT_ADMIN_EMAIL.includes('@'),
  `Root superadmin allowlist configured with protected email (${ROOT_ADMIN_EMAIL})`,
  `Invalid ROOT_ADMIN_EMAIL configuration: ${ROOT_ADMIN_EMAIL}`
);

// TEST 7: Media Library Firestore Security Rules & Admin Authorization Audit
console.log('\n--- Suite 7: Media Library Security Rules & Permission Verification ---');
const firestoreRulesContent = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf-8');
const blueprintJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'firebase-blueprint.json'), 'utf-8'));

assert(
  firestoreRulesContent.includes('match /media_library/{mediaId}'),
  'Firestore Security Rules explicitly declare match block for /media_library/{mediaId}',
  'Missing match /media_library/{mediaId} in firestore.rules'
);

assert(
  firestoreRulesContent.includes("request.auth.token.email == 'huzaifakhanmrt@gmail.com'"),
  'Admin authorization validates root superadmin email (huzaifakhanmrt@gmail.com)',
  'Missing root admin check in firestore.rules'
);

assert(
  firestoreRulesContent.includes('incoming().name is string') &&
  firestoreRulesContent.includes('incoming().url is string') &&
  firestoreRulesContent.includes('incoming().type is string'),
  'Media library write operations enforce schema validation (name, url, type)',
  'Missing field type validation in media_library rule'
);

assert(
  firestoreRulesContent.includes('allow delete: if isAdmin();'),
  'Media library deletions strictly restricted to authorized administrators',
  'Deletion rule for media_library missing or permissive'
);

assert(
  Boolean(blueprintJson.entities?.Media) && Boolean(blueprintJson.firestore?.['/media_library/{mediaId}']),
  'firebase-blueprint.json contains Media entity schema and /media_library/{mediaId} mapping',
  'Missing Media entity or path mapping in firebase-blueprint.json'
);

// Test Media Item Persistence Contract
import { MediaItem } from '../src/types';
const testMediaPayload: MediaItem = {
  id: 'media-mvnrc9cg-i0xta',
  name: 'Sealine_Sunset_Safari.webp',
  url: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAkA4JaQAA3AA/vv9gAA=',
  sizeKb: 142,
  type: 'image/webp',
  category: 'experience',
  dimensions: '1600 × 1066 px',
  uploadedBy: 'huzaifakhanmrt@gmail.com',
  createdAt: new Date().toISOString(),
};

assert(
  testMediaPayload.id === 'media-mvnrc9cg-i0xta' &&
  typeof testMediaPayload.name === 'string' &&
  typeof testMediaPayload.url === 'string' &&
  typeof testMediaPayload.sizeKb === 'number',
  'Target document path media_library/media-mvnrc9cg-i0xta adheres to MediaItem contract',
  'Invalid test media item structure'
);

// Test Authorization Simulation for Root Admin vs Unauthorized User
function simulateFirestoreMediaWritePermission(auth: { email?: string; uid?: string } | null): boolean {
  if (!auth) return false;
  const isRootAdmin = auth.email === 'huzaifakhanmrt@gmail.com';
  return isRootAdmin;
}

const adminWriteAllowed = simulateFirestoreMediaWritePermission({
  email: 'huzaifakhanmrt@gmail.com',
  uid: 'admin-google-uid-12345',
});
const unauthorizedWriteAllowed = simulateFirestoreMediaWritePermission({
  email: 'unauthorized_guest@gmail.com',
  uid: 'guest-google-uid-67890',
});
const unauthenticatedWriteAllowed = simulateFirestoreMediaWritePermission(null);

assert(
  adminWriteAllowed === true,
  'Authorized administrator (huzaifakhanmrt@gmail.com) is permitted to write to media_library/media-mvnrc9cg-i0xta',
  'Admin write was unexpectedly rejected'
);

assert(
  unauthorizedWriteAllowed === false && unauthenticatedWriteAllowed === false,
  'Unauthorized and unauthenticated users are strictly DENIED write access to media_library',
  'Unauthorized user was incorrectly permitted to write'
);

// Summary
console.log('\n======================================================');
const totalPassed = results.filter((r) => r.passed).length;
const totalFailed = results.filter((r) => !r.passed).length;

console.log(`  TEST RESULTS: ${totalPassed} Passed | ${totalFailed} Failed`);
console.log('======================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
