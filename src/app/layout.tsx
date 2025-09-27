import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import clsx from 'clsx';

import '@/styles/tailwind.css';
import { InstallBanner } from '@/components/pwa/InstallBanner';
import { UpdateNotification } from '@/components/pwa/UpdateNotification';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { CookieBanner } from '@/components/ui/CookieBanner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s - PayMatch',
    default: 'PayMatch - Swiss QR-bill invoicing made simple',
  },
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
      'de-CH': '/de',
      'fr-CH': '/fr',
      'it-CH': '/it',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
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
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfb' },
    { media: '(prefers-color-scheme: dark)', color: '#0d192c' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CH"
      className={clsx('bg-gray-50 antialiased', inter.variable)}
    >
      <body>
        {children}
        <InstallBanner />
        <UpdateNotification />
        <ScrollToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
