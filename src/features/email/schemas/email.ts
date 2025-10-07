/**
 * Email Service Validation Schemas
 *
 * Centralized validation schemas for the consolidated email service system.
 * Includes schemas for email sending, unsubscribe operations, and email preferences.
 */

import { z } from 'zod';

// Email type enum
export const emailTypeSchema = z.enum(
  [
    'newsletter_promotional',
    'newsletter_informational',
    'newsletter_news',
    'support',
    'transactional',
    'security',
    'legal',
    'business_notifications',
    'overdue_alerts',
  ],
  {
    errorMap: () => ({ message: 'emailType.invalid' }),
  }
);

// Base email validation
export const emailSchema = z
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
  );

// Email sending schema
export const emailSendingSchema = z.object({
  to: z.union([emailSchema, z.array(emailSchema).min(1, 'email.toRequired')]),
  subject: z
    .string()
    .min(1, 'subject.required')
    .max(200, 'subject.maxLength')
    .transform((val) => val.trim()),
  html: z.string().min(1, 'html.required'),
  text: z.string().optional(),
  from: z.string().email('from.invalid').optional(),
  replyTo: z.string().email('replyTo.invalid').optional(),
  emailType: emailTypeSchema.default('transactional'),
  userId: z.string().uuid('userId.invalid').optional(),
  tags: z
    .array(
      z.object({
        name: z.string().min(1, 'tag.nameRequired'),
        value: z.string().min(1, 'tag.valueRequired'),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        content: z.string().optional(),
        filename: z.string().min(1, 'attachment.filenameRequired'),
        contentId: z.string().min(1, 'attachment.contentIdRequired'),
        contentType: z.string().optional(),
      })
    )
    .optional(),
});

// Newsletter subscription schema (re-exported for consistency)
export const newsletterSubscriptionSchema = z.object({
  email: emailSchema,
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
  consent: z.boolean().refine((val) => val === true, {
    message: 'consent.required',
  }),
});

// Unsubscribe token schema
export const unsubscribeTokenSchema = z.object({
  token: z.string().min(1, 'token.required'),
});

// Email preferences schema
export const emailPreferencesSchema = z.object({
  email: emailSchema,
  emailType: emailTypeSchema,
  userId: z.string().uuid('userId.invalid').optional(),
  isActive: z.boolean().default(true),
});

// Unsubscribe request schema
export const unsubscribeRequestSchema = z.object({
  email: emailSchema,
  type: emailTypeSchema,
  userId: z.string().uuid('userId.invalid').optional(),
});

// Support email schema (for support form integration)
export const supportEmailSchema = z.object({
  name: z
    .string()
    .min(2, 'name.minLength')
    .max(100, 'name.maxLength')
    .regex(/^[\p{L}\s\-'\.]+$/u, 'name.invalidChars'),
  email: emailSchema,
  subject: z
    .string()
    .min(5, 'subject.minLength')
    .max(200, 'subject.maxLength')
    .regex(/^[\p{L}\p{N}\s\-_.,!?]+$/u, 'subject.invalidChars'),
  message: z
    .string()
    .min(10, 'message.minLength')
    .max(2000, 'message.maxLength')
    .regex(/^[\s\S]*[\p{L}\p{N}][\s\S]*$/u, 'message.invalidContent'),
  category: z.enum([
    'general',
    'technical',
    'billing',
    'feature-request',
    'bug-report',
    'account',
    'integration',
    'other',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  attachments: z
    .array(
      z.object({
        name: z.string().min(1, 'attachments.nameRequired'),
        size: z.number().max(5 * 1024 * 1024, 'attachments.fileTooLarge'),
        type: z
          .string()
          .regex(
            /^(image\/(jpeg|jpg|png|gif|webp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation|zip|rar|7z)|text\/(plain|csv))$/,
            'attachments.invalidType'
          ),
        url: z.string().url('attachments.invalidUrl'),
      })
    )
    .max(5, 'attachments.maxFiles')
    .optional(),
});

// Type exports
export type EmailType = z.infer<typeof emailTypeSchema>;
export type EmailSendingData = z.infer<typeof emailSendingSchema>;
export type NewsletterSubscriptionData = z.infer<
  typeof newsletterSubscriptionSchema
>;
export type UnsubscribeTokenData = z.infer<typeof unsubscribeTokenSchema>;
export type EmailPreferencesData = z.infer<typeof emailPreferencesSchema>;
export type UnsubscribeRequestData = z.infer<typeof unsubscribeRequestSchema>;
export type SupportEmailData = z.infer<typeof supportEmailSchema>;

// Validation helper functions
export const validateEmail = (email: string) => emailSchema.safeParse(email);
export const validateEmailType = (type: string) =>
  emailTypeSchema.safeParse(type);
export const validateUnsubscribeToken = (token: string) =>
  unsubscribeTokenSchema.safeParse({ token });

// Common validation patterns
export const commonValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  name: /^[\p{L}\s\-'\.]+$/u,
  subject: /^[\p{L}\p{N}\s\-_.,!?]+$/u,
  message: /^[\s\S]*[\p{L}\p{N}][\s\S]*$/u,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;
