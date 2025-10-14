/**
 * Centralized Toast Message Registry
 *
 * All toast messages used across the application are defined here.
 * This provides a single source of truth for all user-facing messages.
 */

export const TOAST_MESSAGES = {
  auth: {
    login: {
      success: 'Successfully logged in!',
      invalidCredentials: 'Invalid email or password. Please try again.',
      emailNotConfirmed: 'Please verify your email address before signing in.',
      rateLimited:
        'Too many attempts. Please wait a moment before trying again.',
      sessionExpired: 'Your session has expired. Please sign in again.',
      networkError:
        'Network error. Please check your connection and try again.',
      unexpectedError:
        'An unexpected error occurred during login. Please try again.',
    },
    registration: {
      success:
        'Registration successful! Please check your email to verify your account.',
      emailExists: 'An account with this email already exists.',
      failed: 'Registration failed. Please try again.',
      pendingRegistration:
        'You already have a pending registration. Please check your email.',
      unexpectedError:
        'An unexpected error occurred during registration. Please try again.',
    },
    emailVerification: {
      success: 'Email verified successfully! Redirecting to onboarding...',
      successWithRedirect:
        "Email verified successfully! You're now signed in and will be redirected to complete your setup.",
      resendSuccess: 'Verification email sent!',
      resendFailed:
        'Failed to send verification email. Please try again later.',
      emailRequired: 'Please enter your email address to resend verification.',
      unexpectedError: 'An unexpected error occurred. Please try again.',
    },
    passwordReset: {
      requestSuccess:
        'Password reset email sent! Check your email for instructions.',
      requestFailed: 'Failed to send password reset email. Please try again.',
      resetSuccess:
        'Password updated successfully! You can now sign in with your new password.',
      resetFailed:
        'Password reset failed. An unexpected error occurred. Please try again.',
      invalidToken:
        'Invalid or expired reset link. Please request a new password reset.',
      noToken: 'No reset token found. Please request a new password reset.',
      completed:
        'Password reset completed! Your password has been changed in another tab. Redirecting to login...',
    },
    magicLink: {
      sent: 'Magic link sent! Check your email and click the link to sign in.',
      success: 'Successfully logged in with magic link! Redirecting...',
      successCrossDevice:
        'Magic link login completed! You have been successfully logged in from another device. Redirecting...',
      failed: 'Magic link login failed. Please try again.',
      unexpectedError: 'An unexpected error occurred. Please try again.',
    },
    logout: {
      success: 'Successfully logged out.',
      failed: 'Logout failed. Please try again.',
    },
  },
  stripe: {
    subscription: {
      success: 'Subscription updated successfully!',
      failed: 'Failed to update subscription. Please try again.',
      cancelled: 'Subscription cancelled successfully.',
      cancelledFailed: 'Failed to cancel subscription. Please try again.',
    },
    payment: {
      success: 'Payment processed successfully!',
      failed: 'Payment failed. Please try again.',
      methodUpdated: 'Payment method updated successfully!',
      methodUpdateFailed: 'Failed to update payment method. Please try again.',
    },
    customerPortal: {
      loading: 'Opening customer portal...',
      failed: 'Failed to open customer portal. Please try again.',
    },
  },
  onboarding: {
    profile: {
      success: 'Profile updated successfully!',
      failed: 'Failed to update profile. Please try again.',
    },
    organization: {
      success: 'Organization created successfully!',
      failed: 'Failed to create organization. Please try again.',
      updated: 'Organization updated successfully!',
      updateFailed: 'Failed to update organization. Please try again.',
    },
    plan: {
      selected: 'Plan selected successfully!',
      selectionFailed: 'Failed to select plan. Please try again.',
    },
    completed: 'Onboarding completed successfully! Welcome to PayMatch!',
  },
  general: {
    networkError: 'Network error. Please check your connection and try again.',
    unexpectedError: 'An unexpected error occurred. Please try again.',
    sessionExpired: 'Your session has expired. Please sign in again.',
    loading: 'Loading...',
    success: 'Operation completed successfully!',
    failed: 'Operation failed. Please try again.',
    saved: 'Changes saved successfully!',
    saveFailed: 'Failed to save changes. Please try again.',
    deleted: 'Item deleted successfully!',
    deleteFailed: 'Failed to delete item. Please try again.',
  },
  validation: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters long.',
    passwordMatch: 'Passwords do not match.',
    minLength: 'Must be at least {min} characters long.',
    maxLength: 'Must be no more than {max} characters long.',
    invalidFormat: 'Invalid format. Please check your input.',
  },
} as const;

// Type definitions for better type safety
export type ToastMessageKey = keyof typeof TOAST_MESSAGES;
export type AuthMessageKey = keyof typeof TOAST_MESSAGES.auth;
export type StripeMessageKey = keyof typeof TOAST_MESSAGES.stripe;
export type OnboardingMessageKey = keyof typeof TOAST_MESSAGES.onboarding;
export type GeneralMessageKey = keyof typeof TOAST_MESSAGES.general;
export type ValidationMessageKey = keyof typeof TOAST_MESSAGES.validation;

// Helper type for nested message keys
export type NestedMessageKey<T, K extends keyof T> =
  T[K] extends Record<string, unknown> ? keyof T[K] : never;

// Specific message key types
export type LoginMessageKey = NestedMessageKey<
  typeof TOAST_MESSAGES.auth,
  'login'
>;
export type RegistrationMessageKey = NestedMessageKey<
  typeof TOAST_MESSAGES.auth,
  'registration'
>;
export type EmailVerificationMessageKey = NestedMessageKey<
  typeof TOAST_MESSAGES.auth,
  'emailVerification'
>;
export type PasswordResetMessageKey = NestedMessageKey<
  typeof TOAST_MESSAGES.auth,
  'passwordReset'
>;
export type MagicLinkMessageKey = NestedMessageKey<
  typeof TOAST_MESSAGES.auth,
  'magicLink'
>;
