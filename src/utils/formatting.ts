/**
 * Swiss Formatting Utilities
 *
 * Comprehensive formatting utilities specifically designed for Swiss market.
 * Handles dates, times, currency, numbers, and other Swiss-specific formatting.
 * All functions use Swiss locale (de-CH) for consistent formatting.
 */

// Swiss locale configuration
const SWISS_LOCALE = 'de-CH';
const SWISS_TIMEZONE = 'Europe/Zurich';

// Swiss currency configuration (CHF only)
export const SWISS_CURRENCIES = {
  CHF: 'CHF',
} as const;

export type SwissCurrency = keyof typeof SWISS_CURRENCIES;

// Swiss date/time formatting options
export const SWISS_DATE_FORMATS = {
  short: { day: '2-digit', month: '2-digit', year: 'numeric' } as const,
  medium: { day: 'numeric', month: 'long', year: 'numeric' } as const,
  long: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } as const,
  full: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  } as const,
} as const;

export type SwissDateFormat = keyof typeof SWISS_DATE_FORMATS;

// Swiss number formatting options
export const SWISS_NUMBER_FORMATS = {
  currency: {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  } as const,
  percent: {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  } as const,
  decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const,
  integer: { maximumFractionDigits: 0 } as const,
  precise: { maximumFractionDigits: 5 } as const,
} as const;

export type SwissNumberFormat = keyof typeof SWISS_NUMBER_FORMATS;

/**
 * Format a date using Swiss formatting
 */
export function formatSwissDate(
  date: Date | string | number,
  format: SwissDateFormat = 'medium'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(SWISS_LOCALE, {
    ...SWISS_DATE_FORMATS[format],
    timeZone: SWISS_TIMEZONE,
  }).format(dateObj);
}

/**
 * Format a time using Swiss formatting
 */
export function formatSwissTime(
  date: Date | string | number,
  includeSeconds: boolean = false
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(SWISS_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    timeZone: SWISS_TIMEZONE,
  }).format(dateObj);
}

/**
 * Format a date and time using Swiss formatting
 */
export function formatSwissDateTime(
  date: Date | string | number,
  dateFormat: SwissDateFormat = 'medium',
  includeSeconds: boolean = false
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(SWISS_LOCALE, {
    ...SWISS_DATE_FORMATS[dateFormat],
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    timeZone: SWISS_TIMEZONE,
  }).format(dateObj);
}

/**
 * Format currency using Swiss formatting
 */
export function formatSwissCurrency(
  amount: number,
  showSymbol: boolean = true
): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  if (!showSymbol) {
    options.currencyDisplay = 'code';
  }

  return new Intl.NumberFormat(SWISS_LOCALE, options).format(amount);
}

/**
 * Format currency for display (amount in cents)
 */
export function formatSwissCurrencyFromCents(
  amountInCents: number,
  showSymbol: boolean = true
): string {
  return formatSwissCurrency(amountInCents / 100, showSymbol);
}

/**
 * Format a number using Swiss formatting
 */
export function formatSwissNumber(
  value: number,
  format: SwissNumberFormat = 'decimal'
): string {
  return new Intl.NumberFormat(
    SWISS_LOCALE,
    SWISS_NUMBER_FORMATS[format]
  ).format(value);
}

/**
 * Format a percentage using Swiss formatting
 */
