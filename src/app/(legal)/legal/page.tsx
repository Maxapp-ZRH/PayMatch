/**
 * Legal Pages Index
 *
 * Redirects to the main legal page (Privacy Policy) and provides
 * navigation to all other legal pages. This serves as a central
 * entry point for all legal information.
 */

import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Legal Information - PayMatch',
  description:
    'Access all legal information for PayMatch including Privacy Policy, Terms of Service, Cookie Policy, GDPR compliance, and company imprint. Comprehensive legal documentation for Swiss invoicing platform.',
  keywords: [
    'legal information',
    'privacy policy',
    'terms of service',
    'cookie policy',
    'GDPR compliance',
    'Swiss data protection',
    'legal documents',
    'terms and conditions',
    'data privacy',
    'Swiss business law',
    'imprint',
    'legal compliance',
    'user rights',
    'data protection officer',
    'Swiss FADP',
    'legal notice',
    'company information',
    'legal terms',
  ],
  openGraph: {
    title: 'Legal Information - PayMatch',
    description:
      'Access all legal information for PayMatch including Privacy Policy, Terms of Service, Cookie Policy, GDPR compliance, and company imprint.',
    type: 'website',
    locale: 'en_CH',
    siteName: 'PayMatch',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PayMatch Legal Information',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@paymatch_app',
    creator: '@paymatch_app',
    title: 'Legal Information - PayMatch',
    description:
      'Access all legal information for PayMatch including Privacy Policy, Terms of Service, and GDPR compliance.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/legal',
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
  category: 'legal',
  classification: 'Legal Information',
  other: {
    'application-name': 'PayMatch Legal',
    'apple-mobile-web-app-title': 'PayMatch Legal',
  },
};

export default function LegalPage() {
  // Redirect to Privacy Policy as the main legal page
  redirect('/privacy');
}
