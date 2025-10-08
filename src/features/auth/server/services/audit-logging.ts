/**
 * Audit Logging Service
 *
 * Provides comprehensive audit logging for authentication and user activities.
 * Essential for compliance, security monitoring, and debugging.
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import { extractClientIP } from './ip-rate-limiting';

export interface AuditLogEntry {
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  status: 'success' | 'failure' | 'error';
  errorMessage?: string;
  sessionId?: string;
}

export interface AuditLogContext {
  request?: Request; // Keep for backward compatibility
  clientIP?: string; // Extracted client IP
  userAgent?: string; // Extracted user agent
  user?: {
    id: string;
    email?: string;
  };
  sessionId?: string;
}

/**
 * Log an audit entry to the database
 */
export async function logAuditEntry(entry: AuditLogEntry): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('audit_logs').insert({
      user_id: entry.userId || null,
      email: entry.email || null,
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
      action: entry.action,
      resource_type: entry.resourceType || null,
      resource_id: entry.resourceId || null,
      details: entry.details || {},
      status: entry.status,
      error_message: entry.errorMessage || null,
      session_id: entry.sessionId || null,
    });

    if (error) {
      console.error('Failed to log audit entry:', error);
      // Don't throw error to avoid breaking the main flow
    }
  } catch (error) {
    console.error('Audit logging error:', error);
    // Don't throw error to avoid breaking the main flow
  }
}

/**
 * Log authentication success
 */
export async function logAuthSuccess(
  action: string,
  context: AuditLogContext,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email: context.user?.email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action,
    status: 'success',
    details,
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log authentication failure
 */
export async function logAuthFailure(
  action: string,
  context: AuditLogContext,
  errorMessage: string,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email: context.user?.email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action,
    status: 'failure',
    errorMessage,
    details,
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log authentication error
 */
export async function logAuthError(
  action: string,
  context: AuditLogContext,
  error: Error,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email: context.user?.email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action,
    status: 'error',
    errorMessage: error.message,
    details: {
      ...details,
      errorStack: error.stack,
    },
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log user registration attempt
 */
export async function logRegistrationAttempt(
  email: string,
  context: AuditLogContext,
  success: boolean,
  errorMessage?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action: 'user_registration',
    resourceType: 'user',
    status: success ? 'success' : 'failure',
    errorMessage,
    details,
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log login attempt
 */
export async function logLoginAttempt(
  email: string,
  context: AuditLogContext,
  success: boolean,
  errorMessage?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action: 'user_login',
    resourceType: 'user',
    status: success ? 'success' : 'failure',
    errorMessage,
    details,
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log password reset attempt
 */
export async function logPasswordResetAttempt(
  email: string,
  context: AuditLogContext,
  success: boolean,
  errorMessage?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action: 'password_reset',
    resourceType: 'user',
    status: success ? 'success' : 'failure',
    errorMessage,
    details,
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log email verification attempt
 */
export async function logEmailVerificationAttempt(
  email: string,
  context: AuditLogContext,
  success: boolean,
  errorMessage?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action: 'email_verification',
    resourceType: 'user',
    status: success ? 'success' : 'failure',
    errorMessage,
    details,
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log session activity
 */
export async function logSessionActivity(
  action: string,
  context: AuditLogContext,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email: context.user?.email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action,
    resourceType: 'session',
    status: 'success',
    details,
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Log rate limit hit
 */
export async function logRateLimitHit(
  identifier: string,
  rateLimitType: string,
  context: AuditLogContext,
  details?: Record<string, unknown>
): Promise<void> {
  const entry: AuditLogEntry = {
    userId: context.user?.id,
    email: context.user?.email,
    ipAddress:
      context.clientIP ||
      (context.request ? extractClientIP(context.request) : undefined),
    userAgent:
      context.userAgent ||
      context.request?.headers.get('user-agent') ||
      undefined,
    action: 'rate_limit_hit',
    resourceType: 'rate_limit',
    status: 'failure',
    errorMessage: `Rate limit exceeded for ${rateLimitType}`,
    details: {
      ...details,
      identifier,
      rateLimitType,
    },
    sessionId: context.sessionId,
  };

  await logAuditEntry(entry);
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{
  logs: AuditLogEntry[];
  total: number;
  error?: string;
}> {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { logs: [], total: 0, error: error.message };
    }

    const { count } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      logs: logs || [],
      total: count || 0,
    };
  } catch (error) {
    return {
      logs: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get audit logs by IP address
 */
export async function getIPAuditLogs(
  ipAddress: string,
  limit: number = 50,
  offset: number = 0
): Promise<{
  logs: AuditLogEntry[];
  total: number;
  error?: string;
}> {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .eq('ip_address', ipAddress)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { logs: [], total: 0, error: error.message };
    }

    const { count } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress);

    return {
      logs: logs || [],
      total: count || 0,
    };
  } catch (error) {
    return {
      logs: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Clean up old audit logs (for maintenance)
 */
export async function cleanupOldAuditLogs(): Promise<{
  deletedCount: number;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin.rpc('cleanup_old_audit_logs');

    if (error) {
      return { deletedCount: 0, error: error.message };
    }

    return { deletedCount: data || 0 };
  } catch (error) {
    return {
      deletedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
