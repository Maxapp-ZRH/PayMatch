/**
 * Client Information Utilities
 *
 * Utilities for extracting client-side information like IP and user agent
 * that can be safely passed to server actions.
 */

/**
 * Get client IP address using a public IP service
 * This is a fallback when server-side IP extraction is not available
 */
export async function getClientIP(): Promise<string> {
  try {
    // Use a reliable IP detection service
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.ip || 'unknown';
    }
  } catch (error) {
    console.warn('Failed to get client IP:', error);
  }

  return 'unknown';
}

/**
 * Get user agent string from the browser
 */
export function getUserAgent(): string {
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    return navigator.userAgent;
  }
  return 'unknown';
}

/**
 * Get browser locale
 */
export function getBrowserLocale(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.language || 'de-CH';
  }
  return 'de-CH';
}
