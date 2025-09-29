/**
 * Legal Pages Layout Component
 *
 * Provides consistent layout and styling for all legal pages including
 * Privacy Policy, Terms of Service, Cookie Policy, GDPR, and Imprint.
 * Follows the same design language as marketing pages with proper
 * typography, spacing, and navigation.
 */

import { Footer } from '@/components/marketing_pages/Footer';
import { Header } from '@/components/marketing_pages/Header';
import { Container } from '@/components/marketing_pages/Container';
import Link from 'next/link';
import { FileText, Shield, Cookie, Scale, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LegalPage {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const getLegalPages = (t: (key: string) => string): LegalPage[] => [
  {
    title: t('privacy.title'),
    href: '/privacy',
    icon: Shield,
    description: t('privacy.description'),
  },
  {
    title: t('terms.title'),
    href: '/terms',
    icon: FileText,
    description: t('terms.description'),
  },
  {
    title: t('cookies.title'),
    href: '/cookies',
    icon: Cookie,
    description: t('cookies.description'),
  },
  {
    title: t('gdpr.title'),
    href: '/gdpr',
    icon: Scale,
    description: t('gdpr.description'),
  },
  {
    title: t('imprint.title'),
    href: '/imprint',
    icon: Building2,
    description: t('imprint.description'),
  },
];

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export function LegalLayout({
  children,
  title,
  lastUpdated,
}: LegalLayoutProps) {
  const t = useTranslations('legal');
  const legalPages = getLegalPages(t);

  return (
    <>
      <Header />
      <main className="flex-auto">
        <Container className="py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600">
                {t('lastUpdated')}: {lastUpdated}
              </p>
            </div>

            {/* Legal Pages Navigation */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                {t('legalInformation')}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {legalPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="group relative rounded-lg border border-gray-200 bg-white p-4 sm:p-6 hover:border-red-300 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-red-500 transition-colors">
                            {page.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                            {page.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg prose-gray max-w-none">
              {children}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
