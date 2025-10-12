/**
 * Email Services Index
 *
 * Centralized exports for all email-related services.
 * Provides clean imports for email functionality across the application.
 */

// Core email services
export { EmailPreferencesService, UnsubscribeService } from '../email-service';
export { sendEmailWithComponent } from '../email-service';

// Integration services
export { OnboardingEmailIntegrationService } from './onboarding-integration';
export { CookieEmailIntegrationService } from './cookie-integration';
export {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from './auth-integration';

// Server-side services
export {
  syncEmailPreferences,
  getCurrentPreferences,
  validateCompliance,
} from './onboarding-integration-server';
export {
  subscribeToEmailType,
  unsubscribeFromEmailType,
  getEmailPreferences,
} from './email-preferences-server';

// Types
export type { OnboardingEmailSettings } from './onboarding-integration';
