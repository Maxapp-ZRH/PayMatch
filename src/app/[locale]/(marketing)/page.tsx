/**
 * Home Page with Internationalization
 *
 * Main landing page with Swiss QR-bill invoicing features.
 * Supports multiple languages with proper translations.
 * Redirects authenticated users to dashboard.
 */

import { CallToAction } from '@/components/marketing_pages/CallToAction';
import { Faqs } from '@/components/marketing_pages/Faqs';
import { Hero } from '@/components/marketing_pages/Hero';
import { Pricing } from '@/components/marketing_pages/Pricing';
import { PrimaryFeatures } from '@/components/marketing_pages/PrimaryFeatures';
import { Reviews } from '@/components/marketing_pages/Reviews';
import { SecondaryFeatures } from '@/components/marketing_pages/SecondaryFeatures';
import { getPublicSession } from '@/features/auth';

export default async function Home() {
  // Check authentication and redirect if authenticated
  await getPublicSession(true);

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
