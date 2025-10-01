'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Globe,
  Lock,
  Clock,
  Database,
  CreditCard,
  Mail,
  QrCode,
} from 'lucide-react';

import { Container } from '@/components/marketing_pages/Container';
import { Button } from '@/components/marketing_pages/Button';

const getIntegrations = (t: (key: string) => string) => [
  {
    name: t('integrations.blink.name'),
    description: t('integrations.blink.description'),
    features: [
      t('integrations.blink.features.realTime'),
      t('integrations.blink.features.automatic'),
      t('integrations.blink.features.secure'),
      t('integrations.blink.features.compliant'),
    ],
    icon: <Zap className="w-6 h-6" />,
    status: 'available',
    color: 'blue',
  },
  {
    name: t('integrations.camt.name'),
    description: t('integrations.camt.description'),
    features: [
      t('integrations.camt.features.manual'),
      t('integrations.camt.features.import'),
      t('integrations.camt.features.matching'),
      t('integrations.camt.features.fallback'),
    ],
    icon: <Database className="w-6 h-6" />,
    status: 'available',
    color: 'green',
  },
  {
    name: t('integrations.stripe.name'),
    description: t('integrations.stripe.description'),
    features: [
      t('integrations.stripe.features.billing'),
      t('integrations.stripe.features.subscriptions'),
      t('integrations.stripe.features.payments'),
      t('integrations.stripe.features.tax'),
    ],
    icon: <CreditCard className="w-6 h-6" />,
    status: 'available',
    color: 'purple',
  },
  {
    name: t('integrations.resend.name'),
    description: t('integrations.resend.description'),
    features: [
      t('integrations.resend.features.transactional'),
      t('integrations.resend.features.branded'),
      t('integrations.resend.features.reliable'),
      t('integrations.resend.features.tracking'),
    ],
    icon: <Mail className="w-6 h-6" />,
    status: 'available',
    color: 'orange',
  },
  {
    name: t('integrations.qrBill.name'),
    description: t('integrations.qrBill.description'),
    features: [
      t('integrations.qrBill.features.swiss'),
      t('integrations.qrBill.features.compliant'),
      t('integrations.qrBill.features.pdf'),
      t('integrations.qrBill.features.multilingual'),
    ],
    icon: <QrCode className="w-6 h-6" />,
    status: 'available',
    color: 'red',
  },
];

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    available: {
      label: 'Available',
      className: 'bg-green-100 text-green-800',
    },
    'coming-soon': {
      label: 'Coming Soon',
      className: 'bg-yellow-100 text-yellow-800',
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.available;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function Integrations() {
  const t = useTranslations('integrations');
  const integrations = getIntegrations(t);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full mb-6"
                style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}
              >
                <Globe className="w-4 h-4 mr-2" />
                {t('badge')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {t('title')}
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t('subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  href="/register"
                  className="text-white px-8 py-4 text-lg font-semibold"
                  style={{ backgroundColor: '#E4262A' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#C21E1E')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#E4262A')
                  }
                >
                  {t('cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* bLink Open Banking Highlight */}
      <section className="py-16 sm:py-24">
        <Container>
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 lg:p-10 border border-blue-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {t('blinkHighlight.title')}
                  </h3>
                  <StatusBadge status="available" />
                </div>
                <p className="text-lg text-gray-700 mb-6">
                  {t('blinkHighlight.description')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      {t('blinkHighlight.benefits.realTime')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      {t('blinkHighlight.benefits.automatic')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      {t('blinkHighlight.benefits.secure')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      {t('blinkHighlight.benefits.compliant')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* All Integrations */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('allIntegrations')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('allIntegrationsDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    {integration.icon}
                  </div>
                  <StatusBadge status={integration.status} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {integration.name}
                </h3>
                <p className="text-gray-600 mb-4">{integration.description}</p>
                <ul className="space-y-2">
                  {integration.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Technical Details */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('technicalDetails.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('technicalDetails.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#FEF2F2' }}
              >
                <Shield className="w-8 h-8" style={{ color: '#E4262A' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('technicalDetails.security.title')}
              </h3>
              <p className="text-gray-600">
                {t('technicalDetails.security.description')}
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#FEF2F2' }}
              >
                <Lock className="w-8 h-8" style={{ color: '#E4262A' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('technicalDetails.compliance.title')}
              </h3>
              <p className="text-gray-600">
                {t('technicalDetails.compliance.description')}
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#FEF2F2' }}
              >
                <Clock className="w-8 h-8" style={{ color: '#E4262A' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('technicalDetails.reliability.title')}
              </h3>
              <p className="text-gray-600">
                {t('technicalDetails.reliability.description')}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {t('ctaSection.title')}
              </h2>

              <p className="text-xl text-gray-600 mb-8">
                {t('ctaSection.description')}
              </p>

              <div className="flex justify-center items-center">
                <Button
                  href="/register"
                  className="text-white px-8 py-4 text-lg font-semibold"
                  style={{ backgroundColor: '#E4262A' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#C21E1E')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#E4262A')
                  }
                >
                  {t('cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
