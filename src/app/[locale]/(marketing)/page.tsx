/**
 * Home Page with Internationalization
 *
 * Main landing page with Swiss QR-bill invoicing features.
 * Supports multiple languages with proper translations.
 * Redirects authenticated users to dashboard.
 */

import { redirect } from 'next/navigation';

import { CallToAction } from '@/components/marketing_pages/CallToAction';
import { Faqs } from '@/components/marketing_pages/Faqs';
import { Hero } from '@/components/marketing_pages/Hero';
import { Pricing } from '@/components/marketing_pages/Pricing';
import { PrimaryFeatures } from '@/components/marketing_pages/PrimaryFeatures';
import { Reviews } from '@/components/marketing_pages/Reviews';
import { SecondaryFeatures } from '@/components/marketing_pages/SecondaryFeatures';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  // Check authentication using secure getUser() method
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there's an error (like stale JWT), clear the session
  if (
    error &&
    error.message.includes('User from sub claim in JWT does not exist')
  ) {
    await supabase.auth.signOut();
  }

  // If user is authenticated and no error, check email verification
  // Note: Onboarding completion is handled by middleware for protected routes
  if (user && !error) {
    if (!user.email_confirmed_at) {
      redirect('/verify-email');
    } else {
      // Let middleware handle onboarding redirects for protected routes
      redirect('/dashboard');
    }
  }

  return (
    <>
      <Hero />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <CallToAction />
      <Reviews />
      <Pricing />
      <Faqs />
    </>
  );
}
