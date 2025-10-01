/**
 * PWA Information Page
 *
 * Comprehensive page explaining PayMatch's Progressive Web App features,
 * installation instructions, and benefits for Swiss businesses.
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Smartphone,
  Download,
  Wifi,
  Bell,
  Zap,
  Shield,
  CheckCircle,
  Tablet,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Smartphone as PhoneIcon,
  Laptop,
} from 'lucide-react';

import { Container } from '@/components/marketing_pages/Container';
import { Button } from '@/components/marketing_pages/Button';
import { usePWA } from '@/features/pwa/hooks/use-pwa';

export default function PWAPage() {
  const t = useTranslations('pwa');
  const { isInstallable, isInstalled, installPWA, isOnline } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installPWA();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const features = [
    {
      icon: <Wifi className="w-6 h-6" />,
      title: t('features.offline.title'),
      description: t('features.offline.description'),
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: t('features.notifications.title'),
      description: t('features.notifications.description'),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('features.fast.title'),
      description: t('features.fast.description'),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('features.secure.title'),
      description: t('features.secure.description'),
    },
  ];

  const benefits = [
    {
      icon: <FileText className="w-8 h-8" style={{ color: '#E4262A' }} />,
      title: t('benefits.invoicing.title'),
      description: t('benefits.invoicing.description'),
    },
    {
      icon: <CreditCard className="w-8 h-8" style={{ color: '#E4262A' }} />,
      title: t('benefits.payments.title'),
      description: t('benefits.payments.description'),
    },
    {
      icon: <BarChart3 className="w-8 h-8" style={{ color: '#E4262A' }} />,
      title: t('benefits.analytics.title'),
      description: t('benefits.analytics.description'),
    },
    {
      icon: <Settings className="w-8 h-8" style={{ color: '#E4262A' }} />,
      title: t('benefits.management.title'),
      description: t('benefits.management.description'),
    },
  ];

  const devices = [
    {
      icon: <PhoneIcon className="w-8 h-8" />,
      name: t('devices.mobile'),
      description: t('devices.mobileDescription'),
    },
    {
      icon: <Tablet className="w-8 h-8" />,
      name: t('devices.tablet'),
      description: t('devices.tabletDescription'),
    },
    {
      icon: <Laptop className="w-8 h-8" />,
      name: t('devices.desktop'),
      description: t('devices.desktopDescription'),
    },
  ];

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
                <Smartphone className="w-4 h-4 mr-2" />
                {t('badge')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {t('hero.title')}
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t('hero.description')}
              </p>

              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {isInstallable && !isInstalled && (
                    <Button
                      onClick={handleInstall}
                      disabled={isInstalling}
                      className="text-white px-8 py-4 text-lg font-semibold"
                      style={{ backgroundColor: '#E4262A' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#C21E1E')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#E4262A')
                      }
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {isInstalling ? t('installing') : t('installNow')}
                    </Button>
                  )}

                  {isInstalled && (
                    <div
                      className="flex items-center font-semibold"
                      style={{ color: '#E4262A' }}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {t('installed')}
                    </div>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  {isOnline ? t('online') : t('offline')}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-gray-600">{t('features.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#FEF2F2' }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('benefits.title')}
            </h2>
            <p className="text-lg text-gray-600">{t('benefits.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Device Support Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('devices.title')}
            </h2>
            <p className="text-lg text-gray-600">{t('devices.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {devices.map((device, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {device.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {device.name}
                </h3>
                <p className="text-gray-600">{device.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Installation Instructions */}
      <section className="py-16 sm:py-24 bg-red-50">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('installation.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('installation.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mobile Instructions */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t('installation.mobile.title')}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: '#E4262A' }}
                    >
                      1
                    </div>
                    <p className="text-gray-700">
                      {t('installation.mobile.step1')}
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: '#E4262A' }}
                    >
                      2
                    </div>
                    <p className="text-gray-700">
                      {t('installation.mobile.step2')}
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: '#E4262A' }}
                    >
                      3
                    </div>
                    <p className="text-gray-700">
                      {t('installation.mobile.step3')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Instructions */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t('installation.desktop.title')}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: '#E4262A' }}
                    >
                      1
                    </div>
                    <p className="text-gray-700">
                      {t('installation.desktop.step1')}
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: '#E4262A' }}
                    >
                      2
                    </div>
                    <p className="text-gray-700">
                      {t('installation.desktop.step2')}
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: '#E4262A' }}
                    >
                      3
                    </div>
                    <p className="text-gray-700">
                      {t('installation.desktop.step3')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                {t('cta.title')}
              </h2>

              <p className="text-xl text-gray-600 mb-8">
                {t('cta.description')}
              </p>

              <div className="flex justify-center items-center">
                {isInstallable && !isInstalled && (
                  <Button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="text-white px-8 py-4 text-lg font-semibold"
                    style={{ backgroundColor: '#E4262A' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#C21E1E')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#E4262A')
                    }
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {isInstalling ? t('installing') : t('installNow')}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
