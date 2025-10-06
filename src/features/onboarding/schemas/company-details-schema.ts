/**
 * Company Details Schema
 *
 * Validation schema for company details form in onboarding.
 */

import { z } from 'zod';

export const companyDetailsSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .min(4, 'Postal code must be at least 4 characters')
    .max(10, 'Postal code must be less than 10 characters')
    .regex(/^[0-9]+$/, 'Postal code must contain only numbers'),
  country: z
    .string()
    .min(1, 'Country is required')
    .refine((val) => ['CH', 'DE', 'AT', 'FR', 'IT'].includes(val), {
      message: 'Please select a valid country',
    }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        // Basic phone validation - allows international formats
        return /^[\+]?[0-9\s\-\(\)]{7,20}$/.test(val);
      },
      {
        message: 'Please enter a valid phone number',
      }
    ),
  website: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        try {
          new URL(val.startsWith('http') ? val : `https://${val}`);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'Please enter a valid website URL',
      }
    ),
  canton: z
    .string()
    .min(1, 'Canton is required for Swiss businesses')
    .refine(
      (val) =>
        [
          'ZH',
          'BE',
          'LU',
          'UR',
          'SZ',
          'OW',
          'NW',
          'GL',
          'ZG',
          'FR',
          'SO',
          'BS',
          'BL',
          'SH',
          'AR',
          'AI',
          'SG',
          'GR',
          'AG',
          'TG',
          'TI',
          'VD',
          'VS',
          'NE',
          'GE',
          'JU',
        ].includes(val),
      {
        message: 'Please select a valid Swiss canton',
      }
    ),
  uidVatNumber: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        // Swiss UID/VAT number format: CHE-123.456.789
        return /^CHE-\d{3}\.\d{3}\.\d{3}$/.test(val);
      },
      {
        message: 'UID/VAT number must be in format CHE-123.456.789',
      }
    ),
  iban: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        // Swiss IBAN format: CH + 2 check digits + 5 bank code + 12 account number
        return /^CH[0-9]{2}[0-9]{5}[0-9A-Z]{12}$/.test(val);
      },
      {
        message: 'Please enter a valid Swiss IBAN (CH + 21 characters)',
      }
    ),
  qrIban: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        // Swiss QR-IBAN format: CH + 2 check digits + 5 bank code + 12 account number
        return /^CH[0-9]{2}[0-9]{5}[0-9A-Z]{12}$/.test(val);
      },
      {
        message: 'Please enter a valid Swiss QR-IBAN (CH + 21 characters)',
      }
    ),
  legalEntityType: z
    .string()
    .min(1, 'Legal entity type is required')
    .refine(
      (val) =>
        [
          'GmbH',
          'AG',
          'Einzelunternehmen',
          'Partnerschaft',
          'Verein',
          'Stiftung',
          'Other',
        ].includes(val),
      {
        message: 'Please select a valid legal entity type',
      }
    ),
});

export type CompanyDetailsFormData = z.infer<typeof companyDetailsSchema>;
