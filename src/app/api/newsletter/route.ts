/**
 * Newsletter Subscription API Route
 *
 * Handles newsletter subscription requests and sends welcome emails via Resend.
 * Validates form data, stores in database, and provides appropriate error handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { newsletterSchema } from '@/schemas/newsletter';
import { NewsletterWelcomeEmail } from '@/emails/newsletter-welcome';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Environment variables with fallbacks
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@paymatch.app';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'PayMatch';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = newsletterSchema.parse(body);

    // Check if email already exists and is active
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active, email')
      .eq('email', validatedData.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError);
      return NextResponse.json(
        { error: 'Failed to check subscription status' },
        { status: 500 }
      );
    }

    // If subscriber exists and is active, return success (don't reveal if email exists)
    if (existingSubscriber && existingSubscriber.is_active) {
      return NextResponse.json(
        {
          success: true,
          message: 'Successfully subscribed to newsletter',
          alreadySubscribed: true,
        },
        { status: 200 }
      );
    }

    // If subscriber exists but is inactive, reactivate them
    if (existingSubscriber && !existingSubscriber.is_active) {
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          is_active: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to reactivate subscription' },
          { status: 500 }
        );
      }

      // Get the updated subscriber data for email
      const { data: updatedSubscriber } = await supabase
        .from('newsletter_subscribers')
        .select('unsubscribe_token')
        .eq('id', existingSubscriber.id)
        .single();

      if (updatedSubscriber) {
        const unsubscribeUrl = `${APP_URL}/unsubscribe?token=${updatedSubscriber.unsubscribe_token}`;

        // Generate welcome email HTML
        const welcomeEmailHtml = await render(
          NewsletterWelcomeEmail({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            userEmail: validatedData.email,
            unsubscribeUrl,
            appUrl: APP_URL,
          })
        );

        // Send welcome email
        const emailResult = await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [validatedData.email],
          subject: 'Welcome to PayMatch Newsletter!',
          html: welcomeEmailHtml,
        });

        if (emailResult.error) {
          console.error('Welcome email error:', emailResult.error);
          // Don't fail the request if email fails, just log it
          console.warn('Subscription was updated but welcome email failed');
        }

        return NextResponse.json(
          {
            success: true,
            message: 'Successfully reactivated newsletter subscription',
            emailSent: !emailResult.error,
          },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const { data: newSubscriber, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        is_active: true,
      })
      .select('unsubscribe_token')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Generate welcome email HTML
    const unsubscribeUrl = `${APP_URL}/unsubscribe?token=${newSubscriber.unsubscribe_token}`;
    const welcomeEmailHtml = await render(
      NewsletterWelcomeEmail({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        userEmail: validatedData.email,
        unsubscribeUrl,
        appUrl: APP_URL,
      })
    );

    // Send welcome email
    const emailResult = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [validatedData.email],
      subject: 'Welcome to PayMatch Newsletter!',
      html: welcomeEmailHtml,
    });

    if (emailResult.error) {
      console.error('Welcome email error:', emailResult.error);
      // Don't fail the request if email fails, just log it
      console.warn('Subscription was created but welcome email failed');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        emailSent: !emailResult.error,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