export function formatSwissPercent(
  value: number,
  decimals: number = 1
): string {
  return new Intl.NumberFormat(SWISS_LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a list using Swiss formatting
 */
export function formatSwissList(
  items: string[],
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  return new Intl.ListFormat(SWISS_LOCALE, {
    style: 'long',
    type,
  }).format(items);
}

/**
 * Format a relative time (e.g., "2 hours ago") using Swiss formatting
 */
export function formatSwissRelativeTime(date: Date | string | number): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();

  const rtf = new Intl.RelativeTimeFormat(SWISS_LOCALE, { numeric: 'auto' });

  // Calculate the appropriate unit and value
  const units: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
    { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
    { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
    { unit: 'day', ms: 24 * 60 * 60 * 1000 },
    { unit: 'hour', ms: 60 * 60 * 1000 },
    { unit: 'minute', ms: 60 * 1000 },
    { unit: 'second', ms: 1000 },
  ];

  for (const { unit: u, ms } of units) {
    if (Math.abs(diffInMs) >= ms) {
      return rtf.format(Math.round(diffInMs / ms), u);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Format a phone number using Swiss formatting
 */
export function formatSwissPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Swiss phone number patterns
  if (digits.startsWith('41')) {
    // International format: +41 XX XXX XX XX
    return `+41 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(
      7,
      9
    )} ${digits.slice(9, 11)}`;
  } else if (digits.startsWith('0')) {
    // National format: 0XX XXX XX XX
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
      6,
      8
    )} ${digits.slice(8, 10)}`;
  }

  // Return as-is if pattern doesn't match
  return phoneNumber;
}

/**
 * Format a Swiss postal code
 */
export function formatSwissPostalCode(postalCode: string | number): string {
  const code = postalCode.toString().padStart(4, '0');
  return code;
}

/**
 * Format a Swiss IBAN
 */
export function formatSwissIBAN(iban: string): string {
  // Remove all non-alphanumeric characters
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Swiss IBAN format: CH44 3199 9123 0008 8901 2
  if (cleanIban.startsWith('CH') && cleanIban.length === 21) {
    return cleanIban.replace(/(.{4})/g, '$1 ').trim();
  }

  return iban;
}

/**
 * Format a Swiss VAT number
 */
export function formatSwissVATNumber(vatNumber: string): string {
  // Remove all non-digit characters
  const digits = vatNumber.replace(/\D/g, '');

  // Swiss VAT format: CHE-123.456.789 MWST
  if (digits.length >= 9) {
    const formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    return `CHE-${formatted} MWST`;
  }

  return vatNumber;
}

/**
 * Format a Swiss invoice number
 */
export function formatSwissInvoiceNumber(
  year: number,
  month: number,
  sequence: number
): string {
  const yearStr = year.toString().slice(-2);
  const monthStr = month.toString().padStart(2, '0');
  const sequenceStr = sequence.toString().padStart(4, '0');

  return `${yearStr}-${monthStr}-${sequenceStr}`;
}

/**
 * Format a Swiss QR-bill reference number
 */
export function formatSwissQRReference(reference: string): string {
  // Remove all non-digit characters
  const digits = reference.replace(/\D/g, '');

  // Format as groups of 5 digits
  return digits.replace(/(.{5})/g, '$1 ').trim();
}

/**
 * Get Swiss business hours
 */
export function getSwissBusinessHours(): {
  open: string;
  close: string;
  timezone: string;
} {
  return {
    open: '08:00',
    close: '17:00',
    timezone: SWISS_TIMEZONE,
  };
}

/**
 * Check if current time is within Swiss business hours
 */
export function isSwissBusinessHours(date: Date = new Date()): boolean {
  const zurichTime = new Date(
    date.toLocaleString('en-US', { timeZone: SWISS_TIMEZONE })
  );
  const hours = zurichTime.getHours();
  const day = zurichTime.getDay();

  // Monday to Friday, 8 AM to 5 PM
  return day >= 1 && day <= 5 && hours >= 8 && hours < 17;
}

/**
 * Get Swiss public holidays for a given year
 */
export function getSwissPublicHolidays(
  year: number
): Array<{ date: Date; name: string }> {
  const holidays = [
    { date: new Date(year, 0, 1), name: 'Neujahr' },
    { date: new Date(year, 0, 2), name: 'Berchtoldstag' },
    { date: new Date(year, 2, 19), name: 'Josefstag' }, // Approximate, varies by canton
    { date: new Date(year, 3, 1), name: 'Karfreitag' }, // Approximate, varies by year
    { date: new Date(year, 3, 3), name: 'Ostermontag' }, // Approximate, varies by year
    { date: new Date(year, 4, 1), name: 'Tag der Arbeit' },
    { date: new Date(year, 4, 9), name: 'Auffahrt' }, // Approximate, varies by year
    { date: new Date(year, 4, 20), name: 'Pfingstmontag' }, // Approximate, varies by year
    { date: new Date(year, 5, 10), name: 'Fronleichnam' }, // Approximate, varies by year
    { date: new Date(year, 7, 1), name: 'Bundesfeier' },
    { date: new Date(year, 7, 15), name: 'Mariä Himmelfahrt' },
    { date: new Date(year, 10, 1), name: 'Allerheiligen' },
    { date: new Date(year, 11, 8), name: 'Mariä Empfängnis' },
    { date: new Date(year, 11, 25), name: 'Weihnachten' },
    { date: new Date(year, 11, 26), name: 'Stephanstag' },
  ];

  return holidays;
}

/**
 * Check if a date is a Swiss public holiday
 */
export function isSwissPublicHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getSwissPublicHolidays(year);

  return holidays.some(
    (holiday) =>
      holiday.date.getDate() === date.getDate() &&
      holiday.date.getMonth() === date.getMonth()
  );
}

/**
 * Get the next Swiss business day
 */
export function getNextSwissBusinessDay(date: Date = new Date()): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  while (
    nextDay.getDay() === 0 ||
    nextDay.getDay() === 6 ||
    isSwissPublicHoliday(nextDay)
  ) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
}

/**
 * Format a Swiss address
 */
export function formatSwissAddress(address: {
  street: string;
  number: string;
  postalCode: string;
  city: string;
  canton?: string;
}): string {
  const parts = [
    `${address.street} ${address.number}`,
    `${formatSwissPostalCode(address.postalCode)} ${address.city}`,
  ];

  if (address.canton) {
    parts.push(address.canton);
  }

  return parts.join('\n');
}

/**
 * Format Swiss VAT rates for display
 */
export function formatSwissVATRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * Get Swiss VAT rates
 */
export function getSwissVATRates(): Record<string, number> {
  return {
    standard: 7.7,
    reduced: 2.5,
    zero: 0,
  };
}

/**
 * Calculate Swiss VAT
 */
export function calculateSwissVAT(
  amount: number,
  vatRate: keyof ReturnType<typeof getSwissVATRates> = 'standard'
): number {
  const rates = getSwissVATRates();
  return Math.round(amount * (rates[vatRate] / 100));
}

/**
 * Format Swiss VAT amount
 */
export function formatSwissVATAmount(
  amount: number,
  vatRate: keyof ReturnType<typeof getSwissVATRates> = 'standard'
): string {
  const vatAmount = calculateSwissVAT(amount, vatRate);
  return formatSwissCurrency(vatAmount);
}

/**
 * Format Swiss invoice totals
 */
export function formatSwissInvoiceTotals(
  subtotal: number,
  vatAmount: number,
  total: number
): {
  subtotal: string;
  vat: string;
  total: string;
} {
  return {
    subtotal: formatSwissCurrency(subtotal),
    vat: formatSwissCurrency(vatAmount),
    total: formatSwissCurrency(total),
  };
}
