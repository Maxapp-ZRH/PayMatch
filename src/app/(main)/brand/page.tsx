/**
 * Brand Page
 *
 * Comprehensive brand guidelines for PayMatch including usage rules,
 * color palette, typography, logo guidelines, and asset downloads.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Palette,
  Type,
  Image,
  Shield,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  FileText,
} from 'lucide-react';

import { Container } from '@/components/marketing_pages/Container';

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

const brandColors = [
  {
    name: 'Primary Teal',
    hex: '#14b8a6',
    rgb: '20, 184, 166',
    usage: 'Primary brand color, CTAs, links, highlights',
    example: 'bg-teal-600',
  },
  {
    name: 'Teal Light',
    hex: '#5eead4',
    rgb: '94, 234, 212',
    usage: 'Hover states, secondary elements',
    example: 'bg-teal-300',
  },
  {
    name: 'Teal Dark',
    hex: '#0f766e',
    rgb: '15, 118, 110',
    usage: 'Dark mode, contrast elements',
    example: 'bg-teal-800',
  },
  {
    name: 'Primary Blue',
    hex: '#2563eb',
    rgb: '37, 99, 235',
    usage: 'Secondary brand color, information',
    example: 'bg-blue-600',
  },
  {
    name: 'Blue Light',
    hex: '#60a5fa',
    rgb: '96, 165, 250',
    usage: 'Light backgrounds, subtle accents',
    example: 'bg-blue-400',
  },
  {
    name: 'Neutral Gray',
    hex: '#6b7280',
    rgb: '107, 114, 128',
    usage: 'Text, borders, subtle elements',
    example: 'bg-gray-500',
  },
  {
    name: 'Success Green',
    hex: '#10b981',
    rgb: '16, 185, 129',
    usage: 'Success states, positive actions',
    example: 'bg-green-500',
  },
  {
    name: 'Warning Orange',
    hex: '#f59e0b',
    rgb: '251, 146, 60',
    usage: 'Warnings, attention-grabbing elements',
    example: 'bg-orange-500',
  },
];

const typography = [
  {
    name: 'Headings',
    font: 'Inter',
    weights: ['400', '500', '600', '700', '800'],
    usage: 'All headings, titles, and emphasis text',
    example: 'text-4xl font-bold',
  },
  {
    name: 'Body Text',
    font: 'Inter',
    weights: ['400', '500'],
    usage: 'Paragraphs, body content, descriptions',
    example: 'text-base font-normal',
  },
  {
    name: 'Code & Monospace',
    font: 'JetBrains Mono',
    weights: ['400', '500'],
    usage: 'Code snippets, technical content',
    example: 'font-mono text-sm',
  },
];

const logoVariants = [
  {
    name: 'Primary Logo',
    description: 'Main PayMatch logo for general use',
    usage: 'Headers, main branding, marketing materials',
    size: 'Minimum 120px width',
  },
  {
    name: 'Logo Mark',
    description: 'Symbol-only version for small spaces',
    usage: 'Favicons, social media, small applications',
    size: 'Minimum 32px width',
  },
  {
    name: 'Horizontal Logo',
    description: 'Full logo with text for wide applications',
    usage: 'Email headers, documents, presentations',
    size: 'Minimum 200px width',
  },
  {
    name: 'Vertical Logo',
    description: 'Stacked logo for square applications',
    usage: 'Mobile apps, square social media posts',
    size: 'Minimum 120px height',
  },
];

const usageRules = [
  {
    category: 'Logo Usage',
    rules: [
      {
        title: 'Minimum Size',
        description:
          'Never use the logo smaller than the specified minimum sizes',
        correct: true,
        example: 'Primary logo: 120px minimum width',
      },
      {
        title: 'Clear Space',
        description:
          'Maintain clear space around the logo equal to the height of the "P" in PayMatch',
        correct: true,
        example: 'Clear space = height of "P" character',
      },
      {
        title: 'Color Variations',
        description:
          'Use approved color variations only (full color, white, black)',
        correct: true,
        example: 'Full color on light backgrounds, white on dark backgrounds',
      },
      {
        title: 'Distortion',
        description: 'Never stretch, skew, or alter the logo proportions',
        correct: false,
        example: 'Do not stretch the logo to fit different aspect ratios',
      },
      {
        title: 'Background Contrast',
        description: 'Ensure sufficient contrast between logo and background',
        correct: true,
        example:
          'Use white logo on dark backgrounds, dark logo on light backgrounds',
      },
    ],
  },
  {
    category: 'Color Usage',
    rules: [
      {
        title: 'Primary Colors',
        description: 'Use teal and blue as primary brand colors consistently',
        correct: true,
        example: 'Teal for CTAs, blue for information and secondary actions',
      },
      {
        title: 'Color Accessibility',
        description:
          'Ensure all color combinations meet WCAG AA contrast requirements',
        correct: true,
        example: 'Text must have at least 4.5:1 contrast ratio with background',
      },
      {
        title: 'Gradient Usage',
        description:
          'Use brand gradients sparingly and only for special elements',
        correct: true,
        example: 'Hero sections, premium features, call-to-action buttons',
      },
      {
        title: 'Arbitrary Colors',
        description:
          'Avoid using colors outside the brand palette without approval',
        correct: false,
        example: 'Do not use random colors that clash with brand identity',
      },
    ],
  },
  {
    category: 'Typography',
    rules: [
      {
        title: 'Font Consistency',
        description: 'Use Inter for all text content consistently',
        correct: true,
        example: 'Headings, body text, and UI elements should use Inter',
      },
      {
        title: 'Font Weights',
        description: 'Use appropriate font weights for hierarchy and emphasis',
        correct: true,
        example: 'Bold for headings, medium for subheadings, regular for body',
      },
      {
        title: 'Line Height',
        description: 'Maintain proper line height for readability',
        correct: true,
        example: '1.5-1.6 for body text, 1.2-1.3 for headings',
      },
      {
        title: 'Font Substitution',
        description: 'Never substitute Inter with similar fonts',
        correct: false,
        example: 'Do not use Arial, Helvetica, or other fonts as substitutes',
      },
    ],
  },
];

const assetPack = {
  name: 'PayMatch Brand Assets',
  version: '1.0',
  lastUpdated: 'September 2024',
  description:
    'Complete brand asset package for PayMatch including logos, colors, and guidelines',
  files: [
    {
      name: 'Logos',
      description: 'All logo variations in multiple formats',
      items: [
        'Primary Logo (PNG, SVG)',
        'Logo Mark (PNG, SVG)',
        'Horizontal Logo (PNG, SVG)',
        'Vertical Logo (PNG, SVG)',
        'White Logo Variations',
        'Black Logo Variations',
      ],
    },
    {
      name: 'Color Palette',
      description: 'Brand colors in various formats',
      items: [
        'Color Swatches (PNG)',
        'Adobe Swatches (ASE)',
        'Sketch Palette (JSON)',
        'Figma Tokens (JSON)',
        'CSS Variables (CSS)',
      ],
    },
    {
      name: 'Typography',
      description: 'Font files and typography guidelines',
      items: [
        'Inter Font Files (WOFF2, TTF)',
        'JetBrains Mono Font Files',
        'Typography Scale (PDF)',
        'Font Usage Guidelines (PDF)',
      ],
    },
    {
      name: 'Templates',
      description: 'Ready-to-use design templates',
      items: [
        'Business Card Template (AI, PSD)',
        'Letterhead Template (AI, PSD)',
        'Email Signature (HTML)',
        'Social Media Templates (PSD)',
      ],
    },
    {
      name: 'Guidelines',
      description: 'Comprehensive brand guidelines',
      items: [
        'Brand Guidelines PDF',
        'Usage Rules Document',
        'Accessibility Guidelines',
        'Legal Requirements',
      ],
    },
  ],
};

export default function BrandPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(type);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadAssetPack = () => {
    // In a real implementation, this would trigger a download of the asset pack
    alert(
      'Asset pack download would start here. In production, this would be a ZIP file with all brand assets.'
    );
  };

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
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Brand Guidelines
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Complete brand guidelines for PayMatch including usage rules, color
            palette, typography, and downloadable assets.
          </p>
        </motion.div>

        {/* Brand Overview */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Consistent Colors
                </h3>
                <p className="text-gray-600 text-sm">
                  Carefully selected color palette that reflects Swiss precision
                  and modern fintech innovation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Type className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Professional Typography
                </h3>
                <p className="text-gray-600 text-sm">
                  Inter font family ensures excellent readability and modern,
                  professional appearance.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Image
                    className="w-8 h-8 text-white"
                    aria-label="Logo icon"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Versatile Logos
                </h3>
                <p className="text-gray-600 text-sm">
                  Multiple logo variations for different applications and
                  contexts.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Color Palette */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Color Palette
            </h2>
            <p className="text-xl text-gray-600">
              Our carefully crafted color system reflects Swiss precision and
              modern fintech innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandColors.map((color, index) => (
              <motion.div
                key={color.name}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`w-full h-20 ${color.example} rounded-lg mb-4`}
                ></div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {color.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">HEX:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-gray-900 font-mono">
                        {color.hex}
                      </code>
                      <button
                        onClick={() => copyToClipboard(color.hex, color.name)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedColor === color.name ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">RGB:</span>
                    <code className="text-gray-900 font-mono">{color.rgb}</code>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{color.usage}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Typography */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Typography
            </h2>
            <p className="text-xl text-gray-600">
              Professional typography system built for clarity and consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {typography.map((font, index) => (
              <motion.div
                key={font.name}
                className="bg-white rounded-xl border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {font.name}
                </h3>
                <div className={`${font.example} text-gray-900 mb-4`}>
                  The quick brown fox jumps over the lazy dog
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>Font:</strong> {font.font}
                  </div>
                  <div>
                    <strong>Weights:</strong> {font.weights.join(', ')}
                  </div>
                  <div>
                    <strong>Usage:</strong> {font.usage}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Logo Guidelines */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Logo Guidelines
            </h2>
            <p className="text-xl text-gray-600">
              Proper usage of PayMatch logos across all applications and
              contexts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {logoVariants.map((logo, index) => (
              <motion.div
                key={logo.name}
                className="bg-white rounded-xl border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center mb-4">
                  <div
                    className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                    role="img"
                    aria-label={`${logo.name} preview`}
                  >
                    <span className="text-gray-400 text-sm">Logo Preview</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {logo.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {logo.description}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Usage:</strong> {logo.usage}
                  </div>
                  <div>
                    <strong>Minimum Size:</strong> {logo.size}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Usage Rules */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Usage Rules
            </h2>
            <p className="text-xl text-gray-600">
              Essential guidelines to maintain brand consistency and integrity.
            </p>
          </div>

          <div className="space-y-8">
            {usageRules.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                className="bg-white rounded-xl border border-gray-200 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.rules.map((rule, ruleIndex) => (
                    <div
                      key={ruleIndex}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {rule.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {rule.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {rule.description}
                        </p>
                        <p className="text-xs text-gray-500 italic">
                          {rule.example}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Asset Download */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Brand Asset Pack
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Download our complete brand asset package with all logos,
                colors, and guidelines.
              </p>
              <motion.button
                onClick={downloadAssetPack}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Asset Pack
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assetPack.files.map((file, index) => (
                <motion.div
                  key={file.name}
                  className="bg-white rounded-lg p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {file.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {file.description}
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    {file.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Version {assetPack.version} • Last updated{' '}
                {assetPack.lastUpdated}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Legal & Compliance */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Legal & Compliance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Brand Usage Rights
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• PayMatch logos and brand assets are proprietary</li>
                  <li>
                    • Usage requires written permission for commercial use
                  </li>
                  <li>• Partner and affiliate usage must be approved</li>
                  <li>• Unauthorized modification is strictly prohibited</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Accessibility Requirements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• All brand assets must meet WCAG AA standards</li>
                  <li>• Color contrast ratios must be maintained</li>
                  <li>• Alternative text required for all logo usage</li>
                  <li>• Scalable formats preferred for digital use</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Need Brand Support?</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Have questions about brand usage or need custom assets? Our team
              is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/support"
                className="inline-flex items-center px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Contact Support
              </a>
              <a
                href="mailto:brand@paymatch.app"
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                brand@paymatch.app
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}
