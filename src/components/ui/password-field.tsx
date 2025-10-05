/**
 * Password Field Component
 *
 * Reusable password input with show/hide toggle functionality.
 * Includes password requirements display and validation.
 */

'use client';

import { useState } from 'react';
import { useId } from 'react';
import clsx from 'clsx';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const formClasses =
  'block w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-hidden focus:ring-cyan-500 sm:py-[calc(--spacing(2)-1px)] sm:px-[calc(--spacing(3)-1px)]';

function Label({
  id,
  children,
  required,
}: {
  id: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-semibold text-gray-900"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

interface PasswordFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type' | 'id'> {
  label?: string;
  required?: boolean;
  showRequirements?: boolean;
  value?: string;
  error?: string;
}

export function PasswordField({
  label,
  required = false,
  showRequirements = false,
  value = '',
  error,
  className,
  ...props
}: PasswordFieldProps) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  // Password requirements validation
  const requirements = {
    minLength: value.length >= 8,
    hasUppercase: /[A-Z]/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasNumber: /\d/.test(value),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
  };

  // const allRequirementsMet = Object.values(requirements).every(Boolean);

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    const strengthLevels = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-red-400' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-yellow-400' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-green-600' },
    ];

    return strengthLevels[Math.min(score, 5)];
  };

  const strength = getPasswordStrength(value);

  return (
    <div className={className}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          {...props}
          className={clsx(
            formClasses,
            'pr-10', // Add padding for the eye icon
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Show hint when user starts typing but requirements not yet visible */}
      {showRequirements && value.length > 0 && value.length < 3 && (
        <p className="mt-2 text-sm text-gray-500">
          Keep typing to see password requirements...
        </p>
      )}

      {showRequirements && value.length > 0 && (
        <div className="mt-3">
          {/* Password Strength Indicator */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Password Strength
              </span>
              <span
                className={`text-sm font-medium ${
                  strength.score <= 2
                    ? 'text-red-600'
                    : strength.score <= 3
                      ? 'text-yellow-600'
                      : 'text-green-600'
                }`}
              >
                {strength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${(strength.score / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </p>
            <ul className="text-sm space-y-1">
              <li
                className={`flex items-center ${
                  requirements.minLength ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="mr-2">
                  {requirements.minLength ? '✓' : '○'}
                </span>
                At least 8 characters
              </li>
              <li
                className={`flex items-center ${
                  requirements.hasUppercase ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="mr-2">
                  {requirements.hasUppercase ? '✓' : '○'}
                </span>
                One uppercase letter
              </li>
              <li
                className={`flex items-center ${
                  requirements.hasLowercase ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="mr-2">
                  {requirements.hasLowercase ? '✓' : '○'}
                </span>
                One lowercase letter
              </li>
              <li
                className={`flex items-center ${
                  requirements.hasNumber ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="mr-2">
                  {requirements.hasNumber ? '✓' : '○'}
                </span>
                One number
              </li>
              <li
                className={`flex items-center ${
                  requirements.hasSpecialChar
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                <span className="mr-2">
                  {requirements.hasSpecialChar ? '✓' : '○'}
                </span>
                One special character
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
