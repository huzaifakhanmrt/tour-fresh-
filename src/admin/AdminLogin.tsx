import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROOT_ADMIN_EMAIL, ENABLE_TOKEN_API_URL } from '../lib/firebase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const { loginWithGoogle, user, isAdmin, authError, logout } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    const authorized = await loginWithGoogle();
    setIsSigningIn(false);
    if (authorized) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ecc15a]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#111317] border border-[#ecc15a]/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black relative z-10 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ecc15a] to-[#c29b38] items-center justify-center shadow-lg shadow-[#ecc15a]/20 mb-4">
            <span className="font-serif font-black text-[#111317] text-2xl tracking-tighter">MZ</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            MZ Tourism Qatar
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#ecc15a] font-semibold mt-1">
            VIP Management & Concierge Console
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            Restricted access portal for authorized executive staff and operations coordinators.
          </p>
        </div>

        {/* Access Status & Warnings */}
        {authError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-700/50 text-red-200 text-xs leading-relaxed flex items-start gap-3">
            <span className="material-symbols-outlined text-red-400 text-[20px] shrink-0 mt-0.5">
              shield_with_heart
            </span>
            <div className="space-y-2">
              <div className="font-bold text-red-300">Access Restricted / Setup Required</div>
              <div>{authError}</div>
              {(authError.toLowerCase().includes('token') || authError.toLowerCase().includes('securetoken')) && (
                <a
                  href={ENABLE_TOKEN_API_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ecc15a] text-[#111317] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdf99] transition-colors mt-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Enable Token Service API in 1 Click</span>
                </a>
              )}
              {user && (
                <button
                  onClick={() => logout()}
                  className="mt-2.5 underline text-red-300 hover:text-white font-medium block cursor-pointer"
                >
                  Sign out and try another Google account
                </button>
              )}
            </div>
          </div>
        )}

        {/* If user is logged in but already authorized */}
        {user && isAdmin && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-200 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1 text-emerald-300">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Authenticated as Authorized Admin</span>
            </div>
            <div className="text-neutral-300">{user.email}</div>
            <button
              onClick={onSuccess}
              className="mt-4 w-full py-2.5 rounded-lg bg-[#ecc15a] text-[#111317] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdf99] transition-colors shadow-lg"
            >
              Continue to Admin Console
            </button>
          </div>
        )}

        {/* If not logged in */}
        {(!user || !isAdmin) && (
          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#1e2024] hover:bg-[#282a2e] border border-[#ecc15a]/40 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSigningIn ? 'Verifying with Google...' : 'Sign in with Google Admin'}</span>
            </button>

            {/* Security Notice Box */}
            <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#282a2e] text-[11px] text-neutral-400 space-y-2">
              <div className="flex items-center gap-1.5 text-[#ecc15a] font-semibold">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Zero-Trust Admin Allowlist Protection</span>
              </div>
              <p>
                Signing in with a Google account is strictly validated against the server-side authorized administrator directory. Unauthorized accounts cannot access booking records, financial reports, or guest PII.
              </p>
              <div className="pt-1 border-t border-[#282a2e] text-[10px] text-neutral-400">
                Authorized Superadmin: <span className="text-[#ecc15a] font-mono">{ROOT_ADMIN_EMAIL}</span>
              </div>
            </div>
          </div>
        )}

        {/* Back to Public Site link */}
        <div className="mt-8 pt-4 border-t border-[#282a2e] text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-neutral-400 hover:text-[#ecc15a] flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to MZ Tourism Qatar Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
