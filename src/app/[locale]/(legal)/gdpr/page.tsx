/**
 * GDPR Page
 *
 * Comprehensive GDPR information page explaining data subject rights,
 * data processing activities, and how to exercise your rights under
 * the General Data Protection Regulation for EU/EEA users.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';

export default function GDPRPage() {
  return (
    <LegalLayout title="GDPR Information" lastUpdated="September 28, 2025">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Introduction */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            1. GDPR Compliance
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                PayMatch is committed to protecting your personal data in
                accordance with the General Data Protection Regulation (GDPR)
                and the Swiss Federal Data Protection Act (FADP).
              </p>
              <p className="text-gray-700 leading-relaxed">
                This page explains your rights under GDPR and how to exercise
                them when using our Swiss QR-bill invoicing platform.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Important Note
              </h3>
              <p className="text-blue-800 leading-relaxed">
                While PayMatch is based in Switzerland, we process personal data
                of EU/EEA residents and therefore comply with GDPR requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Data Controller Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            2. Data Controller Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                Company Details
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Company Name
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    Maxapp ZRH AG
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Address
                  </dt>
                  <dd className="text-gray-900">
                    Birkenstrasse 49, 6343 Rotkreuz, Switzerland
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Registration
                  </dt>
                  <dd className="text-gray-900 font-mono">CHE-123.456.789</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Email
                  </dt>
                  <dd className="text-gray-900">
                    <a
                      href="mailto:legal@paymatch.app"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      legal@paymatch.app
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Phone
                  </dt>
                  <dd className="text-gray-900 font-mono">+41 44 123 45 67</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                Data Protection Officer
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Email
                  </dt>
                  <dd className="text-gray-900">
                    <a
                      href="mailto:legal@paymatch.app"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      legal@paymatch.app
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Phone
                  </dt>
                  <dd className="text-gray-900 font-mono">+41 44 123 45 68</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Response Time
                  </dt>
                  <dd className="text-gray-900">
                    Within 72 hours for urgent matters
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            3. Your Rights Under GDPR
          </h2>

          <div className="space-y-8">
            {/* Right of Access */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.1 Right of Access (Article 15)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You have the right to obtain confirmation as to whether or not
                personal data concerning you is being processed, and access to
                that data.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  What you can request:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Confirmation of data processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Categories of personal data processed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Purposes of processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Recipients of your data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Data retention periods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Your rights under GDPR</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right to Rectification */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.2 Right to Rectification (Article 16)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You have the right to have inaccurate personal data corrected
                and incomplete data completed.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  How to request:
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>
                      Contact us at{' '}
                      <a
                        href="mailto:info@paymatch.app"
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        info@paymatch.app
                      </a>{' '}
                      for general questions,{' '}
                      <a
                        href="mailto:legal@paymatch.app"
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        legal@paymatch.app
                      </a>{' '}
                      for rights requests
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Specify which data needs correction</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Provide correct information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>We&apos;ll respond within 30 days</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right to Erasure */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.3 Right to Erasure (Article 17)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You have the right to have your personal data erased in certain
                circumstances.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  When you can request erasure:
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>
                      Data is no longer necessary for original purposes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>
                      You withdraw consent and no other legal basis exists
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Data was processed unlawfully</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>
                      Data must be erased to comply with legal obligations
                    </span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> We may retain data for legal
                    compliance (e.g., Swiss tax law)
                  </p>
                </div>
              </div>
            </div>

            {/* Right to Data Portability */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.4 Right to Data Portability (Article 20)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You have the right to receive your personal data in a
                structured, commonly used, and machine-readable format.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  What you can export:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Account information and profile data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Invoice data and client information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Payment records and transaction history</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Settings and preferences</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right to Restrict Processing */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.5 Right to Restrict Processing (Article 18)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You have the right to restrict the processing of your personal
                data in certain circumstances.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  When you can request restriction:
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>You contest the accuracy of the data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>
                      Processing is unlawful but you prefer restriction to
                      erasure
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>
                      We no longer need the data but you need it for legal
                      claims
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>
                      You object to processing pending verification of
                      legitimate grounds
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right to Object */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.6 Right to Object (Article 21)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You have the right to object to processing of your personal data
                based on legitimate interests or for direct marketing purposes.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  You can object to:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Direct marketing communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Profiling for marketing purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Processing based on legitimate interests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-3 mt-1">•</span>
                    <span>Processing for research or statistical purposes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Exercise Your Rights */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            4. How to Exercise Your Rights
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Step 1: Contact Us
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Send your request to our Data Protection Officer:
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Email
                    </dt>
                    <dd className="text-gray-900">
                      <a
                        href="mailto:legal@paymatch.app"
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        legal@paymatch.app
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Subject
                    </dt>
                    <dd className="text-gray-900">GDPR Data Subject Request</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Include
                    </dt>
                    <dd className="text-gray-900">
                      Your full name, email address, and specific request
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Step 2: Identity Verification
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We may need to verify your identity before processing your
                request:
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Government-issued photo ID</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Proof of address</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Account verification questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Additional documentation if required</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Step 3: Response Timeline
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We will respond to your request within the following timeframes:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Standard requests
                  </h4>
                  <p className="text-gray-700">Within 30 days</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Complex requests
                  </h4>
                  <p className="text-gray-700">
                    Up to 60 days (with notification)
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Urgent matters
                  </h4>
                  <p className="text-gray-700">Within 72 hours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Data breach notifications
                  </h4>
                  <p className="text-gray-700">Within 72 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Processing Activities */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            5. Data Processing Activities
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Legal Basis
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Data Categories
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Retention
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Account Management
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Contract Performance
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Name, email, company info
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Account deletion + 7 years
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Invoice Processing
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Contract Performance
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Invoice data, client info
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      10 years (Swiss law)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Payment Processing
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Contract Performance
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Payment data, bank details
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      7 years (Swiss law)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Marketing
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">Consent</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Email, preferences
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Until consent withdrawal
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Analytics
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Legitimate Interest
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Usage data, cookies
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      2 years maximum
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Complaints */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            6. Right to Lodge a Complaint
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed">
                If you believe we have not handled your personal data in
                accordance with GDPR, you have the right to lodge a complaint
                with a supervisory authority.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Swiss Authority
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Authority
                    </dt>
                    <dd className="text-gray-900 font-semibold">
                      Federal Data Protection and Information Commissioner
                      (FDPIC)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Website
                    </dt>
                    <dd className="text-gray-900">
                      <a
                        href="https://www.edoeb.admin.ch"
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.edoeb.admin.ch
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Email
                    </dt>
                    <dd className="text-gray-900">info@edoeb.admin.ch</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  EU Authorities
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can lodge a complaint with the supervisory authority in
                  your country of residence, place of work, or where the alleged
                  infringement occurred.
                </p>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Find your authority
                  </dt>
                  <dd className="text-gray-900">
                    <a
                      href="https://edpb.europa.eu/about-edpb/board/members_en"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      EDPB Members
                    </a>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            7. Contact Information
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                For any GDPR-related questions or to exercise your rights,
                contact us:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Data Protection Officer
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Email
                      </dt>
                      <dd className="text-gray-900">
                        <a
                          href="mailto:legal@paymatch.app"
                          className="text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          legal@paymatch.app
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Phone
                      </dt>
                      <dd className="text-gray-900 font-mono">
                        +41 44 123 45 68
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Address
                      </dt>
                      <dd className="text-gray-900">
                        Maxapp ZRH, Birkenstrasse 49, 6343 Rotkreuz, Schweiz
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Response Time
                      </dt>
                      <dd className="text-gray-900">
                        Within 72 hours for urgent matters
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    General Privacy Inquiries
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Email
                      </dt>
                      <dd className="text-gray-900">
                        <a
                          href="mailto:legal@paymatch.app"
                          className="text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          legal@paymatch.app
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Phone
                      </dt>
                      <dd className="text-gray-900 font-mono">
                        +41 44 123 45 67
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
