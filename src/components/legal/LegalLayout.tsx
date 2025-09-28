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

interface LegalPage {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const legalPages: LegalPage[] = [
  {
    title: 'Privacy Policy',
    href: '/privacy',
    icon: Shield,
    description: 'How we collect, use, and protect your personal data',
  },
  {
    title: 'Terms of Service',
    href: '/terms',
    icon: FileText,
    description: 'Terms and conditions for using PayMatch',
  },
  {
    title: 'Cookie Policy',
    href: '/cookies',
    icon: Cookie,
    description: 'Information about cookies and tracking technologies',
  },
  {
    title: 'GDPR',
    href: '/gdpr',
    icon: Scale,
    description: 'Your rights under the General Data Protection Regulation',
  },
  {
    title: 'Imprint',
    href: '/imprint',
    icon: Building2,
    description: 'Company information and legal details',
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
  return (
    <>
      <Header />
      <main className="flex-auto">
        <Container className="py-16">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Legal Pages Navigation */}
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Legal Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {legalPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:border-teal-300 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                            <Icon className="w-5 h-5 text-teal-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                            {page.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-600">
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
            <div className="prose prose-lg prose-gray max-w-none">
              {children}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
