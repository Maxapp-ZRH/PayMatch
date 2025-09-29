'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

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
  const t = useTranslations('common.footer');

  return (
    <footer className="border-t border-gray-200">
      <Container>
        <motion.div
          className="flex flex-col items-start justify-between gap-y-8 pt-12 pb-6 sm:gap-y-12 sm:pt-16 lg:flex-row lg:items-center lg:py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
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
                <p className="text-sm text-gray-600">{t('description')}</p>
              </div>
            </div>
            <nav className="mt-6 flex flex-wrap gap-6 sm:mt-8 sm:gap-8">
              <NavLinks />
            </nav>
          </motion.div>
          <motion.div
            className="group relative -mx-4 flex w-full items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:w-auto sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex h-20 w-20 flex-none items-center justify-center sm:h-24 sm:w-24">
              <QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-red-500" />
              <QRCode
                value="https://paymatch.app"
                size={64}
                className="rounded-lg"
                alt="QR Code to PayMatch.app"
              />
            </div>
            <div className="ml-6 sm:ml-8 lg:w-64">
              <p className="text-sm font-semibold text-gray-900 sm:text-base">
                <I18nLink href="/register">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  {t('links.startInvoicing')}
                </I18nLink>
              </p>
              <p className="mt-1 text-xs text-gray-700 sm:text-sm">
                {t('links.startInvoicingDescription')}
              </p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="border-t border-gray-200 pt-8 pb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        >
          {/* Links Section */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Company & Legal Group */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
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
            <div className="mt-8 lg:mt-0 lg:pl-8">
              <h3 className="text-base font-semibold text-gray-900 sm:text-sm">
                {t('newsletter.title')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t('newsletter.description')}
              </p>
              <form className="mt-4 space-y-3 sm:space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
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
                    className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <label
                    htmlFor="newsletter-consent"
                    className="text-xs text-gray-600 leading-relaxed"
                  >
                    {t('newsletter.consent')}{' '}
                    <I18nLink
                      href="/privacy"
                      className="text-red-500 hover:text-red-600 underline"
                    >
                      {t('links.privacy')}
                    </I18nLink>{' '}
                    {t('newsletter.and')}{' '}
                    <I18nLink
                      href="/terms"
                      className="text-red-500 hover:text-red-600 underline"
                    >
                      {t('links.terms')}
                    </I18nLink>{' '}
                    {t('newsletter.apply')}.
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  color="cyan"
                  className="w-full text-sm sm:text-base"
                >
                  {t('newsletter.subscribe')}
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-6 flex flex-col items-center justify-between border-t border-gray-200 pt-6 sm:mt-8 sm:pt-8 md:flex-row">
            <p className="text-xs text-gray-500 sm:text-sm">{t('copyright')}</p>
            <div className="mt-3 flex items-center space-x-4 sm:mt-4 md:mt-0">
              <p className="text-xs text-gray-500 sm:text-sm">
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
        </motion.div>
      </Container>
    </footer>
  );
}
