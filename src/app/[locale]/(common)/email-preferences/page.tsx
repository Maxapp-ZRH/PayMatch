/**
 * Email Preferences Management Page
 *
 * Allows users to manage their email preferences at any time.
 * Provides granular control over different email types with
 * clear descriptions and consequence warnings.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/marketing_pages/Container';
import { Button } from '@/components/marketing_pages/Button';
import { Switch } from '@headlessui/react';
import {
  CheckCircle,
  AlertCircle,
  Info,
  Mail,
  Shield,
  Bell,
  FileText,
  CreditCard,
  Settings,
  LogIn,
} from 'lucide-react';
import type { EmailType } from '@/features/email';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';

interface EmailPreferenceConfig {
  emailType: EmailType;
  category:
    | 'marketing'
    | 'transactional'
    | 'security'
    | 'legal'
    | 'informational';
  title: string;
  description: string;
  consequence?: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresConsent: boolean;
  mandatory?: boolean; // NEW: Cannot be disabled
}

export default function EmailPreferencesPage() {
  const t = useTranslations('emailPreferences');
  const [preferences, setPreferences] = useState<
    Partial<Record<EmailType, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Email type configurations
  const emailTypes: EmailPreferenceConfig[] = useMemo(
    () => [
      {
        emailType: 'newsletter_promotional',
        category: 'marketing',
        title: t('emailTypes.newsletter_promotional.title'),
        description: t('emailTypes.newsletter_promotional.description'),
        consequence: t('emailTypes.newsletter_promotional.consequence'),
        icon: Mail,
        requiresConsent: true,
      },
      {
        emailType: 'newsletter_informational',
        category: 'informational',
        title: t('emailTypes.newsletter_informational.title'),
        description: t('emailTypes.newsletter_informational.description'),
        consequence: t('emailTypes.newsletter_informational.consequence'),
        icon: FileText,
        requiresConsent: false,
      },
      {
        emailType: 'newsletter_news',
        category: 'informational',
        title: t('emailTypes.newsletter_news.title'),
        description: t('emailTypes.newsletter_news.description'),
        consequence: t('emailTypes.newsletter_news.consequence'),
        icon: Bell,
        requiresConsent: false,
      },
      {
        emailType: 'business_notifications',
        category: 'transactional',
        title: t('emailTypes.business_notifications.title'),
        description: t('emailTypes.business_notifications.description'),
        consequence: t('emailTypes.business_notifications.consequence'),
        icon: CreditCard,
        requiresConsent: false,
      },
      {
        emailType: 'overdue_alerts',
        category: 'transactional',
        title: t('emailTypes.overdue_alerts.title'),
        description: t('emailTypes.overdue_alerts.description'),
        consequence: t('emailTypes.overdue_alerts.consequence'),
        icon: AlertCircle,
        requiresConsent: false,
      },
      {
        emailType: 'support',
        category: 'transactional',
        title: t('emailTypes.support.title'),
        description: t('emailTypes.support.description'),
        consequence: t('emailTypes.support.consequence'),
        icon: Settings,
        requiresConsent: false,
        mandatory: true,
      },
      {
        emailType: 'transactional',
        category: 'transactional',
        title: t('emailTypes.transactional.title'),
        description: t('emailTypes.transactional.description'),
        consequence: t('emailTypes.transactional.consequence'),
        icon: CheckCircle,
        requiresConsent: false,
        mandatory: true, // Essential for account management
      },
      {
        emailType: 'security',
        category: 'security',
        title: t('emailTypes.security.title'),
        description: t('emailTypes.security.description'),
        consequence: t('emailTypes.security.consequence'),
        icon: Shield,
        requiresConsent: false,
        mandatory: true, // Essential for account security
      },
      {
        emailType: 'legal',
        category: 'legal',
        title: t('emailTypes.legal.title'),
        description: t('emailTypes.legal.description'),
        consequence: t('emailTypes.legal.consequence'),
        icon: FileText,
        requiresConsent: false,
        mandatory: true, // Essential for legal compliance
      },
    ],
    [t]
  );

  // Check authentication and load preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const supabase = createClient();

        // Check if user is authenticated
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUserEmail(user.email || '');

        const newPreferences: Partial<Record<EmailType, boolean>> = {};

        // Load preferences for each email type
        for (const emailType of emailTypes) {
          try {
            // Check if this email type is mandatory
            const mandatoryEmailTypes: EmailType[] = [
              'security',
              'transactional',
              'support',
              'legal',
            ];
            if (mandatoryEmailTypes.includes(emailType.emailType)) {
              // Mandatory emails are always enabled
              newPreferences[emailType.emailType] = true;
            } else {
              const response = await fetch(
                `/api/email/preferences?type=${emailType.emailType}`
              );
              if (response.ok) {
                const data = await response.json();
                newPreferences[emailType.emailType] = data.subscriber.isActive;
              } else {
                throw new Error(
                  `Failed to fetch preferences: ${response.statusText}`
                );
              }
            }
          } catch (error) {
            console.error(
              `Failed to load ${emailType.emailType} preferences:`,
              error
            );
            // For mandatory emails, default to true; for others, default to false
            const mandatoryEmailTypes: EmailType[] = [
              'security',
              'transactional',
              'support',
              'legal',
            ];
            newPreferences[emailType.emailType] = mandatoryEmailTypes.includes(
              emailType.emailType
            );
          }
        }

        setPreferences(newPreferences);
      } catch (error) {
        console.error('Failed to load email preferences:', error);
        setError(t('errorMessage'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [emailTypes, t]);

  const handlePreferenceChange = async (
    emailType: EmailType,
    value: boolean
  ) => {
    if (!userEmail) return;

    // Check if this email type is mandatory
    const mandatoryEmailTypes: EmailType[] = [
      'security',
      'transactional',
      'support',
      'legal',
    ];
    if (mandatoryEmailTypes.includes(emailType)) {
      setError(t('mandatoryErrorMessage'));
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const response = await fetch('/api/email/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType,
          isActive: value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update preference: ${response.statusText}`);
      }

      setPreferences((prev) => ({
        ...prev,
        [emailType]: value,
      }));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(`Failed to update ${emailType} preference:`, error);
      setError(t('updateErrorMessage', { emailType }));
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'transactional':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'security':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'legal':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'informational':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryName = (category: string) => {
    const categoryKey = `categories.${category}` as keyof typeof t;
    return t(categoryKey);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              {/* Header with branding */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Email Preferences
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your email communication preferences
                </p>
              </div>

              {/* Main card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Sign in to manage your preferences
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    To manage your email preferences, you need to be signed in
                    to your PayMatch account. This ensures your settings are
                    secure and personalized to your account.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Link href="/login">
                    <Button
                      color="swiss"
                      className="w-full sm:w-auto px-8 py-3"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="outline"
                      color="swiss"
                      className="w-full sm:w-auto px-8 py-3"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>

                {/* Additional options */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Don&apos;t have an account yet?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      ← Back to Home
                    </Link>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <Link
                      href="/support"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>

              {/* Info section */}
              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      What are email preferences?
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Email preferences allow you to control which types of
                      emails you receive from PayMatch. You can choose to
                      receive business notifications, marketing updates,
                      security alerts, and more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 sm:py-20 lg:py-32">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900">
              {t('title')}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
            {userEmail && (
              <p className="mt-2 text-sm text-gray-500">
                {t('managingFor')}{' '}
                <span className="font-medium text-gray-700">{userEmail}</span>
              </p>
            )}
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">
                {t('successMessage')}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Introduction */}
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 mb-4">
              {t('sections.introduction.title')}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('sections.introduction.content')}
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <div className="flex">
                <Info className="w-5 h-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-teal-800 mb-1">
                    {t('sections.introduction.importantNote.title')}
                  </h3>
                  <p className="text-sm text-teal-700">
                    {t('sections.introduction.importantNote.content')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Email Categories */}
          <section className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900">
              {t('sections.categories.title')}
            </h2>

            {emailTypes.map((emailType) => {
              const Icon = emailType.icon;
              const categoryColor = getCategoryColor(emailType.category);
              const isActive = preferences[emailType.emailType] ?? false;
              const isMandatory = emailType.mandatory ?? false;

              return (
                <div
                  key={emailType.emailType}
                  className={`bg-white border rounded-xl p-6 sm:p-8 ${
                    isMandatory
                      ? 'border-teal-200 bg-teal-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <Icon className="w-5 h-5 text-gray-600 mr-3" />
                        <h3 className="text-lg font-medium text-gray-900">
                          {emailType.title}
                        </h3>
                        <span
                          className={`ml-3 px-2 py-1 text-xs font-medium rounded-full border ${categoryColor}`}
                        >
                          {getCategoryName(emailType.category)}
                        </span>
                        {isMandatory && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                            {t('labels.required')}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-3">
                        {emailType.description}
                      </p>

                      {isMandatory && (
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                          <div className="flex">
                            <Shield className="w-4 h-4 text-teal-600 mr-2 mt-0.5" />
                            <p className="text-sm text-teal-800">
                              <strong>{t('labels.essential')}:</strong>{' '}
                              {t('labels.essentialDescription')}
                            </p>
                          </div>
                        </div>
                      )}

                      {emailType.consequence && !isMandatory && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex">
                            <AlertCircle className="w-4 h-4 text-amber-600 mr-2 mt-0.5" />
                            <p className="text-sm text-amber-800">
                              <strong>{t('labels.consequence')}:</strong>{' '}
                              {emailType.consequence}
                            </p>
                          </div>
                        </div>
                      )}

                      {emailType.requiresConsent && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {t('labels.requiresMarketingConsent')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex-shrink-0">
                      {isMandatory ? (
                        <div className="flex items-center justify-center h-6 w-11 bg-teal-200 rounded-full">
                          <Shield className="h-4 w-4 text-teal-600" />
                        </div>
                      ) : (
                        <Switch
                          checked={isActive}
                          onChange={(checked) =>
                            handlePreferenceChange(emailType.emailType, checked)
                          }
                          disabled={isSaving}
                          className={`${
                            isActive ? 'bg-teal-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50`}
                        >
                          <span
                            className={`${
                              isActive ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Footer Actions */}
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>{t('sections.footer.autoSave')}</p>
                <p>{t('sections.footer.updateAnytime')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  href="/support"
                  variant="outline"
                  color="swiss"
                  className="w-full sm:w-auto"
                >
                  {t('actions.contactSupport')}
                </Button>
                <Button
                  href="/privacy"
                  variant="outline"
                  color="swiss"
                  className="w-full sm:w-auto"
                >
                  {t('actions.privacyPolicy')}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
