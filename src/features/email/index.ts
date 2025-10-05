/**
 * Email Feature - Public API
 *
 * Centralized email functionality including services, utilities, and schemas.
 * This is the main entry point for the email feature.
 */

// Services
export {
  EmailPreferencesService,
  NewsletterService,
  sendEmail,
  sendEmailWithComponent,
  SupportEmailService,
  UnsubscribeService,
} from './email-service';

// Cookie-related services moved to @/features/cookies

// Utilities
export {
  type EmailType,
  generateOneClickUnsubscribeUrl,
  generateUnsubscribeToken,
  generateUnsubscribeUrl,
  getUnsubscribeHeaders,
  type UnsubscribeTokenData,
  verifyUnsubscribeToken,
} from './unsubscribe';

export { renderEmailComponent, renderEmailToHtml } from './email-renderer';

// Schemas
export {
  type EmailPreferencesData,
  emailPreferencesSchema,
  emailSchema,
  type EmailSendingData,
  emailSendingSchema,
  type EmailType as SchemaEmailType,
  emailTypeSchema,
  type NewsletterSubscriptionData,
  newsletterSubscriptionSchema,
  type SupportEmailData,
  supportEmailSchema,
  type UnsubscribeRequestData,
  unsubscribeRequestSchema,
  type UnsubscribeTokenData as SchemaUnsubscribeTokenData,
  unsubscribeTokenSchema,
  validateEmail,
} from './schemas/email';

export {
  type UnsubscribePageState,
  unsubscribePageStateSchema,
  type UnsubscribeResponse,
  unsubscribeResponseSchema,
} from './schemas/unsubscribe';
