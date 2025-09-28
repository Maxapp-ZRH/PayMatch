/**
 * Downloads Page
 *
 * Promotes PWA installation across different devices and platforms.
 * Provides clear instructions, QR codes, and showcases PWA benefits.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  ArrowRight,
  WifiOff,
  Clock,
  Shield,
  Zap,
  Globe,
  Star,
  Copy,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/marketing_pages/Container';
import { QRCode } from '@/components/ui/QRCode';
import { usePWA } from '@/hooks/use-pwa';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const deviceInstructions = [
  {
    id: 'ios',
    name: 'iPhone & iPad',
    icon: Smartphone,
    color: 'bg-gray-900',
    steps: [
      'Open Safari and visit paymatch.app',
      'Tap the Share button at the bottom',
      'Scroll down and tap "Add to Home Screen"',
      'Tap "Add" to install PayMatch',
    ],
    benefits: ['Offline access', 'Push notifications', 'Native app feel'],
  },
  {
    id: 'android',
    name: 'Android',
    icon: Smartphone,
    color: 'bg-green-600',
    steps: [
      'Open Chrome and visit paymatch.app',
      'Tap the menu (⋮) in the top right',
      'Select "Add to Home screen" or "Install app"',
      'Tap "Add" or "Install" to confirm',
    ],
    benefits: ['Offline access', 'Push notifications', 'Native app feel'],
  },
  {
    id: 'desktop',
    name: 'Desktop',
    icon: Monitor,
    color: 'bg-blue-600',
    steps: [
      'Open Chrome, Edge, or Safari',
      'Visit paymatch.app',
      'Look for the install icon in the address bar',
      'Click "Install" to add to your desktop',
    ],
    benefits: ['Desktop shortcuts', 'Windowed mode', 'System integration'],
  },
  {
    id: 'tablet',
    name: 'Tablet',
    icon: Tablet,
    color: 'bg-purple-600',
    steps: [
      'Open your preferred browser',
      'Visit paymatch.app',
      'Look for the install prompt or menu',
      'Follow the installation instructions',
    ],
    benefits: ['Large screen experience', 'Touch optimized', 'Portable access'],
  },
];

const pwaFeatures = [
  {
    icon: WifiOff,
    title: 'Works Offline',
    description:
      'Access your invoices and data even without internet connection',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant loading and smooth performance on all devices',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays on your device with end-to-end encryption',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Clock,
    title: 'Always Updated',
    description: 'Automatic updates ensure you always have the latest features',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Globe,
    title: 'Cross-Platform',
    description: 'Seamlessly sync across all your devices and platforms',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    icon: Star,
    title: 'Native Experience',
    description: 'Feels and works like a native app with system integration',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function DownloadsPage() {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [selectedDevice, setSelectedDevice] = useState('ios');
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://paymatch.app';
  const qrCodeUrl = `${currentUrl}/?install=true`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleInstall = async () => {
    if (isInstallable && !isInstalled) {
      await installPWA();
    }
  };

  const selectedDeviceData = deviceInstructions.find(
    (d) => d.id === selectedDevice
  );

  return (
    <Container className="py-16">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl mb-8">
            <Download className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Download PayMatch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Install PayMatch as a Progressive Web App (PWA) on any device for a
            native app experience with offline access and lightning-fast
            performance.
          </p>

          {/* Install Button */}
          {isInstallable && !isInstalled && (
            <motion.button
              onClick={handleInstall}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5 mr-2" />
              Install PayMatch Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          )}

          {isInstalled && (
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              PayMatch is installed on this device
            </motion.div>
          )}
        </motion.div>

        {/* Device Selection */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Choose Your Device
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deviceInstructions.map((device) => {
              const Icon = device.icon;
              return (
                <motion.button
                  key={device.id}
                  onClick={() => setSelectedDevice(device.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    selectedDevice === device.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`w-12 h-12 ${device.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {device.name}
                  </h3>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Installation Instructions */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div
                className={`w-12 h-12 ${selectedDeviceData?.color} rounded-lg flex items-center justify-center mr-4`}
              >
                {selectedDeviceData && (
                  <selectedDeviceData.icon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Install on {selectedDeviceData?.name}
                </h3>
                <p className="text-gray-600">Follow these simple steps</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Steps */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Installation Steps
                </h4>
                <div className="space-y-4">
                  {selectedDeviceData?.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  What You Get
                </h4>
                <div className="space-y-3">
                  {selectedDeviceData?.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 4) * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Mobile Install
              </h2>
              <p className="text-gray-600">
                Scan this QR code with your mobile device to install PayMatch
                instantly
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <QRCode value={qrCodeUrl} size={192} className="mx-auto" />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Scan with your camera
                </p>
              </div>

              {/* URL */}
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Or visit this URL:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {currentUrl}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {copied ? 'Copied to clipboard!' : 'Click to copy'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PWA Features */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PWA?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Progressive Web Apps combine the best of web and native apps for
              an unparalleled experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pwaFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What is a Progressive Web App (PWA)?
                </h3>
                <p className="text-gray-600">
                  A PWA is a web application that uses modern web capabilities
                  to deliver a native app-like experience. It can be installed
                  on your device, works offline, and provides push
                  notifications.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is PayMatch PWA secure?
                </h3>
                <p className="text-gray-600">
                  Yes, PayMatch PWA uses the same security measures as our web
                  version, including HTTPS encryption, secure data storage, and
                  regular security updates.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I use PayMatch offline?
                </h3>
                <p className="text-gray-600">
                  Yes, once installed, you can access your invoices and basic
                  features even without an internet connection. Data syncs
                  automatically when you&apos;re back online.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I update the app?
                </h3>
                <p className="text-gray-600">
                  PWAs update automatically in the background. You&apos;ll
                  always have the latest version without needing to manually
                  update from an app store.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Install PayMatch now and experience the future of Swiss invoicing
              with offline access and native app performance.
            </p>

            {isInstallable && !isInstalled ? (
              <motion.button
                onClick={handleInstall}
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 mr-2" />
                Install PayMatch
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              <div className="space-y-4">
                <p className="text-lg">
                  {isInstalled
                    ? 'PayMatch is already installed!'
                    : 'Visit paymatch.app to install'}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
                >
                  Go to PayMatch
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}
