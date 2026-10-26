import React, { useState, useEffect } from 'react';
import { getAvailabilityRules, saveAvailabilityRule, logAudit } from '../../services/db';
import { AvailabilityRuleItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AvailabilityScreen: React.FC = () => {
  const { user } = useAuth();
  const [rule, setRule] = useState<AvailabilityRuleItem>({
    id: 'default-availability',
    title: 'Standard Operating & Booking Buffer Rules',
    blackoutDates: [],
    operatingHours: '06:00 - 23:30 Daily',
    cutoffHoursNotice: 3,
    maxDailyBookings: 50,
  });
  const [newDate, setNewDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const rules = await getAvailabilityRules();
      if (rules.length > 0) {
        setRule(rules[0]);
      }
    }
    load();
  }, []);

  const handleAddBlackoutDate = () => {
    if (!newDate) return;
    if (rule.blackoutDates.includes(newDate)) return;
    setRule({
      ...rule,
      blackoutDates: [...rule.blackoutDates, newDate].sort(),
    });
    setNewDate('');
  };

  const handleRemoveBlackoutDate = (dateToRemove: string) => {
    setRule({
      ...rule,
      blackoutDates: rule.blackoutDates.filter((d) => d !== dateToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveAvailabilityRule(rule);
      await logAudit('update_availability', user?.email || 'admin', 'Updated blackout dates and hours');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save availability:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
          Availability, Operating Hours & Blackouts
        </h2>
        <p className="text-xs text-neutral-400">
          Control operational cutoffs, daily departure limits, and block dates for national events or severe maritime weather.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs">
          Availability settings successfully saved to Firestore.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Operational Constraints */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl space-y-4">
          <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-2 border-b border-[#282a2e]">
            Operating Schedule & Notice Windows
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Operating Hours</label>
            <input
              type="text"
              value={rule.operatingHours}
              onChange={(e) => setRule({ ...rule, operatingHours: e.target.value })}
              className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-medium"
              placeholder="06:00 - 23:30 Daily"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">
              Minimum Advance Notice (Hours prior to departure)
            </label>
            <input
              type="number"
              min={1}
              max={72}
              value={rule.cutoffHoursNotice}
              onChange={(e) => setRule({ ...rule, cutoffHoursNotice: Number(e.target.value) })}
              className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono font-bold"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Reservations requested less than {rule.cutoffHoursNotice} hours in advance will trigger a concierge review note.
            </span>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Max Daily Departure Reservations</label>
            <input
              type="number"
              min={5}
              max={200}
              value={rule.maxDailyBookings}
              onChange={(e) => setRule({ ...rule, maxDailyBookings: Number(e.target.value) })}
              className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono font-bold"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Enforces maximum fleet utilization across 4x4 safaris and royal dhow yachts.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 rounded-lg bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving Changes...' : 'Save Availability Rules'}
          </button>
        </div>

        {/* Blackout Dates */}
        <div className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl space-y-4">
          <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-2 border-b border-[#282a2e]">
            Blackout Dates (Closed for Booking)
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
            />
            <button
              type="button"
              onClick={handleAddBlackoutDate}
              className="px-4 py-2 rounded-lg bg-[#1e2024] hover:bg-[#282a2e] border border-[#ecc15a]/40 text-[#ecc15a] font-bold"
            >
              Add Date
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rule.blackoutDates.length === 0 ? (
              <div className="text-center py-6 text-neutral-500 text-xs">
                No dates are currently blacked out. All days are open for booking.
              </div>
            ) : (
              rule.blackoutDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#1e2024] border border-[#282a2e]"
                >
                  <span className="font-mono text-white font-bold">{date}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlackoutDate(date)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
