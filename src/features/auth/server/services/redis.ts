/**
 * Redis Service
 *
 * Provides Redis client and operations for caching, rate limiting, and session management.
 * Uses ioredis for production-ready Redis integration.
 */

import Redis from 'ioredis';

// Create Redis client with connection pooling and error handling
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
});

// Handle Redis connection events
redis.on('connect', () => {});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('close', () => {});

/**
 * Redis client instance
 */
export const redisClient = redis;

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
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, value);
    } else {
      await redis.set(key, value);
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
    const value = await redis.get(key);
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
    const result = await redis.del(key);
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
    const result = await redis.exists(key);
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
    const result = await redis.incrby(key, increment);
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
    const result = await redis.expire(key, ttlSeconds);
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
    if (keys.length === 0) return [];
    return await redis.mget(...keys);
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
    if (keys.length === 0) return 0;
    return await redis.del(...keys);
  } catch (error) {
    console.error('Redis MDEL error:', error);
    return 0;
  }
}
