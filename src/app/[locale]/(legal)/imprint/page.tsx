/**
 * Imprint Page
 *
 * Swiss company information and legal details required by Swiss law.
 * Includes company registration, contact information, and legal disclaimers
 * for users in Switzerland, Germany, France, and Italy.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';
import { Link } from '@/i18n/navigation';

export default function ImprintPage() {
  return (
    <LegalLayout title="Imprint" lastUpdated="September 28, 2025">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Company Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            1. Company Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Legal Entity */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                Legal Entity
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
                    Legal Form
                  </dt>
                  <dd className="text-gray-900">Aktiengesellschaft (AG)</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Registration Number
                  </dt>
                  <dd className="text-gray-900 font-mono">CHE-123.456.789</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    VAT Number
                  </dt>
                  <dd className="text-gray-900 font-mono">
                    CHE-123.456.789 MWST
                  </dd>
                </div>
              </dl>
            </div>

            {/* Corporate Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                Corporate Details
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Registered Office
                  </dt>
                  <dd className="text-gray-900">Rotkreuz, Schweiz</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Commercial Register
                  </dt>
                  <dd className="text-gray-900">Zürich</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Authorized Capital
                  </dt>
                  <dd className="text-gray-900 font-semibold">CHF 100,000</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Paid-in Capital
                  </dt>
                  <dd className="text-gray-900 font-semibold">CHF 50,000</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Address */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Registered Address
            </h3>
            <address className="not-italic text-gray-900 leading-relaxed">
              <div className="font-semibold text-lg mb-2">Maxapp ZRH AG</div>
              <div>Birkenstrasse 49</div>
              <div>6343 Rotkreuz</div>
              <div>Switzerland</div>
            </address>
          </div>
        </section>

        {/* Contact Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            2. Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                General Inquiries
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Phone
                  </dt>
                  <dd className="text-gray-900 font-mono">+41 44 123 45 67</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Email
                  </dt>
                  <dd className="text-gray-900">
                    <a
                      href="mailto:info@paymatch.app"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      info@paymatch.app
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Website
                  </dt>
                  <dd className="text-gray-900">
                    <a
                      href="https://paymatch.app"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      https://paymatch.app
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Support & Legal
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Support
                  </dt>
                  <dd className="text-gray-900">
                    <a
                      href="mailto:support@paymatch.app"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      support@paymatch.app
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Legal
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
                    Privacy
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

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Business Hours
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Monday - Friday
                  </dt>
                  <dd className="text-gray-900">09:00 - 17:00 CET</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Response Time
                  </dt>
                  <dd className="text-gray-900">Within 24 hours</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Emergency
                  </dt>
                  <dd className="text-gray-900 text-sm">
                    For urgent matters, contact legal@paymatch.app
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Management */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            3. Management
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
              Executive Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Chief Executive Officer
                </h4>
                <p className="text-gray-700">Mr. Thilipan Thiyagaraj</p>
                <p className="text-sm text-gray-600 mt-1">Since 2024</p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            4. Business Information
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Business Purpose
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Development, operation, and maintenance of software solutions
                for invoicing, payment processing, and financial management,
                with particular focus on Swiss QR-bill compliance and Swiss tax
                regulations.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Services
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Swiss QR-bill invoice generation and management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Payment processing and reconciliation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>CAMT file processing and bank statement analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Tax-compliant reporting for Swiss authorities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Client and customer database management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Automated payment reminders and notifications</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Target Markets
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Switzerland, Germany, France, and Italy, with focus on small and
                medium-sized enterprises (SMEs) requiring Swiss QR-bill
                compliance.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            5. Legal Information
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Governing Law
              </h3>
              <p className="text-gray-700 leading-relaxed">
                This website and all services are governed by Swiss law. Any
                disputes will be resolved in the courts of Rotkreuz, Schweiz.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Jurisdiction
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The competent court for all disputes arising from or in
                connection with this website and our services is the Commercial
                Court of Rotkreuz, Schweiz.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Alternative Dispute Resolution
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We are committed to resolving disputes amicably. Before pursuing
                legal action, we encourage you to contact us to discuss
                potential solutions through mediation or other alternative
                dispute resolution methods.
              </p>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            6. Intellectual Property
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Trademarks
              </h3>
              <p className="text-gray-700 leading-relaxed">
                &quot;PayMatch&quot; and the PayMatch logo are registered
                trademarks of Maxapp ZRH AG. All rights reserved. Unauthorized
                use is prohibited.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Copyright
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including text, graphics, logos,
                images, and software, is the property of Maxapp ZRH AG and is
                protected by Swiss and international copyright laws.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Patents
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our invoicing and payment reconciliation technology may be
                protected by patents and patent applications. For licensing
                inquiries, contact{' '}
                <a
                  href="mailto:legal@paymatch.app"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  legal@paymatch.app
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            7. Disclaimers
          </h2>

          <div className="space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Website Content
              </h3>
              <p className="text-amber-800 leading-relaxed">
                While we strive to provide accurate and up-to-date information,
                we cannot guarantee the completeness, accuracy, or timeliness of
                all content on this website.
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Third-Party Links
              </h3>
              <p className="text-amber-800 leading-relaxed">
                This website may contain links to third-party websites. We are
                not responsible for the content, privacy policies, or practices
                of these external sites.
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Service Availability
              </h3>
              <p className="text-amber-800 leading-relaxed">
                We strive for high availability but cannot guarantee
                uninterrupted service. We are not liable for service
                interruptions due to circumstances beyond our control.
              </p>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            8. Data Protection
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                We are committed to protecting your personal data in accordance
                with the Swiss Federal Data Protection Act (FADP) and the
                General Data Protection Regulation (GDPR).
              </p>
              <p className="text-gray-700 leading-relaxed">
                For detailed information about how we collect, use, and protect
                your data, please see our{' '}
                <Link
                  href="/privacy"
                  className="text-teal-600 hover:text-teal-700 underline transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
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
                  <dd className="text-gray-900 font-mono">+41 44 123 45 68</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Regulatory Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            9. Regulatory Information
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Financial Services
              </h3>
              <p className="text-gray-700 leading-relaxed">
                PayMatch is not a licensed financial institution. We provide
                software services for invoicing and payment processing but do
                not hold client funds or provide banking services.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Payment Processing
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Payment processing is handled by our licensed partners,
                including Stripe, which is authorized to provide payment
                services in Switzerland and the EU.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Tax Compliance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                While our software helps generate tax-compliant invoices, users
                are responsible for ensuring compliance with all applicable tax
                laws and regulations in their jurisdiction.
              </p>
            </div>
          </div>
        </section>

        {/* Contact for Legal Matters */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            10. Contact for Legal Matters
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <p className="text-gray-700 leading-relaxed mb-6">
              For legal matters, including cease and desist letters, copyright
              claims, or other legal notices, please contact:
            </p>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Legal Department
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
                  <dd className="text-gray-900 font-mono">+41 44 123 45 67</dd>
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
                  <dd className="text-gray-900">Within 5 business days</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            11. Last Updated
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <p className="text-gray-700 leading-relaxed mb-4">
              This imprint was last updated on September 28, 2025. We reserve
              the right to update this information at any time without prior
              notice.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For the most current version, please visit this page regularly or
              contact us if you have any questions about the information
              provided.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
