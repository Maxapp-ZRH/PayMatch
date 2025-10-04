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

  console.log('Auth callback - type:', type, 'token exists:', !!token);

  if (type === 'signup' && token) {
    // Handle pending registration verification
    try {
      console.log(
        'Verifying pending registration with token:',
        token.substring(0, 10) + '...'
      );
      const result = await verifyPendingRegistration(token);

      console.log(
        'Verification result:',
        result.success ? 'Success' : 'Failed'
      );

      if (!result.success) {
        console.error('Registration verification failed:', result.error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      // Redirect to login with success message
      // User account has been created and verified
      console.log('Redirecting to login with verified=true');
      return NextResponse.redirect(`${origin}/login?verified=true`);
    } catch (error) {
      console.error('Verification error:', error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // Error redirect
  console.log('No valid signup token, redirecting to error page');
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
