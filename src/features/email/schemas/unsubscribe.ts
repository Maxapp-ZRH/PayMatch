/**
 * Unsubscribe Page Validation Schemas
 *
 * Schemas for validating unsubscribe page data and API responses.
 * Includes schemas for subscriber data and unsubscribe operations.
 */

import { z } from 'zod';

// Import email type from main email schema to avoid duplication
import { emailTypeSchema } from './email';

// Subscriber data schema
export const subscriberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean(),
  emailType: emailTypeSchema,
});

// Unsubscribe response schema
export const unsubscribeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  subscriber: subscriberSchema,
  alreadyUnsubscribed: z.boolean().optional(),
  error: z.string().optional(),
});

// Unsubscribe page state schema
export const unsubscribePageStateSchema = z.object({
  subscriber: subscriberSchema.nullable(),
  isLoading: z.boolean(),
  isUnsubscribing: z.boolean(),
  isUnsubscribed: z.boolean(),
  error: z.string().nullable(),
  emailType: emailTypeSchema,
});

// URL parameter schemas
export const unsubscribeUrlParamsSchema = z.object({
  token: z.string().optional(),
  error: z.enum(['invalid-token', 'server-error']).optional(),
});

// Error message mapping schema
export const errorCodeSchema = z.enum([
  'invalid-token',
  'server-error',
  'network-error',
  'validation-error',
  'unknown-error',
]);

// Type exports
export type SubscriberData = z.infer<typeof subscriberSchema>;
export type UnsubscribeResponse = z.infer<typeof unsubscribeResponseSchema>;
export type UnsubscribePageState = z.infer<typeof unsubscribePageStateSchema>;
export type UnsubscribeUrlParams = z.infer<typeof unsubscribeUrlParamsSchema>;
export type ErrorCode = z.infer<typeof errorCodeSchema>;

// Validation helper functions
export const validateSubscriber = (data: unknown) =>
  subscriberSchema.safeParse(data);
export const validateUnsubscribeResponse = (data: unknown) =>
  unsubscribeResponseSchema.safeParse(data);
export const validateUrlParams = (params: Record<string, string | undefined>) =>
  unsubscribeUrlParamsSchema.safeParse(params);

// Error message mapping
export const getErrorMessage = (errorCode: ErrorCode): string => {
  const errorMessages: Record<ErrorCode, string> = {
    'invalid-token':
      'Invalid or expired unsubscribe link. Please request a new one.',
    'server-error': 'Server error occurred. Please try again later.',
    'network-error':
      'Network error occurred. Please check your connection and try again.',
    'validation-error':
      'Invalid data provided. Please check your input and try again.',
    'unknown-error': 'An unexpected error occurred. Please try again later.',
  };

  return errorMessages[errorCode] || errorMessages['unknown-error'];
};

// Email type display names
export const getEmailTypeDisplayName = (type: string): string => {
  const displayNames: Record<string, string> = {
    newsletter: 'PayMatch Newsletter',
    support: 'Support Emails',
    transactional: 'Transactional Emails',
  };

  return displayNames[type] || 'Email Updates';
};
