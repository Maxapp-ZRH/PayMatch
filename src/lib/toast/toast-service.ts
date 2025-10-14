/**
 * Typed Toast Service
 *
 * Provides a centralized, type-safe interface for showing toast messages.
 * All toast messages are categorized and typed for better developer experience.
 */

import { showToast } from './toast';
import { TOAST_MESSAGES } from './toast-messages';
// import { validateMessageKey, getMessage } from './toast-validation'; // TODO: Use for future validation

export class ToastService {
  /**
   * Authentication-related toast messages
   */
  static auth = {
    login: {
      success: () => showToast.success(TOAST_MESSAGES.auth.login.success),
      invalidCredentials: () =>
        showToast.error(TOAST_MESSAGES.auth.login.invalidCredentials),
      emailNotConfirmed: () =>
        showToast.error(TOAST_MESSAGES.auth.login.emailNotConfirmed),
      rateLimited: () =>
        showToast.warning(TOAST_MESSAGES.auth.login.rateLimited),
      sessionExpired: () =>
        showToast.warning(TOAST_MESSAGES.auth.login.sessionExpired),
      networkError: () =>
        showToast.error(TOAST_MESSAGES.auth.login.networkError),
      unexpectedError: () =>
        showToast.error(TOAST_MESSAGES.auth.login.unexpectedError),
    },

    registration: {
      success: () =>
        showToast.success(TOAST_MESSAGES.auth.registration.success),
      emailExists: () =>
        showToast.error(TOAST_MESSAGES.auth.registration.emailExists),
      failed: () => showToast.error(TOAST_MESSAGES.auth.registration.failed),
      pendingRegistration: () =>
        showToast.info(TOAST_MESSAGES.auth.registration.pendingRegistration),
      unexpectedError: () =>
        showToast.error(TOAST_MESSAGES.auth.registration.unexpectedError),
    },

    emailVerification: {
      success: () =>
        showToast.success(TOAST_MESSAGES.auth.emailVerification.success),
      successWithRedirect: () =>
        showToast.success(
          TOAST_MESSAGES.auth.emailVerification.successWithRedirect
        ),
      resendSuccess: () =>
        showToast.success(TOAST_MESSAGES.auth.emailVerification.resendSuccess),
      resendFailed: () =>
        showToast.error(TOAST_MESSAGES.auth.emailVerification.resendFailed),
      emailRequired: () =>
        showToast.error(TOAST_MESSAGES.auth.emailVerification.emailRequired),
      unexpectedError: () =>
        showToast.error(TOAST_MESSAGES.auth.emailVerification.unexpectedError),
    },

    passwordReset: {
      requestSuccess: () =>
        showToast.success(TOAST_MESSAGES.auth.passwordReset.requestSuccess),
      requestFailed: () =>
        showToast.error(TOAST_MESSAGES.auth.passwordReset.requestFailed),
      resetSuccess: () =>
        showToast.success(TOAST_MESSAGES.auth.passwordReset.resetSuccess),
      resetFailed: () =>
        showToast.error(TOAST_MESSAGES.auth.passwordReset.resetFailed),
      invalidToken: () =>
        showToast.error(TOAST_MESSAGES.auth.passwordReset.invalidToken),
      noToken: () => showToast.error(TOAST_MESSAGES.auth.passwordReset.noToken),
      completed: () =>
        showToast.success(TOAST_MESSAGES.auth.passwordReset.completed),
    },

    magicLink: {
      sent: () => showToast.success(TOAST_MESSAGES.auth.magicLink.sent),
      success: () => showToast.success(TOAST_MESSAGES.auth.magicLink.success),
      successCrossDevice: () =>
        showToast.success(TOAST_MESSAGES.auth.magicLink.successCrossDevice),
      failed: () => showToast.error(TOAST_MESSAGES.auth.magicLink.failed),
      unexpectedError: () =>
        showToast.error(TOAST_MESSAGES.auth.magicLink.unexpectedError),
    },

    logout: {
      success: () => showToast.success(TOAST_MESSAGES.auth.logout.success),
      failed: () => showToast.error(TOAST_MESSAGES.auth.logout.failed),
    },
  };

