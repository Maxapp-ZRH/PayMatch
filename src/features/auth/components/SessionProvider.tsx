/**
 * Session Provider Component
 *
 * Provides unified session management for client-side components.
 * Can be used in layouts to provide session context to all child components.
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, type UseSessionReturn } from '../hooks/use-session';

// Create session context
const SessionContext = createContext<UseSessionReturn | null>(null);

interface SessionProviderProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
  requireOnboarding?: boolean;
  requireOrganization?: boolean;
}

/**
 * Session provider component
 * @param children - Child components
 * @param requireEmailVerification - Require email verification
 * @param requireOnboarding - Require onboarding completion
 * @param requireOrganization - Require organization membership
 */
export function SessionProvider({
  children,
  requireEmailVerification = false,
  requireOnboarding = false,
  requireOrganization = false,
}: SessionProviderProps) {
  const session = useSession({
    requireEmailVerification,
    requireOnboarding,
    requireOrganization,
  });

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Hook to use session context
 * @returns Session state and functions
 */
export function useSessionContext(): UseSessionReturn {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }

  return context;
}

/**
 * Hook for authenticated session context
 * @returns Session state with authentication requirements
 */
export function useAuthenticatedSessionContext(): UseSessionReturn {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      'useAuthenticatedSessionContext must be used within a SessionProvider'
    );
  }

  if (!context.isAuthenticated) {
    throw new Error('User must be authenticated to use this hook');
  }

  return context;
}
