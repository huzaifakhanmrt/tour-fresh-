import React, { useState, useRef, useEffect } from 'react';
import { processAndCompressImage, validateMediaFile, ALLOWED_IMAGE_TYPES } from '../../utils/mediaUpload';
import { getMediaItems, saveMediaItem } from '../../services/db';
import { MediaItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MediaUploaderProps {
  label: string;
  helperText?: string;
  value: string; // URL or Data URL
  onChange: (url: string) => void;
  aspectRatio?: 'landscape' | 'square' | 'wide' | 'auto';
  category?: 'experience' | 'hero' | 'vehicle' | 'logo' | 'general';
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  helperText = 'JPG, PNG, WebP or AVIF (auto-optimized for instant loading)',
  value,
  onChange,
  aspectRatio = 'landscape',
  category = 'general',
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Media Library modal selector
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState<boolean>(false);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const processed = await processAndCompressImage(file, (pct) => {
        setUploadProgress(pct);
      });

      // Save to central media library in Firestore/cache
      const mediaRecord: MediaItem = {
        id: processed.id,
        name: processed.name,
        url: processed.url,
        sizeKb: processed.sizeKb,
        type: processed.type,
        dimensions: processed.dimensions,
        category,
        uploadedBy: user?.email || 'admin',
        createdAt: new Date().toISOString(),
      };

      await saveMediaItem(mediaRecord);
      onChange(processed.url);
    } catch (err: any) {
      console.error('Upload processing failed:', err);
      let msg = err?.message || 'Upload failed. Please try again.';
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error && (parsed.error.includes('Missing') || parsed.error.includes('permission'))) {
          msg = `Firebase Permission Denied (${parsed.path || 'media_library'}). Please ensure your account has administrator privileges.`;
        } else if (parsed.error) {
          msg = parsed.error;
        }
      } catch {}
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const openLibraryModal = async () => {
    setIsLibraryOpen(true);
    setIsLoadingLibrary(true);
    try {
      const items = await getMediaItems();
      setMediaLibrary(items);
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const selectFromLibrary = (item: MediaItem) => {
    onChange(item.url);
    setIsLibraryOpen(false);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'wide':
        return 'aspect-21/9';
      case 'landscape':
      default:
        return 'aspect-16/9';
    }
  };

  return (
    <div className="space-y-2">
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
        <button
          type="button"
          onClick={openLibraryModal}
          className="text-[11px] text-[#ecc15a] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">photo_library</span>
          <span>Choose from Media Library</span>
        </button>
      </div>

      {/* Main Dropzone / Image Preview Area */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-[#ecc15a]/40 bg-[#0c0e12] shadow-md">
          <div className={`w-full ${getAspectClass()} overflow-hidden bg-neutral-900`}>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-lg bg-[#ecc15a] text-[#111317] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#ffdf99] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Replace from Computer</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-lg bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-red-500 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Remove</span>
            </button>
          </div>

          <div className="p-2.5 bg-[#17191e] border-t border-[#282a2e] flex items-center justify-between text-[11px] text-neutral-400">
            <span className="truncate max-w-[240px] text-neutral-300">Image attached</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Ready
            </span>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? 'border-[#ecc15a] bg-[#ecc15a]/10 scale-[1.01]'
              : 'border-[#282a2e] hover:border-[#ecc15a]/50 bg-[#0c0e12]/60'
          }`}
        >
          {isUploading ? (
            <div className="py-4 space-y-3">
              <div className="w-10 h-10 border-2 border-[#ecc15a] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs text-[#ecc15a] font-semibold">
                Optimizing &amp; Uploading ({uploadProgress}%)...
              </div>
              <div className="w-48 h-1.5 bg-neutral-800 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ecc15a] to-[#c29b38] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#ecc15a]/10 border border-[#ecc15a]/30 text-[#ecc15a] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ecc15a] to-[#c29b38] text-[#111317] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">computer</span>
                  <span>Upload from Computer</span>
                </button>
                <p className="text-xs text-neutral-400 mt-2">
                  or drag and drop your photo here
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-700/50 text-red-300 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] shrink-0 text-red-400">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Central Media Library Selection Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[85vh] bg-[#111317] border border-[#ecc15a]/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#282a2e] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ecc15a]">photo_library</span>
                  Select from MZ Media Library
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Choose from existing assets or upload a new file from your device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 border-b border-[#282a2e] bg-[#0c0e12] flex items-center justify-between gap-4">
              <span className="text-xs text-neutral-400">
                {mediaLibrary.length} image{mediaLibrary.length === 1 ? '' : 's'} stored in library
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-lg bg-[#ecc15a] text-[#111317] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdf99] transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                <span>Upload New from Computer</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoadingLibrary ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-2 border-[#ecc15a] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">Loading media library...</p>
                </div>
              ) : mediaLibrary.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="material-symbols-outlined text-neutral-600 text-[48px] mb-2 block">
                    image_not_supported
                  </span>
                  <p className="text-sm font-semibold text-neutral-300">No media uploaded yet</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Upload images from your computer to start building your luxury asset library.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#ecc15a] text-[#111317] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">computer</span>
                    <span>Upload First Photo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaLibrary.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => selectFromLibrary(item)}
                      className="group relative rounded-xl overflow-hidden border border-[#282a2e] hover:border-[#ecc15a] bg-[#0c0e12] cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-black"
                    >
                      <div className="aspect-16/10 w-full overflow-hidden bg-neutral-900">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-white truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                          <span>{item.sizeKb} KB</span>
                          <span className="text-[#ecc15a] group-hover:underline">Select</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#282a2e] flex justify-end">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface GalleryUploaderProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  label,
  images,
  onChange,
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMultipleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateMediaFile(file);
        if (validation.valid) {
          const processed = await processAndCompressImage(file);
          newUrls.push(processed.url);
          await saveMediaItem({
            id: processed.id,
            name: processed.name,
            url: processed.url,
            sizeKb: processed.sizeKb,
            type: processed.type,
            dimensions: processed.dimensions,
            category: 'experience',
            uploadedBy: user?.email || 'admin',
            createdAt: new Date().toISOString(),
          });
        }
      }
      onChange([...images, ...newUrls]);
    } catch (err: any) {
      console.error('Gallery upload error:', err);
      setErrorMessage(err.message || 'One or more images failed to process.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImageAt = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleMultipleFiles(e.target.files)}
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {label} ({images.length} photos)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3 py-1.5 rounded-lg bg-[#ecc15a] text-[#111317] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdf99] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
          <span>{isUploading ? 'Uploading...' : 'Add Photos from Computer'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-700/50 text-red-300 text-xs">
          {errorMessage}
        </div>
      )}

      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-[#282a2e] hover:border-[#ecc15a]/50 rounded-xl p-6 text-center cursor-pointer bg-[#0c0e12]/40 transition-colors"
        >
          <span className="material-symbols-outlined text-neutral-500 text-[28px] mb-1 block">
            collections
          </span>
          <p className="text-xs text-neutral-400">Click to upload experience gallery photos</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Select multiple photos from your device</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-[#282a2e] bg-[#0c0e12]"
            >
              <div className="aspect-16/10 w-full overflow-hidden bg-neutral-900">
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeImageAt(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                title="Remove photo"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-neutral-300 font-mono">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
