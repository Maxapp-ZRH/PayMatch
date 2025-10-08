/**
 * IP-Based Rate Limiting Service
 *
 * Provides IP-based rate limiting functionality for enhanced security.
 * Uses Redis for persistent, distributed rate limiting by IP address.
 */

import {
  getRedisKey,
  setRedisKey,
  incrementRedisCounter,
  expireRedisKey,
} from './redis';
import { REDIS_CONFIG, type RateLimitType } from '@/config/redis-config';

/**
 * Extract IP address from request headers
 * Handles various proxy configurations (Vercel, Cloudflare, etc.)
 * Always returns a safe string to prevent charCodeAt errors
 */
export function extractClientIP(request: Request): string {
  try {
    // Check various headers for the real IP address
    const headers = request.headers;

    // Vercel
    const vercelIP = headers.get('x-vercel-forwarded-for');
    if (vercelIP && typeof vercelIP === 'string' && vercelIP.trim()) {
      const parts = vercelIP.split(',');
      if (parts && parts.length > 0) {
        const firstIP = parts[0]?.trim();
        if (firstIP && firstIP.length > 0) {
          return firstIP;
        }
      }
    }

    // Cloudflare
    const cloudflareIP = headers.get('cf-connecting-ip');
    if (
      cloudflareIP &&
      typeof cloudflareIP === 'string' &&
      cloudflareIP.trim()
    ) {
      return cloudflareIP.trim();
    }

    // Standard proxy headers
    const forwardedFor = headers.get('x-forwarded-for');
    if (
      forwardedFor &&
      typeof forwardedFor === 'string' &&
      forwardedFor.trim()
    ) {
      const parts = forwardedFor.split(',');
      if (parts && parts.length > 0) {
        const firstIP = parts[0]?.trim();
        if (firstIP && firstIP.length > 0) {
          return firstIP;
        }
      }
    }

    const realIP = headers.get('x-real-ip');
    if (realIP && typeof realIP === 'string' && realIP.trim()) {
      return realIP.trim();
    }

    // Fallback to connection remote address
    const connectionIP = headers.get('x-connection-remote-addr');
    if (
      connectionIP &&
      typeof connectionIP === 'string' &&
      connectionIP.trim()
    ) {
      return connectionIP.trim();
    }

    // Last resort - use a deterministic fallback string
    // This ensures we always return a valid string for rate limiting
    return '0.0.0.0';
  } catch (error) {
    console.warn('Error extracting client IP:', error);
    // Always return a safe fallback
    return '0.0.0.0';
  }
}

/**
 * Check if an IP address is within rate limits
 * @param ip - IP address to check
 * @param rateLimitType - Type of rate limit from config
 * @returns true if within limits, false if rate limited
 */
export async function checkIPRateLimit(
  ip: string,
  rateLimitType: RateLimitType
): Promise<boolean> {
  // Safety guard: ensure IP is always a valid string
  const safeIP = typeof ip === 'string' && ip.trim() ? ip.trim() : '0.0.0.0';

  const config = REDIS_CONFIG.RATE_LIMITS[rateLimitType];
  const key = `${REDIS_CONFIG.KEY_PREFIXES.IP_RATE_LIMIT}:${rateLimitType}:${safeIP}`;
  const windowSeconds = Math.floor(config.windowMs / 1000);

  try {
    // Get current count
    const currentCount = await getRedisKey(key);

    if (!currentCount) {
      // First request - set count to 1 and set expiration
      await setRedisKey(key, '1', windowSeconds);
      return true;
    }

    const count = parseInt(currentCount, 10);

    // Check if within limit
    if (count >= config.limit) {
      return false;
    }

    // Increment count
    const newCount = await incrementRedisCounter(key);

    // Set expiration if this is the first increment after key creation
    if (newCount === 1) {
      await expireRedisKey(key, windowSeconds);
    }

    return newCount <= config.limit;
  } catch (error) {
    console.error('IP rate limit check error:', error);
    // On error, allow the request (fail open)
    return true;
  }
}

/**
 * Get remaining attempts for an IP address
 * @param ip - IP address to check
 * @param rateLimitType - Type of rate limit from config
 * @returns number of remaining attempts
 */
export async function getIPRemainingAttempts(
  ip: string,
  rateLimitType: RateLimitType
): Promise<number> {
  const config = REDIS_CONFIG.RATE_LIMITS[rateLimitType];
  const key = `${REDIS_CONFIG.KEY_PREFIXES.IP_RATE_LIMIT}:${rateLimitType}:${ip}`;

  try {
    const currentCount = await getRedisKey(key);

    if (!currentCount) {
      return config.limit;
    }

    const count = parseInt(currentCount, 10);
    return Math.max(0, config.limit - count);
  } catch (error) {
    console.error('Get IP remaining attempts error:', error);
    return config.limit; // On error, assume full limit available
  }
}

