/**
 * Client IP Extraction Utility
 *
 * Utility functions for extracting client IP addresses from requests.
 * Used for audit logging and general IP tracking.
 */

/**
 * Extract client IP from request headers
 * @param request - Request object
 * @returns Client IP address
 */
export function extractClientIP(request: Request): string {
  try {
    // Check for forwarded headers first (common in production)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const firstIP = forwarded.split(',')[0].trim();
      if (isValidIP(firstIP)) {
        return firstIP;
      }
    }

    // Check for real IP header
    const realIP = request.headers.get('x-real-ip');
    if (realIP && isValidIP(realIP)) {
      return realIP;
    }

    // Check for CF-Connecting-IP (Cloudflare)
    const cfIP = request.headers.get('cf-connecting-ip');
    if (cfIP && isValidIP(cfIP)) {
      return cfIP;
    }

    // Check for X-Client-IP
    const clientIP = request.headers.get('x-client-ip');
    if (clientIP && isValidIP(clientIP)) {
      return clientIP;
    }

    // Fallback to unknown
    return 'unknown';
  } catch (error) {
    console.error('Error extracting client IP:', error);
    return 'unknown';
  }
}

/**
 * Validate IP address format
 * @param ip - IP address to validate
 * @returns true if valid IP format
 */
function isValidIP(ip: string): boolean {
  if (!ip || typeof ip !== 'string') {
    return false;
  }

  // Basic IP validation (IPv4 and IPv6)
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
