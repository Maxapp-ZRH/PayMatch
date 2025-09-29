/**
 * Imprint Page
 *
 * Swiss company information and legal details required by Swiss law.
 * Includes company registration, contact information, and legal disclaimers
 * for users in Switzerland, Germany, France, and Italy.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';
import { useTranslations } from 'next-intl';

export default function ImprintPage() {
  const t = useTranslations('legal.imprint');

  return (
    <LegalLayout title={t('title')} lastUpdated={t('lastUpdated')}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Company Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.companyInformation.title')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {t('sections.companyInformation.subsections.companyName.title')}
              </h3>
              <p className="text-gray-700 text-lg font-medium">
                {t(
                  'sections.companyInformation.subsections.companyName.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {t('sections.companyInformation.subsections.address.title')}
              </h3>
              <p className="text-gray-700">
                {t('sections.companyInformation.subsections.address.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {t('sections.companyInformation.subsections.phone.title')}
              </h3>
              <p className="text-gray-700">
                <a
                  href="tel:+41411234567"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {t('sections.companyInformation.subsections.phone.content')}
                </a>
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {t('sections.companyInformation.subsections.email.title')}
              </h3>
              <p className="text-gray-700">
                <a
                  href="mailto:info@paymatch.ch"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {t('sections.companyInformation.subsections.email.content')}
                </a>
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {t('sections.companyInformation.subsections.website.title')}
              </h3>
              <p className="text-gray-700">
                <a
                  href="https://paymatch.ch"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('sections.companyInformation.subsections.website.content')}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Legal Details */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.legalDetails.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.legalDetails.subsections.legalForm.title')}
              </h3>
              <p className="text-gray-700">
                {t('sections.legalDetails.subsections.legalForm.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.legalDetails.subsections.registrationNumber.title'
                )}
              </h3>
              <p className="text-gray-700">
                {t(
                  'sections.legalDetails.subsections.registrationNumber.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.legalDetails.subsections.vatNumber.title')}
              </h3>
              <p className="text-gray-700">
                {t('sections.legalDetails.subsections.vatNumber.content')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.legalDetails.subsections.chamberOfCommerce.title')}
              </h3>
              <p className="text-gray-700">
                {t(
                  'sections.legalDetails.subsections.chamberOfCommerce.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.legalDetails.subsections.managingDirector.title')}
              </h3>
              <p className="text-gray-700">
                {t(
                  'sections.legalDetails.subsections.managingDirector.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Business Purpose */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.businessPurpose.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.businessPurpose.content')}
            </p>
          </div>
        </section>

        {/* Regulatory Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.regulatoryInformation.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.regulatoryInformation.subsections.dataProtection.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.regulatoryInformation.subsections.dataProtection.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.regulatoryInformation.subsections.financialServices.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.regulatoryInformation.subsections.financialServices.content'
                )}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t(
                  'sections.regulatoryInformation.subsections.swissCompliance.title'
                )}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(
                  'sections.regulatoryInformation.subsections.swissCompliance.content'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.intellectualProperty.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.intellectualProperty.content')}
            </p>
          </div>
        </section>

        {/* Liability */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.liability.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.liability.content')}
            </p>
          </div>
        </section>

        {/* External Links */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.externalLinks.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.externalLinks.content')}
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.governingLaw.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.governingLaw.content')}
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.contact.title')}
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.contact.subsections.generalInquiries.title')}
              </h3>
              <p className="text-gray-700">
                <a
                  href="mailto:info@paymatch.ch"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {t('sections.contact.subsections.generalInquiries.content')}
                </a>
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.contact.subsections.support.title')}
              </h3>
              <p className="text-gray-700">
                <a
                  href="mailto:support@paymatch.ch"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {t('sections.contact.subsections.support.content')}
                </a>
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.contact.subsections.privacy.title')}
              </h3>
              <p className="text-gray-700">
                <a
                  href="mailto:privacy@paymatch.ch"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {t('sections.contact.subsections.privacy.content')}
                </a>
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {t('sections.contact.subsections.legal.title')}
              </h3>
              <p className="text-gray-700">
                <a
                  href="mailto:legal@paymatch.ch"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {t('sections.contact.subsections.legal.content')}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section className="pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('sections.lastUpdated.title')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              {t('sections.lastUpdated.content')}
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
