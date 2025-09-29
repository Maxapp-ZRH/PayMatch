/**
 * Terms of Service Page
 *
 * Comprehensive terms of service compliant with Swiss business law,
 * covering service usage, payment terms, liability, and dispute resolution
 * for users in Switzerland, Germany, France, and Italy.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';
import { useTranslations } from 'next-intl';

export default function TermsOfServicePage() {
  const t = useTranslations('legal.terms');

  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        {/* Agreement */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.agreement.title')}
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                {t('sections.agreement.content.paragraph1')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                {t('sections.agreement.content.paragraph2')}
              </p>
            </div>
          </div>
        </section>

        {/* Definitions */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.definitions.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.definitions.subsections.service.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.definitions.subsections.service.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.definitions.subsections.user.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.definitions.subsections.user.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.definitions.subsections.content.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.definitions.subsections.content.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Service Description */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.serviceDescription.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.serviceDescription.content')}
            </p>
          </div>
        </section>

        {/* User Accounts */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.userAccounts.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.userAccounts.subsections.registration.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.userAccounts.subsections.registration.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.userAccounts.subsections.accountSecurity.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.userAccounts.subsections.accountSecurity.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.acceptableUse.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.acceptableUse.subsections.permittedUse.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.acceptableUse.subsections.permittedUse.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.acceptableUse.subsections.prohibitedUse.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.acceptableUse.subsections.prohibitedUse.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Terms */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.paymentTerms.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.paymentTerms.subsections.fees.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.paymentTerms.subsections.fees.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.paymentTerms.subsections.billing.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.paymentTerms.subsections.billing.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.paymentTerms.subsections.refunds.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.paymentTerms.subsections.refunds.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.intellectualProperty.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.intellectualProperty.subsections.ourRights.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.intellectualProperty.subsections.ourRights.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.intellectualProperty.subsections.yourContent.title'
                )}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t(
                  'sections.intellectualProperty.subsections.yourContent.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.privacy.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.privacy.content')}
            </p>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.disclaimers.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.disclaimers.content')}
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.limitationOfLiability.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.limitationOfLiability.content')}
            </p>
          </div>
        </section>

        {/* Indemnification */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.indemnification.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.indemnification.content')}
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.termination.title')}
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.termination.subsections.byYou.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.termination.subsections.byYou.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                {t('sections.termination.subsections.byUs.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('sections.termination.subsections.byUs.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.governingLaw.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.governingLaw.content')}
            </p>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.disputeResolution.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.disputeResolution.content')}
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            {t('sections.changes.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.changes.content')}
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
