/**
 * Privacy Policy Page
 *
 * Comprehensive privacy policy compliant with GDPR, Swiss Federal Data Protection Act (FADP),
 * and applicable laws in Germany, France, and Italy. Covers data collection, processing,
 * user rights, and contact information for data protection inquiries.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';
import { Link } from '@/i18n/navigation';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="September 28, 2025">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Introduction */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            1. Introduction
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                PayMatch (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                committed to protecting your privacy and personal data. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our Swiss QR-bill
                invoicing platform.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                This policy complies with the General Data Protection Regulation
                (GDPR), the Swiss Federal Data Protection Act (FADP), and
                applicable data protection laws in Germany, France, and Italy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Data Controller
                  </h3>
                  <p className="text-gray-700">
                    Maxapp ZRH, Birkenstrasse 49, 6343 Rotkreuz, Schweiz
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Data Protection Officer
                  </h3>
                  <p className="text-gray-700">
                    <a
                      href="mailto:legal@paymatch.app"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      legal@paymatch.app
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
            2. Information We Collect
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                2.1 Personal Information
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Name, email address, and contact information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Company information and business registration details
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Billing and payment information (processed securely by
                    Stripe)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Swiss QR-bill and invoice data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Client and customer information for invoicing purposes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Bank account details for payment reconciliation</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                2.2 Technical Information
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>IP address, browser type, and device information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Usage data and analytics (with your consent)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Cookies and similar tracking technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Log files and system performance data</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Legal Basis */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            3. Legal Basis for Processing
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We process your personal data based on the following legal
              grounds:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Contract Performance
                </h4>
                <p className="text-sm text-gray-700">
                  To provide our invoicing services
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Legal Obligation
                </h4>
                <p className="text-sm text-gray-700">
                  To comply with Swiss tax and accounting laws
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Legitimate Interest
                </h4>
                <p className="text-sm text-gray-700">
                  To improve our services and prevent fraud
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Consent</h4>
                <p className="text-sm text-gray-700">
                  For marketing communications and analytics
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Usage */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            4. How We Use Your Information
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Provide and maintain our invoicing platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Process payments and generate Swiss QR-bills</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Comply with Swiss tax and accounting regulations</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Send invoices and payment reminders</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Provide customer support and technical assistance</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Improve our services and develop new features</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Prevent fraud and ensure platform security</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Send marketing communications (with your consent)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Sharing */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            5. Data Sharing and Disclosure
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We may share your data with:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Service Providers
                </h4>
                <p className="text-gray-700">
                  Stripe (payments), Resend (emails), Supabase (hosting)
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Legal Authorities
                </h4>
                <p className="text-gray-700">
                  When required by Swiss law or court order
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Business Partners
                </h4>
                <p className="text-gray-700">Only with your explicit consent</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Successors</h4>
                <p className="text-gray-700">
                  In case of merger or acquisition
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-teal-800 font-medium">
                We never sell your personal data to third parties for marketing
                purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            6. Data Security
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement comprehensive security measures:
            </p>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>End-to-end encryption for sensitive data</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Regular security audits and penetration testing</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Access controls and authentication systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Secure data centers with physical security</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Employee training on data protection</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  Incident response and breach notification procedures
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Retention */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            7. Data Retention
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We retain your data for:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Account Data
                </h4>
                <p className="text-sm text-gray-700">
                  Until account deletion + 7 years (Swiss law)
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Invoice Data
                </h4>
                <p className="text-sm text-gray-700">
                  10 years (Swiss tax law requirement)
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Payment Data
                </h4>
                <p className="text-sm text-gray-700">
                  7 years (Swiss accounting law)
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Marketing Data
                </h4>
                <p className="text-sm text-gray-700">
                  Until consent withdrawal
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Technical Logs
                </h4>
                <p className="text-sm text-gray-700">12 months maximum</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            8. Your Rights
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              Under GDPR and Swiss FADP, you have the right to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Access</h4>
                  <p className="text-sm text-gray-700">
                    Request copies of your personal data
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Rectification
                  </h4>
                  <p className="text-sm text-gray-700">
                    Correct inaccurate or incomplete data
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Erasure</h4>
                  <p className="text-sm text-gray-700">
                    Request deletion of your data (with limitations)
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Portability
                  </h4>
                  <p className="text-sm text-gray-700">
                    Receive your data in a structured format
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Restriction
                  </h4>
                  <p className="text-sm text-gray-700">
                    Limit how we process your data
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Objection
                  </h4>
                  <p className="text-sm text-gray-700">
                    Object to processing based on legitimate interests
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Withdraw Consent
                  </h4>
                  <p className="text-sm text-gray-700">
                    Withdraw consent for marketing communications
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-teal-800">
                To exercise these rights, contact us at{' '}
                <a
                  href="mailto:legal@paymatch.app"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  legal@paymatch.app
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* International Transfers */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            9. International Data Transfers
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              Some of our service providers are located outside Switzerland and
              the EU. We ensure adequate protection through:
            </p>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Standard Contractual Clauses (SCCs)</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Adequacy decisions by the European Commission</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Binding Corporate Rules where applicable</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Additional safeguards for sensitive data</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Cookies */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            10. Cookies and Tracking
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We use cookies to enhance your experience. For detailed
              information, see our{' '}
              <Link
                href="/cookies"
                className="text-teal-600 hover:text-teal-700 underline transition-colors"
              >
                Cookie Policy
              </Link>
              .
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can manage cookie preferences through our cookie banner or
              browser settings.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            11. Children&apos;s Privacy
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 16. We do not
              knowingly collect personal information from children under 16. If
              you become aware that a child has provided us with personal data,
              please contact us immediately.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            12. Changes to This Policy
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Material changes will be communicated via email or platform
              notification.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            13. Contact Information
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                For questions about this Privacy Policy, contact us at{' '}
                <a
                  href="mailto:info@paymatch.app"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  info@paymatch.app
                </a>
                . To exercise your rights, contact us at{' '}
                <a
                  href="mailto:legal@paymatch.app"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  legal@paymatch.app
                </a>
                .
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Contact Details
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
                      Address
                    </dt>
                    <dd className="text-gray-900">
                      Maxapp ZRH, Birkenstrasse 49, 6343 Rotkreuz, Schweiz
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
                  <div>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Data Protection Officer
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
                </dl>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Right to Complain
              </h3>
              <p className="text-amber-800">
                You also have the right to lodge a complaint with the Swiss
                Federal Data Protection and Information Commissioner (FDPIC) or
                your local data protection authority.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
