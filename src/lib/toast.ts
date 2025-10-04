/**
 * Toast Utility Functions
 *
 * Standardized toast notifications for consistent UX across the application.
 * Provides success, error, warning, and info toasts with proper styling.
 */

import { toast } from 'sonner';

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
};

/**
 * Auth-specific toast messages with helpful actions
 */
export const authToasts = {
  // Registration
  registrationSuccess: (email: string) => {
    showToast.success(
      'Account created successfully!',
      `We've sent a verification link to ${email}`
    );
  },

  registrationError: (error: string) => {
    if (
      error.includes('already registered') ||
      error.includes('User already registered')
    ) {
      showToast.error(
        'Email already registered',
        'This email is already associated with an account. Try signing in instead.'
      );
    } else if (error.includes('Invalid email')) {
      showToast.error(
        'Invalid email address',
        'Please enter a valid email address.'
      );
    } else if (error.includes('Password should be at least')) {
      showToast.error(
        'Password too short',
        'Password must be at least 8 characters long.'
      );
    } else {
      showToast.error('Registration failed', error);
    }
  },

  // Login
  loginSuccess: () => {
    showToast.success('Welcome back!', 'You have been signed in successfully.');
  },

  loginError: (error: string) => {
    if (error.includes('Invalid login credentials')) {
      showToast.error(
        'Invalid credentials',
        'Please check your email and password and try again.'
      );
    } else {
      showToast.error('Sign in failed', error);
    }
  },

  // Email verification
  verificationSent: (email: string) => {
    showToast.success(
      'Verification email sent!',
      `Check your inbox at ${email} for the verification link.`
    );
  },

  verificationError: (error: string) => {
    showToast.error('Failed to send verification email', error);
  },

  // Password reset
  passwordResetSent: (email: string) => {
    showToast.success(
      'Password reset email sent!',
      `Check your inbox at ${email} for reset instructions.`
    );
  },

  passwordResetError: (error: string) => {
    showToast.error('Failed to send password reset email', error);
  },

  // Rate limiting
  rateLimitExceeded: (action: string, retryAfter?: number) => {
    const retryMessage = retryAfter
      ? ` Please wait ${retryAfter} minutes.`
      : '';
    showToast.warning(
      'Too many attempts',
      `You've exceeded the limit for ${action}.${retryMessage}`
    );
  },

  // Generic toast methods for consistency
  success: (message: string, description?: string) => {
    showToast.success(message, description);
  },

  error: (message: string, description?: string) => {
    showToast.error(message, description);
  },

  warning: (message: string, description?: string) => {
    showToast.warning(message, description);
  },

  info: (message: string, description?: string) => {
    showToast.info(message, description);
  },
};
