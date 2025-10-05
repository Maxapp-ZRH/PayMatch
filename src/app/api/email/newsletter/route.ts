/**
 * Newsletter API Route
 *
 * Handles newsletter subscription and unsubscription using the centralized email service.
 * Replaces the old newsletter route with unified system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { NewsletterService, sendEmailWithComponent } from '@/features/email';
import { newsletterSubscriptionSchema } from '@/features/email/schemas';
import { NewsletterWelcomeEmail } from '@/emails/newsletter-welcome';
import { generateUnsubscribeUrl } from '@/features/email';
import { CookieEmailIntegrationService } from '@/features/cookies';

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

    // Subscribe to newsletter
    const result = await NewsletterService.subscribe({
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
    });

    // If subscription was successful and not already subscribed, send welcome email
    if (result.success && !result.alreadySubscribed && result.subscriber) {
      const unsubscribeUrl = generateUnsubscribeUrl(
        validatedData.email,
        'newsletter'
      );

      const emailResult = await sendEmailWithComponent({
        to: validatedData.email,
        subject: 'Welcome to PayMatch Newsletter!',
        emailType: 'newsletter',
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
          ...result,
          emailSent: emailResult.success,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(result, { status: 200 });
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

    const result = await NewsletterService.getSubscriberInfo(
      // Extract email from token for newsletter-specific lookup
      // This is a simplified approach - in practice you'd verify the token
      token
    );

    return NextResponse.json(result, { status: 200 });
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
