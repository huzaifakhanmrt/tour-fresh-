import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  ROOT_ADMIN_EMAIL,
} from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdminUser } from '../types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminProfile: AdminUser | null;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkAdminStatus: (currentUser: User) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  adminProfile: null,
  isLoading: true,
  authError: null,
  loginWithGoogle: async () => false,
  logout: async () => {},
  checkAdminStatus: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAdminStatus = async (currentUser: User): Promise<boolean> => {
    try {
      const email = currentUser.email?.toLowerCase().trim();
      
      // Root admin allowlist check
      if (email === ROOT_ADMIN_EMAIL.toLowerCase().trim()) {
        const rootProf: AdminUser = {
          id: currentUser.uid,
          email: ROOT_ADMIN_EMAIL,
          displayName: currentUser.displayName || 'Root Superadmin',
          role: 'superadmin',
          active: true,
          createdAt: new Date().toISOString(),
        };
        setIsAdmin(true);
        setAdminProfile(rootProf);
        try {
          await setDoc(doc(db, 'admins', currentUser.uid), rootProf, { merge: true });
        } catch {
          // Non-blocking sync
        }
        return true;
      }

      // Check Firestore doc by UID
      const uidDoc = await getDoc(doc(db, 'admins', currentUser.uid));
      if (uidDoc.exists()) {
        const data = uidDoc.data() as AdminUser;
        if (data.active) {
          setIsAdmin(true);
          setAdminProfile({ ...data, id: uidDoc.id });
          return true;
        }
      }

      // Check Firestore docs by email directly
      if (email) {
        const emailDoc = await getDoc(doc(db, 'admins', email));
        if (emailDoc.exists()) {
          const docData = emailDoc.data() as AdminUser;
          if (docData.active) {
            setIsAdmin(true);
            setAdminProfile({ ...docData, id: emailDoc.id });
            try {
              await setDoc(doc(db, 'admins', currentUser.uid), {
                ...docData,
                id: currentUser.uid,
                active: true,
              }, { merge: true });
            } catch {}
            return true;
          }
        }

        // Also check sanitized slug ID
        const slugId = `admin-${email.replace(/[^a-z0-9]/g, '_')}`;
        const slugDoc = await getDoc(doc(db, 'admins', slugId));
        if (slugDoc.exists()) {
          const docData = slugDoc.data() as AdminUser;
          if (docData.active) {
            setIsAdmin(true);
            setAdminProfile({ ...docData, id: slugDoc.id });
            try {
              await setDoc(doc(db, 'admins', currentUser.uid), {
                ...docData,
                id: currentUser.uid,
                active: true,
              }, { merge: true });
            } catch {}
            return true;
          }
        }
      }

      setIsAdmin(false);
      setAdminProfile(null);
      return false;
    } catch (err) {
      console.warn('Admin status evaluation notice:', err);
      // Fallback check for root email even if network error
      if (currentUser.email?.toLowerCase().trim() === ROOT_ADMIN_EMAIL.toLowerCase().trim()) {
        setIsAdmin(true);
        return true;
      }
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkAdminStatus(currentUser);
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isAuthorized = await checkAdminStatus(result.user);
      if (!isAuthorized) {
        setAuthError(
          `Access Denied: ${result.user.email} is not on the authorized MZ Tourism Qatar administrative allowlist. Please contact the Superadmin (${ROOT_ADMIN_EMAIL}) for access.`
        );
      }
      return isAuthorized;
    } catch (err: any) {
      console.warn('Google Sign-in status notice:', err);
      const msg = err?.message || String(err);
      if (msg.includes('token-service-api') || msg.includes('securetoken')) {
        setAuthError(
          'Google Cloud Token Service API (securetoken.googleapis.com) needs activation for Project 133501107135. Please click the button below to enable it in 1 click, then retry signing in.'
        );
      } else {
        setAuthError(err.message || 'Authentication failed. Please check popup blockers or network connection.');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setAdminProfile(null);
      setAuthError(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        adminProfile,
        isLoading,
        authError,
        loginWithGoogle,
        logout,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
