/**
 * One-Click Unsubscribe API Route
 *
 * Handles one-click unsubscribe for transactional emails.
 * Supports both GET (redirect to unsubscribe page) and POST (one-click unsubscribe).
 */

import { NextRequest, NextResponse } from 'next/server';
import { UnsubscribeService } from '@/features/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid-token', request.url)
      );
    }

    // Verify token exists (basic check)
    try {
      await UnsubscribeService.getSubscriberInfo(token);
    } catch {
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid-token', request.url)
      );
    }

    // Redirect to unsubscribe page with token
    return NextResponse.redirect(
      new URL(`/unsubscribe?token=${token}`, request.url)
    );
  } catch (error) {
    console.error('One-click unsubscribe GET error:', error);
    return NextResponse.redirect(
      new URL('/unsubscribe?error=server-error', request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new NextResponse('Invalid token', { status: 400 });
    }

    await UnsubscribeService.handleUnsubscribe(token);

    // Return blank page with 200 OK as required by RFC
    return new NextResponse('', { status: 200 });
  } catch (error) {
    console.error('One-click unsubscribe POST error:', error);
    return new NextResponse('', { status: 500 });
  }
}
