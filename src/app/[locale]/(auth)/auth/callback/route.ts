/**
 * Auth Callback Route
 *
 * Handles email verification and password reset callbacks from Supabase Auth.
 * Redirects users to appropriate pages after successful authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPendingRegistration } from '@/features/auth/server/utils/pending-registration';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const type = searchParams.get('type');
  const token = searchParams.get('token');

  // Decode the token in case it was URL-encoded
  const decodedToken = token ? decodeURIComponent(token) : null;

  if (type === 'signup' && decodedToken) {
    // Handle pending registration verification
    try {
      const result = await verifyPendingRegistration(decodedToken);

      if (!result.success) {
        // Try to get email from the token verification result
        const emailParam = result.email
          ? `?email=${encodeURIComponent(result.email)}`
          : '';
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error${emailParam}`
        );
      }

      // Redirect to password setting page for GDPR compliance
      // User needs to set their password to complete registration
      const emailParam = encodeURIComponent(result.email || '');
      return NextResponse.redirect(
        `${origin}/verify-email?setPassword=true&email=${emailParam}`
      );
    } catch (error) {
      console.error('Verification error:', error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // Error redirect
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
