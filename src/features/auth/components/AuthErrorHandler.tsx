/**
 * Auth Error Handler Component
 *
 * Client-side component that handles authentication errors globally.
 * Should be placed in the root layout to catch auth errors across the app.
 */

'use client';

import { useAuthErrorHandler } from '@/hooks/use-auth-error-handler';

interface AuthErrorHandlerProps {
  children: React.ReactNode;
}

export function AuthErrorHandler({ children }: AuthErrorHandlerProps) {
  // Handle auth errors globally
  useAuthErrorHandler();

  return <>{children}</>;
}
