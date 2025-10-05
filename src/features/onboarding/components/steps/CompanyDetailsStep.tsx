/**
 * Company Details Step Component
 *
 * Second step of the onboarding wizard - company information.
 * Collects business details for invoice generation.
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Info } from 'lucide-react';
import { Button } from '@/components/marketing_pages/Button';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import {
  companyDetailsSchema,
  type CompanyDetailsFormData,
} from '../../schemas/company-details-schema';
import type { StepProps } from '../../types';
import { useProgressiveSave, useDraftData } from '../../hooks';

export function CompanyDetailsStep({ formData, onNext }: StepProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Progressive saving hooks
  const { saveDraft, isSaving } = useProgressiveSave({
    orgId: formData.orgId!,
    currentStep: 2,
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
  } = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      companyName: formData.companyName || '',
      address: formData.address || '',
      city: formData.city || '',
      postalCode: formData.postalCode || '',
      country: formData.country || 'CH',
      phone: formData.phone || '',
      website: formData.website || '',
      vatNumber: formData.vatNumber || '',
    },
  });

  // Watch all form values for progressive saving
  const watchedValues = watch();

  // Load draft data when available
  useEffect(() => {
    if (draftData && !isLoadingDraft) {
      Object.entries(draftData).forEach(([key, value]) => {
        setValue(key as keyof CompanyDetailsFormData, value as string);
      });
    }
  }, [draftData, isLoadingDraft, setValue]);

  // Progressive saving on form changes
  useEffect(() => {
    if (Object.keys(watchedValues).length > 0) {
      saveDraft(watchedValues);
    }
  }, [watchedValues, saveDraft]);

  const onSubmit = async (data: CompanyDetailsFormData) => {
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
          Company Details
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Tell us about your business. This information will be used for Swiss
          QR-Bill compliant invoices.
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
        {/* Company Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Company Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Name */}
            <TextField
              className="lg:col-span-2"
              label="Company Name"
              type="text"
              autoComplete="organization"
              required
              placeholder="Enter your company name"
              {...register('companyName')}
              error={errors.companyName?.message}
            />

            {/* VAT Number */}
            <TextField
              label="VAT Number"
              type="text"
              placeholder="CHE-123.456.789"
              {...register('vatNumber')}
              error={errors.vatNumber?.message}
            />

            {/* Website */}
            <TextField
              label="Website"
              type="url"
              placeholder="https://yourcompany.com"
              {...register('website')}
              error={errors.website?.message}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Address Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Address */}
            <TextField
              className="lg:col-span-2"
              label="Street Address"
              type="text"
              autoComplete="street-address"
              required
              placeholder="Enter your street address"
              {...register('address')}
              error={errors.address?.message}
            />

            {/* City */}
            <TextField
              label="City"
              type="text"
              autoComplete="address-level2"
              required
              placeholder="Enter your city"
              {...register('city')}
              error={errors.city?.message}
            />

            {/* Postal Code */}
            <TextField
              label="Postal Code"
              type="text"
              autoComplete="postal-code"
              required
              placeholder="8001"
              {...register('postalCode')}
              error={errors.postalCode?.message}
            />

            {/* Country */}
            <SelectField
              label="Country"
              required
              {...register('country')}
              error={errors.country?.message}
            >
              <option value="">Select country</option>
              <option value="CH">Switzerland</option>
              <option value="DE">Germany</option>
              <option value="AT">Austria</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
            </SelectField>

            {/* Phone */}
            <TextField
              label="Phone Number"
              type="tel"
              autoComplete="tel"
              placeholder="+41 44 123 45 67"
              {...register('phone')}
              error={errors.phone?.message}
            />
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
                Swiss QR-Bill Compliance
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This information will be used to generate Swiss QR-Bill
                  compliant invoices. Make sure all details are accurate as they
                  will appear on your invoices.
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
          {isLoading ? 'Saving...' : 'Continue to Settings'}
        </Button>
      </form>
    </div>
  );
}
