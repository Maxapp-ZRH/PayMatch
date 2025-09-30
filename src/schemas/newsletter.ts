/**
 * Newsletter Subscription Validation Schema
 *
 * Enhanced Zod schema for validating newsletter subscription form data including
 * personal information, email validation, and consent requirements with detailed
 * error messages and real-time validation support.
 */

import { z } from 'zod';

export const newsletterSchema = z.object({
  firstName: z
    .string()
    .min(1, 'firstName.required')
    .min(2, 'firstName.minLength')
    .max(100, 'firstName.maxLength')
    .regex(/^[\p{L}\s\-'\.]+$/u, 'firstName.invalidChars')
    .transform((val) => val.trim()),

  lastName: z
    .string()
    .min(1, 'lastName.required')
    .min(2, 'lastName.minLength')
    .max(100, 'lastName.maxLength')
    .regex(/^[\p{L}\s\-'\.]+$/u, 'lastName.invalidChars')
    .transform((val) => val.trim()),

  email: z
    .string()
    .min(1, 'email.required')
    .email('email.invalid')
    .max(255, 'email.maxLength')
    .transform((val) => val.toLowerCase().trim())
    .refine(
      (email) => {
        // Additional email validation for common issues
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      },
      {
        message: 'email.invalid',
      }
    ),

  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'consent.required',
    })
    .refine((val) => val === true, {
      message: 'consent.mustAccept',
    }),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Partial schema for real-time validation (without consent requirement)
export const newsletterPartialSchema = newsletterSchema.partial({
  consent: true,
});

export type NewsletterPartialFormData = z.infer<typeof newsletterPartialSchema>;
