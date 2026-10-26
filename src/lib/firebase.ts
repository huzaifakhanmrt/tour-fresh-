import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Suppress internal firestore logger noise during token propagation
try {
  setLogLevel('silent');
} catch {
  // ignore
}

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without passing firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ENABLE_TOKEN_API_URL =
  'https://console.developers.google.com/apis/api/securetoken.googleapis.com/overview?project=133501107135';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function isPermissionError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();
  return lower.includes('permission') || lower.includes('insufficient') || lower.includes('missing');
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  if (isPermissionError(error)) {
    throw new Error(JSON.stringify(errInfo));
  }
}

// CRITICAL CONSTRAINT: Test connection on initial boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('securetoken') || errorMsg.includes('token-service-api')) {
      console.warn(
        `Token Service API (securetoken.googleapis.com) needs activation in Google Cloud project. Enable link: ${ENABLE_TOKEN_API_URL}`
      );
    } else if (errorMsg.includes('the client is offline')) {
      console.warn('Firestore is currently operating in offline mode. Local cached catalog is active.');
    } else {
      console.warn('Notice: Firestore connection check:', errorMsg);
    }
  }
}

// Hardcoded primary root bootstrapped superadmin
export const ROOT_ADMIN_EMAIL = 'huzaifakhanmrt@gmail.com';

export { signInWithPopup, signOut, onAuthStateChanged };
export type { User };
