/**
 * Email Assets Utility
 *
 * Handles loading and encoding of assets for inline email embedding.
 * Uses Resend's CID (Content-ID) method for inline images.
 */

import fs from 'fs';
import path from 'path';

/**
 * Get the base64-encoded PayMatch logo for inline email embedding
 */
export function getPayMatchLogoAttachment() {
  try {
    // Read the logo file from the public directory
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');

    return {
      content: logoBase64,
      filename: 'paymatch-logo.png',
      contentId: 'paymatch-logo',
      contentType: 'image/png',
    };
  } catch (error) {
    console.error('Failed to load PayMatch logo:', error);
    // Return a fallback - you might want to use a remote URL instead
    return {
      path: 'https://paymatch.app/logo.png',
      filename: 'paymatch-logo.png',
      contentId: 'paymatch-logo',
      contentType: 'image/png',
    };
  }
}

/**
 * Get all standard email attachments (logo, etc.)
 */
export function getStandardEmailAttachments() {
  return [getPayMatchLogoAttachment()];
}

/**
 * Check if an asset file exists
 */
export function assetExists(filename: string): boolean {
  try {
    const assetPath = path.join(process.cwd(), 'public', filename);
    return fs.existsSync(assetPath);
  } catch {
    return false;
  }
}

/**
 * Get asset file size in bytes
 */
export function getAssetSize(filename: string): number {
  try {
    const assetPath = path.join(process.cwd(), 'public', filename);
    const stats = fs.statSync(assetPath);
    return stats.size;
  } catch {
    return 0;
  }
}
