/**
 * Swiss Validation Service
 *
 * Swiss-specific validation functions for company details.
 * Uses existing formatting utilities for consistency.
 */

import { formatSwissIBAN, formatSwissVATNumber } from '@/utils/formatting';
import type { CompanyDetails, SwissValidationResult } from '../types';

// Swiss cantons data
const SWISS_CANTONS = [
  { code: 'ZH', name: 'Zürich' },
  { code: 'BE', name: 'Bern' },
  { code: 'LU', name: 'Luzern' },
  { code: 'UR', name: 'Uri' },
  { code: 'SZ', name: 'Schwyz' },
  { code: 'OW', name: 'Obwalden' },
  { code: 'NW', name: 'Nidwalden' },
  { code: 'GL', name: 'Glarus' },
  { code: 'ZG', name: 'Zug' },
  { code: 'FR', name: 'Freiburg' },
  { code: 'SO', name: 'Solothurn' },
  { code: 'BS', name: 'Basel-Stadt' },
  { code: 'BL', name: 'Basel-Landschaft' },
  { code: 'SH', name: 'Schaffhausen' },
  { code: 'AR', name: 'Appenzell Ausserrhoden' },
  { code: 'AI', name: 'Appenzell Innerrhoden' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'GR', name: 'Graubünden' },
  { code: 'AG', name: 'Aargau' },
  { code: 'TG', name: 'Thurgau' },
  { code: 'TI', name: 'Tessin' },
  { code: 'VD', name: 'Waadt' },
  { code: 'VS', name: 'Wallis' },
  { code: 'NE', name: 'Neuenburg' },
  { code: 'GE', name: 'Genf' },
  { code: 'JU', name: 'Jura' },
];

/**
 * Validate Swiss company details for compliance
 */
export async function validateSwissCompliance(
  data: CompanyDetails
): Promise<SwissValidationResult> {
  const errors: Record<string, string> = {};

  // Validate company name
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Company name must be at least 2 characters long';
  }

  // Validate street address
  if (!data.street || data.street.trim().length < 5) {
    errors.street = 'Street address must be at least 5 characters long';
  }

  // Validate postal code
  if (!validateSwissPostalCode(data.zip)) {
    errors.zip = 'Swiss postal code must be 4 digits';
  }

  // Validate city
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City name must be at least 2 characters long';
  }

  // Validate canton
  if (!validateSwissCanton(data.canton)) {
    errors.canton = 'Invalid Swiss canton code';
  }

  // Validate IBAN
  if (!validateSwissIBAN(data.iban)) {
    errors.iban = 'Invalid Swiss IBAN format';
  }

  // Validate QR-IBAN if provided
  if (data.qr_iban && !validateSwissIBAN(data.qr_iban)) {
    errors.qr_iban = 'Invalid Swiss QR-IBAN format';
  }

  // Validate VAT number if provided
  if (data.vat_number && !validateSwissVATNumber(data.vat_number)) {
    errors.vat_number = 'Invalid Swiss VAT number format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Swiss IBAN format
 */
export function validateSwissIBAN(iban: string): boolean {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  return cleanIban.startsWith('CH') && cleanIban.length === 21;
}

/**
 * Validate Swiss postal code
 */
export function validateSwissPostalCode(postalCode: string): boolean {
  return /^[0-9]{4}$/.test(postalCode);
}

/**
 * Validate Swiss canton code
 */
export function validateSwissCanton(canton: string): boolean {
  return SWISS_CANTONS.some((c) => c.code === canton);
}

/**
 * Validate Swiss VAT number format
 */
export function validateSwissVATNumber(vatNumber: string): boolean {
  const digits = vatNumber.replace(/\D/g, '');
  return digits.length >= 9;
}

/**
 * Get all Swiss cantons
 */
export function getSwissCantons() {
  return SWISS_CANTONS;
}

/**
 * Format Swiss IBAN for display
 */
export function formatSwissIBANForDisplay(iban: string): string {
  return formatSwissIBAN(iban);
}

/**
 * Format Swiss VAT number for display
 */
export function formatSwissVATNumberForDisplay(vatNumber: string): string {
  return formatSwissVATNumber(vatNumber);
}
