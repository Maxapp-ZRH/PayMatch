/**
 * Login Schema
 *
 * Validation schema for user login form.
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

// Server-side validation schema for additional checks
export const loginServerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  // Add server-side specific validations
  userExists: z.boolean().optional(),
  hasPendingRegistration: z.boolean().optional(),
  isEmailConfirmed: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
