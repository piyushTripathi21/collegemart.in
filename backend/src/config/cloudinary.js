import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary from environment variables
// Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in your .env
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[CLOUDINARY] Configured — images will be stored in Cloudinary');
} else {
  console.warn('[CLOUDINARY] Not configured — falling back to local disk storage.');
  console.warn('[CLOUDINARY] Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env to enable.');
}

/**
 * Upload a local file to Cloudinary.
 * Falls back gracefully if Cloudinary is not configured (returns local path).
 * @param {string} localFilePath - Absolute path to the temp file on disk
 * @param {string} folder - Cloudinary folder (e.g. 'products', 'profiles')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadToCloudinary(localFilePath, folder = 'general') {
  if (!isCloudinaryConfigured) {
    // Return a local /uploads/ URL as fallback
    const filename = localFilePath.split(/[\\/]/).pop();
    return `/uploads/${filename}`;
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: `collegemart/${folder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    // Delete temp file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error('[CLOUDINARY] Upload failed:', error);
    // Fallback: keep local file and return local URL
    const filename = localFilePath.split(/[\\/]/).pop();
    return `/uploads/${filename}`;
  }
}

/**
 * Delete an image from Cloudinary by URL.
 * Extracts the public_id from the URL and deletes it.
 * Safe to call even if Cloudinary is not configured or URL is local.
 * @param {string} imageUrl - The Cloudinary secure_url of the image
 */
export async function deleteFromCloudinary(imageUrl) {
  if (!isCloudinaryConfigured || !imageUrl || !imageUrl.includes('cloudinary.com')) {
    return; // Nothing to do for local files or if not configured
  }

  try {
    // Extract public_id from URL: .../upload/v123456/collegemart/products/abc.jpg → collegemart/products/abc
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length < 2) return;
    const withVersion = urlParts[1]; // e.g. v1234567/collegemart/products/abc.jpg
    const withoutVersion = withVersion.replace(/^v\d+\//, ''); // collegemart/products/abc.jpg
    const publicId = withoutVersion.replace(/\.[^.]+$/, ''); // remove extension
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('[CLOUDINARY] Delete failed:', err);
  }
}

export { isCloudinaryConfigured };
