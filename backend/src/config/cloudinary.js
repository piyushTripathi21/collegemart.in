import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

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

export async function uploadToCloudinary(localFilePath, folder = 'general') {
  if (!isCloudinaryConfigured) {

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

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error('[CLOUDINARY] Upload failed:', error);

    const filename = localFilePath.split(/[\\/]/).pop();
    return `/uploads/${filename}`;
  }
}

export async function deleteFromCloudinary(imageUrl) {
  if (!isCloudinaryConfigured || !imageUrl || !imageUrl.includes('cloudinary.com')) {
    return; // Nothing to do for local files or if not configured
  }

  try {

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
