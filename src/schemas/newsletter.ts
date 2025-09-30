/**
 * Newsletter Subscription Validation Schema
 *
 * Zod schema for validating newsletter subscription form data including
 * personal information and consent requirements.
 */

import { z } from 'zod';

export const newsletterSchema = z.object({
  firstName: z
    .string()
    .min(2, 'firstName.minLength')
    .max(100, 'firstName.maxLength')
    .regex(/^[\p{L}\s\-'\.]+$/u, 'firstName.invalidChars'),

  lastName: z
    .string()
    .min(2, 'lastName.minLength')
    .max(100, 'lastName.maxLength')
    .regex(/^[\p{L}\s\-'\.]+$/u, 'lastName.invalidChars'),

  email: z.string().email('email.invalid').max(255, 'email.maxLength'),

  consent: z.boolean().refine((val) => val === true, {
    message: 'consent.required',
  }),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
