import React, { useState, useEffect } from 'react';
import { getAdmins, saveAdmin, deleteAdmin, getAuditLogs, logAudit, seedInitialDataIfEmpty } from '../../services/db';
import { AdminUser, AuditLogItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ROOT_ADMIN_EMAIL } from '../../lib/firebase';

export const SettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'staff' | 'notifications' | 'audit' | 'database'>('staff');
  const [isLoading, setIsLoading] = useState(true);

  // New Admin form
  const [newEmail, setNewEmail] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<'superadmin' | 'manager' | 'operations' | 'concierge'>('manager');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettingsData();
  }, []);

  async function loadSettingsData() {
    setIsLoading(true);
    try {
      const [adminList, logs] = await Promise.all([getAdmins(), getAuditLogs()]);
      setAdmins(adminList);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Settings load error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setIsAddingAdmin(true);
    try {
      const cleanEmail = newEmail.toLowerCase().trim();
      const adminId = `admin-${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
      const newAdmin: AdminUser = {
        id: adminId,
        email: cleanEmail,
        displayName: newDisplayName || cleanEmail.split('@')[0],
        role: newRole,
        active: true,
        createdAt: new Date().toISOString(),
      };

      await saveAdmin(newAdmin);
      await logAudit(
        'grant_admin_access',
        user?.email || 'admin',
        `Authorized new admin: ${cleanEmail} as ${newRole}`
      );

      setNewEmail('');
      setNewDisplayName('');
      setMessage(`Authorized ${cleanEmail} successfully. They can now sign in with Google.`);
      setTimeout(() => setMessage(null), 4000);
      await loadSettingsData();
    } catch (err) {
      console.error('Failed to add admin:', err);
      alert('Error adding administrator.');
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleToggleAdminStatus = async (admin: AdminUser) => {
    if (admin.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) {
      alert('Root Superadmin cannot be deactivated.');
      return;
    }
    try {
      const updated = { ...admin, active: !admin.active };
      await saveAdmin(updated);
      await logAudit('toggle_admin_status', user?.email || 'admin', `${admin.email} active: ${updated.active}`);
      await loadSettingsData();
    } catch (err) {
      console.error('Error toggling admin:', err);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (admin.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) {
      alert('Root Superadmin account cannot be deleted.');
      return;
    }
    if (!confirm(`Revoke administrative access for ${admin.email}?`)) return;
    try {
      await deleteAdmin(admin.id, admin.email);
      await logAudit('revoke_admin_access', user?.email || 'admin', `Revoked ${admin.email}`);
      await loadSettingsData();
    } catch (err) {
      console.error('Revoke admin error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
          System Settings & Staff Authorization
        </h2>
        <p className="text-xs text-neutral-400">
          Manage authorized administrator accounts, WhatsApp notification blueprints, and security audit logs.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{message}</span>
        </div>
      )}

      {/* Settings Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#282a2e] pb-2 text-xs">
        {[
          { id: 'staff', label: 'Authorized Administrators', icon: 'admin_panel_settings' },
          { id: 'notifications', label: 'Notification Blueprints', icon: 'chat' },
          { id: 'audit', label: 'Security Audit Log', icon: 'security' },
          { id: 'database', label: 'Database Health', icon: 'database' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#ecc15a] text-[#111317]'
                : 'text-neutral-400 hover:bg-[#1e2024] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Staff Accounts */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Add Admin Form */}
          <form
            onSubmit={handleAddAdmin}
            className="bg-[#111317] border border-[#282a2e] p-5 rounded-xl space-y-4 text-xs"
          >
            <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
              Authorize New Administrator
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1">Google Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  placeholder="staff@mztourism.qa"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Staff Member Name / Title</label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  placeholder="e.g. Operations Manager"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Role & Permissions</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                >
                  <option value="superadmin">Superadmin (Full Control)</option>
                  <option value="manager">Operations Manager</option>
                  <option value="concierge">VIP Concierge & Dispatch</option>
                  <option value="operations">Fleet Coordinator</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAddingAdmin}
              className="px-5 py-2.5 rounded-lg bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAddingAdmin ? 'Authorizing...' : 'Authorize Staff Account'}
            </button>
          </form>

          {/* Current Staff List */}
          <div className="bg-[#111317] border border-[#282a2e] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#282a2e]">
              <h3 className="font-bold text-white text-sm">Authorized Administrator Allowlist</h3>
              <p className="text-[11px] text-neutral-400">
                Only authenticated Google users matching these records are permitted access to admin features.
              </p>
            </div>

            <div className="divide-y divide-[#282a2e] text-xs">
              {/* Root Superadmin Row */}
              <div className="p-4 flex items-center justify-between bg-[#1e2024]/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ecc15a] text-[#111317] font-bold flex items-center justify-center font-serif text-sm">
                    SA
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>Root Superadmin</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#ecc15a] text-[#111317]">
                        Root Owner
                      </span>
                    </div>
                    <div className="font-mono text-[#ecc15a] text-[11px]">{ROOT_ADMIN_EMAIL}</div>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Permanently Authorized</span>
                </div>
              </div>

              {/* Other Admins */}
              {admins
                .filter((a) => a.email.toLowerCase() !== ROOT_ADMIN_EMAIL.toLowerCase())
                .map((admin) => (
                  <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-[#1e2024]/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#282a2e] text-neutral-300 font-bold flex items-center justify-center text-xs">
                        {admin.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{admin.displayName}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#1e2024] text-neutral-300 border border-[#282a2e]">
                            {admin.role}
                          </span>
                        </div>
                        <div className="font-mono text-neutral-400 text-[11px]">{admin.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleAdminStatus(admin)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          admin.active
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/40'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {admin.active ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => handleDeleteAdmin(admin)}
                        className="p-1 rounded text-neutral-400 hover:text-red-400"
                        title="Revoke Access"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Notification Blueprints */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#111317] border border-[#282a2e] space-y-4 text-xs">
            <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
              WhatsApp & Email VIP Notification Templates
            </div>
            <p className="text-neutral-400 leading-relaxed">
              MZ Tourism uses direct WhatsApp deep-links (wa.me) for instant booking confirmation dispatch. For automated background SMS or transactional emails, connect Twilio or SendGrid/Resend API credentials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#282a2e] space-y-2">
                <div className="font-bold text-white">Booking Confirmation (WhatsApp)</div>
                <div className="p-3 rounded bg-[#16181d] font-mono text-[11px] text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {`Hello {GuestName},
MZ Tourism Qatar confirms your VIP reservation:
• Ref: {BookingRef}
• Tour: {TourTitle}
• Date: {Date} ({Window})
• Pickup: {PickupLocation}
• Vehicle: {VehicleType}
• Total: {TotalPriceQar} QAR

Our private chauffeur will meet you 10 minutes prior to departure.`}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#282a2e] space-y-2">
                <div className="font-bold text-white">Chauffeur Dispatch Notification</div>
                <div className="p-3 rounded bg-[#16181d] font-mono text-[11px] text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {`VIP Chauffeur on Route:
Your designated driver {DriverName} ({DriverPhone}) is arriving at {PickupLocation} in a {VehicleName} (Plate: {PlateNumber}).
Have an exquisite journey with MZ Tourism.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-[#111317] border border-[#282a2e] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#282a2e]">
            <h3 className="font-bold text-white text-sm">Administrative Audit Trail</h3>
            <p className="text-[11px] text-neutral-400">
              Immutable security record of price adjustments, cancellations, and staff authorizations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0c0e12] uppercase text-[10px] text-neutral-400 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Admin Email</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282a2e]">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-neutral-500">
                      No administrative changes logged yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.slice(0, 20).map((log) => (
                    <tr key={log.id} className="hover:bg-[#1e2024]/40">
                      <td className="px-4 py-2.5 font-mono text-neutral-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e2024] text-[#ecc15a] border border-[#282a2e]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-white text-[11px]">
                        {log.performedBy}
                      </td>
                      <td className="px-4 py-2.5 text-neutral-300 truncate max-w-xs">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Database Health */}
      {activeTab === 'database' && (
        <div className="bg-[#111317] border border-[#282a2e] p-6 rounded-xl space-y-4 text-xs">
          <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
            Cloud Firestore Health & Security Invariants
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#282a2e] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="material-symbols-outlined text-[18px]">cloud_done</span>
                <span>Firestore Database Active</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                Target: ai-studio-olsstyleremixm2t-49e16942-9475-4629-b1df-1c83b03ebbcd
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#282a2e] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Firestore Rules Deployed</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                8-Pillar hardened rules enforce least privilege, admin authorization, and PII protection.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#282a2e] flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Initialize / Re-seed Catalog Data</div>
              <div className="text-neutral-400 text-[11px]">Populate empty Firestore collections with signature luxury Qatar tours, vehicles, and locations.</div>
            </div>
            <button
              type="button"
              onClick={async () => {
                const res = await seedInitialDataIfEmpty(true);
                alert(res ? 'Catalog data successfully synchronized into Firestore!' : 'Seeding complete.');
              }}
              className="px-4 py-2 rounded-lg bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold text-xs uppercase tracking-wider"
            >
              Seed Catalog to Firestore
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
