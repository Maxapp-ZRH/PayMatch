import { CallToAction } from '@/components/marketing_pages/CallToAction';
import { Faqs } from '@/components/marketing_pages/Faqs';
import { Hero } from '@/components/marketing_pages/Hero';
import { Pricing } from '@/components/marketing_pages/Pricing';
import { PrimaryFeatures } from '@/components/marketing_pages/PrimaryFeatures';
import { Reviews } from '@/components/marketing_pages/Reviews';
import { SecondaryFeatures } from '@/components/marketing_pages/SecondaryFeatures';

export default function Home() {
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
