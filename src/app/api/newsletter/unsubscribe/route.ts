/**
 * Newsletter Unsubscribe API Route
 *
 * Handles newsletter unsubscribe requests using unsubscribe tokens.
 * Validates token and deactivates subscription in database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Find subscriber by unsubscribe token
    const { data: subscriber, error: findError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, first_name, last_name, is_active')
      .eq('unsubscribe_token', token)
      .single();

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    // Check if already unsubscribed
    if (!subscriber.is_active) {
      return NextResponse.json(
        {
          success: true,
          message: 'You have already unsubscribed from our newsletter',
          alreadyUnsubscribed: true,
        },
        { status: 200 }
      );
    }

    // Unsubscribe the user
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully unsubscribed from newsletter',
        subscriber: {
          email: subscriber.email,
          firstName: subscriber.first_name,
          lastName: subscriber.last_name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
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

    // Find subscriber by unsubscribe token
    const { data: subscriber, error: findError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, first_name, last_name, is_active')
      .eq('unsubscribe_token', token)
      .single();

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscriber: {
          email: subscriber.email,
          firstName: subscriber.first_name,
          lastName: subscriber.last_name,
          isActive: subscriber.is_active,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
