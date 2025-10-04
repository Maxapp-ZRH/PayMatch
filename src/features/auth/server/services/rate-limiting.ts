/**
 * Rate Limiting Service
 *
 * Provides rate limiting functionality for auth operations.
 * Currently uses in-memory storage, but can be easily migrated to Redis.
 */

// Simple in-memory rate limiting (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Check if an operation is within rate limits
 * @param identifier - Unique identifier for the rate limit (e.g., email, IP)
 * @param limit - Maximum number of attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if within limits, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;

  const current = rateLimitMap.get(key);

  if (!current) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  // Reset if window has passed
  if (now - current.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  // Check if within limit
  if (current.count >= limit) {
    return false;
  }

  // Increment count
  current.count++;
  rateLimitMap.set(key, current);
  return true;
}

/**
 * Get remaining attempts for an identifier
 * @param identifier - Unique identifier for the rate limit
 * @param limit - Maximum number of attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns number of remaining attempts
 */
export function getRemainingAttempts(
  identifier: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): number {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;

  const current = rateLimitMap.get(key);

  if (!current) {
    return limit;
  }

  // Reset if window has passed
  if (now - current.lastReset > windowMs) {
    return limit;
  }

  return Math.max(0, limit - current.count);
}

/**
 * Clear rate limit for an identifier
 * @param identifier - Unique identifier for the rate limit
 */
export function clearRateLimit(identifier: string): void {
  const key = `rate_limit_${identifier}`;
  rateLimitMap.delete(key);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitMap.clear();
}
