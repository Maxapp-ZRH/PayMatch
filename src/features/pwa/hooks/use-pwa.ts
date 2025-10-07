'use client';

import { useState, useEffect, useCallback } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isServiceWorkerReady: boolean;
  installPrompt: PWAInstallPrompt | null;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isServiceWorkerReady: false,
    installPrompt: null,
  });

  // Check if app is installed
  const checkIfInstalled = useCallback(() => {
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    setState((prev) => ({ ...prev, isInstalled }));
  }, []);

  // Check if service worker is ready
  const checkServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        setState((prev) => ({ ...prev, isServiceWorkerReady: !!registration }));
      } catch (error) {
        console.error('Service worker check failed:', error);
      }
    }
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New content is available, show update notification
                setState((prev) => ({ ...prev, isServiceWorkerReady: true }));
              }
            });
          }
        });

        setState((prev) => ({ ...prev, isServiceWorkerReady: true }));
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (state.installPrompt) {
      try {
        await state.installPrompt.prompt();
        const choiceResult = await state.installPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
          setState((prev) => ({
            ...prev,
            isInstalled: true,
            installPrompt: null,
          }));
        } else {
        }
      } catch (error) {
        console.error('PWA installation failed:', error);
      }
    }
  }, [state.installPrompt]);

  // Update service worker
  const updateServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      } catch (error) {
        console.error('Service worker update failed:', error);
      }
    }
  }, []);

  // Handle online/offline status
  const handleOnlineStatus = useCallback(() => {
    setState((prev) => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  // Setup event listeners
  useEffect(() => {
    // Check initial state
    checkIfInstalled();
    checkServiceWorker();
    registerServiceWorker();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState((prev) => ({
        ...prev,
        isInstallable: true,
        installPrompt: e as unknown as PWAInstallPrompt,
      }));
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null,
      }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Cleanup
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [
    checkIfInstalled,
    checkServiceWorker,
    registerServiceWorker,
    handleOnlineStatus,
  ]);

  return {
    ...state,
    installPWA,
    updateServiceWorker,
  };
}
