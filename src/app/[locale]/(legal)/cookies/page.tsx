/**
 * Cookie Policy Page
 *
 * Detailed cookie policy explaining the types of cookies used by PayMatch,
 * their purposes, and how users can manage their cookie preferences.
 * Compliant with GDPR and applicable laws in Switzerland, Germany, France, and Italy.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';
import { useTranslations } from 'next-intl';

export default function CookiePolicyPage() {
  const t = useTranslations('legal.cookies');

  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        {/* Introduction */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.introduction.title')}
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                {t('sections.introduction.content.paragraph1')}
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.introduction.content.paragraph2')}
              </p>
            </div>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.typesOfCookies.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.typesOfCookies.subsections.essential.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.typesOfCookies.subsections.essential.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.typesOfCookies.subsections.analytics.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.typesOfCookies.subsections.analytics.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.typesOfCookies.subsections.functional.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.typesOfCookies.subsections.functional.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.typesOfCookies.subsections.marketing.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.typesOfCookies.subsections.marketing.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Specific Cookies */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.specificCookies.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.specificCookies.subsections.sessionCookies.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.specificCookies.subsections.sessionCookies.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.specificCookies.subsections.persistentCookies.title'
                )}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.specificCookies.subsections.persistentCookies.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.specificCookies.subsections.thirdPartyCookies.title'
                )}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.specificCookies.subsections.thirdPartyCookies.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Purposes */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.purposes.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.purposes.subsections.websiteFunctionality.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.purposes.subsections.websiteFunctionality.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.purposes.subsections.userExperience.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.purposes.subsections.userExperience.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.purposes.subsections.analytics.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.purposes.subsections.analytics.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.purposes.subsections.security.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.purposes.subsections.security.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Management */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.cookieManagement.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.cookieManagement.subsections.browserSettings.title'
                )}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.cookieManagement.subsections.browserSettings.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.cookieManagement.subsections.ourCookieSettings.title'
                )}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.cookieManagement.subsections.ourCookieSettings.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.cookieManagement.subsections.optOut.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.cookieManagement.subsections.optOut.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.thirdPartyServices.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.thirdPartyServices.subsections.analytics.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.thirdPartyServices.subsections.analytics.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.thirdPartyServices.subsections.advertising.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.thirdPartyServices.subsections.advertising.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.thirdPartyServices.subsections.socialMedia.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.thirdPartyServices.subsections.socialMedia.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.dataRetention.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.dataRetention.content')}
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.yourRights.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.consent.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.consent.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.withdrawal.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.withdrawal.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.information.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.information.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.updates.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.updates.content')}
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.contact.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.contact.content')}
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
