/**
 * Cookie Policy Page
 *
 * Detailed cookie policy explaining the types of cookies used by PayMatch,
 * their purposes, and how users can manage their cookie preferences.
 * Compliant with GDPR and applicable laws in Switzerland, Germany, France, and Italy.
 */

import { LegalLayout } from '@/components/legal/LegalLayout';

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="September 28, 2025">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Introduction */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            1. What Are Cookies?
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                Cookies are small text files that are stored on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This Cookie Policy explains how PayMatch uses cookies and
                similar technologies, and how you can control them.
              </p>
            </div>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            2. Types of Cookies We Use
          </h2>

          <div className="space-y-8">
            {/* Necessary Cookies */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                2.1 Necessary Cookies (Always Active)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                These cookies are essential for the website to function properly
                and cannot be disabled.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Authentication Cookies
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Purpose
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Keep you logged in and maintain your session
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Examples
                      </dt>
                      <dd className="text-sm text-gray-700 font-mono">
                        session_id, auth_token, user_preferences
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Session or up to 30 days
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Security Cookies
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Purpose
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Protect against CSRF attacks and ensure security
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Examples
                      </dt>
                      <dd className="text-sm text-gray-700 font-mono">
                        csrf_token, security_headers
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-700">Session only</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Cookie Consent
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Purpose
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Remember your cookie preferences
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Examples
                      </dt>
                      <dd className="text-sm text-gray-700 font-mono">
                        paymatch-cookie-consent, consent_date
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-700">1 year</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                2.2 Analytics Cookies (Optional)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                These cookies help us understand how visitors use our website to
                improve our service.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Google Analytics
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Purpose
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Track website usage, page views, and user behavior
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Examples
                      </dt>
                      <dd className="text-sm text-gray-700 font-mono">
                        _ga, _ga_*, _gid, _gat
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-700">
                        2 years (_ga), 24 hours (_gid)
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Performance Monitoring
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Purpose
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Monitor website performance and identify issues
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Examples
                      </dt>
                      <dd className="text-sm text-gray-700 font-mono">
                        performance_metrics, error_tracking
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-700">30 days</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                2.3 Marketing Cookies (Optional)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                These cookies are used to deliver relevant advertisements and
                track marketing campaigns.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Social Media Tracking
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Purpose
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Track social media interactions and referrals
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Examples
                      </dt>
                      <dd className="text-sm text-gray-700 font-mono">
                        _fbp, _fbc, li_sugr, _pin_unauth
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-700">
                        90 days to 2 years
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Advertising Networks
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Purpose
                      </dt>
                      <dd className="text-sm text-gray-700">
                        Deliver targeted advertisements
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Examples
                      </dt>
                      <dd className="text-sm text-gray-700 font-mono">
                        _gcl_au, _gcl_aw, _gcl_dc
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-700">90 days</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            3. Third-Party Cookies
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                We use third-party services that may set their own cookies:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Stripe</h4>
                  <p className="text-sm text-gray-700">
                    Payment processing and fraud prevention
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Supabase</h4>
                  <p className="text-sm text-gray-700">
                    Database and authentication services
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Resend</h4>
                  <p className="text-sm text-gray-700">
                    Email delivery and tracking
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Google Analytics
                  </h4>
                  <p className="text-sm text-gray-700">
                    Website analytics and performance
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Cloudflare
                  </h4>
                  <p className="text-sm text-gray-700">
                    Security and performance optimization
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> These third parties have their own
                  privacy policies and cookie practices. We recommend reviewing
                  their policies for more information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Management */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            4. Managing Your Cookie Preferences
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                4.1 Our Cookie Banner
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                When you first visit our website, you&apos;ll see a cookie
                banner where you can:
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Accept all cookies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Reject non-essential cookies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Customize your preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 mt-1">•</span>
                  <span>Learn more about each cookie category</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                4.2 Browser Settings
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You can also manage cookies through your browser settings:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                  <p className="text-sm text-gray-700">
                    Settings → Privacy and security → Cookies and other site
                    data
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                  <p className="text-sm text-gray-700">
                    Settings → Privacy & Security → Cookies and Site Data
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                  <p className="text-sm text-gray-700">
                    Preferences → Privacy → Manage Website Data
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                  <p className="text-sm text-gray-700">
                    Settings → Cookies and site permissions → Cookies and site
                    data
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                4.3 Opt-Out Tools
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                You can opt out of specific tracking services:
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Google Analytics
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Analytics Opt-out Browser Add-on
                    </a>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Facebook</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <a
                      href="https://www.facebook.com/settings?tab=ads"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook Ad Preferences
                    </a>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">LinkedIn</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <a
                      href="https://www.linkedin.com/psettings/advertising"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn Ad Settings
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact of Disabling Cookies */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            5. Impact of Disabling Cookies
          </h2>

          <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">
                Necessary Cookies
              </h3>
              <p className="text-red-800 leading-relaxed">
                Disabling necessary cookies will prevent you from using our
                service. These cookies are required for basic functionality like
                logging in and maintaining your session.
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Analytics Cookies
              </h3>
              <p className="text-amber-800 leading-relaxed">
                Disabling analytics cookies won&apos;t affect functionality, but
                we won&apos;t be able to improve our service based on usage
                patterns. You may also see less relevant content
                recommendations.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Marketing Cookies
              </h3>
              <p className="text-blue-800 leading-relaxed">
                Disabling marketing cookies means you may see less relevant
                advertisements and won&apos;t receive personalized marketing
                communications. This won&apos;t affect core service
                functionality.
              </p>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            6. Cookie Data Retention
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              Different cookies have different retention periods:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Session Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    Deleted when you close your browser
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Persistent Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    Remain until expiration date or manual deletion
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Analytics Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    Typically 2 years maximum
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Marketing Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    Usually 90 days to 2 years
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Preference Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    1 year or until you change preferences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Updates to Policy */}
        <section className="border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            7. Updates to This Policy
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or applicable laws. We will notify you of
              any material changes through our website or email.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We encourage you to review this policy periodically to stay
              informed about how we use cookies.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            8. Contact Us
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about our use of cookies or this Cookie
              Policy, please contact us:
            </p>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Contact Information
              </h3>
              <dl className="space-y-3">
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
              </dl>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
