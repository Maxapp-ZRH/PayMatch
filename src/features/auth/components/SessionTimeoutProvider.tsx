/**
 * Session Timeout Provider
 *
 * Provides session timeout functionality for client-side components.
 * Monitors session activity and shows warnings when sessions are about to expire.
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';

interface SessionTimeoutContextType {
  hasWarning: boolean;
  timeRemaining: number;
  extendSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType | null>(
  null
);

export function useSessionTimeout() {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error(
      'useSessionTimeout must be used within a SessionTimeoutProvider'
    );
  }
  return context;
}

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
  warningTime?: number; // Time in milliseconds before session expires
}

export function SessionTimeoutProvider({
  children,
  warningTime = 5 * 60 * 1000, // 5 minutes default
}: SessionTimeoutProviderProps) {
  const [hasWarning, setHasWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [, setIsExtending] = useState(false);
  const [, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = '/login?reason=session_expired';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/login?reason=session_expired';
    } finally {
      setIsLoggingOut(false);
    }
  }, [supabase.auth]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkSessionWarning = () => {
      // Check if we have a session warning header from middleware
      const hasWarningHeader = document.querySelector(
        'meta[name="session-warning"]'
      );
      if (hasWarningHeader) {
        setHasWarning(true);
        setTimeRemaining(warningTime);
      }
    };

    // Check for session warning on mount
    checkSessionWarning();

    // Listen for session warning events
    const handleSessionWarning = (event: CustomEvent) => {
      setHasWarning(true);
      setTimeRemaining(event.detail.timeRemaining || warningTime);
    };

    window.addEventListener(
      'session-warning',
      handleSessionWarning as EventListener
    );

    // Set up countdown timer
    if (hasWarning) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            // Session expired, force logout
            handleLogout();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener(
        'session-warning',
        handleSessionWarning as EventListener
      );
    };
  }, [hasWarning, warningTime, handleLogout]);

  const extendSession = async () => {
    setIsExtending(true);
    try {
      // Refresh the page to update session activity
      window.location.reload();
    } catch (error) {
      console.error('Failed to extend session:', error);
      // If extending fails, logout
      handleLogout();
    } finally {
      setIsExtending(false);
    }
  };

  const contextValue: SessionTimeoutContextType = {
    hasWarning,
    timeRemaining,
    extendSession,
    logout: handleLogout,
  };

  return (
    <SessionTimeoutContext.Provider value={contextValue}>
      {children}
      {hasWarning && (
        <SessionTimeoutWarning
          warningTime={warningTime}
          onExtendSession={extendSession}
          onLogout={handleLogout}
        />
      )}
    </SessionTimeoutContext.Provider>
  );
}
