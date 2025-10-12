/**
 * Redis Service
 *
 * Provides Redis client and operations for caching, rate limiting, and session management.
 * Uses ioredis for production-ready Redis integration.
 */

import Redis from 'ioredis';
import { REDIS_CONFIG } from '@/config/redis-config';

// Validate Redis URL
function getRedisUrl(): string {
  try {
    const redisUrl = process.env.REDIS_URL;

    // If no Redis URL is provided, return a default local URL
    if (!redisUrl || typeof redisUrl !== 'string' || redisUrl.trim() === '') {
      console.log('No REDIS_URL provided, using localhost fallback');
      return 'redis://localhost:6379';
    }

    // Basic validation of Redis URL format
    try {
      const url = new URL(redisUrl);
      // Additional validation for Redis URL
      if (url.protocol !== 'redis:' && url.protocol !== 'rediss:') {
        throw new Error('Invalid protocol, must be redis: or rediss:');
      }
      return redisUrl;
    } catch (urlError) {
      console.warn(
        'Invalid REDIS_URL format, falling back to localhost:',
        urlError
      );
      return 'redis://localhost:6379';
    }
  } catch (error) {
    console.error('Error processing REDIS_URL:', error);
    return 'redis://localhost:6379';
  }
}

// Lazy Redis client initialization
let redis: Redis | null = null;
let redisInitialized = false;

/**
 * Get Redis client with true lazy initialization
 */
function getRedisClient(): Redis | null {
  if (!redisInitialized) {
    try {
      // Check if we're in Edge Runtime
      const isEdgeRuntime =
        (typeof process !== 'undefined' &&
          process.env.NEXT_RUNTIME === 'edge') ||
        (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis);

      if (isEdgeRuntime) {
        console.log(
          'Running in Edge Runtime, Redis may not be fully supported'
        );
      }

      const redisUrl = getRedisUrl();
      console.log(
        'Initializing Redis client with URL:',
        redisUrl.replace(/\/\/.*@/, '//***:***@')
      ); // Hide credentials in logs

      // Additional safety check for the URL
      if (!redisUrl || typeof redisUrl !== 'string') {
        throw new Error('Invalid Redis URL');
      }

      // Additional validation for Edge Runtime
      if (isEdgeRuntime) {
        // In Edge Runtime, we need to be more careful
        console.log('Using Edge Runtime compatible Redis configuration');
      }

      // Create Redis client with optimized configuration
      redis = new Redis(redisUrl, {
        ...REDIS_CONFIG.CONNECTION,
        // Override with URL-specific settings
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
        enableReadyCheck: false,
        family: 4, // Force IPv4
      });

      // Handle Redis connection events
      redis.on('connect', () => {
        console.log('Redis connected successfully');
      });

      redis.on('error', (error) => {
        console.error('Redis connection error:', error);
        // Don't crash the application on Redis errors
      });

      redis.on('close', () => {
        console.log('Redis connection closed');
      });

      redis.on('reconnecting', () => {
        console.log('Redis reconnecting...');
      });

      redisInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      redis = null;
      redisInitialized = true;
    }
  }

  return redis;
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) return false;

    await client.ping();
    return true;
  } catch (error) {
    console.warn('Redis not available:', error);
    return false;
  }
}

/**
 * Redis client instance (completely lazy - only created when accessed)
 */
export function getRedisClientInstance(): Redis | null {
  return getRedisClient();
}

/**
 * Set a key-value pair in Redis with optional expiration
 * @param key - Redis key
 * @param value - Value to store
 * @param ttlSeconds - Time to live in seconds (optional)
 */
export async function setRedisKey(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping SET operation');
      return false;
    }

    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, value);
    } else {
      await client.set(key, value);
    }
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
}

/**
 * Get a value from Redis by key
 * @param key - Redis key
 * @returns value or null if not found
 */
export async function getRedisKey(key: string): Promise<string | null> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping GET operation');
      return null;
    }

    const value = await client.get(key);
    return value;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

/**
 * Delete a key from Redis
 * @param key - Redis key
 * @returns true if key was deleted
 */
export async function deleteRedisKey(key: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping DEL operation');
      return false;
    }

    const result = await client.del(key);
    return result > 0;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
}

/**
 * Check if a key exists in Redis
 * @param key - Redis key
 * @returns true if key exists
 */
export async function existsRedisKey(key: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping EXISTS operation');
      return false;
    }

    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    console.error('Redis EXISTS error:', error);
    return false;
  }
}

/**
 * Increment a counter in Redis
 * @param key - Redis key
 * @param increment - Amount to increment by (default: 1)
 * @returns new counter value
 */
export async function incrementRedisCounter(
  key: string,
  increment = 1
): Promise<number> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping INCR operation');
      return 0;
    }

    const result = await client.incrby(key, increment);
    return result;
  } catch (error) {
    console.error('Redis INCR error:', error);
    return 0;
  }
}

/**
 * Set expiration for a key
 * @param key - Redis key
 * @param ttlSeconds - Time to live in seconds
 * @returns true if expiration was set
 */
export async function expireRedisKey(
  key: string,
  ttlSeconds: number
): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping EXPIRE operation');
      return false;
    }

    const result = await client.expire(key, ttlSeconds);
    return result === 1;
  } catch (error) {
    console.error('Redis EXPIRE error:', error);
    return false;
  }
}

/**
 * Store a JSON object in Redis with optional expiration
 * @param key - Redis key
 * @param value - Object to store
 * @param ttlSeconds - Time to live in seconds (optional)
 */
export async function setRedisObject(
  key: string,
  value: Record<string, unknown>,
  ttlSeconds?: number
): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(value);
    return await setRedisKey(key, jsonValue, ttlSeconds);
  } catch (error) {
    console.error('Redis SET object error:', error);
    return false;
  }
}

/**
 * Get a JSON object from Redis by key
 * @param key - Redis key
 * @returns parsed object or null if not found
 */
export async function getRedisObject<T = Record<string, unknown>>(
  key: string
): Promise<T | null> {
  try {
    const value = await getRedisKey(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Redis GET object error:', error);
    return null;
  }
}

/**
 * Get multiple keys from Redis
 * @param keys - Array of Redis keys
 * @returns array of values (null for missing keys)
 */
export async function getRedisKeys(keys: string[]): Promise<(string | null)[]> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping MGET operation');
      return keys.map(() => null);
    }

    if (keys.length === 0) return [];
    return await client.mget(...keys);
  } catch (error) {
    console.error('Redis MGET error:', error);
    return keys.map(() => null);
  }
}

/**
 * Delete multiple keys from Redis
 * @param keys - Array of Redis keys to delete
 * @returns number of keys deleted
 */
export async function deleteRedisKeys(keys: string[]): Promise<number> {
  try {
    const client = getRedisClient();
    if (!client) {
      console.warn('Redis client not available, skipping MDEL operation');
      return 0;
    }

    if (keys.length === 0) return 0;
    return await client.del(...keys);
  } catch (error) {
    console.error('Redis MDEL error:', error);
    return 0;
  }
}
