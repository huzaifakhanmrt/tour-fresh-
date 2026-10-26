import React, { useState, useEffect } from 'react';
import { getVehicles, saveVehicle, deleteVehicle, logAudit } from '../../services/db';
import { VehicleItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const VehiclesScreen: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingVeh, setEditingVeh] = useState<VehicleItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<VehicleItem['type']>('4x4_safari');
  const [formPassengerCapacity, setFormPassengerCapacity] = useState<number>(6);
  const [formLuggageCapacity, setFormLuggageCapacity] = useState<number>(4);
  const [formPlateNumber, setFormPlateNumber] = useState('');
  const [formDriverName, setFormDriverName] = useState('');
  const [formDriverPhone, setFormDriverPhone] = useState('');
  const [formPriceMultiplier, setFormPriceMultiplier] = useState<number>(1.0);
  const [formFixedAddonQar, setFormFixedAddonQar] = useState<number>(0);
  const [formActive, setFormActive] = useState<boolean>(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    setIsLoading(true);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const openNewVehicle = () => {
    setEditingVeh(null);
    setFormName('');
    setFormType('4x4_safari');
    setFormPassengerCapacity(6);
    setFormLuggageCapacity(4);
    setFormPlateNumber('QA-');
    setFormDriverName('');
    setFormDriverPhone('+974 ');
    setFormPriceMultiplier(1.0);
    setFormFixedAddonQar(0);
    setFormActive(true);
    setIsEditorOpen(true);
  };

  const openEditVehicle = (v: VehicleItem) => {
    setEditingVeh(v);
    setFormName(v.name);
    setFormType(v.type);
    setFormPassengerCapacity(v.passengerCapacity);
    setFormLuggageCapacity(v.luggageCapacity);
    setFormPlateNumber(v.plateNumber || '');
    setFormDriverName(v.driverName || '');
    setFormDriverPhone(v.driverPhone || '');
    setFormPriceMultiplier(v.priceMultiplier);
    setFormFixedAddonQar(v.fixedAddonQar);
    setFormActive(v.active);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const id = editingVeh?.id || `veh-${Date.now().toString(36)}`;
      const payload: VehicleItem = {
        id,
        name: formName,
        type: formType,
        passengerCapacity: Number(formPassengerCapacity),
        luggageCapacity: Number(formLuggageCapacity),
        plateNumber: formPlateNumber,
        driverName: formDriverName,
        driverPhone: formDriverPhone,
        priceMultiplier: Number(formPriceMultiplier),
        fixedAddonQar: Number(formFixedAddonQar),
        active: formActive,
      };

      await saveVehicle(payload);
      await logAudit(
        editingVeh ? 'update_vehicle' : 'create_vehicle',
        user?.email || 'admin',
        `Vehicle: ${formName}`
      );

      await loadVehicles();
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Failed to save vehicle:', err);
      alert('Error saving vehicle.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (v: VehicleItem) => {
    try {
      await saveVehicle({ ...v, active: !v.active });
      await logAudit('toggle_vehicle_active', user?.email || 'admin', `${v.name} -> ${!v.active}`);
      await loadVehicles();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (v: VehicleItem) => {
    if (!confirm(`Delete vehicle "${v.name}"?`)) return;
    try {
      await deleteVehicle(v.id);
      await logAudit('delete_vehicle', user?.email || 'admin', `Deleted: ${v.name}`);
      await loadVehicles();
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
            VIP Fleet & Marine Vessels
          </h2>
          <p className="text-xs text-neutral-400">
            Manage 4x4 desert cruisers, Maybach limousines, Escalades, executive vans, and royal maritime yachts.
          </p>
        </div>

        <button
          onClick={openNewVehicle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      {/* Fleet Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading fleet vehicles from Firestore...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`p-5 rounded-xl border transition-all ${
                v.active
                  ? 'bg-[#111317] border-[#282a2e] hover:border-[#ecc15a]/40'
                  : 'bg-[#111317]/50 border-neutral-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1e2024] text-[#ecc15a] border border-[#ecc15a]/30">
                    {v.type.replace('_', ' ')}
                  </span>
                  <h3 className="font-bold text-white text-sm mt-1.5 leading-snug">{v.name}</h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    v.active ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {v.active ? 'Ready' : 'Maintenance'}
                </span>
              </div>

              {/* Capacities */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-[#0c0e12] p-3 rounded-lg border border-[#282a2e]">
                <div className="flex items-center gap-2 text-neutral-300">
                  <span className="material-symbols-outlined text-[16px] text-[#ecc15a]">airline_seat_recline_normal</span>
                  <span>{v.passengerCapacity} Passengers</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <span className="material-symbols-outlined text-[16px] text-[#ecc15a]">luggage</span>
                  <span>{v.luggageCapacity} Bags</span>
                </div>
              </div>

              {/* Chauffeur details */}
              <div className="mt-3 text-xs text-neutral-400 space-y-1">
                <div className="flex justify-between">
                  <span>Assigned Chauffeur:</span>
                  <span className="text-white font-medium">{v.driverName || 'Rotational Pool'}</span>
                </div>
                {v.driverPhone && (
                  <div className="flex justify-between">
                    <span>Direct Mobile:</span>
                    <span className="font-mono text-[#ecc15a]">{v.driverPhone}</span>
                  </div>
                )}
                {v.plateNumber && (
                  <div className="flex justify-between">
                    <span>Plate / Reg:</span>
                    <span className="font-mono text-neutral-300">{v.plateNumber}</span>
                  </div>
                )}
              </div>

              {/* Pricing Multiplier */}
              <div className="mt-4 pt-3 border-t border-[#282a2e] flex items-center justify-between text-xs">
                <div className="text-[11px] text-neutral-400">
                  Rate Factor: <span className="font-mono text-[#ecc15a] font-bold">{v.priceMultiplier}x</span>
                  {v.fixedAddonQar > 0 && <span className="text-neutral-300"> (+{v.fixedAddonQar} QAR)</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(v)}
                    title={v.active ? 'Set to Maintenance' : 'Set to Active'}
                    className="p-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-neutral-300 hover:text-[#ecc15a] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {v.active ? 'toggle_on' : 'toggle_off'}
                    </span>
                  </button>

                  <button
                    onClick={() => openEditVehicle(v)}
                    title="Edit Vehicle"
                    className="p-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(v)}
                    title="Delete Vehicle"
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

      {/* Vehicle Form Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111317] border border-[#ecc15a]/40 rounded-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
              <h3 className="font-serif font-bold text-white text-base">
                {editingVeh ? 'Edit Fleet Vehicle' : 'Add New VIP Vehicle'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-medium"
                  placeholder="e.g. Cadillac Escalade Platinum VIP"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Class Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="4x4_safari">4x4 Safari Desert Spec</option>
                    <option value="sedan_luxury">Luxury Executive Sedan</option>
                    <option value="suv_luxury">Full-Size Luxury SUV</option>
                    <option value="van_luxury">Executive Chauffeur Van</option>
                    <option value="minibus">Minibus (Sprinter/Coaster)</option>
                    <option value="bus">Luxury Coach Bus</option>
                    <option value="dhow">Royal Wooden Dhow</option>
                    <option value="yacht">Luxury Motor Yacht</option>
                    <option value="custom">Custom Fleet Vessel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Plate Number / Reg</label>
                  <input
                    type="text"
                    value={formPlateNumber}
                    onChange={(e) => setFormPlateNumber(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono uppercase"
                    placeholder="QA-VIP-08"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Max Passenger Capacity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formPassengerCapacity}
                    onChange={(e) => setFormPassengerCapacity(Number(e.target.value))}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Luggage Capacity (Bags)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formLuggageCapacity}
                    onChange={(e) => setFormLuggageCapacity(Number(e.target.value))}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Assigned Chauffeur / Captain</label>
                  <input
                    type="text"
                    value={formDriverName}
                    onChange={(e) => setFormDriverName(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                    placeholder="e.g. Tariq Al-Kuwari"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Chauffeur Phone</label>
                  <input
                    type="text"
                    value={formDriverPhone}
                    onChange={(e) => setFormDriverPhone(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                    placeholder="+974 5512 8800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Price Multiplier Factor</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    value={formPriceMultiplier}
                    onChange={(e) => setFormPriceMultiplier(Number(e.target.value))}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Fixed Addon Surcharge (QAR)</label>
                  <input
                    type="number"
                    min={0}
                    value={formFixedAddonQar}
                    onChange={(e) => setFormFixedAddonQar(Number(e.target.value))}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeVeh"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded accent-[#ecc15a]"
                />
                <label htmlFor="activeVeh" className="text-neutral-300 cursor-pointer">
                  Active & Available for Dispatch
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
                  {isSaving ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