  /**
   * Stripe-related toast messages
   */
  static stripe = {
    subscription: {
      success: () =>
        showToast.success(TOAST_MESSAGES.stripe.subscription.success),
      failed: () => showToast.error(TOAST_MESSAGES.stripe.subscription.failed),
      cancelled: () =>
        showToast.success(TOAST_MESSAGES.stripe.subscription.cancelled),
      cancelledFailed: () =>
        showToast.error(TOAST_MESSAGES.stripe.subscription.cancelledFailed),
    },

    payment: {
      success: () => showToast.success(TOAST_MESSAGES.stripe.payment.success),
      failed: () => showToast.error(TOAST_MESSAGES.stripe.payment.failed),
      methodUpdated: () =>
        showToast.success(TOAST_MESSAGES.stripe.payment.methodUpdated),
      methodUpdateFailed: () =>
        showToast.error(TOAST_MESSAGES.stripe.payment.methodUpdateFailed),
    },

    customerPortal: {
      loading: () =>
        showToast.loading(TOAST_MESSAGES.stripe.customerPortal.loading),
      failed: () =>
        showToast.error(TOAST_MESSAGES.stripe.customerPortal.failed),
    },
  };

  /**
   * Onboarding-related toast messages
   */
  static onboarding = {
    profile: {
      success: () =>
        showToast.success(TOAST_MESSAGES.onboarding.profile.success),
      failed: () => showToast.error(TOAST_MESSAGES.onboarding.profile.failed),
    },

    organization: {
      success: () =>
        showToast.success(TOAST_MESSAGES.onboarding.organization.success),
      failed: () =>
        showToast.error(TOAST_MESSAGES.onboarding.organization.failed),
      updated: () =>
        showToast.success(TOAST_MESSAGES.onboarding.organization.updated),
      updateFailed: () =>
        showToast.error(TOAST_MESSAGES.onboarding.organization.updateFailed),
    },

    plan: {
      selected: () =>
        showToast.success(TOAST_MESSAGES.onboarding.plan.selected),
      selectionFailed: () =>
        showToast.error(TOAST_MESSAGES.onboarding.plan.selectionFailed),
    },

    completed: () => showToast.success(TOAST_MESSAGES.onboarding.completed),
  };

  /**
   * General-purpose toast messages
   */
  static general = {
    networkError: () => showToast.error(TOAST_MESSAGES.general.networkError),
    unexpectedError: () =>
      showToast.error(TOAST_MESSAGES.general.unexpectedError),
    sessionExpired: () =>
      showToast.warning(TOAST_MESSAGES.general.sessionExpired),
    loading: () => showToast.loading(TOAST_MESSAGES.general.loading),
    success: () => showToast.success(TOAST_MESSAGES.general.success),
    failed: () => showToast.error(TOAST_MESSAGES.general.failed),
    saved: () => showToast.success(TOAST_MESSAGES.general.saved),
    saveFailed: () => showToast.error(TOAST_MESSAGES.general.saveFailed),
    deleted: () => showToast.success(TOAST_MESSAGES.general.deleted),
    deleteFailed: () => showToast.error(TOAST_MESSAGES.general.deleteFailed),
  };

  /**
   * Validation-related toast messages
   */
  static validation = {
    required: () => showToast.error(TOAST_MESSAGES.validation.required),
    email: () => showToast.error(TOAST_MESSAGES.validation.email),
    password: () => showToast.error(TOAST_MESSAGES.validation.password),
    passwordMatch: () =>
      showToast.error(TOAST_MESSAGES.validation.passwordMatch),
    minLength: (min: number) =>
      showToast.error(
        TOAST_MESSAGES.validation.minLength.replace('{min}', min.toString())
      ),
    maxLength: (max: number) =>
      showToast.error(
        TOAST_MESSAGES.validation.maxLength.replace('{max}', max.toString())
      ),
    invalidFormat: () =>
      showToast.error(TOAST_MESSAGES.validation.invalidFormat),
  };

  /**
   * Custom toast with dynamic content
   */
  static custom = {
    success: (message: string, description?: string) =>
      showToast.success(message, description),
    error: (message: string, description?: string) =>
      showToast.error(message, description),
    warning: (message: string, description?: string) =>
      showToast.warning(message, description),
    info: (message: string, description?: string) =>
      showToast.info(message, description),
    loading: (message: string) => showToast.loading(message),
  };
}

// Export individual services for easier imports
export const AuthToast = ToastService.auth;
export const StripeToast = ToastService.stripe;
export const OnboardingToast = ToastService.onboarding;
export const GeneralToast = ToastService.general;
export const ValidationToast = ToastService.validation;
export const CustomToast = ToastService.custom;
