'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/marketing_pages/Button';
import { Container } from '@/components/marketing_pages/Container';
import { TextField } from '@/components/marketing_pages/Fields';
import { NavLinks } from '@/components/marketing_pages/NavLinks';
import { Link as I18nLink } from '@/i18n/navigation';
import {
  newsletterSubscriptionSchema,
  type NewsletterSubscriptionData,
} from '@/features/email/schemas';

export function Footer() {
  const t = useTranslations('common.footer');
  const tValidation = useTranslations('validation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    watch,
    trigger,
    setValue,
  } = useForm<NewsletterSubscriptionData>({
    resolver: zodResolver(newsletterSubscriptionSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      consent: false,
    },
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  // Real-time validation for individual fields
  useEffect(() => {
    const validateField = async (
      fieldName: keyof NewsletterSubscriptionData
    ) => {
      if (touchedFields[fieldName]) {
        await trigger(fieldName);
      }
    };

    // Validate fields as user types (debounced)
    const timeoutId = setTimeout(() => {
      if (watchedValues.firstName) validateField('firstName');
      if (watchedValues.lastName) validateField('lastName');
      if (watchedValues.email) validateField('email');
      // Always validate consent when it changes
      if (touchedFields.consent) validateField('consent');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    watchedValues.firstName,
    watchedValues.lastName,
    watchedValues.email,
    watchedValues.consent,
    trigger,
    touchedFields,
  ]);

  const onSubmit = async (data: NewsletterSubscriptionData) => {
    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage('');

    try {
      const response = await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe to newsletter');
      }

      setShowSuccess(true);
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to subscribe to newsletter'
      );
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission with validation
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Force validation of all fields including consent
    const validationResults = await Promise.all([
      trigger('firstName'),
      trigger('lastName'),
      trigger('email'),
      trigger('consent'),
    ]);

    const isValid = validationResults.every((result) => result);

    if (!isValid) {
      // Scroll to first error field
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstErrorField as HTMLElement).focus();
      }
      return;
    }

    handleSubmit(onSubmit)(e);
  };

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
            <div className="flex items-start text-gray-900">
              <Image
                src="/logo.png"
                alt="PayMatch"
                width={40}
                height={40}
                className="h-10 w-10 flex-none mt-0.5"
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
                  <li>
                    <a
                      href="#pwa"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('links.pwa')}
                    </a>
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

              {/* Success Message */}
              {showSuccess && (
                <motion.div
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-sm text-green-800 font-medium">
                      Successfully subscribed! Check your email for a welcome
                      message.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {showError && (
                <motion.div
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <p className="text-sm text-red-800 font-medium">
                      {errorMessage}
                    </p>
                  </div>
                </motion.div>
              )}

              <form
                onSubmit={handleFormSubmit}
                className="mt-4 space-y-3 sm:space-y-4"
              >
                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
                  <div className="min-w-0">
                    <TextField
                      {...register('firstName')}
                      type="text"
                      aria-label={t('newsletter.firstName')}
                      placeholder={t('newsletter.firstName')}
                      autoComplete="given-name"
                      className={`min-w-0 ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={
                        errors.firstName ? 'firstName-error' : undefined
                      }
                    />
                    {errors.firstName && (
                      <p
                        id="firstName-error"
                        className="mt-1 text-xs text-red-600"
                      >
                        {tValidation(errors.firstName.message || '')}
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <TextField
                      {...register('lastName')}
                      type="text"
                      aria-label={t('newsletter.lastName')}
                      placeholder={t('newsletter.lastName')}
                      autoComplete="family-name"
                      className={`min-w-0 ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      aria-invalid={!!errors.lastName}
                      aria-describedby={
                        errors.lastName ? 'lastName-error' : undefined
                      }
                    />
                    {errors.lastName && (
                      <p
                        id="lastName-error"
                        className="mt-1 text-xs text-red-600"
                      >
                        {tValidation(errors.lastName.message || '')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="w-full">
                  <TextField
                    {...register('email')}
                    type="email"
                    aria-label={t('newsletter.email')}
                    placeholder={t('newsletter.emailPlaceholder')}
                    autoComplete="email"
                    className={`w-full ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600">
                      {tValidation(errors.email.message || '')}
                    </p>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center">
                      <input
                        {...register('consent')}
                        type="checkbox"
                        id="newsletter-consent"
                        className={`h-4 w-4 flex-shrink-0 rounded border-gray-300 text-red-500 focus:ring-2 focus:ring-red-200 ${
                          errors.consent
                            ? 'border-red-500 ring-2 ring-red-200'
                            : 'border-gray-300'
                        }`}
                        aria-invalid={!!errors.consent}
                        aria-describedby={
                          errors.consent ? 'consent-error' : undefined
                        }
                        onChange={(e) => {
                          setValue('consent', e.target.checked);
                          trigger('consent');
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor="newsletter-consent"
                        className="text-xs text-gray-600 leading-relaxed cursor-pointer block"
                      >
                        {t('newsletter.consent')}{' '}
                        <I18nLink
                          href="/privacy"
                          className="text-red-500 hover:text-red-600 underline font-medium"
                        >
                          {t('links.privacy')}
                        </I18nLink>{' '}
                        {t('newsletter.and')}{' '}
                        <I18nLink
                          href="/terms"
                          className="text-red-500 hover:text-red-600 underline font-medium"
                        >
                          {t('links.terms')}
                        </I18nLink>{' '}
                        {t('newsletter.apply')}.
                      </label>
                    </div>
                  </div>
                  {errors.consent && (
                    <div className="ml-7">
                      <p
                        id="consent-error"
                        className="text-xs text-red-600 font-medium"
                      >
                        {tValidation(errors.consent.message || '')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  color="cyan"
                  disabled={isSubmitting || !isValid}
                  className="w-full text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    t('newsletter.subscribe')
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-6 flex flex-col items-center justify-between border-t border-gray-200 pt-6 sm:mt-8 sm:pt-8 md:flex-row">
            <p className="text-xs text-gray-500 sm:text-sm">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
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
