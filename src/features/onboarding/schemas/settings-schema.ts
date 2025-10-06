/**
 * Settings Schema
 *
 * Validation schema for settings and preferences form in onboarding.
 */

import { z } from 'zod';

export const settingsSchema = z.object({
  defaultCurrency: z
    .string()
    .min(1, 'Default currency is required')
    .refine((val) => ['CHF', 'EUR'].includes(val), {
      message: 'Please select a valid currency',
    }),
  language: z
    .string()
    .min(1, 'Language is required')
    .refine((val) => ['en', 'de', 'fr', 'it'].includes(val), {
      message: 'Please select a valid language',
    }),
  timezone: z
    .string()
    .min(1, 'Timezone is required')
    .refine(
      (val) =>
        [
          'Europe/Zurich',
          'Europe/Berlin',
          'Europe/Vienna',
          'Europe/Paris',
          'Europe/Rome',
        ].includes(val),
      {
        message: 'Please select a valid timezone',
      }
    ),
  invoiceNumbering: z
    .string()
    .min(1, 'Invoice numbering is required')
    .refine((val) => ['sequential', 'year-prefix', 'custom'].includes(val), {
      message: 'Please select a valid invoice numbering format',
    }),
  paymentTerms: z
    .string()
    .min(1, 'Payment terms is required')
    .refine((val) => ['7', '14', '30', '60', '90'].includes(val), {
      message: 'Please select valid payment terms',
    }),
  emailNotifications: z.boolean(),
  autoReminders: z.boolean(),
  reminderDays: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        // Should be comma-separated numbers
        const days = val.split(',').map((d) => d.trim());
        return days.every((day) => /^\d+$/.test(day) && parseInt(day) > 0);
      },
      {
        message: 'Reminder days must be comma-separated numbers',
      }
    ),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
