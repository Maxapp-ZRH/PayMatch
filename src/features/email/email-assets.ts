/**
 * Email Assets Utility
 *
 * Handles loading and encoding of assets for inline email embedding.
 * Uses Resend's CID (Content-ID) method for inline images.
 */

/**
 * Get the PayMatch logo URL for email templates
 * Uses a URL that works in both development and production
 */
export function getPayMatchLogoUrl(): string {
  // Use the app URL from environment or default to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/logo.png`;
}

/**
 * Get all standard email attachments (currently none needed)
 * Since we're using direct URLs in templates, no attachments needed
 */
export function getStandardEmailAttachments() {
  return [];
}

/**
 * Check if an asset file exists (client-side compatible)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assetExists(_filename: string): boolean {
  // Always return true for client-side
  // In production, you might want to check against a CDN or known assets
  return true;
}

/**
 * Get asset file size in bytes (client-side compatible)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAssetSize(_filename: string): number {
  // Return 0 for client-side
  // In production, you might want to get this from a CDN or API
  return 0;
}
