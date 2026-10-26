import React, { useState, useEffect } from 'react';
import { getLocations, saveLocation, deleteLocation, logAudit } from '../../services/db';
import { LocationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const LocationsScreen: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingLoc, setEditingLoc] = useState<LocationItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCategory, setFormCategory] = useState<'airport' | 'hotel' | 'area' | 'port' | 'desert_hub' | 'custom'>('hotel');
  const [formCanPickup, setFormCanPickup] = useState(true);
  const [formCanDropoff, setFormCanDropoff] = useState(true);
  const [formIsFreePickup, setFormIsFreePickup] = useState(true);
  const [formExtraFeeQar, setFormExtraFeeQar] = useState<number>(0);
  const [formMapLink, setFormMapLink] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    setIsLoading(true);
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const openNewLocation = () => {
    setEditingLoc(null);
    setFormName('');
    setFormAddress('');
    setFormCategory('hotel');
    setFormCanPickup(true);
    setFormCanDropoff(true);
    setFormIsFreePickup(true);
    setFormExtraFeeQar(0);
    setFormMapLink('https://maps.google.com/?q=Doha');
    setFormActive(true);
    setIsEditorOpen(true);
  };

  const openEditLocation = (loc: LocationItem) => {
    setEditingLoc(loc);
    setFormName(loc.name);
    setFormAddress(loc.address);
    setFormCategory(loc.category);
    setFormCanPickup(loc.canPickup);
    setFormCanDropoff(loc.canDropoff);
    setFormIsFreePickup(loc.isFreePickup);
    setFormExtraFeeQar(loc.extraFeeQar);
    setFormMapLink(loc.mapLink || '');
    setFormActive(loc.active);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const id = editingLoc?.id || `loc-${Date.now().toString(36)}`;
      const payload: LocationItem = {
        id,
        name: formName,
        address: formAddress,
        category: formCategory,
        applicableExperiences: ['all'],
        canPickup: formCanPickup,
        canDropoff: formCanDropoff,
        isFreePickup: formIsFreePickup,
        extraFeeQar: Number(formExtraFeeQar),
        mapLink: formMapLink,
        active: formActive,
      };

      await saveLocation(payload);
      await logAudit(
        editingLoc ? 'update_location' : 'create_location',
        user?.email || 'admin',
        `Location: ${formName}`
      );

      await loadLocations();
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Failed to save location:', err);
      alert('Error saving location.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (loc: LocationItem) => {
    try {
      await saveLocation({ ...loc, active: !loc.active });
      await logAudit('toggle_location_active', user?.email || 'admin', `${loc.name} -> ${!loc.active}`);
      await loadLocations();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (loc: LocationItem) => {
    if (!confirm(`Delete location "${loc.name}"?`)) return;
    try {
      await deleteLocation(loc.id);
      await logAudit('delete_location', user?.email || 'admin', `Deleted: ${loc.name}`);
      await loadLocations();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            VIP Pick-up & Drop-off Hubs
          </h2>
          <p className="text-xs text-neutral-400">
            Active locations automatically populate the public booking modal dropdowns with real-time zone surcharges.
          </p>
        </div>

        <button
          onClick={openNewLocation}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          <span>Add Location</span>
        </button>
      </div>

      {/* Locations Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading location hubs from Firestore...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className={`p-5 rounded-xl border transition-all ${
                loc.active
                  ? 'bg-[#111317] border-[#282a2e] hover:border-[#ecc15a]/40'
                  : 'bg-[#111317]/50 border-neutral-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#1e2024] border border-[#ecc15a]/30 flex items-center justify-center text-[#ecc15a] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {loc.category === 'airport'
                        ? 'flight'
                        : loc.category === 'hotel'
                        ? 'hotel'
                        : loc.category === 'port'
                        ? 'directions_boat'
                        : loc.category === 'desert_hub'
                        ? 'terrain'
                        : 'pin_drop'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-tight">{loc.name}</h3>
                    <div className="text-[10px] text-[#ecc15a] uppercase tracking-wider font-semibold">
                      {loc.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    loc.active ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {loc.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-xs text-neutral-400 mt-3 line-clamp-2">{loc.address}</p>

              <div className="mt-4 pt-3 border-t border-[#282a2e] flex items-center justify-between text-xs">
                <div>
                  {loc.isFreePickup ? (
                    <span className="text-emerald-400 font-bold text-[11px]">Free VIP Pickup</span>
                  ) : (
                    <span className="text-amber-400 font-mono text-[11px] font-bold">
                      +{loc.extraFeeQar} QAR Zone Surcharge
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(loc)}
                    title={loc.active ? 'Deactivate' : 'Activate'}
                    className="p-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-neutral-300 hover:text-[#ecc15a] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {loc.active ? 'toggle_on' : 'toggle_off'}
                    </span>
                  </button>

                  <button
                    onClick={() => openEditLocation(loc)}
                    title="Edit Location"
                    className="p-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(loc)}
                    title="Delete Location"
                    className="p-1.5 rounded bg-[#1e2024] hover:bg-red-950 text-red-400 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111317] border border-[#ecc15a]/40 rounded-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
              <h3 className="font-serif font-bold text-white text-base">
                {editingLoc ? 'Edit Pickup Location' : 'New VIP Location Hub'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Location Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-medium"
                  placeholder="e.g. The Ritz-Carlton, Doha"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Detailed Address or Landmark *</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  placeholder="West Bay Lagoon, Doha, Qatar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="hotel">Luxury Hotel</option>
                    <option value="airport">Airport Terminal</option>
                    <option value="port">Port / Marina</option>
                    <option value="area">City District</option>
                    <option value="desert_hub">Desert Meeting Point</option>
                    <option value="custom">Custom Address</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Zone Surcharge (QAR)</label>
                  <input
                    type="number"
                    min={0}
                    value={formExtraFeeQar}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormExtraFeeQar(val);
                      if (val > 0) setFormIsFreePickup(false);
                    }}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFreePickup}
                    onChange={(e) => {
                      setFormIsFreePickup(e.target.checked);
                      if (e.target.checked) setFormExtraFeeQar(0);
                    }}
                    className="rounded accent-[#ecc15a]"
                  />
                  <span className="text-neutral-300">Complimentary (Free) Pickup</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="rounded accent-[#ecc15a]"
                  />
                  <span className="text-neutral-300">Active in Public Dropdown</span>
                </label>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Google Maps Link / Coordinates</label>
                <input
                  type="url"
                  value={formMapLink}
                  onChange={(e) => setFormMapLink(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono text-[11px]"
                  placeholder="https://maps.google.com/..."
                />
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
                  {isSaving ? 'Saving...' : 'Save Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
