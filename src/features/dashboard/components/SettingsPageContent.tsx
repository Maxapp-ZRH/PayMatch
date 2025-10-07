/**
 * Settings Page Content Component
 *
 * The main content for the settings page with comprehensive account management.
 * Provides organized sections for different types of settings and preferences.
 */

'use client';

import { useState } from 'react';
import {
  Settings,
  Mail,
  Cookie,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SettingsItem[];
}

interface SettingsItem {
  title: string;
  description: string;
  href: '/email-preferences' | '/cookie-settings' | '/support';
  badge?: string;
  badgeColor?: string;
  external?: boolean;
}

interface SettingsPageContentProps {
  userEmail: string;
}

export function SettingsPageContent({ userEmail }: SettingsPageContentProps) {
  const [activeSection, setActiveSection] = useState<string>('communications');

  const settingsSections: SettingsSection[] = [
    {
      id: 'communications',
      title: 'Communications',
      description: 'Manage how you receive notifications and communications',
      icon: Mail,
      items: [
        {
          title: 'Email Preferences',
          description: 'Control which emails you receive from PayMatch',
          href: '/email-preferences',
          badge: 'New',
          badgeColor: 'bg-blue-100 text-blue-800',
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      description: 'Control your privacy settings and data preferences',
      icon: Shield,
      items: [
        {
          title: 'Cookie Settings',
          description: 'Manage your cookie preferences and tracking settings',
          href: '/cookie-settings',
        },
      ],
    },
    {
      id: 'support',
      title: 'Support & Help',
      description: 'Get help and access support resources',
      icon: HelpCircle,
      items: [
        {
          title: 'Contact Support',
          description: 'Get in touch with our support team',
          href: '/support',
        },
      ],
    },
  ];

  const currentSection = settingsSections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="h-8 w-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
          </div>

          <p className="text-lg text-gray-600">
            Manage your PayMatch account settings and preferences
          </p>

          {userEmail && (
            <p className="text-sm text-gray-500 mt-2">
              Managing settings for:{' '}
              <span className="font-medium text-gray-700">{userEmail}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-cyan-100 text-cyan-700 border-r-2 border-cyan-500'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-left">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentSection && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <currentSection.icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {currentSection.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {currentSection.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {currentSection.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group relative flex items-start space-x-4 rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                              {item.title}
                            </p>
                            {item.badge && (
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.badgeColor || 'bg-gray-100 text-gray-800'}`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {item.external && (
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 group-hover:text-gray-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/email-preferences"
            className="group relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  Email Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your email notifications
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/cookie-settings"
            className="group relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                  <Cookie className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  Privacy Settings
                </h3>
                <p className="text-sm text-gray-500">
                  Control your privacy preferences
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/support"
            className="group relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  Get Help
                </h3>
                <p className="text-sm text-gray-500">
                  Contact support and get assistance
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
