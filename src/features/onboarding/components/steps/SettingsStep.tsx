/**
 * Settings Step Component
 *
 * Third step of the onboarding wizard - user preferences and settings.
 * Configures default settings for the organization.
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Info, Mail, Smartphone, Clock } from 'lucide-react';
import { Button } from '@/components/marketing_pages/Button';
import { SelectField } from '@/components/ui/select-field';
import {
  settingsSchema,
  type SettingsFormData,
} from '../../schemas/settings-schema';
import type { StepProps } from '../../types';
import { useProgressiveSave, useDraftData } from '../../hooks';

export function SettingsStep({ formData, onNext }: StepProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Progressive saving hooks
  const { saveDraft, isSaving } = useProgressiveSave({
    orgId: formData.orgId!,
    currentStep: 3,
  });

  const { draftData, isLoading: isLoadingDraft } = useDraftData({
    orgId: formData.orgId!,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      defaultCurrency: formData.defaultCurrency || 'CHF',
      language: formData.language || 'en',
      timezone: formData.timezone || 'Europe/Zurich',
      invoiceNumbering: formData.invoiceNumbering || 'sequential',
      paymentTerms: formData.paymentTerms || '30',
      emailNotifications: formData.emailNotifications ?? true,
      smsNotifications: formData.smsNotifications ?? false,
      autoReminders: formData.autoReminders ?? true,
      reminderDays: formData.reminderDays || '7,14,30',
    },
  });

  // Watch all form values for progressive saving
  const watchedValues = watch();

  // Load draft data when available
  useEffect(() => {
    if (draftData && !isLoadingDraft) {
      Object.entries(draftData).forEach(([key, value]) => {
        setValue(key as keyof SettingsFormData, value as string | boolean);
      });
    }
  }, [draftData, isLoadingDraft, setValue]);

  // Progressive saving on form changes
  useEffect(() => {
    if (Object.keys(watchedValues).length > 0) {
      saveDraft(watchedValues);
    }
  }, [watchedValues, saveDraft]);

  const onSubmit = async (data: SettingsFormData) => {
    clearErrors();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onNext(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900">
          Settings & Preferences
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Configure your default settings for invoicing and notifications.
        </p>
      </div>

      {/* Save Status Indicator */}
      {isSaving && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-1 text-sm text-red-600">
            <Save className="w-4 h-4" />
            <span>Saving...</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Currency & Language */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Currency & Language
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Currency */}
            <SelectField
              label="Default Currency"
              {...register('defaultCurrency')}
              error={errors.defaultCurrency?.message}
            >
              <option value="CHF">Swiss Franc (CHF)</option>
              <option value="EUR">Euro (EUR)</option>
            </SelectField>

            {/* Language */}
            <SelectField
              label="Language"
              {...register('language')}
              error={errors.language?.message}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
            </SelectField>

            {/* Timezone */}
            <SelectField
              className="lg:col-span-2"
              label="Timezone"
              {...register('timezone')}
              error={errors.timezone?.message}
            >
              <option value="Europe/Zurich">Europe/Zurich (Switzerland)</option>
              <option value="Europe/Berlin">Europe/Berlin (Germany)</option>
              <option value="Europe/Vienna">Europe/Vienna (Austria)</option>
              <option value="Europe/Paris">Europe/Paris (France)</option>
              <option value="Europe/Rome">Europe/Rome (Italy)</option>
            </SelectField>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Invoice Settings
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Numbering */}
            <SelectField
              label="Invoice Numbering"
              {...register('invoiceNumbering')}
              error={errors.invoiceNumbering?.message}
            >
              <option value="sequential">Sequential (001, 002, 003...)</option>
              <option value="year-prefix">
                Year Prefix (2024-001, 2024-002...)
              </option>
              <option value="custom">Custom Format</option>
            </SelectField>

            {/* Payment Terms */}
            <SelectField
              label="Default Payment Terms (Days)"
              {...register('paymentTerms')}
              error={errors.paymentTerms?.message}
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </SelectField>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Notification Settings
          </h2>
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Smartphone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications via SMS
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('smsNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* Auto Reminders */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Automatic Reminders
                  </h3>
                  <p className="text-sm text-gray-500">
                    Send automatic payment reminders
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('autoReminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Settings Saved
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  You can always change these settings later in your dashboard.
                  These preferences will be applied to all new invoices and
                  notifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          color="swiss"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
}
