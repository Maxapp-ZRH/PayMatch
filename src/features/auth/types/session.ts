/**
 * Unified Session Management Types
 *
 * Type definitions for unified session management across the application.
 * Uses database types from the generated Supabase schema.
 */

import type { Database } from '@/types/database';
import type { User, Session } from '@supabase/supabase-js';

// Database types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationUser =
  Database['public']['Tables']['organization_users']['Row'];

// Extended user with profile and organization data
export interface ExtendedUser extends User {
  profile?: UserProfile | null;
  organization?: Organization | null;
  organizationMembership?: OrganizationUser | null;
}

// Session state types
export interface SessionState {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  hasCompletedOnboarding: boolean;
  hasOrganization: boolean;
}

// Session hook return type
export interface UseSessionReturn extends SessionState {
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Server session result type
export interface ServerSessionResult {
  user: ExtendedUser | null;
  session: Session | null;
  error: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  hasCompletedOnboarding: boolean;
  hasOrganization: boolean;
  organization?: Organization | null;
  organizationMembership?: OrganizationUser | null;
}

// Session validation options
export interface SessionValidationOptions {
  requireEmailVerification?: boolean;
  requireOnboarding?: boolean;
  requireOrganization?: boolean;
  redirectTo?: string;
}

// Session error types
export type SessionError =
  | 'UNAUTHENTICATED'
  | 'EMAIL_NOT_VERIFIED'
  | 'ONBOARDING_INCOMPLETE'
  | 'NO_ORGANIZATION'
  | 'SESSION_EXPIRED'
  | 'INVALID_SESSION'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface SessionErrorDetails {
  type: SessionError;
  message: string;
  redirectTo?: string;
}
