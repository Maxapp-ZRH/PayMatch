/**
 * Support Form Validation Schema
 *
 * Zod schema for validating support form submissions including
 * contact information, issue category, priority, and message content.
 */

import { z } from 'zod';

export const supportFormSchema = z.object({
  name: z
    .string()
    .min(2, 'name.minLength')
    .max(100, 'name.maxLength')
    .regex(/^[\p{L}\s\-'\.]+$/u, 'name.invalidChars'),

  email: z.string().email('email.invalid').max(255, 'email.maxLength'),

  company: z
    .string()
    .max(100, 'company.maxLength')
    .optional()
    .or(z.literal('')),

  category: z.enum(
    [
      'general',
      'technical',
      'billing',
      'feature-request',
      'bug-report',
      'account',
      'integration',
      'other',
    ],
    {
      errorMap: () => ({ message: 'category.invalid' }),
    }
  ),

  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'priority.invalid' }),
  }),

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

  attachments: z
    .array(
      z.object({
        name: z.string().min(1, 'attachments.nameRequired'),
        size: z.number().max(5 * 1024 * 1024, 'attachments.fileTooLarge'), // 5MB max
        type: z
          .string()
          .regex(
            /^(image\/(jpeg|jpg|png|gif|webp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation|zip|rar|7z)|text\/(plain|csv))$/,
            'attachments.invalidType'
          ),
        url: z.string().url('attachments.invalidUrl'),
      })
    )
    .max(5, 'attachments.maxFiles'),

  consent: z.boolean().refine((val) => val === true, {
    message: 'consent.required',
  }),
});

export type SupportFormData = z.infer<typeof supportFormSchema>;

// Category options for the form
export const supportCategories = [
  {
    value: 'general',
    label: 'General Inquiry',
    description: 'General questions about PayMatch',
  },
  {
    value: 'technical',
    label: 'Technical Support',
    description: 'Technical issues or problems',
  },
  {
    value: 'billing',
    label: 'Billing & Payments',
    description: 'Questions about pricing or payments',
  },
  {
    value: 'feature-request',
    label: 'Feature Request',
    description: 'Suggest a new feature or improvement',
  },
  {
    value: 'bug-report',
    label: 'Bug Report',
    description: 'Report a bug or unexpected behavior',
  },
  {
    value: 'account',
    label: 'Account Issues',
    description: 'Account access or management problems',
  },
  {
    value: 'integration',
    label: 'Integration Help',
    description: 'Help with third-party integrations',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Something else not listed above',
  },
] as const;

// Priority options for the form
export const supportPriorities = [
  {
    value: 'low',
    label: 'Low',
    description: 'General question, no rush',
    color: 'text-green-600',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Important but not urgent',
    color: 'text-yellow-600',
  },
  {
    value: 'high',
    label: 'High',
    description: 'Urgent issue affecting work',
    color: 'text-orange-600',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Critical issue, immediate attention needed',
    color: 'text-red-600',
  },
] as const;
