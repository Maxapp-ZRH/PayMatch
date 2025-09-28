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
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
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
      errorMap: () => ({ message: 'Please select a valid category' }),
    }
  ),

  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Please select a valid priority level' }),
  }),

  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, 'Subject contains invalid characters'),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .regex(
      /^[\s\S]*[a-zA-Z0-9][\s\S]*$/,
      'Message must contain at least one alphanumeric character'
    ),

  attachments: z.array(z.string()).max(5, 'Maximum 5 attachments allowed'),

  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to our privacy policy to submit this form',
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
