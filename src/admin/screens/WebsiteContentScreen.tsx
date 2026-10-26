import React, { useState, useEffect } from 'react';
import { getWebsiteContent, saveWebsiteContent, logAudit } from '../../services/db';
import { WebsiteContentConfig } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MediaUploader } from '../components/MediaUploader';

export const WebsiteContentScreen: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<WebsiteContentConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'about' | 'seo' | 'policies'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getWebsiteContent();
      setContent(data);
    }
    load();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content) return;
    setIsSaving(true);
    try {
      await saveWebsiteContent(content, user?.email || 'admin');
      await logAudit('update_website_content', user?.email || 'admin', `Updated CMS section: ${activeTab}`);
      setSaveMessage('Website copy and configuration successfully published to live website!');
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to save website content:', err);
      alert('Error updating CMS.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!content) {
    return (
      <div className="py-20 text-center text-xs text-[#ecc15a]">
        Loading website CMS configuration from Firestore...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Website Content Management System (CMS)
          </h2>
          <p className="text-xs text-neutral-400">
            Edit live homepage copy, hero photography, contact hotline, WhatsApp numbers, SEO metadata, and legal terms without coding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecc15a] to-[#c29b38] hover:opacity-90 text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span>{isSaving ? 'Publishing...' : 'Publish to Live Site'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{saveMessage}</span>
        </div>
      )}

      {/* CMS Tab Bar */}
      <div className="flex items-center gap-2 border-b border-[#282a2e] pb-2 overflow-x-auto text-xs">
        {[
          { id: 'hero', label: 'Homepage Hero & Banner', icon: 'home' },
          { id: 'contact', label: 'Contact & WhatsApp Hotline', icon: 'chat' },
          { id: 'about', label: 'About Us Heritage Story', icon: 'history_edu' },
          { id: 'seo', label: 'Search Engine Optimization (SEO)', icon: 'search' },
          { id: 'policies', label: 'Policies & Terms', icon: 'policy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Editor Content Area */}
      <form onSubmit={handleSave} className="bg-[#111317] border border-[#282a2e] p-6 rounded-2xl space-y-6 text-xs">
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
              Homepage Hero Section
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Hero Pill Badge</label>
              <input
                type="text"
                value={content.heroBadge}
                onChange={(e) => setContent({ ...content, heroBadge: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={content.heroHeadline}
                onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-serif text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Hero Subtitle</label>
              <textarea
                rows={3}
                value={content.heroSubtitle}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white leading-relaxed"
              />
            </div>

            <MediaUploader
              label="Hero Cinematic Background Image"
              value={content.heroImage}
              onChange={(url) => setContent({ ...content, heroImage: url })}
              aspectRatio="wide"
              category="hero"
              helperText="Upload a sweeping high-resolution photo from your computer (auto-compressed for instant loading)."
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
              Hotlines, WhatsApp & Head Office Address
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1">VIP WhatsApp Number (With Country Code)</label>
                <input
                  type="text"
                  value={content.whatsappNumber}
                  onChange={(e) => setContent({ ...content, whatsappNumber: e.target.value })}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold"
                  placeholder="+974 5512 8899"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Used directly in the floating WhatsApp button and mobile bottom bar.
                </span>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Direct Phone Hotline</label>
                <input
                  type="text"
                  value={content.phoneContact}
                  onChange={(e) => setContent({ ...content, phoneContact: e.target.value })}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  placeholder="+974 4499 5500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Concierge Email</label>
                <input
                  type="email"
                  value={content.emailContact}
                  onChange={(e) => setContent({ ...content, emailContact: e.target.value })}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  placeholder="concierge@mztourism.qa"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Physical Office Address</label>
                <input
                  type="text"
                  value={content.addressText}
                  onChange={(e) => setContent({ ...content, addressText: e.target.value })}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  placeholder="Porto Arabia Promenade, The Pearl-Qatar, Doha"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
              About Us Heritage Story
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Story Title</label>
              <input
                type="text"
                value={content.aboutStoryTitle}
                onChange={(e) => setContent({ ...content, aboutStoryTitle: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-serif text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Paragraph 1 (Founding & Vision)</label>
              <textarea
                rows={3}
                value={content.aboutStoryP1}
                onChange={(e) => setContent({ ...content, aboutStoryP1: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Paragraph 2 (Commitment to Luxury)</label>
              <textarea
                rows={3}
                value={content.aboutStoryP2}
                onChange={(e) => setContent({ ...content, aboutStoryP2: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
              Global Search Engine Optimization (SEO)
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Meta Title Tag</label>
              <input
                type="text"
                value={content.seoMetaTitle}
                onChange={(e) => setContent({ ...content, seoMetaTitle: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Meta Description Tag</label>
              <textarea
                rows={3}
                value={content.seoMetaDescription}
                onChange={(e) => setContent({ ...content, seoMetaDescription: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-4">
            <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
              Policies, Cancellation & Terms
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Cancellation Policy Statement</label>
              <textarea
                rows={3}
                value={content.cancellationPolicyText}
                onChange={(e) => setContent({ ...content, cancellationPolicyText: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Booking Terms & Safety Conditions</label>
              <textarea
                rows={3}
                value={content.termsPolicyText}
                onChange={(e) => setContent({ ...content, termsPolicyText: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Guest Privacy Policy</label>
              <textarea
                rows={3}
                value={content.privacyPolicyText}
                onChange={(e) => setContent({ ...content, privacyPolicyText: e.target.value })}
                className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white leading-relaxed"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#282a2e] flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}
          </button>
        </div>
      </form>
    </div>
  );
};
