/**
 * Password Requirements Component
 *
 * Shows password requirements with real-time validation feedback.
 * Displays checkmarks for met requirements and helps users understand password rules.
 */

'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

interface Requirement {
  id: string;
  text: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    id: 'length',
    text: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    id: 'lowercase',
    text: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'uppercase',
    text: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'number',
    text: 'One number',
    test: (password) => /\d/.test(password),
  },
  {
    id: 'symbol',
    text: 'One special character',
    test: (password) => /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password),
  },
];

export function PasswordRequirements({
  password,
  className = '',
}: PasswordRequirementsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show requirements when user starts typing
    setIsVisible(password.length > 0);
  }, [password]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-gray-700">
        Password requirements:
      </p>
      <div className="space-y-1">
        {requirements.map((requirement) => {
          const isValid = requirement.test(password);
          return (
            <div
              key={requirement.id}
              className={`flex items-center space-x-2 text-sm ${
                isValid ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {isValid ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
              <span>{requirement.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
