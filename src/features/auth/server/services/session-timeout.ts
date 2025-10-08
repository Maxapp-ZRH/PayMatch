/**
 * Session Timeout Service
 *
 * Provides session timeout functionality for enhanced security.
 * Tracks user activity and manages session expiration.
 */

import { getRedisObject, setRedisObject, deleteRedisKey } from './redis';
import { REDIS_CONFIG } from '@/config/redis-config';
import { logSessionActivity } from './audit-logging';

export interface SessionActivity extends Record<string, unknown> {
  userId: string;
  email?: string;
  lastActivity: Date;
  sessionStart: Date;
  rememberMe: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionTimeoutInfo {
  isExpired: boolean;
  timeUntilExpiry: number;
  timeUntilWarning: number;
  shouldWarn: boolean;
  sessionLifetime: number;
}

/**
 * Update session activity timestamp
 */
export async function updateSessionActivity(
  sessionId: string,
  userId: string,
  context?: {
    request?: Request;
    email?: string;
    rememberMe?: boolean;
    clientIP?: string;
    userAgent?: string;
  }
): Promise<void> {
  try {
    const key = `${REDIS_CONFIG.KEY_PREFIXES.SESSION_ACTIVITY}:${sessionId}`;
    const now = new Date();

    // Get existing session data or create new
    const existingData = await getRedisObject<SessionActivity>(key);

    const sessionData: SessionActivity = {
      userId,
      email: context?.email || existingData?.email,
      lastActivity: now,
      sessionStart: existingData?.sessionStart || now,
      rememberMe: context?.rememberMe || existingData?.rememberMe || false,
      ipAddress:
        context?.clientIP ||
        (context?.request
          ? extractClientIP(context.request)
          : existingData?.ipAddress),
      userAgent:
        context?.userAgent ||
        context?.request?.headers.get('user-agent') ||
        existingData?.userAgent,
    };

    // Calculate TTL based on remember me setting
    const ttl = sessionData.rememberMe
      ? Math.floor(REDIS_CONFIG.SESSION_TIMEOUT.REMEMBER_ME_TIMEOUT / 1000)
      : Math.floor(REDIS_CONFIG.SESSION_TIMEOUT.MAX_LIFETIME / 1000);

    await setRedisObject(key, sessionData, ttl);

    // Log session activity
    if (context?.request) {
      await logSessionActivity('session_activity_update', {
        request: context.request,
        user: { id: userId, email: context.email },
        sessionId,
      });
    }
  } catch (error) {
    console.error('Update session activity error:', error);
  }
}

/**
 * Check if session is expired
 */
export async function checkSessionTimeout(
  sessionId: string
): Promise<SessionTimeoutInfo> {
  try {
    const key = `${REDIS_CONFIG.KEY_PREFIXES.SESSION_ACTIVITY}:${sessionId}`;
    const sessionData = await getRedisObject<SessionActivity>(key);

    if (!sessionData) {
      return {
        isExpired: true,
        timeUntilExpiry: 0,
        timeUntilWarning: 0,
        shouldWarn: false,
        sessionLifetime: 0,
      };
    }

    const now = new Date();
    const lastActivity = new Date(sessionData.lastActivity);
    const sessionStart = new Date(sessionData.sessionStart);

    // Calculate timeouts based on remember me setting
    const inactiveTimeout = REDIS_CONFIG.SESSION_TIMEOUT.INACTIVE_TIMEOUT;
    const maxLifetime = sessionData.rememberMe
      ? REDIS_CONFIG.SESSION_TIMEOUT.REMEMBER_ME_TIMEOUT
      : REDIS_CONFIG.SESSION_TIMEOUT.MAX_LIFETIME;

    const timeSinceLastActivity = now.getTime() - lastActivity.getTime();
    const totalSessionTime = now.getTime() - sessionStart.getTime();

    // Check if session is expired due to inactivity
    const isInactiveExpired = timeSinceLastActivity > inactiveTimeout;

    // Check if session is expired due to max lifetime
    const isLifetimeExpired = totalSessionTime > maxLifetime;

    const isExpired = isInactiveExpired || isLifetimeExpired;

    // Calculate remaining times
    const timeUntilInactiveExpiry = Math.max(
      0,
      inactiveTimeout - timeSinceLastActivity
    );
    const timeUntilLifetimeExpiry = Math.max(0, maxLifetime - totalSessionTime);
    const timeUntilExpiry = Math.min(
      timeUntilInactiveExpiry,
      timeUntilLifetimeExpiry
    );

    const timeUntilWarning = Math.max(
      0,
      timeUntilExpiry - REDIS_CONFIG.SESSION_TIMEOUT.WARNING_TIME
    );
    const shouldWarn = timeUntilWarning <= 0 && timeUntilExpiry > 0;

    return {
      isExpired,
      timeUntilExpiry,
      timeUntilWarning,
      shouldWarn,
      sessionLifetime: totalSessionTime,
    };
  } catch (error) {
    console.error('Check session timeout error:', error);
    return {
      isExpired: true,
      timeUntilExpiry: 0,
      timeUntilWarning: 0,
      shouldWarn: false,
      sessionLifetime: 0,
    };
  }
}

/**
 * Extend session (reset inactivity timer)
 */
export async function extendSession(
  sessionId: string,
  userId: string,
  context?: {
    request?: Request;
    email?: string;
    clientIP?: string;
    userAgent?: string;
  }
): Promise<boolean> {
  try {
    const timeoutInfo = await checkSessionTimeout(sessionId);

    if (timeoutInfo.isExpired) {
      return false;
    }

    await updateSessionActivity(sessionId, userId, context);
    return true;
  } catch (error) {
    console.error('Extend session error:', error);
    return false;
  }
}

/**
 * Invalidate session
 */
export async function invalidateSession(
  sessionId: string,
  userId: string,
  reason: string = 'manual_logout',
  context?: {
    request?: Request;
    email?: string;
    clientIP?: string;
    userAgent?: string;
  }
): Promise<void> {
  try {
    const key = `${REDIS_CONFIG.KEY_PREFIXES.SESSION_ACTIVITY}:${sessionId}`;
    await deleteRedisKey(key);

    // Log session invalidation
    if (context?.request) {
      await logSessionActivity(
        'session_invalidated',
        {
          request: context.request,
          user: { id: userId, email: context.email },
          sessionId,
        },
        { reason }
      );
    }
  } catch (error) {
    console.error('Invalidate session error:', error);
  }
}

/**
 * Get session information
 */
export async function getSessionInfo(
  sessionId: string
): Promise<SessionActivity | null> {
  try {
    const key = `${REDIS_CONFIG.KEY_PREFIXES.SESSION_ACTIVITY}:${sessionId}`;
    return await getRedisObject<SessionActivity>(key);
  } catch (error) {
    console.error('Get session info error:', error);
    return null;
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<{
  cleanedCount: number;
  error?: string;
}> {
  try {
    // This would require Redis SCAN operation to find all session keys
    // For now, we'll rely on Redis TTL to handle cleanup automatically
    // In a production environment, you might want to implement a more sophisticated cleanup

    return { cleanedCount: 0 };
  } catch (error) {
    return {
      cleanedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all active sessions for a user
 */
export async function getUserActiveSessions(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string
): Promise<SessionActivity[]> {
  try {
    // This would require Redis SCAN operation to find all sessions for a user
    // For now, we'll return an empty array
    // In a production environment, you might want to implement this functionality

    return [];
  } catch (error) {
    console.error('Get user active sessions error:', error);
    return [];
  }
}

/**
 * Helper function to extract client IP (imported from ip-rate-limiting)
 */
function extractClientIP(request: Request): string {
  const headers = request.headers;

  // Vercel
  const vercelIP = headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }

  // Cloudflare
  const cloudflareIP = headers.get('cf-connecting-ip');
  if (cloudflareIP) {
    return cloudflareIP;
  }

  // Standard proxy headers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const connectionIP = headers.get('x-connection-remote-addr');
  if (connectionIP) {
    return connectionIP;
  }

  return 'unknown';
}
