/**
 * Logout Button Component
 *
 * A reusable logout button that handles user logout with proper error handling.
 * Uses server actions for secure logout functionality.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/auth/server/actions/auth';
import { authToasts } from '@/lib/toast';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({
  variant = 'outline',
  size = 'md',
  className = '',
  children = 'Logout',
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await logout();

      if (result.success) {
        authToasts.success('Logged out successfully');
        router.push('/');
        router.refresh();
      } else {
        authToasts.error(result.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      authToasts.error('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    default: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
    ghost: 'text-red-700 hover:bg-red-50',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-11 px-8 text-base',
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Logging out...
        </>
      ) : (
        children
      )}
    </button>
  );
}
