/**
 * Language Switcher Component
 *
 * Provides a dropdown to switch between supported languages.
 * Displays current language and allows users to change locale.
 */

'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { LanguageTransition } from './LanguageTransition';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
  showFlags?: boolean;
}

const localeConfig = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English',
  },
  'de-CH': {
    name: 'German (Swiss)',
    flag: '🇨🇭',
    nativeName: 'Deutsch',
  },
} as const;

export function LanguageSwitcher({
  className = '',
  variant = 'dropdown',
  showFlags = true,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState<Locale>('en');
  const [transitionTo, setTransitionTo] = useState<Locale>('en');

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Start transition
    setTransitionFrom(locale);
    setTransitionTo(newLocale);
    setIsTransitioning(true);
    setIsOpen(false);
  };

  const handleTransitionComplete = () => {
    // Complete the language change
    router.replace(pathname, { locale: transitionTo });
    setIsTransitioning(false);
  };

  const currentConfig = localeConfig[locale] || localeConfig.en;

  if (variant === 'buttons') {
    return (
      <>
        <LanguageTransition
          isTransitioning={isTransitioning}
          fromLanguage={transitionFrom}
          toLanguage={transitionTo}
          onComplete={handleTransitionComplete}
        />
        <div className={`flex gap-2 ${className}`}>
          {routing.locales.map((loc) => {
            const config = localeConfig[loc];
            const isActive = loc === locale;

            return (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md 
                  transition-colors duration-200 min-w-0 flex-1 justify-center
                  ${
                    isActive
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }
                `}
                title={config.name}
              >
                {showFlags && (
                  <span className="text-base flex-shrink-0">{config.flag}</span>
                )}
                <span className="truncate">{config.nativeName}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <LanguageTransition
        isTransitioning={isTransitioning}
        fromLanguage={transitionFrom}
        toLanguage={transitionTo}
        onComplete={handleTransitionComplete}
      />
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
          flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-gray-700 
          bg-white border border-gray-300 rounded-md
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500
          transition-colors duration-200
        "
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2">
            {showFlags && <span>{currentConfig.flag}</span>}
            <span className="hidden sm:inline">{currentConfig.nativeName}</span>
            <span className="sm:hidden">{currentConfig.flag}</span>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <div
              className="
            absolute right-0 z-20 mt-1 w-48 bg-white border border-gray-200 
            rounded-md
          "
            >
              <div>
                {routing.locales.map((loc) => {
                  const config = localeConfig[loc];
                  const isActive = loc === locale;

                  return (
                    <button
                      key={loc}
                      onClick={() => handleLanguageChange(loc)}
                      className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                      hover:bg-gray-100 transition-colors duration-200
                      ${isActive ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'}
                    `}
                    >
                      {showFlags && (
                        <span className="text-lg">{config.flag}</span>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{config.nativeName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {config.name}
                        </div>
                      </div>
                      {isActive && (
                        <CheckIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default LanguageSwitcher;
