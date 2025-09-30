'use client';

import { useId } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import { Button } from '@/components/marketing_pages/Button';
import { Container } from '@/components/marketing_pages/Container';
import { QRCode } from '@/components/ui/QRCode';
import logoBbc from '@/assets/logos/bbc.svg';
import logoCbs from '@/assets/logos/cbs.svg';
import logoCnn from '@/assets/logos/cnn.svg';
import logoFastCompany from '@/assets/logos/fast-company.svg';
import logoForbes from '@/assets/logos/forbes.svg';
import logoHuffpost from '@/assets/logos/huffpost.svg';
import logoTechcrunch from '@/assets/logos/techcrunch.svg';
import logoWired from '@/assets/logos/wired.svg';

function BackgroundIllustration(props: React.ComponentPropsWithoutRef<'div'>) {
  const id = useId();

  return (
    <div {...props}>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-slow"
      >
        <path
          d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M513 1025C230.23 1025 1 795.77 1 513"
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1="1"
            y1="513"
            x2="1"
            y2="1025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4262A" />
            <stop offset="1" stopColor="#E4262A" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-reverse-slower"
      >
        <path
          d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M913 513c0 220.914-179.086 400-400 400"
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1="913"
            y1="513"
            x2="913"
            y2="913"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4262A" />
            <stop offset="1" stopColor="#E4262A" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="11.5" stroke="#D4D4D4" />
      <path
        d="M9.5 14.382V9.618a.5.5 0 0 1 .724-.447l4.764 2.382a.5.5 0 0 1 0 .894l-4.764 2.382a.5.5 0 0 1-.724-.447Z"
        fill="#A3A3A3"
        stroke="#A3A3A3"
      />
    </svg>
  );
}

export function Hero() {
  const t = useTranslations('hero');

  return (
    <div
      data-testid="hero"
      className="overflow-hidden py-12 sm:py-20 lg:py-32 lg:pb-32 xl:pb-36"
    >
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <motion.div
            className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              {t('title')}
            </motion.h1>
            <motion.p
              className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            >
              {t('subtitle')}
            </motion.p>
            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-x-6 sm:gap-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            >
              <Button
                href="/register"
                color="cyan"
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold w-full sm:w-auto"
              >
                {t('cta')}
              </Button>
              <Button
                href="#features"
                variant="outline"
                color="gray"
                className="px-4 sm:px-6 text-sm sm:text-base font-semibold !py-2.5 sm:!py-3 w-full sm:w-auto"
              >
                <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6 flex-none" />
                <span className="ml-2 sm:ml-2.5">{t('learnMore')}</span>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <BackgroundIllustration className="absolute top-4 left-1/2 h-[1026px] w-[1026px] -translate-x-1/3 mask-[linear-gradient(to_bottom,white_20%,transparent_75%)] stroke-gray-300/70 sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0" />
            <div className="-mx-4 h-[320px] sm:h-[448px] mask-[linear-gradient(to_bottom,white_60%,transparent)] px-4 sm:px-9 sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-10 lg:-bottom-20 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
              <div className="mx-auto max-w-[280px] sm:max-w-[366px] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                {/* Invoice Header */}
                <div className="bg-gray-900 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm sm:text-lg font-semibold">
                        PayMatch
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Swiss Invoicing Platform
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xs sm:text-sm font-medium">
                        Invoice #2024-001
                      </p>
                      <p className="text-gray-400 text-xs">15.03.2024</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Content */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                          Swiss Business AG
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Musterstrasse 123
                          <br />
                          8001 Zürich, Switzerland
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded border border-gray-200 overflow-hidden">
                          <QRCode
                            value="https://paymatch.app"
                            className="w-full h-full object-cover"
                            alt="QR Code to PayMatch.app"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">QR-Bill</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 sm:pt-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Consulting Services
                          </span>
                          <span className="font-medium">CHF 1,000.00</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">VAT (7.7%)</span>
                          <span className="font-medium">CHF 77.00</span>
                        </div>
                        <div className="border-t pt-1.5 sm:pt-2 flex justify-between font-semibold text-xs sm:text-sm">
                          <span>Total</span>
                          <span className="text-red-600">CHF 1,077.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            Payment Status
                          </p>
                          <p className="text-xs text-gray-600">
                            Due in 15 days
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm text-yellow-600 font-medium">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Footer */}
                <div className="bg-gray-100 px-4 sm:px-6 py-2 sm:py-3">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Swiss QR-Bill Compliant</span>
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="relative -mt-4 lg:col-span-7 lg:mt-0 xl:col-span-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
          >
            <p className="text-center text-xs sm:text-sm font-semibold text-gray-900 lg:text-left">
              {t('trustedBy')}
            </p>
            <ul
              role="list"
              className="mx-auto mt-6 sm:mt-8 flex max-w-xl flex-wrap justify-center gap-x-6 sm:gap-x-10 gap-y-6 sm:gap-y-8 lg:mx-0 lg:justify-start"
            >
              {[
                ['Forbes', logoForbes],
                ['TechCrunch', logoTechcrunch],
                ['Wired', logoWired],
                ['CNN', logoCnn, 'hidden xl:block'],
                ['BBC', logoBbc],
                ['CBS', logoCbs],
                ['Fast Company', logoFastCompany],
                ['HuffPost', logoHuffpost, 'hidden xl:block'],
              ].map(([name, logo, className]) => (
                <li key={name} className={clsx('flex', className)}>
                  <Image
                    src={logo}
                    alt={name}
                    className="h-6 sm:h-8"
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
