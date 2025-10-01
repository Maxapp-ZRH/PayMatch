/**
 * Language Switcher Component
 *
 * Provides a compact select dropdown to switch between supported languages.
 * Features red accent color for hover and focus states to match brand colors.
 * Always plays smooth language transition animation when selecting any language.
 * Only shows languages that have message files available.
 * Enhanced with extended width, no label, custom styling, and single dropdown arrow.
 */

'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { LanguageTransition } from './LanguageTransition';
import clsx from 'clsx';

interface LanguageSwitcherProps {
  className?: string;
}

// Language configuration - only include languages with message files
const localeConfig = {
  'en-CH': {
    name: 'English (Switzerland)',
    nativeName: 'English',
  },
  'de-CH': {
    name: 'German (Switzerland)',
    nativeName: 'Deutsch',
  },
} as const;

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fromLanguage, setFromLanguage] = useState<Locale>(locale);
  const [toLanguage, setToLanguage] = useState<Locale>(locale);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLocale = event.target.value as Locale;

    // Always play transition, even if selecting the same language
    setFromLanguage(locale);
    setToLanguage(newLocale);
    setIsTransitioning(true);

    // Only navigate if it's actually a different language
    if (newLocale !== locale) {
      // Navigate to the new locale after the full animation completes (1.8 seconds)
      setTimeout(() => {
        router.replace(pathname, { locale: newLocale });
      }, 1800);
    } else {
      // If same language, just complete the transition after full animation
      setTimeout(() => {
        handleTransitionComplete();
      }, 1800);
    }
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setFromLanguage(toLanguage);
  };

  return (
    <>
      <LanguageTransition
        isTransitioning={isTransitioning}
        fromLanguage={fromLanguage}
        toLanguage={toLanguage}
        onComplete={handleTransitionComplete}
      />
      <div className={clsx('relative', className)}>
        <select
          value={locale}
          onChange={handleLanguageChange}
          className={clsx(
            'w-32 min-w-32 appearance-none rounded-lg border-2 border-gray-200 bg-white py-2 px-3 pr-8 text-sm text-gray-900 transition-colors duration-200',
            'hover:border-red-300 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20',
            'cursor-pointer shadow-none'
          )}
          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        >
          {routing.locales.map((loc) => {
            const config = localeConfig[loc];
            return (
              <option key={loc} value={loc}>
                {config.nativeName}
              </option>
            );
          })}
        </select>
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </>
  );
}

export default LanguageSwitcher;
