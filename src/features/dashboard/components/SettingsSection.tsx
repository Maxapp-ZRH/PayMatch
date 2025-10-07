/**
 * Settings Section Component
 *
 * Provides quick access to account settings and preferences from the dashboard.
 * Includes links to email preferences, cookie settings, and other account management.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Cookie,
  Shield,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface SettingsItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: '/email-preferences' | '/cookie-settings' | '/support';
  badge?: string;
  badgeColor?: string;
}

export function SettingsSection() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const settingsItems: SettingsItem[] = [
    {
      title: 'Email Preferences',
      description: 'Manage your email notifications and subscriptions',
      icon: Mail,
      href: '/email-preferences',
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Cookie Settings',
      description: 'Control your privacy and cookie preferences',
      icon: Cookie,
      href: '/cookie-settings',
    },
    {
      title: 'Contact Support',
      description: 'Get help and support from our team',
      icon: Shield,
      href: '/support',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Account Settings
          </h3>
        </div>
        {userEmail && (
          <div className="text-sm text-gray-500">
            Managing:{' '}
            <span className="font-medium text-gray-700">{userEmail}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center space-x-4 rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
              </div>

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
                </div>
                <p className="text-sm text-gray-500 group-hover:text-gray-600">
                  {item.description}
                </p>
              </div>

              <div className="flex-shrink-0">
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Quick Actions
        </h4>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/email-preferences"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Settings
          </Link>
          <Link
            href="/cookie-settings"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            <Cookie className="h-4 w-4 mr-2" />
            Privacy Settings
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Help
          </Link>
        </div>
      </div>
    </div>
  );
}
