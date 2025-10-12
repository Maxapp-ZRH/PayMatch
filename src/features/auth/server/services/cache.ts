/**
 * Redis Cache Service
 *
 * Optimized caching service for app-level data.
 * Provides efficient caching for user profiles, organizations, and API responses.
 */

import { getRedisObject, setRedisObject, deleteRedisKey } from './redis';
import { REDIS_CONFIG, type CacheType } from '@/config/redis-config';
import type { UserProfile, Organization } from '../../types/session';

/**
 * Generate cache key with optimized prefix
 */
function getCacheKey(type: CacheType, identifier: string): string {
  const prefix =
    REDIS_CONFIG.KEY_PREFIXES[
      type.toUpperCase() as keyof typeof REDIS_CONFIG.KEY_PREFIXES
    ] || 'cache';
  return `${prefix}:${identifier}`;
}

/**
 * Cache user profile data
 */
export async function cacheUserProfile(
  userId: string,
  profile: UserProfile
): Promise<boolean> {
  try {
    const key = getCacheKey('USER_PROFILE', userId);
    const ttl = REDIS_CONFIG.CACHE.USER_PROFILE_TTL;

    return await setRedisObject(key, profile, ttl);
  } catch (error) {
    console.error('Cache user profile error:', error);
    return false;
  }
}

/**
 * Get cached user profile
 */
export async function getCachedUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const key = getCacheKey('USER_PROFILE', userId);
    return await getRedisObject<UserProfile>(key);
  } catch (error) {
    console.error('Get cached user profile error:', error);
    return null;
  }
}

/**
 * Cache organization data
 */
export async function cacheOrganization(
  orgId: string,
  organization: Organization
): Promise<boolean> {
  try {
    const key = getCacheKey('ORGANIZATION', orgId);
    const ttl = REDIS_CONFIG.CACHE.ORGANIZATION_TTL;

    return await setRedisObject(key, organization, ttl);
  } catch (error) {
    console.error('Cache organization error:', error);
    return false;
  }
}

/**
 * Get cached organization
 */
export async function getCachedOrganization(
  orgId: string
): Promise<Organization | null> {
  try {
    const key = getCacheKey('ORGANIZATION', orgId);
    return await getRedisObject<Organization>(key);
  } catch (error) {
    console.error('Get cached organization error:', error);
    return null;
  }
}

/**
 * Cache dashboard data
 */
export async function cacheDashboardData(
  userId: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const key = getCacheKey('DASHBOARD', userId);
    const ttl = REDIS_CONFIG.CACHE.DASHBOARD_DATA_TTL;

    return await setRedisObject(key, data, ttl);
  } catch (error) {
    console.error('Cache dashboard data error:', error);
    return false;
  }
}

/**
 * Get cached dashboard data
 */
export async function getCachedDashboardData(
  userId: string
): Promise<Record<string, unknown> | null> {
  try {
    const key = getCacheKey('DASHBOARD', userId);
    return await getRedisObject<Record<string, unknown>>(key);
  } catch (error) {
    console.error('Get cached dashboard data error:', error);
    return null;
  }
}

/**
 * Cache API response
 */
export async function cacheApiResponse(
  endpoint: string,
  params: Record<string, unknown>,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const identifier = `${endpoint}:${JSON.stringify(params)}`;
    const key = getCacheKey('API_RESPONSE', identifier);
    const ttl = REDIS_CONFIG.CACHE.API_RESPONSE_TTL;

    return await setRedisObject(key, data, ttl);
  } catch (error) {
    console.error('Cache API response error:', error);
    return false;
  }
}

/**
 * Get cached API response
 */
export async function getCachedApiResponse<T = unknown>(
  endpoint: string,
  params: Record<string, unknown>
): Promise<T | null> {
  try {
    const identifier = `${endpoint}:${JSON.stringify(params)}`;
    const key = getCacheKey('API_RESPONSE', identifier);
    return await getRedisObject<T>(key);
  } catch (error) {
    console.error('Get cached API response error:', error);
    return null;
  }
}

/**
 * Invalidate user profile cache
 */
export async function invalidateUserProfileCache(
  userId: string
): Promise<boolean> {
  try {
    const key = getCacheKey('USER_PROFILE', userId);
    await deleteRedisKey(key);
    return true;
  } catch (error) {
    console.error('Invalidate user profile cache error:', error);
    return false;
  }
}

/**
 * Invalidate organization cache
 */
export async function invalidateOrganizationCache(
  orgId: string
): Promise<boolean> {
  try {
    const key = getCacheKey('ORGANIZATION', orgId);
    await deleteRedisKey(key);
    return true;
  } catch (error) {
    console.error('Invalidate organization cache error:', error);
    return false;
  }
}

/**
 * Invalidate dashboard cache
 */
export async function invalidateDashboardCache(
  userId: string
): Promise<boolean> {
  try {
    const key = getCacheKey('DASHBOARD', userId);
    await deleteRedisKey(key);
    return true;
  } catch (error) {
    console.error('Invalidate dashboard cache error:', error);
    return false;
  }
}

/**
 * Clear all caches for a user
 */
export async function clearUserCaches(userId: string): Promise<boolean> {
  try {
    await Promise.all([
      invalidateUserProfileCache(userId),
      invalidateDashboardCache(userId),
    ]);
    return true;
  } catch (error) {
    console.error('Clear user caches error:', error);
    return false;
  }
}

/**
 * Clear all caches for an organization
 */
export async function clearOrganizationCaches(orgId: string): Promise<boolean> {
  try {
    await invalidateOrganizationCache(orgId);
    return true;
  } catch (error) {
    console.error('Clear organization caches error:', error);
    return false;
  }
}
