/**
 * Toast System Exports
 *
 * Centralized exports for the entire toast system.
 * Provides easy access to all toast functionality.
 */

// Core toast functionality
export { showToast } from './toast';

// Message registry
export { TOAST_MESSAGES } from './toast-messages';
export type {
  ToastMessageKey,
  AuthMessageKey,
  StripeMessageKey,
  OnboardingMessageKey,
  GeneralMessageKey,
  ValidationMessageKey,
  LoginMessageKey,
  RegistrationMessageKey,
  EmailVerificationMessageKey,
  PasswordResetMessageKey,
  MagicLinkMessageKey,
} from './toast-messages';

// Toast service
export { ToastService } from './toast-service';
export {
  AuthToast,
  StripeToast,
  OnboardingToast,
  GeneralToast,
  ValidationToast,
  CustomToast,
} from './toast-service';

// Validation utilities
export {
  validateMessageKey,
  getMessage,
  extractMessageKeys,
  validateAllMessageKeys,
  validateInDevelopment,
} from './toast-validation';
