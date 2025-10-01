/**
 * Unified Email Unsubscribe API Route
 *
 * Centralized unsubscribe handling for all email types:
 * - Newsletter emails
 * - Support emails
 * - Transactional emails
 *
 * Replaces scattered unsubscribe routes with unified system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { UnsubscribeService } from '@/features/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    const result = await UnsubscribeService.handleUnsubscribe(token);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    const result = await UnsubscribeService.getSubscriberInfo(token);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Unsubscribe GET API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 400 }
    );
  }
}
