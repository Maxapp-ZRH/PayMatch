/**
 * Error Reporting API Endpoint
 *
 * Handles error reporting from the client-side for monitoring and debugging.
 * Logs errors to the database and external monitoring services.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  errorId: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  category?: string;
  code?: string;
  recoverable?: boolean;
  retryable?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const errorReport: ErrorReport = await request.json();

    // Validate required fields
    if (!errorReport.message || !errorReport.errorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client information
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || errorReport.userAgent;
    const clientIP =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown';

    // Create Supabase client
    const supabase = await createClient();

    // Get current user if available
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Log error to database
    const { error: dbError } = await supabase.from('error_logs').insert({
      error_id: errorReport.errorId,
      message: errorReport.message,
      stack_trace: errorReport.stack,
      component_stack: errorReport.componentStack,
      category: errorReport.category || 'unknown',
      code: errorReport.code || 'UNKNOWN',
      recoverable: errorReport.recoverable ?? false,
      retryable: errorReport.retryable ?? false,
      user_id: user?.id || null,
      user_agent: userAgent,
      ip_address: clientIP,
      url: errorReport.url,
      session_id: errorReport.sessionId,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('Failed to log error to database:', dbError);
      // Don't fail the request if logging fails
    }

    // Send to external monitoring service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      try {
        await sendToExternalMonitoring(errorReport, {
          userId: user?.id,
          userAgent,
          clientIP,
        });
      } catch (monitoringError) {
        console.error(
          'Failed to send error to monitoring service:',
          monitoringError
        );
        // Don't fail the request if monitoring fails
      }
    }

    // Send alert for critical errors
    if (isCriticalError(errorReport)) {
      await sendCriticalErrorAlert(errorReport, {
        userId: user?.id,
        userAgent,
        clientIP,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in error reporting API:', error);
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}

/**
 * Send error to external monitoring service
 */
async function sendToExternalMonitoring(
  errorReport: ErrorReport,
  context: { userId?: string; userAgent?: string; clientIP: string }
): Promise<void> {
  // Example: Send to Sentry
  if (process.env.SENTRY_DSN) {
    // Implementation would depend on your Sentry setup
    console.log('Would send to Sentry:', errorReport);
  }

  // Example: Send to LogRocket
  if (process.env.LOGROCKET_APP_ID) {
    // Implementation would depend on your LogRocket setup
    console.log('Would send to LogRocket:', errorReport);
  }

  // Example: Send to custom monitoring service
  if (process.env.MONITORING_WEBHOOK_URL) {
    await fetch(process.env.MONITORING_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...errorReport,
        context,
        timestamp: new Date().toISOString(),
      }),
    });
  }
}

/**
 * Check if error is critical and requires immediate attention
 */
function isCriticalError(errorReport: ErrorReport): boolean {
  const criticalPatterns = [
    'AUTH_TOKEN_INVALID',
    'SESSION_EXPIRED',
    'PERMISSION_DENIED',
    'DATABASE_ERROR',
    'PAYMENT_ERROR',
  ];

  return criticalPatterns.some(
    (pattern) =>
      errorReport.code?.includes(pattern) ||
      errorReport.message.includes(pattern)
  );
}

/**
 * Send critical error alert to team
 */
async function sendCriticalErrorAlert(
  errorReport: ErrorReport,
  context: { userId?: string; userAgent?: string; clientIP: string }
): Promise<void> {
  // Example: Send to Slack/Discord webhook
  if (process.env.ALERT_WEBHOOK_URL) {
    try {
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 Critical Error Alert`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Error:* ${errorReport.message}\n*Code:* ${errorReport.code}\n*User:* ${context.userId || 'Anonymous'}\n*Time:* ${new Date().toISOString()}`,
              },
            },
          ],
        }),
      });
    } catch (error) {
      console.error('Failed to send critical error alert:', error);
    }
  }
}
