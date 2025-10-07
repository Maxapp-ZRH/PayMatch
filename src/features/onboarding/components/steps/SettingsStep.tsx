/**
 * Settings Step Component
 *
 * Third step of the onboarding wizard - user preferences and settings.
 * Configures default settings for the organization.
 */

'use client';

import React, {
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Mail, Clock } from 'lucide-react';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import {
  settingsSchema,
  type SettingsFormData,
} from '../../schemas/settings-schema';
import type { StepProps } from '../../types';
import { useDraftData } from '../../hooks';

export const SettingsStep = forwardRef<
  { submitForm: () => Promise<void> },
  StepProps
>(function SettingsStep({ formData, onNext, saveOnBlur }, ref) {
  // Draft data loading
  const { draftData, isLoading: isLoadingDraft } = useDraftData({
    orgId: formData.orgId!,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      defaultCurrency: formData.defaultCurrency || 'CHF',
      language: formData.language || 'en',
      timezone: formData.timezone || 'Europe/Zurich',
      invoiceNumbering: formData.invoiceNumbering || 'sequential',
      paymentTerms: formData.paymentTerms || '30',
      emailNotifications: formData.emailNotifications ?? true,
      autoReminders: formData.autoReminders ?? true,
      reminderDays: formData.reminderDays || '7,14,30',
      defaultVatRates: formData.defaultVatRates ?? [],
    },
  });

  // Watch all form values for progressive saving
  // Load draft data when available (fallback for any missing data)
  useEffect(() => {
    if (draftData && !isLoadingDraft) {
      Object.entries(draftData).forEach(([key, value]) => {
        // Only set values that aren't already set from formData prop
        const currentValue = getValues(key as keyof SettingsFormData);
        if (!currentValue && value) {
          setValue(key as keyof SettingsFormData, value as string | boolean);
        }
      });
    }
  }, [draftData, isLoadingDraft, setValue, getValues]);

  // Save on blur handler
  const handleBlur = useCallback(() => {
    const currentValues = getValues();
    if (saveOnBlur && Object.keys(currentValues).length > 0) {
      saveOnBlur(currentValues);
    }
  }, [getValues, saveOnBlur]);

  const handleFormSubmit = async (data: SettingsFormData) => {
    clearErrors();
    try {
      onNext(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Expose form submission function to parent
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      const formData = getValues();
      // Ensure defaultVatRates is always an array
      const dataWithDefaults = {
        ...formData,
        defaultVatRates: formData.defaultVatRates || [],
      };
      await handleFormSubmit(dataWithDefaults);
    },
  }));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600">
          Configure your default settings for invoicing and notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* General Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">General</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Currency */}
            <SelectField
              label="Default Currency"
              required
              {...register('defaultCurrency')}
              onBlur={handleBlur}
              error={errors.defaultCurrency?.message}
            >
              <option value="CHF">Swiss Franc (CHF)</option>
              <option value="EUR">Euro (EUR)</option>
            </SelectField>

            {/* Language */}
            <SelectField
              label="Language"
              required
              {...register('language')}
              onBlur={handleBlur}
              error={errors.language?.message}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
            </SelectField>

            {/* Timezone - Hidden field with subtle note */}
            <div className="lg:col-span-2">
              <div className="flex items-center text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                <Clock className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                <span>
                  Timezone: Europe/Zurich (CET/CEST) - Automatically set for
                  Swiss businesses
                </span>
              </div>
              <input
                type="hidden"
                {...register('timezone')}
                value="Europe/Zurich"
              />
            </div>
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
              required
              {...register('invoiceNumbering')}
              onBlur={handleBlur}
              error={errors.invoiceNumbering?.message}
            >
              <option value="sequential">Sequential (001, 002, 003...)</option>
              <option value="year-prefix">
                Year Prefix (2024-001, 2024-002...)
              </option>
            </SelectField>

            {/* Payment Terms */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Default Payment Terms (Days){' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    <div className="max-w-xs">
                      <div className="font-semibold mb-1">
                        Default Payment Terms
                      </div>
                      <div>
                        This sets the default number of days customers have to
                        pay invoices. You can change this for individual
                        invoices later.
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <SelectField
                {...register('paymentTerms')}
                onBlur={handleBlur}
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
        </div>

        {/* VAT Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">VAT Information</h2>
          <div className="space-y-4">
            {/* Swiss VAT Rates Info */}
            <div className="flex items-center text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
              <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
              <span>
                Swiss VAT rates (7.7% standard, 2.5% reduced, 0% zero) are
                automatically configured for all invoices. You can customize
                rates per invoice if needed.
              </span>
            </div>
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
                    Receive notifications about invoice status changes
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

            {/* Overdue Alerts */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Overdue Alerts
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get notified when customers haven&apos;t paid on time
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

            {/* Alert Days - Show only if overdue alerts is enabled */}
            {getValues('autoReminders') && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <TextField
                  label="Alert Schedule"
                  type="text"
                  placeholder="7,14,30"
                  {...register('reminderDays')}
                  onBlur={handleBlur}
                  error={errors.reminderDays?.message}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Days after due date to send you overdue alerts (e.g., 7,14,30)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* GDPR Compliance Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Email Preferences & GDPR Compliance
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Business notifications are necessary for service operation and
                  are automatically enabled. You can manage all email settings
                  in your account preferences. We comply with Swiss FADP data
                  protection laws and respect your privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});
