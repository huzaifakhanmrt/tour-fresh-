import React, { useState, useEffect } from 'react';
import { getPricingRules, savePricingRule, deletePricingRule, logAudit } from '../../services/db';
import { PricingRuleItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const PricingScreen: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<PricingRuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRuleItem | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<'percentage' | 'fixed' | 'seasonal'>('percentage');
  const [formValue, setFormValue] = useState<number>(10);
  const [formMinSpendQar, setFormMinSpendQar] = useState<number>(500);
  const [formActive, setFormActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    setIsLoading(true);
    try {
      const data = await getPricingRules();
      setRules(data);
    } catch (err) {
      console.error('Failed to load pricing rules:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const openNewRule = () => {
    setEditingRule(null);
    setFormCode('QATAR15');
    setFormTitle('Winter Qatar Celebration Discount');
    setFormType('percentage');
    setFormValue(15);
    setFormMinSpendQar(600);
    setFormActive(true);
    setIsEditorOpen(true);
  };

  const openEditRule = (r: PricingRuleItem) => {
    setEditingRule(r);
    setFormCode(r.code);
    setFormTitle(r.title);
    setFormType(r.type);
    setFormValue(r.value);
    setFormMinSpendQar(r.minSpendQar || 0);
    setFormActive(r.active);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const id = editingRule?.id || `promo-${Date.now().toString(36)}`;
      const payload: PricingRuleItem = {
        id,
        code: formCode.toUpperCase().trim(),
        title: formTitle,
        type: formType,
        value: Number(formValue),
        minSpendQar: Number(formMinSpendQar),
        active: formActive,
      };

      await savePricingRule(payload);
      await logAudit(
        editingRule ? 'update_coupon' : 'create_coupon',
        user?.email || 'admin',
        `Coupon: ${payload.code}`
      );

      await loadRules();
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Failed to save rule:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (r: PricingRuleItem) => {
    if (!confirm(`Delete coupon "${r.code}"?`)) return;
    try {
      await deletePricingRule(r.id);
      await logAudit('delete_coupon', user?.email || 'admin', `Deleted: ${r.code}`);
      await loadRules();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Promotional Coupons & Seasonal Rates
          </h2>
          <p className="text-xs text-neutral-400">
            Configure QAR promotional coupon codes, percentage incentives, and seasonal peak rate rules.
          </p>
        </div>

        <button
          onClick={openNewRule}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>New Promo Code</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading pricing rules from Firestore...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 rounded-xl border transition-all ${
                rule.active
                  ? 'bg-[#111317] border-[#282a2e] hover:border-[#ecc15a]/40'
                  : 'bg-[#111317]/50 border-neutral-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
                <div className="font-mono font-bold text-sm text-[#ecc15a] tracking-wider">
                  {rule.code}
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    rule.active ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {rule.active ? 'Active' : 'Expired'}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm mt-3">{rule.title}</h3>

              <div className="mt-3 bg-[#0c0e12] p-3 rounded-lg border border-[#282a2e] text-xs flex justify-between">
                <span className="text-neutral-400">Benefit:</span>
                <span className="font-mono font-bold text-white">
                  {rule.type === 'percentage' ? `${rule.value}% Off` : `${rule.value} QAR Flat Off`}
                </span>
              </div>

              {rule.minSpendQar ? (
                <div className="text-[11px] text-neutral-400 mt-2">
                  Min spend: <span className="font-mono text-neutral-200">{rule.minSpendQar} QAR</span>
                </div>
              ) : null}

              <div className="mt-4 pt-3 border-t border-[#282a2e] flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditRule(rule)}
                  className="px-3 py-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-white text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(rule)}
                  className="p-1.5 rounded bg-[#1e2024] hover:bg-red-950 text-red-400 text-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111317] border border-[#ecc15a]/40 rounded-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
              <h3 className="font-serif font-bold text-white text-base">
                {editingRule ? 'Edit Promo Rule' : 'New Promotional Coupon'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-[#ecc15a] font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Discount Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (QAR)</option>
                    <option value="seasonal">Seasonal Rate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Minimum Booking Spend (QAR)</label>
                <input
                  type="number"
                  min={0}
                  value={formMinSpendQar}
                  onChange={(e) => setFormMinSpendQar(Number(e.target.value))}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeRule"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded accent-[#ecc15a]"
                />
                <label htmlFor="activeRule" className="text-neutral-300 cursor-pointer">
                  Active & Redeemable by Guests
                </label>
              </div>

              <div className="pt-3 border-t border-[#282a2e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#1e2024] text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-[#ecc15a] text-[#111317] font-bold uppercase tracking-wider"
                >
                  {isSaving ? 'Saving...' : 'Save Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
