import React, { useState, useEffect } from 'react';
import { getGuestPolicies, saveGuestPolicies, logAudit } from '../../services/db';
import { GuestCategoryPolicy } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const GuestsScreen: React.FC = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<GuestCategoryPolicy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getGuestPolicies();
        setPolicies(data);
      } catch (err: any) {
        console.error('Failed to load guest policies:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleUpdatePercentage = (id: string, newPct: number) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pricePercentage: newPct } : p))
    );
  };

  const handleUpdateDescription = (id: string, newDesc: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, description: newDesc } : p))
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await saveGuestPolicies(policies, user?.email || 'admin');
      await logAudit('update_guest_policies', user?.email || 'admin', 'Updated passenger age tiers & price rates');
      setNotification({
        type: 'success',
        text: 'Guest policies and pricing percentages successfully saved and applied to booking calculations!',
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      console.error('Save failed:', err);
      setNotification({
        type: 'error',
        text: `Failed to save changes: ${err.message || 'Please check your admin privileges.'}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Guest Policies & Passenger Age Tiers
          </h2>
          <p className="text-xs text-neutral-400">
            Configure age limits, child passenger safety guidelines, and automatic price percentage ratios.
          </p>
        </div>

        <button
          onClick={handleSaveChanges}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecc15a] to-[#c29b38] hover:opacity-90 text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Alert banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2 text-xs shadow-md animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {notification.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{notification.text}</span>
        </div>
      )}

      {/* Policies Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading guest policies...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {policies.map((p) => (
            <div
              key={p.id}
              className="bg-[#111317] border border-[#282a2e] hover:border-[#ecc15a]/40 p-5 rounded-2xl space-y-4 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
                  <h3 className="font-bold text-white text-sm">{p.title}</h3>
                  <span className="font-mono text-[#ecc15a] font-bold text-xs bg-[#1e2024] px-2.5 py-1 rounded-lg border border-[#ecc15a]/30">
                    {p.pricePercentage}% Rate
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Policy Description</label>
                  <textarea
                    rows={3}
                    value={p.description}
                    onChange={(e) => handleUpdateDescription(p.id, e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg p-2.5 text-xs text-white leading-relaxed focus:border-[#ecc15a] outline-none"
                  />
                </div>

                <div className="space-y-1.5 text-xs bg-[#0c0e12] p-3 rounded-xl border border-[#282a2e]">
                  <div className="text-[10px] uppercase font-bold text-[#ecc15a]">Age Range Specification</div>
                  <div className="text-neutral-300 text-[11px]">
                    Minimum: <span className="text-white font-bold">{p.minAge} years</span> • Maximum: <span className="text-white font-bold">{p.maxAge} years</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#282a2e]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-400">Rate Ratio (% of Adult Fare):</span>
                  <span className="font-mono text-sm font-bold text-[#ecc15a]">
                    {p.pricePercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={p.pricePercentage}
                  onChange={(e) => handleUpdatePercentage(p.id, Number(e.target.value))}
                  className="w-full accent-[#ecc15a] cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Notice from Qatar Tourism Authority */}
      <div className="p-5 rounded-2xl bg-[#1e2024] border border-[#ecc15a]/30 flex items-start gap-3.5 text-xs text-neutral-300">
        <span className="material-symbols-outlined text-[#ecc15a] text-[26px] shrink-0">
          health_and_safety
        </span>
        <div className="space-y-1">
          <div className="font-bold text-white text-sm">Civil Defense &amp; Qatar Tourism Compliance Notice</div>
          <p className="text-neutral-400 leading-relaxed text-xs">
            By Qatari maritime and desert transport regulations, every passenger vehicle must carry an active first-aid kit, certified fire extinguisher, GPS emergency beacon, and chilled hydration. Child booster seats must meet ECE R44/04 or i-Size specifications.
          </p>
        </div>
      </div>
    </div>
  );
};
