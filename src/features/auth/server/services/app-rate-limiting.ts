/**
 * App-Level Rate Limiting Service
 *
 * Optimized rate limiting for non-auth operations.
 * Handles API calls, file uploads, email sending, and other app-level features.
 */

import {
  getRedisKey,
  setRedisKey,
  incrementRedisCounter,
  expireRedisKey,
} from './redis';
import { REDIS_CONFIG, type RateLimitType } from '@/config/redis-config';

/**
 * Check if an operation is within app-level rate limits
 * @param identifier - Unique identifier for the rate limit (e.g., userId, IP)
 * @param rateLimitType - Type of rate limit from config
 * @returns true if within limits, false if rate limited
 */
export async function checkAppRateLimit(
  identifier: string,
  rateLimitType: RateLimitType
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const config = REDIS_CONFIG.RATE_LIMITS[rateLimitType];
  const key = `${REDIS_CONFIG.KEY_PREFIXES.RATE_LIMIT}:${rateLimitType}:${identifier}`;
  const windowSeconds = Math.floor(config.windowMs / 1000);
  const resetTime = Date.now() + config.windowMs;

  try {
    // Get current count
    const currentCount = await getRedisKey(key);

    if (!currentCount) {
      // First request - set count to 1 and set expiration
      await setRedisKey(key, '1', windowSeconds);
      return {
        allowed: true,
        remaining: config.limit - 1,
        resetTime,
      };
    }

    const count = parseInt(currentCount, 10);

    // Check if within limit
    if (count >= config.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }

    // Increment count
    const newCount = await incrementRedisCounter(key);

    // Set expiration if this is the first increment after key creation
    if (newCount === 1) {
      await expireRedisKey(key, windowSeconds);
    }

    return {
      allowed: newCount <= config.limit,
      remaining: Math.max(0, config.limit - newCount),
      resetTime,
    };
  } catch (error) {
    console.error('App rate limit check error:', error);
    // On error, allow the request (fail open)
    return {
      allowed: true,
      remaining: config.limit,
      resetTime,
    };
  }
}

/**
 * Get remaining attempts for an identifier
 * @param identifier - Unique identifier for the rate limit
 * @param rateLimitType - Type of rate limit from config
 * @returns number of remaining attempts and reset time
 */
export async function getAppRateLimitStatus(
  identifier: string,
  rateLimitType: RateLimitType
): Promise<{ remaining: number; resetTime: number }> {
  const config = REDIS_CONFIG.RATE_LIMITS[rateLimitType];
  const key = `${REDIS_CONFIG.KEY_PREFIXES.RATE_LIMIT}:${rateLimitType}:${identifier}`;
  const resetTime = Date.now() + config.windowMs;

  try {
    const currentCount = await getRedisKey(key);

    if (!currentCount) {
      return {
        remaining: config.limit,
        resetTime,
      };
    }

    const count = parseInt(currentCount, 10);
    return {
      remaining: Math.max(0, config.limit - count),
      resetTime,
    };
  } catch (error) {
    console.error('Get app rate limit status error:', error);
    return {
      remaining: config.limit,
      resetTime,
    };
  }
}

/**
 * Clear rate limit for an identifier
 * @param identifier - Unique identifier for the rate limit
 * @param rateLimitType - Type of rate limit from config
 */
export async function clearAppRateLimit(
  identifier: string,
  rateLimitType: RateLimitType
): Promise<boolean> {
  try {
    const key = `${REDIS_CONFIG.KEY_PREFIXES.RATE_LIMIT}:${rateLimitType}:${identifier}`;
    await expireRedisKey(key, 0); // Expire immediately
    return true;
  } catch (error) {
    console.error('Clear app rate limit error:', error);
    return false;
  }
}

/**
 * Rate limit API calls
 */
export async function rateLimitApiCalls(
  userId: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  return checkAppRateLimit(userId, 'API_CALLS');
}

/**
 * Rate limit file uploads
 */
export async function rateLimitFileUploads(
  userId: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  return checkAppRateLimit(userId, 'FILE_UPLOADS');
}

/**
 * Rate limit email sending (non-auth emails)
 */
export async function rateLimitEmailSending(
  userId: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  return checkAppRateLimit(userId, 'EMAIL_SENDING');
}

/**
 * Rate limit newsletter subscriptions
 */
export async function rateLimitNewsletterSubscription(
  email: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  return checkAppRateLimit(email, 'NEWSLETTER_SUBSCRIPTION');
}

/**
 * Rate limit support tickets
 */
export async function rateLimitSupportTickets(
  userId: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  return checkAppRateLimit(userId, 'SUPPORT_TICKETS');
}

/**
 * Rate limit general IP requests
 */
export async function rateLimitGeneralIP(
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  return checkAppRateLimit(ip, 'IP_GENERAL');
}