/**
 * Clear rate limit for an IP address
 * @param ip - IP address to clear
 * @param rateLimitType - Type of rate limit from config
 */
export async function clearIPRateLimit(
  ip: string,
  rateLimitType: RateLimitType
): Promise<void> {
  const key = `${REDIS_CONFIG.KEY_PREFIXES.IP_RATE_LIMIT}:${rateLimitType}:${ip}`;

  try {
    await setRedisKey(key, '0', 1); // Set to 0 with 1 second TTL
  } catch (error) {
    console.error('Clear IP rate limit error:', error);
  }
}

/**
 * Check both email and IP rate limits
 * @param email - Email address
 * @param ip - IP address
 * @param emailRateLimitType - Email-based rate limit type
 * @param ipRateLimitType - IP-based rate limit type
 * @returns object with both rate limit results
 */
export async function checkDualRateLimit(
  email: string,
  ip: string,
  emailRateLimitType: RateLimitType,
  ipRateLimitType: RateLimitType
): Promise<{
  emailAllowed: boolean;
  ipAllowed: boolean;
  emailRemaining: number;
  ipRemaining: number;
}> {
  const [emailAllowed, ipAllowed, emailRemaining, ipRemaining] =
    await Promise.all([
      // Import the email rate limiting function
      import('./rate-limiting').then(({ checkRateLimit }) =>
        checkRateLimit(email, emailRateLimitType)
      ),
      checkIPRateLimit(ip, ipRateLimitType),
      import('./rate-limiting').then(({ getRemainingAttempts }) =>
        getRemainingAttempts(email, emailRateLimitType)
      ),
      getIPRemainingAttempts(ip, ipRateLimitType),
    ]);

  return {
    emailAllowed,
    ipAllowed,
    emailRemaining,
    ipRemaining,
  };
}

/**
 * Get rate limit information for monitoring
 * @param ip - IP address
 * @param rateLimitType - Type of rate limit
 * @returns rate limit information
 */
export async function getIPRateLimitInfo(
  ip: string,
  rateLimitType: RateLimitType
): Promise<{
  limit: number;
  remaining: number;
  resetTime: number;
  windowMs: number;
}> {
  const config = REDIS_CONFIG.RATE_LIMITS[rateLimitType];
  const key = `${REDIS_CONFIG.KEY_PREFIXES.IP_RATE_LIMIT}:${rateLimitType}:${ip}`;
  const windowSeconds = Math.floor(config.windowMs / 1000);

  try {
    const currentCount = await getRedisKey(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;
    const remaining = Math.max(0, config.limit - count);

    // Get TTL to calculate reset time
    const ttl = (await getRedisKey(`${key}:ttl`)) || windowSeconds.toString();
    const resetTime = Date.now() + parseInt(ttl, 10) * 1000;

    return {
      limit: config.limit,
      remaining,
      resetTime,
      windowMs: config.windowMs,
    };
  } catch (error) {
    console.error('Get IP rate limit info error:', error);
    return {
      limit: config.limit,
      remaining: config.limit,
      resetTime: Date.now() + config.windowMs,
      windowMs: config.windowMs,
    };
  }
}

/**
 * Check if IP is in a blocked list (for future enhancement)
 * @param ip - IP address to check
 * @returns true if IP is blocked
 */
export async function isIPBlocked(ip: string): Promise<boolean> {
  try {
    const blockedKey = `${REDIS_CONFIG.KEY_PREFIXES.IP_RATE_LIMIT}:blocked:${ip}`;
    const isBlocked = await getRedisKey(blockedKey);
    return !!isBlocked;
  } catch (error) {
    console.error('Check IP blocked error:', error);
    return false; // On error, assume not blocked
  }
}

/**
 * Block an IP address (for future enhancement)
 * @param ip - IP address to block
 * @param durationMs - Block duration in milliseconds
 */
export async function blockIP(
  ip: string,
  durationMs: number = 24 * 60 * 60 * 1000
): Promise<void> {
  try {
    const blockedKey = `${REDIS_CONFIG.KEY_PREFIXES.IP_RATE_LIMIT}:blocked:${ip}`;
    const durationSeconds = Math.floor(durationMs / 1000);
    await setRedisKey(blockedKey, '1', durationSeconds);
  } catch (error) {
    console.error('Block IP error:', error);
  }
}
