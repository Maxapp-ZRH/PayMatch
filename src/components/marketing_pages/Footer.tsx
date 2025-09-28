import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/marketing_pages/Button';
import { Container } from '@/components/marketing_pages/Container';
import { TextField } from '@/components/marketing_pages/Fields';
import { NavLinks } from '@/components/marketing_pages/NavLinks';
import { QRCode } from '@/components/ui/QRCode';
import { Link as I18nLink } from '@/i18n/navigation';

function QrCodeBorder(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between gap-y-12 pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <Image
                src="/logo.png"
                alt="PayMatch"
                width={40}
                height={40}
                className="h-10 w-10 flex-none"
              />
              <div className="ml-4">
                <p className="text-base font-semibold">PayMatch</p>
                <p className="text-sm">{t('description')}</p>
              </div>
            </div>
            <nav className="mt-8 flex gap-8">
              <NavLinks />
            </nav>
          </div>
          <div className="group relative -mx-4 flex items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
            <div className="relative flex h-24 w-24 flex-none items-center justify-center">
              <QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-teal-600" />
              <QRCode
                value="https://paymatch.app"
                size={80}
                className="rounded-lg"
                alt="QR Code to PayMatch.app"
              />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900">
                <I18nLink href="/register">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  {t('links.startInvoicing')}
                </I18nLink>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {t('links.startInvoicingDescription')}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 pb-12">
          {/* Links Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Company & Legal Group */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Company & Support */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('links.company')}
                </h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="https://maxappzrh.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.company')}
                    </Link>
                  </li>
                  <li>
                    <I18nLink
                      href="/support"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.support')}
                    </I18nLink>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('links.legal')}
                </h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <I18nLink
                      href="/privacy"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.privacy')}
                    </I18nLink>
                  </li>
                  <li>
                    <I18nLink
                      href="/terms"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.terms')}
                    </I18nLink>
                  </li>
                  <li>
                    <I18nLink
                      href="/cookies"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.cookies')}
                    </I18nLink>
                  </li>
                  <li>
                    <I18nLink
                      href="/gdpr"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.gdpr')}
                    </I18nLink>
                  </li>
                  <li>
                    <I18nLink
                      href="/imprint"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.imprint')}
                    </I18nLink>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:pl-8">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('newsletter.title')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t('newsletter.description')}
              </p>
              <form className="mt-4 space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <TextField
                    type="text"
                    name="firstName"
                    aria-label={t('newsletter.firstName')}
                    placeholder={t('newsletter.firstName')}
                    autoComplete="given-name"
                    required
                    className="min-w-0"
                  />
                  <TextField
                    type="text"
                    name="lastName"
                    aria-label={t('newsletter.lastName')}
                    placeholder={t('newsletter.lastName')}
                    autoComplete="family-name"
                    required
                    className="min-w-0"
                  />
                </div>

                {/* Email Field */}
                <TextField
                  type="email"
                  name="email"
                  aria-label={t('newsletter.email')}
                  placeholder={t('newsletter.emailPlaceholder')}
                  autoComplete="email"
                  required
                  className="w-full"
                />

                {/* Consent Checkbox */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter-consent"
                    name="consent"
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label
                    htmlFor="newsletter-consent"
                    className="text-xs text-gray-600 leading-relaxed"
                  >
                    {t('newsletter.consent')}
                    <br />
                    <I18nLink
                      href="/privacy"
                      className="text-teal-600 hover:text-teal-700 underline"
                    >
                      {t('links.privacy')}
                    </I18nLink>{' '}
                    {t('newsletter.and')}{' '}
                    <I18nLink
                      href="/terms"
                      className="text-teal-600 hover:text-teal-700 underline"
                    >
                      {t('links.terms')}
                    </I18nLink>{' '}
                    {t('newsletter.apply')}.
                  </label>
                </div>

                {/* Submit Button */}
                <Button type="submit" color="cyan" className="w-full">
                  {t('newsletter.subscribe')}
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-200 pt-8 md:flex-row">
            <p className="text-sm text-gray-500">{t('copyright')}</p>
            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              <p className="text-sm text-gray-500">
                {t('developedBy')}{' '}
                <Link
                  href="https://maxappzrh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 hover:text-gray-900"
                >
                  Maxapp ZRH
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
