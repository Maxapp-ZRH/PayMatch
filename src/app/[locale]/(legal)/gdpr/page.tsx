/**
 * GDPR Page
 *
 * Comprehensive GDPR information page explaining data subject rights,
 * data processing activities, and how to exercise your rights under
 * the General Data Protection Regulation for EU/EEA users.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';
import { useTranslations } from 'next-intl';

export default function GDPRPage() {
  const t = useTranslations('legal.gdpr');

  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Introduction */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.introduction.title')}
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                {t('sections.introduction.content.paragraph1')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.introduction.content.paragraph2')}
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.yourRights.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.rightToInformation.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.yourRights.subsections.rightToInformation.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.rightOfAccess.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.rightOfAccess.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.yourRights.subsections.rightToRectification.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.yourRights.subsections.rightToRectification.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.rightToErasure.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.rightToErasure.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.yourRights.subsections.rightToRestrictProcessing.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.yourRights.subsections.rightToRestrictProcessing.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.yourRights.subsections.rightToDataPortability.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.yourRights.subsections.rightToDataPortability.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.rightToObject.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.rightToObject.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.yourRights.subsections.rightsRelatedToAutomatedDecisionMaking.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.yourRights.subsections.rightsRelatedToAutomatedDecisionMaking.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Lawful Basis */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.lawfulBasis.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.lawfulBasis.subsections.consent.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.lawfulBasis.subsections.consent.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.lawfulBasis.subsections.contract.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.lawfulBasis.subsections.contract.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.lawfulBasis.subsections.legalObligation.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.lawfulBasis.subsections.legalObligation.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.lawfulBasis.subsections.legitimateInterests.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.lawfulBasis.subsections.legitimateInterests.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Data Processing */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataProcessing.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.dataProcessing.subsections.dataMinimization.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.dataProcessing.subsections.dataMinimization.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.dataProcessing.subsections.purposeLimitation.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.dataProcessing.subsections.purposeLimitation.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.dataProcessing.subsections.storageLimitation.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.dataProcessing.subsections.storageLimitation.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataProcessing.subsections.accuracy.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.dataProcessing.subsections.accuracy.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Data Breaches */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataBreaches.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.dataBreaches.content')}
            </p>
          </div>
        </section>

        {/* Data Protection Officer */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataProtectionOfficer.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.dataProtectionOfficer.content')}
            </p>
          </div>
        </section>

        {/* International Transfers */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.internationalTransfers.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.internationalTransfers.content')}
            </p>
          </div>
        </section>

        {/* Complaints */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.complaints.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.complaints.content')}
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
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
