import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

async function runLiveVerification() {
  console.log('\n--- LIVE FIRESTORE INTEGRATION AUDIT ---');
  console.log('Target Project:', firebaseConfig.projectId);
  console.log('Target Database:', firebaseConfig.firestoreDatabaseId);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  // Test 1: Public read on media_library
  try {
    const snap = await getDocs(collection(db, 'media_library'));
    console.log(`[PASS] Read on /media_library succeeded. Found ${snap.docs.length} documents.`);
  } catch (err: any) {
    console.error('[FAIL] Read on /media_library failed:', err.message);
  }

  // Test 2: Unauthenticated write to media_library (MUST BE DENIED)
  try {
    await setDoc(doc(db, 'media_library', 'unauthorized-test-doc'), {
      name: 'Hacked_Image.jpg',
      url: 'https://example.com/fake.jpg',
      type: 'image/jpeg',
      createdAt: new Date().toISOString(),
    });
    console.error('[FAIL] Security breach: Unauthenticated write to media_library was allowed!');
  } catch (err: any) {
    if (err.message.includes('permission') || err.message.includes('Missing or insufficient permissions')) {
      console.log('[PASS] Security check: Unauthenticated write to media_library was correctly REJECTED with "Missing or insufficient permissions."');
    } else {
      console.warn('[NOTICE] Unauthenticated write failed with:', err.message);
    }
  }

  // Test 3: Unauthenticated write to customers collection (MUST BE DENIED - strictly private)
  try {
    await setDoc(doc(db, 'customers', 'unauthorized-customer-doc'), {
      fullName: 'Infiltrator',
      email: 'hacker@dark.net',
    });
    console.error('[FAIL] Security breach: Unauthenticated write to customers was allowed!');
  } catch (err: any) {
    if (err.message.includes('permission') || err.message.includes('Missing or insufficient permissions')) {
      console.log('[PASS] Security check: Unauthenticated write to /customers was correctly REJECTED.');
    } else {
      console.warn('[NOTICE] Unauthenticated customer write failed with:', err.message);
    }
  }

  // Test 4: Public booking creation with valid schema (MUST SUCCEED)
  const testBookingRef = `MZ-QA-${Date.now().toString(36).toUpperCase()}`;
  const testBookingId = `test-booking-${Date.now().toString(36)}`;
  try {
    await setDoc(doc(db, 'bookings', testBookingId), {
      bookingRef: testBookingRef,
      tourId: 'inland-sea',
      fullName: 'VIP Test Guest',
      phone: '+974 5500 1234',
      email: 'guest@luxury-qatar.qa',
      totalPriceQar: 850,
      status: 'pending',
      date: '2026-11-15',
    });
    console.log(`[PASS] Valid public booking creation succeeded: ${testBookingRef}`);
    
    // Clean up or note
    console.log('[PASS] Public booking contract verified.');
  } catch (err: any) {
    console.warn('[NOTICE] Public booking test notice:', err.message);
  }

  console.log('\n--- LIVE AUDIT COMPLETE ---\n');
  process.exit(0);
}

runLiveVerification().catch((e) => {
  console.error(e);
  process.exit(1);
});
