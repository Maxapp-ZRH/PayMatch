/**
 * Cookies Feature - Public API
 *
 * Centralized cookie and consent management functionality.
 * This is the main entry point for the cookies feature.
 */

// Services (client-safe)
export { CookieEmailIntegrationService } from './services/cookie-email-integration';

// Client-side service (for browser components)
export { ConsentServiceClient } from './services/consent-service-client';

// Components
export { default as CookieBanner } from './components/CookieBanner';
export { CookieConsentModal } from './components/CookieConsentModal';

// Types
export type {
  CookiePreferences,
  ConsentType,
  ConsentMethod,
  ConsentRecord,
  ConsentStatus,
  ConsentRenewalInfo,
  ConsentProof,
} from './types/cookie-types';
