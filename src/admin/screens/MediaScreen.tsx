import React, { useState, useEffect, useRef } from 'react';
import { getMediaItems, saveMediaItem, deleteMediaItem, logAudit } from '../../services/db';
import { MediaItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { processAndCompressImage, validateMediaFile, ALLOWED_IMAGE_TYPES } from '../../utils/mediaUpload';

const DEFAULT_SEEDED_MEDIA: { url: string; name: string; category: MediaItem['category'] }[] = [
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWXZL8dMJARl7egedwhd2V4ZTjc3fwO0H1KhNvBTKWXTUTcJb-J13eELb9M__jpCdvTX5xj8WDQwhGmiEVWbzO9SRaBGi0DwI9GQw3FsH28ziVrIcuO7bA_LNiS3vkzOm2701xDhQ8AKlfwZIzsZCX0G-QXevg2ndZLzRqvIZZIx3FXJg_YZ5mc0lWibEveKUVpmjmvkuA1HSW-RhzvMFOgIJQPlOjH29UJIBYVdjsydbaQd5f1wd',
    name: 'Khor_Al_Adaid_Dunes_Sunset.webp',
    category: 'experience',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqahxGX-jt2oHExfZeYoyxeg5WgS7zVh-2ztoyDkOK9g2zpzMnNJI4ZfOltiJwsdd9kihJrU4iCfSMyoyEUHSyr4Z03-P2KoS_xpdVUkgqt7QUVhKcrcFhD7BzwIBBVkgKSXHkxvL4SWmnhKhPcPE1VLhMhf7CQqoTbePh-CPVvEMPA4yJ1l1QfdLWVzfNM7dBmKa5fTDoVJehDnQHBqgpQLk1fhrbVFIE052T2Zqzkgp2X2-ByExJ',
    name: 'Royal_Wooden_Dhow_Doha_Bay.webp',
    category: 'experience',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkdf1sdjjkm25Js9fFohnKFBWlf2Zy2TBw8nylJd95kjvN1HHdI9GrphYTv0xCWAhyqaqveFGe6Z06ScM5GUGa8e0fySV0Pjr0OsZM86rkQIYO6QG7WscLptyrbVCw6mfq4z4Myt-yyvCYftNg8qzSTXcUbYq_KBcgSuHg7Pj4On7TgkgpOZxHy-VIq7dXNJp60p2ae0fOwMm4qgBuAsE1zJqoh3HT41mgQkw2I-qUeBYWELRUvacQ',
    name: 'Souq_Waqif_Falcon_Heritage.webp',
    category: 'experience',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHVhxgB-d53FhiA-wzB0d3wzWNC6Qk9ue92zVVmaVftkURihBftJyLpYR6O4at-n5vv-3m7Km4Z8cC0HR5bTkWUEeuJHmLTiuJg6PcmqQ7Dpso0tpsTow4AY4KpIDCmKSXxRuDUGXu2P9NZnoykcuM8g3Kx-suxwbv72Jo3Fr7OG0qPw7Urgay-8jSI4srGdJJUfPH1Gwnnmmq9_rFNQShIjY1B2Qg1ESATSslIDMMuz7ANB73VdR9',
    name: 'Museum_Islamic_Art_Skyline.webp',
    category: 'experience',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2Dqaj9vhrEu1AhIYGG07l33tIuCB3VP0q9-kwfxV_obMEb7BlCIxq_WOlDdRkZa1JKUy8c2O9EZSFWz7fV_jVO0Gr4bEUsE4ruJ4hOKwvdqFXPAXv1btAUj2ZeKsi807OBlEc2XWkhaTI54aJ0CsSmJOdm5E7_B_6yN3re2VVh5_L_DjIUyYlJ265sQd55SouBVHnoYe2kkdEpj-_iVZcLHmcxMkJmKii_xV796bse_4E2lbmfq-g',
    name: 'Singing_Sand_Dunes_Desert_Camp.webp',
    category: 'hero',
  },
  {
    url: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80',
    name: 'Land_Cruiser_V8_Safari_Dunes.webp',
    category: 'vehicle',
  },
  {
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    name: 'West_Bay_Diplomatic_Corniche.webp',
    category: 'general',
  },
];

