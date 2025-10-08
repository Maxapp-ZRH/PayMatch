/**
 * Session Timeout Warning Component
 *
 * Displays a warning when the user's session is about to expire.
 * Provides options to extend the session or logout gracefully.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from '@/components/ui/dialog';
import { AlertTriangle, Clock, LogOut } from 'lucide-react';

interface SessionTimeoutWarningProps {
  warningTime?: number; // Time in milliseconds before session expires
  onExtendSession?: () => Promise<void>;
  onLogout?: () => Promise<void>;
}

export function SessionTimeoutWarning({
  warningTime = 5 * 60 * 1000, // 5 minutes default
  onExtendSession,
  onLogout,
}: SessionTimeoutWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        // Default logout
        await supabase.auth.signOut();
      }
      router.push('/login?reason=session_expired');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      router.push('/login?reason=session_expired');
    } finally {
      setIsLoggingOut(false);
    }
  }, [onLogout, router, supabase.auth]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkSessionWarning = () => {
      // Check if we have a session warning header
      const hasWarning = document.querySelector('meta[name="session-warning"]');
      if (hasWarning) {
        setShowWarning(true);
        setTimeRemaining(warningTime);
      }
    };

    // Check for session warning on mount
    checkSessionWarning();

    // Listen for session warning events
    const handleSessionWarning = (event: CustomEvent) => {
      setShowWarning(true);
      setTimeRemaining(event.detail.timeRemaining || warningTime);
    };

    window.addEventListener(
      'session-warning',
      handleSessionWarning as EventListener
    );

    // Set up countdown timer
    if (showWarning) {
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
  }, [showWarning, warningTime, handleLogout]);

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      if (onExtendSession) {
        await onExtendSession();
      } else {
        // Default: refresh the page to update session activity
        window.location.reload();
      }
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
      // If extending fails, logout
      handleLogout();
    } finally {
      setIsExtending(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <Dialog open={showWarning} onClose={() => {}}>
      <DialogTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        Session Timeout Warning
      </DialogTitle>

      <DialogDescription>
        Your session will expire in{' '}
        <span className="font-mono font-semibold text-amber-600">
          {formatTime(timeRemaining)}
        </span>
        . Please extend your session to continue working.
      </DialogDescription>

      <DialogBody>
        <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <Clock className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-800">
            For security reasons, your session will automatically expire after a
            period of inactivity.
          </span>
        </div>
      </DialogBody>

      <DialogActions>
        <Button
          outline
          onClick={handleLogout}
          disabled={isExtending || isLoggingOut}
          className="w-full sm:w-auto"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
        <Button
          onClick={handleExtendSession}
          disabled={isExtending || isLoggingOut}
          className="w-full sm:w-auto"
        >
          {isExtending ? 'Extending...' : 'Extend Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Hook to check for session timeout warnings
 */
export function useSessionTimeout() {
  const [hasWarning, setHasWarning] = useState(false);

  useEffect(() => {
    const checkWarning = () => {
      // Check for session warning header
      const warningHeader = document.querySelector(
        'meta[name="session-warning"]'
      );
      setHasWarning(!!warningHeader);
    };

    // Check on mount
    checkWarning();

    // Listen for session warning events
    const handleSessionWarning = () => setHasWarning(true);
    const handleSessionExtended = () => setHasWarning(false);

    window.addEventListener('session-warning', handleSessionWarning);
    window.addEventListener('session-extended', handleSessionExtended);

    return () => {
      window.removeEventListener('session-warning', handleSessionWarning);
      window.removeEventListener('session-extended', handleSessionExtended);
    };
  }, []);

  return { hasWarning };
}
