/**
 * Email Preferences API Route
 *
 * Handles email preferences operations for authenticated users.
 * Provides server-side access to email preferences with proper RLS.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  subscribeToEmailType,
  unsubscribeFromEmailType,
  getEmailPreferences,
} from '@/features/email/services/email-preferences-server';
import type { EmailType } from '@/features/email';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const emailType = searchParams.get('type') as EmailType;

    if (!emailType) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
      );
    }

    const result = await getEmailPreferences(user.email!, emailType);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriber: result.subscriber,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emailType, isActive, firstName, lastName } = body;

    if (!emailType) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
      );
    }

    // Validate email type
    const validEmailTypes = [
      'newsletter_promotional',
      'newsletter_informational',
      'newsletter_news',
      'support',
      'transactional',
      'security',
      'legal',
      'business_notifications',
      'overdue_alerts',
    ];

    if (!validEmailTypes.includes(emailType)) {
      return NextResponse.json(
        { error: `Invalid email type: ${emailType}` },
        { status: 400 }
      );
    }

    if (isActive) {
      const result = await subscribeToEmailType(
        user.email!,
        emailType,
        user.id,
        firstName || '',
        lastName || ''
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || result.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        subscriber: result.subscriber,
      });
    } else {
      const result = await unsubscribeFromEmailType(
        user.email!,
        emailType,
        user.id
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || result.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        subscriber: result.subscriber,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
