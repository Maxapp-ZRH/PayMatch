'use client';

import Image from 'next/image';
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/marketing_pages/Button';
import { Container } from '@/components/marketing_pages/Container';
import { NavLinks } from '@/components/marketing_pages/NavLinks';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Link } from '@/i18n/navigation';

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const t = useTranslations('common.navigation');

  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            <Link
              href="/"
              aria-label="Home"
              className="flex items-center space-x-3"
            >
              <Image
                src="/logo.png"
                alt="PayMatch"
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="text-xl font-bold text-gray-900">PayMatch</span>
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <LanguageSwitcher className="hidden sm:block" />

            <Popover className="lg:hidden">
              {({ open }: { open: boolean }) => (
                <>
                  <PopoverButton
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 focus:not-data-focus:outline-hidden active:stroke-gray-900"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }: { open: boolean }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </PopoverButton>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <PopoverBackdrop
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur-sm"
                        />
                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pt-32 pb-6 shadow-2xl shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a
                              href="/#features"
                              className="block text-base/7 tracking-tight text-gray-700"
                            >
                              {t('features')}
                            </a>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a
                              href="/#reviews"
                              className="block text-base/7 tracking-tight text-gray-700"
                            >
                              {t('reviews')}
                            </a>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a
                              href="/#pricing"
                              className="block text-base/7 tracking-tight text-gray-700"
                            >
                              {t('pricing')}
                            </a>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a
                              href="/#faqs"
                              className="block text-base/7 tracking-tight text-gray-700"
                            >
                              {t('faqs')}
                            </a>
                          </div>
                          <div className="mt-6 mb-4">
                            <div className="text-sm font-medium text-gray-900 mb-3">
                              Language
                            </div>
                            <LanguageSwitcher className="w-full" />
                          </div>
                          <div className="mt-8 flex flex-col gap-4">
                            <Button href="/login" variant="outline">
                              {t('login')}
                            </Button>
                            <Button href="/register" color="swiss">
                              {t('register')}
                            </Button>
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
            <div className="flex items-center gap-6 max-lg:hidden">
              <Button href="/login" variant="outline">
                {t('login')}
              </Button>
              <Button href="/register" color="swiss">
                {t('register')}
              </Button>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
