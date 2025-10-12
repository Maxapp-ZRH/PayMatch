/**
 * Newsletter API Route
 *
 * Handles newsletter subscription and unsubscription using the centralized email service.
 * Replaces the old newsletter route with unified system.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  EmailPreferencesService,
  sendEmailWithComponent,
} from '@/features/email';
import { newsletterSubscriptionSchema } from '@/features/email/schemas';
import { NewsletterWelcomeEmail } from '@/emails/newsletter-welcome';
import { generateUnsubscribeUrl } from '@/features/email';
import { CookieEmailIntegrationService } from '@/features/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = newsletterSubscriptionSchema.parse(body);

    // Check marketing cookie consent before allowing subscription
    const cookieValidation =
      CookieEmailIntegrationService.validateNewsletterSubscription();
    if (!cookieValidation.valid) {
      return NextResponse.json(
        {
          error: cookieValidation.error,
          requiresCookieConsent: true,
        },
        { status: 403 }
      );
    }

    // Check if already subscribed
    const existingPreference = await EmailPreferencesService.getPreferences(
      validatedData.email,
      'newsletter_promotional'
    );

    const alreadySubscribed = existingPreference.subscriber.isActive;

    // Subscribe to newsletter_promotional emails
    await EmailPreferencesService.subscribe(
      validatedData.email,
      'newsletter_promotional',
      undefined, // userId
      validatedData.firstName,
      validatedData.lastName
    );

    // If not already subscribed, send welcome email
    if (!alreadySubscribed) {
      const unsubscribeUrl = generateUnsubscribeUrl(
        validatedData.email,
        'newsletter_promotional'
      );

      const emailResult = await sendEmailWithComponent({
        to: validatedData.email,
        subject: 'Welcome to PayMatch Newsletter!',
        emailType: 'newsletter_promotional',
        component: NewsletterWelcomeEmail({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          userEmail: validatedData.email,
          unsubscribeUrl,
          appUrl: APP_URL,
        }),
      });

      if (!emailResult.success) {
        console.warn(
          'Subscription was created but welcome email failed:',
          emailResult.error
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Successfully subscribed to newsletter',
          emailSent: emailResult.success,
          subscriber: {
            email: validatedData.email,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        alreadySubscribed: true,
        subscriber: {
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
        },
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
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
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

    // Get newsletter subscriber info using email_preferences
    const result = await EmailPreferencesService.getPreferences(
      token, // In practice, you'd extract email from token
      'newsletter_promotional'
    );

    return NextResponse.json(
      {
        success: true,
        subscriber: {
          email: token, // In practice, you'd extract email from token
          firstName: '', // Not stored in email_preferences
          lastName: '', // Not stored in email_preferences
          isActive: result.subscriber.isActive,
          emailType: 'newsletter_promotional',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter GET API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 400 }
    );
  }
}
