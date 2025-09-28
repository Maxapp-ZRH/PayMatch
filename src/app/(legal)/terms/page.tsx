/**
 * Terms of Service Page
 *
 * Comprehensive terms of service compliant with Swiss business law,
 * covering service usage, payment terms, liability, and dispute resolution
 * for users in Switzerland, Germany, France, and Italy.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="September 28, 2025">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Introduction */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            1. Agreement to Terms
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                These Terms of Service (&quot;Terms&quot;) govern your use of
                PayMatch, a Swiss QR-bill invoicing platform operated by Maxapp
                ZRH AG (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;).
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                By accessing or using our service, you agree to be bound by
                these Terms. If you disagree with any part of these terms, you
                may not access the service.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Governing Law
                </h3>
                <p className="text-gray-700">
                  Swiss law, with jurisdiction in Rotkreuz, Schweiz
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Description */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            2. Service Description
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              PayMatch provides a cloud-based invoicing platform designed for
              Swiss businesses and teams that enables:
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Create and manage Swiss QR-bill compliant invoices</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  Process payments through integrated payment gateways
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  Reconcile payments with bank statements (CAMT files)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  Generate tax-compliant reports for Swiss authorities
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Manage client and customer databases</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Send automated payment reminders</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  Team collaboration and user management (Business/Enterprise
                  plans)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Organization-wide dashboard and reporting</span>
              </li>
            </ul>
          </div>
        </section>

        {/* User Accounts */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            3. User Accounts
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.1 Account Registration
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    You must provide accurate and complete information
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    You are responsible for maintaining account security
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    One account per business entity - designed for business use
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Team features available for Business and Enterprise plans
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    You must be at least 18 years old or have parental consent
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3.2 Account Responsibilities
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Keep login credentials confidential</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Notify us immediately of any unauthorized access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Ensure all information remains accurate and current
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Comply with all applicable laws and regulations</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing and Payment */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            4. Pricing and Payment
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                4.1 Pricing Plans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Free Plan
                  </h4>
                  <p className="text-sm text-gray-700">
                    5 invoices per month, basic features
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Freelancer Plan
                  </h4>
                  <p className="text-sm text-gray-700">
                    CHF 5/month, unlimited invoices, single user
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Business Plan
                  </h4>
                  <p className="text-sm text-gray-700">
                    CHF 50/month, team features (up to 10 users), advanced
                    collaboration tools
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Enterprise Plan
                  </h4>
                  <p className="text-sm text-gray-700">
                    CHF 150/month, unlimited users, dedicated support, advanced
                    security
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                4.2 Payment Terms
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    All prices are in Swiss Francs (CHF) and include Swiss VAT
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Payments are processed securely through Stripe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Billing occurs monthly in advance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>No refunds for partial months or unused features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>We may change prices with 30 days&apos; notice</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                4.3 Payment Processing
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Payment processing fees are included in our pricing
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>We support CHF and EUR currencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Failed payments may result in service suspension</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>You are responsible for any bank charges or fees</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Service Usage */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            5. Acceptable Use
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                5.1 Permitted Uses
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Create and manage invoices for legitimate business purposes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Process payments in compliance with applicable laws
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Generate reports for tax and accounting purposes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    Use the service in accordance with Swiss business practices
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                5.2 Prohibited Uses
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1">•</span>
                  <span>
                    Illegal activities or violation of applicable laws
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1">•</span>
                  <span>Fraud, money laundering, or tax evasion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1">•</span>
                  <span>Spam, harassment, or abusive behavior</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1">•</span>
                  <span>
                    Reverse engineering or unauthorized access to our systems
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1">•</span>
                  <span>
                    Reselling or redistributing our service without permission
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1">•</span>
                  <span>Creating fake invoices or fraudulent transactions</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data and Privacy */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            6. Data and Privacy
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              Your privacy is important to us. Please review our{' '}
              <a
                href="/privacy"
                className="text-teal-600 hover:text-teal-700 underline transition-colors"
              >
                Privacy Policy
              </a>{' '}
              to understand how we collect, use, and protect your information.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>You retain ownership of all your business data</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  We process data in compliance with GDPR and Swiss FADP
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Data is stored securely in Switzerland and the EU</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>You can export your data at any time</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  We will not use your data for purposes other than providing
                  our service
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            7. Intellectual Property
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                7.1 Our Rights
              </h3>
              <p className="text-gray-700 leading-relaxed">
                PayMatch and its original content, features, and functionality
                are owned by Maxapp ZRH AG and are protected by Swiss and
                international copyright, trademark, and other intellectual
                property laws.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                7.2 Your Rights
              </h3>
              <p className="text-gray-700 leading-relaxed">
                You retain all rights to your business data, invoices, and
                customer information. You grant us a limited license to process
                this data solely for providing our service.
              </p>
            </div>
          </div>
        </section>

        {/* Service Availability */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            8. Service Availability
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  We strive for 99.9% uptime but cannot guarantee uninterrupted
                  service
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>Scheduled maintenance will be announced in advance</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  We are not liable for service interruptions due to
                  circumstances beyond our control
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  You are responsible for backing up your important data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-3 mt-1">•</span>
                <span>
                  We may suspend service for violations of these Terms
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Liability and Disclaimers */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            9. Liability and Disclaimers
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                9.1 Limitation of Liability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by Swiss law, our liability is
                limited to the amount you paid for our service in the 12 months
                preceding the claim.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                9.2 Disclaimers
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3 mt-1">•</span>
                  <span>
                    Service is provided &quot;as is&quot; without warranties of
                    any kind
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3 mt-1">•</span>
                  <span>
                    We do not guarantee compliance with all tax or accounting
                    requirements
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3 mt-1">•</span>
                  <span>
                    You are responsible for verifying invoice accuracy and
                    compliance
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3 mt-1">•</span>
                  <span>
                    We are not liable for third-party payment processing issues
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            10. Termination
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                10.1 Termination by You
              </h3>
              <p className="text-gray-700 leading-relaxed">
                You may cancel your account at any time through your account
                settings. Cancellation takes effect at the end of your current
                billing period.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                10.2 Termination by Us
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may suspend or terminate your account immediately if you
                violate these Terms or engage in fraudulent or illegal
                activities.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                10.3 Effect of Termination
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Your access to the service will cease</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    You can export your data for 30 days after termination
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>
                    We will delete your data after the retention period
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Outstanding payments remain due</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            11. Dispute Resolution
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                11.1 Governing Law
              </h3>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by Swiss law. Any disputes will be
                resolved in the courts of Rotkreuz, Schweiz.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                11.2 Mediation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Before pursuing legal action, we encourage you to contact us to
                resolve disputes through good faith negotiation or mediation.
              </p>
            </div>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            12. Changes to Terms
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update these Terms from time to time. We will notify you of
              material changes via email or platform notification at least 30
              days in advance.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Continued use of our service after changes constitutes acceptance
              of the new Terms.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            13. Contact Information
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              For questions about these Terms or our service, contact us:
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
                  <dd className="text-gray-900 font-mono">+41 44 123 45 67</dd>
                </div>
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
              </dl>
            </div>
          </div>
        </section>

        {/* Severability */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            14. Severability
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or
              invalid, the remaining provisions will remain in full force and
              effect.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