export const MediaScreen: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual URL adder state
  const [manualUrl, setManualUrl] = useState('');
  const [manualName, setManualName] = useState('');

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setIsLoading(true);
    try {
      const items = await getMediaItems();
      if (items.length === 0) {
        // Seed default luxury photography assets
        const seeded: MediaItem[] = DEFAULT_SEEDED_MEDIA.map((item, idx) => ({
          id: `seed-media-${idx + 1}`,
          name: item.name,
          url: item.url,
          sizeKb: 180 + idx * 25,
          type: 'image/webp',
          category: item.category,
          dimensions: '1600 × 1066 px',
          uploadedBy: 'system_bootstrap',
          createdAt: new Date().toISOString(),
        }));
        for (const m of seeded) {
          await saveMediaItem(m);
        }
        setMediaList(seeded);
      } else {
        setMediaList(items);
      }
    } catch (err) {
      console.error('Failed to load media items:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUploadFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    setUploadProgress(10);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateMediaFile(file);
        if (!validation.valid) {
          alert(`File "${file.name}" skipped: ${validation.error}`);
          continue;
        }

        const processed = await processAndCompressImage(file, (pct) => {
          setUploadProgress(pct);
        });

        const newMedia: MediaItem = {
          id: processed.id,
          name: processed.name,
          url: processed.url,
          sizeKb: processed.sizeKb,
          type: processed.type,
          dimensions: processed.dimensions,
          category: 'experience',
          uploadedBy: user?.email || 'admin',
          createdAt: new Date().toISOString(),
        };

        await saveMediaItem(newMedia);
      }

      await logAudit('upload_media', user?.email || 'admin', `Uploaded ${files.length} media file(s)`);
      setToastMessage('Media asset(s) successfully uploaded and persisted to library!');
      setTimeout(() => setToastMessage(null), 3500);
      await loadMedia();
    } catch (err: any) {
      console.error('Upload error diagnostics:', err);
      let message = err?.message || 'Upload failed.';
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error && (parsed.error.includes('Missing') || parsed.error.includes('permission'))) {
          message = `Firebase Permission Denied (${parsed.path || 'media_library'}). Please verify that your account (${user?.email || 'unknown'}) is an authorized administrator.`;
        } else if (parsed.error) {
          message = parsed.error;
        }
      } catch {}
      alert(`Upload failed: ${message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    try {
      const id = `media-${Date.now().toString(36)}`;
      const name = manualName.trim() || `photo_${Date.now().toString(36)}.jpg`;
      const newItem: MediaItem = {
        id,
        name,
        url: manualUrl.trim(),
        sizeKb: 150,
        type: 'image/jpeg',
        dimensions: 'Web Asset',
        category: 'general',
        uploadedBy: user?.email || 'admin',
        createdAt: new Date().toISOString(),
      };

      await saveMediaItem(newItem);
      setToastMessage(`Added "${name}" to media library!`);
      setTimeout(() => setToastMessage(null), 3000);
      setManualUrl('');
      setManualName('');
      await loadMedia();
    } catch (err: any) {
      let message = err?.message || 'Failed to add media link.';
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error) message = parsed.error;
      } catch {}
      alert(`Failed to add link: ${message}`);
    }
  };

  const handleDeleteMedia = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from the media library?`)) return;
    try {
      await deleteMediaItem(item.id);
      await logAudit('delete_media', user?.email || 'admin', `Deleted media: ${item.name}`);
      setToastMessage(`Deleted "${item.name}"`);
      setTimeout(() => setToastMessage(null), 2500);
      await loadMedia();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || (item.category && item.category.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hidden native input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            VIP Media &amp; High-Resolution Asset Library
          </h2>
          <p className="text-xs text-neutral-400">
            Upload images from your computer or link external high-resolution photography for tours, banners, and vehicles.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecc15a] to-[#c29b38] hover:opacity-90 text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">computer</span>
          <span>{isUploading ? `Uploading (${uploadProgress}%)...` : 'Upload from Computer'}</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Upload Dragzone & Quick Link Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Computer Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="lg:col-span-2 border-2 border-dashed border-[#282a2e] hover:border-[#ecc15a]/60 bg-[#111317] rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-[#111317]/80 flex flex-col items-center justify-center space-y-2 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#ecc15a]/10 border border-[#ecc15a]/30 text-[#ecc15a] flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[26px]">upload_file</span>
          </div>
          <div className="text-sm font-bold text-white">
            Click or drag &amp; drop photos from your computer
          </div>
          <p className="text-xs text-neutral-400">
            Supports JPG, PNG, WebP, AVIF. Automatically optimized for sub-second page loads.
          </p>
        </div>

        {/* Or Add from URL */}
        <form
          onSubmit={handleAddManualUrl}
          className="bg-[#111317] border border-[#282a2e] p-4 rounded-2xl flex flex-col justify-between space-y-3"
        >
          <div className="text-xs font-bold text-[#ecc15a] uppercase tracking-wider">
            Or Add Web Photo Link
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="Photo label (optional)"
              className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#ecc15a]"
            />
            <input
              type="url"
              required
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="Paste direct URL (https://...)"
              className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-[#ecc15a]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Add Photo Link
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111317] p-3 rounded-xl border border-[#282a2e]">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['all', 'experience', 'hero', 'vehicle', 'general'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#ecc15a] text-[#111317] font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-[#1e2024]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-[#1e2024] border border-[#282a2e] text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:border-[#ecc15a] outline-none placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Media Gallery Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading media assets...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-[#111317] border border-[#282a2e] p-12 text-center rounded-xl space-y-2">
          <span className="material-symbols-outlined text-4xl text-neutral-600">photo_library</span>
          <div className="text-white font-medium text-sm">No media items found</div>
          <p className="text-xs text-neutral-400">Upload photos from your computer to populate this gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group bg-[#111317] border border-[#282a2e] rounded-xl overflow-hidden hover:border-[#ecc15a]/50 transition-all flex flex-col shadow-sm"
            >
              <div className="h-44 w-full bg-[#1e2024] overflow-hidden relative">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteMedia(item)}
                    className="w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center shadow-md cursor-pointer"
                    title="Delete media"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>
                {item.category && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-[#ecc15a] font-mono capitalize">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="p-3 bg-[#111317] flex-1 flex flex-col justify-between border-t border-[#282a2e] space-y-2">
                <div>
                  <div className="text-xs font-semibold text-white truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {item.sizeKb} KB • {item.dimensions || 'Web Image'}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#282a2e] flex items-center justify-between">
                  <button
                    onClick={() => copyUrl(item)}
                    className="flex-1 py-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-[#ecc15a] text-xs font-bold border border-[#282a2e] hover:border-[#ecc15a]/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {copiedId === item.id ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedId === item.id ? 'Copied URL!' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
