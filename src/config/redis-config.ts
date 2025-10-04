/**
 * Redis Configuration
 *
 * Centralized configuration for Redis settings and rate limiting.
 */

export const REDIS_CONFIG = {
  // Rate limiting configurations
  RATE_LIMITS: {
    // Email verification resend
    EMAIL_VERIFICATION: {
      limit: 10,
      windowMs: 5 * 60 * 1000, // 5 minutes
    },
    // Password reset
    PASSWORD_RESET: {
      limit: 3,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    // General auth operations
    AUTH_OPERATIONS: {
      limit: 10,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    // Login attempts
    LOGIN_ATTEMPTS: {
      limit: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  },

  // Cache configurations
  CACHE: {
    // Session cache TTL
    SESSION_TTL: 24 * 60 * 60, // 24 hours in seconds
    // User profile cache TTL
    USER_PROFILE_TTL: 60 * 60, // 1 hour in seconds
    // Organization cache TTL
    ORGANIZATION_TTL: 30 * 60, // 30 minutes in seconds
  },

  // Key prefixes for organization
  KEY_PREFIXES: {
    RATE_LIMIT: 'rate_limit',
    SESSION: 'session',
    USER_PROFILE: 'user_profile',
    ORGANIZATION: 'organization',
    PASSWORD_RESET: 'password_reset',
    EMAIL_VERIFICATION: 'email_verification',
  },
} as const;

export type RateLimitType = keyof typeof REDIS_CONFIG.RATE_LIMITS;
export type CacheType = keyof typeof REDIS_CONFIG.CACHE;
