/**
 * Rate Limiting Service
 *
 * Provides rate limiting functionality for auth operations.
 * Uses Redis for persistent, distributed rate limiting.
 */

import {
  getRedisKey,
  setRedisKey,
  incrementRedisCounter,
  expireRedisKey,
} from './redis';
import { REDIS_CONFIG, type RateLimitType } from '@/config/redis-config';

/**
 * Check if an operation is within rate limits using centralized config
 * @param identifier - Unique identifier for the rate limit (e.g., email, IP)
 * @param rateLimitType - Type of rate limit from config
 * @returns true if within limits, false if rate limited
 */
export async function checkRateLimit(
  identifier: string,
  rateLimitType: RateLimitType
): Promise<boolean> {
  const config = REDIS_CONFIG.RATE_LIMITS[rateLimitType];
  const key = `${REDIS_CONFIG.KEY_PREFIXES.RATE_LIMIT}:${rateLimitType}:${identifier}`;
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
    console.error('Rate limit check error:', error);
    // On error, allow the request (fail open)
    return true;
  }
}

/**
 * Get remaining attempts for an identifier using centralized config
 * @param identifier - Unique identifier for the rate limit
 * @param rateLimitType - Type of rate limit from config
 * @returns number of remaining attempts
 */
export async function getRemainingAttempts(
  identifier: string,
  rateLimitType: RateLimitType
): Promise<number> {
  const config = REDIS_CONFIG.RATE_LIMITS[rateLimitType];
  const key = `${REDIS_CONFIG.KEY_PREFIXES.RATE_LIMIT}:${rateLimitType}:${identifier}`;

  try {
    const currentCount = await getRedisKey(key);

    if (!currentCount) {
      return config.limit;
    }

    const count = parseInt(currentCount, 10);
    return Math.max(0, config.limit - count);
  } catch (error) {
    console.error('Get remaining attempts error:', error);
    return config.limit; // On error, assume full limit available
  }
}

/**
 * Clear rate limit for an identifier using centralized config
 * @param identifier - Unique identifier for the rate limit
 * @param rateLimitType - Type of rate limit from config
 */
export async function clearRateLimit(
  identifier: string,
  rateLimitType: RateLimitType
): Promise<void> {
  const key = `${REDIS_CONFIG.KEY_PREFIXES.RATE_LIMIT}:${rateLimitType}:${identifier}`;

  try {
    await setRedisKey(key, '0', 1); // Set to 0 with 1 second TTL
  } catch (error) {
    console.error('Clear rate limit error:', error);
  }
}

/**
 * Clear all rate limits (useful for testing)
 * Note: This is a destructive operation - use with caution
 */
export async function clearAllRateLimits(): Promise<void> {
  try {
    // This would require a Redis SCAN operation to find all rate_limit:* keys
    // For now, we'll just log a warning
    console.warn(
      'clearAllRateLimits: This operation requires Redis SCAN - not implemented'
    );
  } catch (error) {
    console.error('Clear all rate limits error:', error);
  }
}
