/**
 * Client-Side Media Processor & Storage Helper for MZ Tourism Qatar
 * Handles image validation, high-fidelity canvas compression, and WebP conversion.
 */

export interface ProcessedMedia {
  id: string;
  url: string;
  name: string;
  type: string;
  sizeKb: number;
  dimensions: string;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const MAX_FILE_SIZE_MB = 10;

/**
 * Validates file type and size before upload
 */
export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please choose JPG, PNG, WebP, or AVIF.`,
    };
  }

  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `File is too large (${sizeMb.toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Compresses an image file client-side to an optimized WebP or JPEG data URL
 * Max dimension: 1600px width/height, preserving aspect ratio and quality.
 */
export async function processAndCompressImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<ProcessedMedia> {
  const validation = validateMediaFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  onProgress?.(15);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read file from your device.'));
    };

    reader.onload = (event) => {
      onProgress?.(40);
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to decode image data. Please ensure it is a valid image file.'));
      };

      img.onload = () => {
        onProgress?.(65);
        try {
          // Calculate bounded dimensions (max 1200px for optimum quality & lightweight persistence)
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context initialization failed.'));
            return;
          }

          // High quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          onProgress?.(85);

          // Export as image/webp (fallback to jpeg)
          let outputUrl = '';
          try {
            outputUrl = canvas.toDataURL('image/webp', 0.80);
            if (!outputUrl.startsWith('data:image/webp')) {
              outputUrl = canvas.toDataURL('image/jpeg', 0.82);
            }
          } catch {
            outputUrl = canvas.toDataURL('image/jpeg', 0.82);
          }

          // Calculate approximate size in KB
          const head = 'data:image/webp;base64,';
          const base64Str = outputUrl.substring(outputUrl.indexOf(',') + 1);
          const sizeKb = Math.round((base64Str.length * 3) / 4 / 1024);

          const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
          const id = `media-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

          onProgress?.(100);

          resolve({
            id,
            url: outputUrl,
            name: safeName,
            type: 'image/webp',
            sizeKb,
            dimensions: `${width} × ${height} px`,
          });
        } catch (err: any) {
          reject(new Error(`Image compression failed: ${err.message}`));
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
