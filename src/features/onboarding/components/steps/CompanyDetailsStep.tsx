/**
 * Company Details Step Component
 *
 * Second step of the onboarding wizard - collecting company information.
 * Includes Swiss-specific fields for QR-Bill compliance.
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
import { Info } from 'lucide-react';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import {
  companyDetailsSchema,
  type CompanyDetailsFormData,
} from '../../schemas/company-details-schema';
import type { StepProps } from '../../types';
import { useDraftData } from '../../hooks';
import {
  formatSwissPhoneNumberInput,
  formatSwissIBANInput,
  formatSwissVATNumberInput,
  formatSwissPostalCodeInput,
} from '@/utils/formatting';

export const CompanyDetailsStep = forwardRef<
  { submitForm: () => Promise<void> },
  StepProps
>(function CompanyDetailsStep({ formData, onNext, saveOnBlur }, ref) {
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
  } = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      companyName: formData.companyName || '',
      address1:
        formData.address1 || formData.address_line_1 || formData.address || '', // Support old address field
      address2: formData.address2 || formData.address_line_2 || '',
      city: formData.city || '',
      postalCode: formData.postalCode || '',
      country: formData.country || 'CH',
      phone: formData.phone || '+41 ',
      website: formData.website || 'https://',
      canton: formData.canton || '',
      uidVatNumber: formData.uidVatNumber || 'CHE-',
      iban: formData.iban || 'CH',
      qrIban: formData.qrIban || 'CH',
      legalEntityType: formData.legalEntityType || '',
    },
  });

  // Load draft data when available (fallback for any missing data)
  useEffect(() => {
    if (draftData && !isLoadingDraft) {
      Object.entries(draftData).forEach(([key, value]) => {
        // Only set values that aren't already set from formData prop
        const currentValue = getValues(key as keyof CompanyDetailsFormData);
        if (!currentValue && value) {
          setValue(key as keyof CompanyDetailsFormData, value as string);
        }
      });
    }
  }, [draftData, isLoadingDraft, setValue, getValues]);

  // Formatting handlers
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // If user starts typing without +41, add it
      if (value && !value.startsWith('+41') && !value.startsWith('0')) {
        value = '+41 ' + value;
      }

      // If user types 0xx format, convert to +41
      if (value.startsWith('0') && value.length > 1) {
        value = '+41 ' + value.substring(1);
      }

      const formatted = formatSwissPhoneNumberInput(value);
      setValue('phone', formatted);
    },
    [setValue]
  );

  const handleWebsiteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // If user starts typing without https://, add it
      if (
        value &&
        !value.startsWith('http://') &&
        !value.startsWith('https://')
      ) {
        value = 'https://' + value;
      }

      setValue('website', value);
    },
    [setValue]
  );

  const handleIBANChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // If user starts typing without CH, add it
      if (value && !value.startsWith('CH') && !value.startsWith('ch')) {
        value = 'CH' + value;
      }

      const formatted = formatSwissIBANInput(value);
      setValue('iban', formatted);
    },
    [setValue]
  );

  const handleQRIBANChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // If user starts typing without CH, add it
      if (value && !value.startsWith('CH') && !value.startsWith('ch')) {
        value = 'CH' + value;
      }

      const formatted = formatSwissIBANInput(value);
      setValue('qrIban', formatted);
    },
    [setValue]
  );

  const handleVATNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // If user starts typing without CHE-, add it
      if (value && !value.startsWith('CHE-')) {
        value = 'CHE-' + value;
      }

      const formatted = formatSwissVATNumberInput(value);
      setValue('uidVatNumber', formatted);
    },
    [setValue]
  );

  const handlePostalCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatSwissPostalCodeInput(e.target.value);
      setValue('postalCode', formatted);
    },
    [setValue]
  );

  // Save on blur handler
  const handleBlur = useCallback(() => {
    const currentValues = getValues();
    if (saveOnBlur && Object.keys(currentValues).length > 0) {
      saveOnBlur(currentValues);
    }
  }, [getValues, saveOnBlur]);

  const handleFormSubmit = async (data: CompanyDetailsFormData) => {
    clearErrors();
    try {
      // Combine address1 and address2 into a single address field for backend compatibility
      let phone = data.phone;

      // Ensure phone has +41 prefix if it's provided
      if (phone && phone.trim() !== '') {
        // Remove any existing +41 to avoid duplicates
        phone = phone.replace(/^\+41\s*/, '');
        // Add +41 prefix
        phone = '+41 ' + phone;
      }

      const submitData = {
        ...data,
        address_line_1: data.address1,
        address_line_2: data.address2,
        phone: phone,
      };
      onNext(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Expose form submission function to parent
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      const formData = getValues();
      await handleFormSubmit(formData);
    },
  }));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900">
          Company Details
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600">
          Tell us about your business. This information will be used for Swiss
          QR-Bill compliant invoices.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Company Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Company Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Name */}
            <TextField
              label="Company Name"
              type="text"
              autoComplete="organization"
              required
              placeholder="Enter your company name"
              {...register('companyName')}
              onBlur={handleBlur}
              error={errors.companyName?.message}
            />

            {/* Website */}
            <TextField
              label="Website"
              type="url"
              placeholder="https://yourcompany.com"
              {...register('website')}
              onChange={handleWebsiteChange}
              onBlur={handleBlur}
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
            {/* Address Line 1 */}
            <TextField
              className="lg:col-span-2"
              label="Street Address"
              type="text"
              autoComplete="street-address"
              required
              placeholder="Enter your street address"
              {...register('address1')}
              onBlur={handleBlur}
              error={errors.address1?.message}
            />

            {/* Address Line 2 */}
            <TextField
              className="lg:col-span-2"
              label="Address Line 2 (Optional)"
              type="text"
              autoComplete="address-line2"
              placeholder="Apartment, suite, unit, building, floor, etc."
              {...register('address2')}
              onBlur={handleBlur}
              error={errors.address2?.message}
            />

            {/* City */}
            <TextField
              label="City"
              type="text"
              autoComplete="address-level2"
              required
              placeholder="Enter your city"
              {...register('city')}
              onBlur={handleBlur}
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
              onChange={handlePostalCodeChange}
              onBlur={handleBlur}
              error={errors.postalCode?.message}
            />

            {/* Phone */}
            <TextField
              label="Phone Number"
              type="tel"
              autoComplete="tel"
              placeholder="+41 79 123 45 67"
              {...register('phone')}
              onChange={handlePhoneChange}
              onBlur={handleBlur}
              error={errors.phone?.message}
            />

            {/* Canton */}
            <SelectField
              label="Canton"
              required
              {...register('canton')}
              onBlur={handleBlur}
              error={errors.canton?.message}
            >
              <option value="">Select Canton</option>
              <option value="AG">Aargau</option>
              <option value="AI">Appenzell Innerrhoden</option>
              <option value="AR">Appenzell Ausserrhoden</option>
              <option value="BL">Basel-Landschaft</option>
              <option value="BS">Basel-Stadt</option>
              <option value="BE">Bern</option>
              <option value="FR">Fribourg</option>
              <option value="GE">Genève</option>
              <option value="GL">Glarus</option>
              <option value="GR">Graubünden</option>
              <option value="JU">Jura</option>
              <option value="LU">Luzern</option>
              <option value="NE">Neuchâtel</option>
              <option value="NW">Nidwalden</option>
              <option value="OW">Obwalden</option>
              <option value="SG">St. Gallen</option>
              <option value="SH">Schaffhausen</option>
              <option value="SZ">Schwyz</option>
              <option value="SO">Solothurn</option>
              <option value="TG">Thurgau</option>
              <option value="TI">Ticino</option>
              <option value="UR">Uri</option>
              <option value="VS">Valais</option>
              <option value="VD">Vaud</option>
              <option value="ZG">Zug</option>
              <option value="ZH">Zürich</option>
            </SelectField>

            {/* Switzerland Note */}
            <div className="lg:col-span-2">
              <div className="flex items-center text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                <span>
                  PayMatch is designed specifically for businesses in
                  Switzerland and Swiss QR-Bill compliance.
                </span>
              </div>
              <input type="hidden" {...register('country')} value="CH" />
            </div>
          </div>
        </div>

        {/* Legal & Tax Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Legal & Tax Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legal Entity Type */}
            <SelectField
              label="Legal Entity Type"
              required
              {...register('legalEntityType')}
              onBlur={handleBlur}
              error={errors.legalEntityType?.message}
            >
              <option value="">Select Type</option>
              <option value="AG">AG (Aktiengesellschaft)</option>
              <option value="GmbH">
                GmbH (Gesellschaft mit beschränkter Haftung)
              </option>
              <option value="Einzelunternehmen">Einzelunternehmen</option>
              <option value="Verein">Verein</option>
              <option value="Stiftung">Stiftung</option>
              <option value="Genossenschaft">Genossenschaft</option>
              <option value="Kollektivgesellschaft">
                Kollektivgesellschaft
              </option>
              <option value="Kommanditgesellschaft">
                Kommanditgesellschaft
              </option>
            </SelectField>

            {/* UID/VAT Number */}
            <TextField
              label="UID/VAT Number"
              type="text"
              placeholder="CHE-123.456.789"
              {...register('uidVatNumber')}
              onChange={handleVATNumberChange}
              onBlur={handleBlur}
              error={errors.uidVatNumber?.message}
            />
          </div>
        </div>

        {/* Banking Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Banking Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IBAN */}
            <TextField
              label="IBAN (Bank Account)"
              type="text"
              placeholder="CH93 0076 2011 6238 5295 7"
              {...register('iban')}
              onChange={handleIBANChange}
              onBlur={handleBlur}
              error={errors.iban?.message}
            />

            {/* QR-IBAN */}
            <TextField
              label="QR-IBAN (QR-Bill Reference)"
              type="text"
              placeholder="CH93 0076 2011 6238 5295 7"
              {...register('qrIban')}
              onChange={handleQRIBANChange}
              onBlur={handleBlur}
              error={errors.qrIban?.message}
            />
          </div>
        </div>
      </form>
    </div>
  );
});
