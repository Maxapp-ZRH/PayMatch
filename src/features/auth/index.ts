/**
 * Auth Feature Exports
 *
 * Centralized exports for the authentication feature.
 * Provides unified access to all auth-related functionality.
 */

// Types
export type {
  SessionState,
  UseSessionReturn,
  ExtendedUser,
  ServerSessionResult,
  SessionValidationOptions,
  SessionError,
  SessionErrorDetails,
  UserProfile,
  Organization,
  OrganizationUser,
} from './types/session';

// Client-side hooks
export {
  useSession,
  useAuthenticatedSession,
  useBasicSession,
} from './hooks/use-session';

// Server-side helpers
export {
  getServerSession,
  requireServerSession,
  requireDashboardSession,
  requireOnboardingSession,
  getPublicSession,
  validateSessionRequirements,
  handleSessionError,
} from './server/helpers/session';

// Existing auth components and actions
export * from './components';
export * from './server/actions';
export * from './server/helpers';
export * from './helpers';
export * from './schemas';
