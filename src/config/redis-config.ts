/**
 * Redis Configuration
 *
 * Optimized Redis configuration for app-level features only.
 * Supabase Auth handles all authentication rate limiting.
 * Redis is used for caching, API rate limiting, and app-level features.
 */

export const REDIS_CONFIG = {
  // App-level rate limiting (non-auth operations)
  RATE_LIMITS: {
    // API rate limiting
    API_CALLS: {
      limit: 1000, // Increased for better UX
      windowMs: 60 * 1000, // 1 minute
    },
    // File upload rate limiting
    FILE_UPLOADS: {
      limit: 20, // Increased for better UX
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    // Email sending rate limiting (non-auth emails)
    EMAIL_SENDING: {
      limit: 50, // Increased for better UX
      windowMs: 60 * 1000, // 1 minute
    },
    // Newsletter subscription rate limiting
    NEWSLETTER_SUBSCRIPTION: {
      limit: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    // Support ticket rate limiting
    SUPPORT_TICKETS: {
      limit: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    // General IP rate limiting for abuse prevention
    IP_GENERAL: {
      limit: 1000,
      windowMs: 60 * 1000, // 1 minute
    },
  },

  // Cache configurations with optimized TTLs
  CACHE: {
    // User profile cache (longer TTL since it changes infrequently)
    USER_PROFILE_TTL: 2 * 60 * 60, // 2 hours in seconds
    // Organization cache (longer TTL since it changes infrequently)
    ORGANIZATION_TTL: 60 * 60, // 1 hour in seconds
    // API response cache (shorter TTL for real-time data)
    API_RESPONSE_TTL: 2 * 60, // 2 minutes in seconds
    // Dashboard data cache
    DASHBOARD_DATA_TTL: 5 * 60, // 5 minutes in seconds
    // Invoice data cache
    INVOICE_DATA_TTL: 10 * 60, // 10 minutes in seconds
    // Client data cache
    CLIENT_DATA_TTL: 30 * 60, // 30 minutes in seconds
  },

  // Optimized key prefixes
  KEY_PREFIXES: {
    RATE_LIMIT: 'rl', // Shortened for efficiency
    CACHE: 'cache',
    USER_PROFILE: 'user',
    ORGANIZATION: 'org',
    DASHBOARD: 'dash',
    INVOICE: 'inv',
    CLIENT: 'client',
    EMAIL: 'email',
    SUPPORT: 'support',
    API_RESPONSE: 'api',
  },

  // Redis connection optimization
  CONNECTION: {
    // Connection pool settings
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    connectTimeout: 10000,
    commandTimeout: 5000,
    enableReadyCheck: false,
    family: 4, // Force IPv4
    // Retry settings
    retryDelayOnFailover: 100,
    // Memory optimization
    maxmemoryPolicy: 'allkeys-lru',
  },
} as const;

export type RateLimitType = keyof typeof REDIS_CONFIG.RATE_LIMITS;
export type CacheType = keyof typeof REDIS_CONFIG.KEY_PREFIXES;
