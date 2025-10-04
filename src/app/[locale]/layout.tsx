/**
 * Locale-based Layout
 *
 * Handles internationalization for all pages within the [locale] segment.
 * Provides NextIntlClientProvider and locale-specific metadata.
 */

import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { GeistSans } from 'geist/font/sans';
import clsx from 'clsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';

import '@/styles/tailwind.css';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { BannerManager } from '@/components/common/BannerManager';
import { PageTransitionWrapper } from '@/components/common/PageTransitionWrapper';

const geistSans = GeistSans;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const metadata: Metadata = {
    title: {
      template: '%s - PayMatch',
      default: 'PayMatch - Swiss QR-bill invoicing made simple',
    },
    description:
      'Create, send, and reconcile Swiss QR-bill invoices effortlessly. Built for Swiss businesses who value precision, compliance, and professional presentation.',
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
    ],
    authors: [{ name: 'PayMatch Team' }],
    creator: 'PayMatch',
    publisher: 'PayMatch',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://paymatch.app'),
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en',
        'de-CH': '/de-CH',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en-CH' ? 'en_CH' : 'de_CH', // Swiss locales only
      url: 'https://paymatch.app',
      siteName: 'PayMatch',
      title: 'PayMatch - Swiss QR-bill invoicing made simple',
      description:
        'Create, send, and reconcile Swiss QR-bill invoices effortlessly. Built for Swiss businesses who value precision, compliance, and professional presentation.',
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
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    category: 'business',
    classification: 'Business Software',
    referrer: 'origin-when-cross-origin',
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#14b8a1',
        },
      ],
    },
    manifest: '/site.webmanifest',
    other: {
      'msapplication-TileColor': '#14b8a1',
      'msapplication-config': '/browserconfig.xml',
    },
  };

  return metadata;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={clsx('bg-gray-50 antialiased', geistSans.className)}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
          <BannerManager />
          <ScrollToTop />
          <Toaster
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
          />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
