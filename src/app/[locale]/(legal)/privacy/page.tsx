/**
 * Privacy Policy Page
 *
 * Comprehensive privacy policy compliant with GDPR, Swiss Federal Data Protection Act (FADP),
 * and applicable laws in Germany, France, and Italy. Covers data collection, processing,
 * user rights, and contact information for data protection inquiries.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('legal.privacy');

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
              <p className="text-gray-700 leading-relaxed mb-6">
                {t('sections.introduction.content.paragraph2')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('sections.introduction.dataController.title')}
                  </h3>
                  <p className="text-gray-700">
                    {t('sections.introduction.dataController.content')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('sections.introduction.dataProtectionOfficer.title')}
                  </h3>
                  <p className="text-gray-700">
                    <a
                      href="mailto:privacy@paymatch.ch"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      {t('sections.introduction.dataProtectionOfficer.content')}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Collection */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataCollection.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.dataCollection.subsections.personalInformation.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.dataCollection.subsections.personalInformation.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataCollection.subsections.usageData.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.dataCollection.subsections.usageData.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataCollection.subsections.cookies.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.dataCollection.subsections.cookies.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Data Usage */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataUsage.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataUsage.subsections.serviceProvision.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.dataUsage.subsections.serviceProvision.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataUsage.subsections.communication.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.dataUsage.subsections.communication.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataUsage.subsections.legalCompliance.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.dataUsage.subsections.legalCompliance.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Data Sharing */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataSharing.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataSharing.subsections.serviceProviders.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.dataSharing.subsections.serviceProviders.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataSharing.subsections.legalRequirements.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.dataSharing.subsections.legalRequirements.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.dataSharing.subsections.businessTransfers.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.dataSharing.subsections.businessTransfers.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataSecurity.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.dataSecurity.content')}
            </p>
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
                {t('sections.yourRights.subsections.access.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.access.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.rectification.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.rectification.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.erasure.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.erasure.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.portability.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.portability.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.yourRights.subsections.objection.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.yourRights.subsections.objection.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.dataRetention.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.dataRetention.content')}
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

        {/* Children's Privacy */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.childrenPrivacy.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.childrenPrivacy.content')}
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
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
