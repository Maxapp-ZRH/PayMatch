/**
 * Auth Callback Route
 *
 * Handles email verification and password reset callbacks from Supabase Auth.
 * Redirects users to appropriate pages after successful authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  console.log('=== AUTH CALLBACK DEBUG ===');
  console.log('Full URL:', requestUrl.href);
  console.log('Query params:', Object.fromEntries(requestUrl.searchParams));
  console.log('URL fragment:', requestUrl.hash);

  // Try to get token and type from query parameters first
  let token_hash = requestUrl.searchParams.get('token_hash');
  let type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  console.log('Initial token_hash:', token_hash);
  console.log('Initial type:', type);

  // If not found in query params, try to extract from URL fragment
  if (!token_hash || !type) {
    const hash = requestUrl.hash;
    console.log('Checking URL fragment:', hash);
    if (hash) {
      const fragmentParams = new URLSearchParams(hash.substring(1));
      console.log('Fragment params:', Object.fromEntries(fragmentParams));
      token_hash = token_hash || fragmentParams.get('access_token');
      type = type || fragmentParams.get('type') || 'magiclink'; // Get type from fragment or default to magiclink
      console.log(
        'After fragment extraction - token_hash:',
        token_hash,
        'type:',
        type
      );
    }
  }

  // Check if we have a 'token' parameter instead of 'token_hash' (from Supabase redirect)
  if (!token_hash && requestUrl.searchParams.has('token')) {
    token_hash = requestUrl.searchParams.get('token');
    console.log('Found token parameter:', token_hash);
  }

  // If we still don't have a type but we have a token, use the type from URL or default to magiclink
  if (!type && token_hash) {
    type = requestUrl.searchParams.get('type') || 'magiclink';
    console.log('Using type from URL or defaulting to magiclink:', type);
  }

  console.log('Final token_hash:', token_hash);
  console.log('Final type:', type);

  if (token_hash && type) {
    console.log('Processing token verification...');
    const supabase = await createClient();

    try {
      // For URL fragments with access_token, we need to exchange it for a session
      if (requestUrl.hash && requestUrl.hash.includes('access_token')) {
        console.log('Processing URL fragment with access_token');
        // Extract the access token from the fragment
        const fragmentParams = new URLSearchParams(
          requestUrl.hash.substring(1)
        );
        const accessToken = fragmentParams.get('access_token');
        const refreshToken = fragmentParams.get('refresh_token');

        console.log('Access token found:', !!accessToken);
        console.log('Refresh token found:', !!refreshToken);

        if (accessToken && refreshToken) {
          // Set the session using the tokens from the fragment
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session setting failed:', error);
            return NextResponse.redirect(
              new URL('/auth/auth-code-error', requestUrl.origin)
            );
          }
          console.log('Session set successfully');

          // Clear remember me flag for email verification and magic link (first-time users)
          // This ensures new users don't get remembered automatically
          if (type === 'signup' || type === 'email' || type === 'magiclink') {
            console.log(
              'Clearing remember me flag for new user verification/magic link'
            );
            // We can't directly clear localStorage from server-side, but we can
            // add a query parameter to indicate this should be cleared client-side
          }
        }
      } else if (token_hash) {
        console.log('Processing token verification with verifyOtp');
        console.log('Token type:', type);
        // For query parameters, use verifyOtp
        const { data: verifyData, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as
            | 'signup'
            | 'invite'
            | 'magiclink'
            | 'recovery'
            | 'email_change'
            | 'email',
        });

        if (error) {
          console.error('Token verification failed:', error);
          return NextResponse.redirect(
            new URL('/auth/auth-code-error', requestUrl.origin)
          );
        }
        console.log('Token verified successfully');
        console.log('Verify data:', verifyData);

        // For recovery type, we need to establish a session for password reset
        // The verifyOtp call should have already established the session
      } else {
        // No valid token found
        console.error('No valid token found in URL');
        return NextResponse.redirect(
          new URL('/auth/auth-code-error', requestUrl.origin)
        );
      }

      // Get the user session after successful verification/session setting
      console.log('Getting user after verification...');
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Failed to get user:', userError);
        return NextResponse.redirect(
          new URL('/auth/auth-code-error', requestUrl.origin)
        );
      }

      console.log('User found:', user?.email);
      console.log('User ID:', user?.id);

      if (user) {
        // Check if user needs onboarding (new user or incomplete onboarding)
        console.log('Checking user profile...');
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        console.log('Profile data:', profile);
        console.log('Onboarding completed:', profile?.onboarding_completed);

        // Determine redirect based on type and onboarding status
        console.log('Determining redirect based on type:', type);
        if (type === 'signup' || type === 'email') {
          console.log('Processing signup/email verification');
          // For new user registration or email verification
          if (!profile?.onboarding_completed) {
            console.log('Redirecting to verification success (new user)');
            // Redirect to verification success page which will auto-close and redirect to onboarding
            const verificationUrl = new URL(
              '/verification-success',
              requestUrl.origin
            );
            verificationUrl.searchParams.set('clearRememberMe', 'true');
            return NextResponse.redirect(verificationUrl);
          } else {
            console.log('Redirecting to dashboard (existing user)');
            const dashboardUrl = new URL('/dashboard', requestUrl.origin);
            dashboardUrl.searchParams.set('clearRememberMe', 'true');
            return NextResponse.redirect(dashboardUrl);
          }
        } else if (type === 'magiclink') {
          console.log('Processing magic link login');
          // For magic link login, always go to dashboard (successful login)
          if (!profile?.onboarding_completed) {
            console.log(
              'Redirecting to onboarding (new user magic link login)'
            );
            const onboardingUrl = new URL('/onboarding', requestUrl.origin);
            onboardingUrl.searchParams.set('clearRememberMe', 'true');
            return NextResponse.redirect(onboardingUrl);
          } else {
            console.log(
              'Redirecting to dashboard (existing user magic link login)'
            );
            const dashboardUrl = new URL('/dashboard', requestUrl.origin);
            dashboardUrl.searchParams.set('clearRememberMe', 'true');
            return NextResponse.redirect(dashboardUrl);
          }
        } else if (type === 'recovery') {
          console.log('Redirecting to reset password page');
          const resetPasswordUrl = new URL(
            '/reset-password',
            requestUrl.origin
          );
          resetPasswordUrl.searchParams.set('token', token_hash);
          resetPasswordUrl.searchParams.set('type', type);
          return NextResponse.redirect(resetPasswordUrl);
        } else {
          console.log('Redirecting to next URL:', next);
          return NextResponse.redirect(new URL(next, requestUrl.origin));
        }
      } else {
        // User not found after verification - this shouldn't happen
        console.error('User not found after successful verification');
        return NextResponse.redirect(
          new URL('/auth/auth-code-error', requestUrl.origin)
        );
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL('/auth/auth-code-error', requestUrl.origin)
      );
    }
  }

  // No token provided
  return NextResponse.redirect(
    new URL('/auth/auth-code-error', requestUrl.origin)
  );
}
