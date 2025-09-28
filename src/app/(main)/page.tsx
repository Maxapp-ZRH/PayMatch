import { type Metadata } from 'next';
import { CallToAction } from '@/components/marketing_pages/CallToAction';
import { Faqs } from '@/components/marketing_pages/Faqs';
import { Hero } from '@/components/marketing_pages/Hero';
import { Pricing } from '@/components/marketing_pages/Pricing';
import { PrimaryFeatures } from '@/components/marketing_pages/PrimaryFeatures';
import { Reviews } from '@/components/marketing_pages/Reviews';
import { SecondaryFeatures } from '@/components/marketing_pages/SecondaryFeatures';

export const metadata: Metadata = {
  title: 'PayMatch - Swiss QR-bill invoicing made simple',
  description:
    'Create, send, and reconcile Swiss QR-bill invoices effortlessly. Built for Swiss businesses who value precision, compliance, and professional presentation. Invoices in sync, payments in check.',
  keywords: [
    'Swiss invoicing',
    'QR-bill',
    'invoice management',
    'payment reconciliation',
    'Swiss business',
    'invoice software',
    'CAMT files',
    'Swiss compliance',
    'fiduciary software',
    'SME invoicing',
    'Swiss tax',
    'invoice tracking',
    'payment matching',
    'Swiss accounting',
    'invoice automation',
    'Swiss QR-bill generator',
    'invoice reconciliation',
    'Swiss invoicing software',
    'business invoicing',
    'Swiss payment processing',
  ],
  openGraph: {
    title: 'PayMatch - Swiss QR-bill invoicing made simple',
    description:
      'Create, send, and reconcile Swiss QR-bill invoices effortlessly. Built for Swiss businesses who value precision, compliance, and professional presentation.',
    type: 'website',
    locale: 'en_CH',
    siteName: 'PayMatch',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PayMatch - Swiss QR-bill invoicing platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@paymatch_app',
    creator: '@paymatch_app',
    title: 'PayMatch - Swiss QR-bill invoicing made simple',
    description:
      'Create, send, and reconcile Swiss QR-bill invoices effortlessly. Built for Swiss businesses.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'business',
  classification: 'Business Software',
  other: {
    'application-name': 'PayMatch',
    'apple-mobile-web-app-title': 'PayMatch',
    'msapplication-TileColor': '#14b8a1',
  },
};

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
