/**
 * FeatureIcon Component
 *
 * Shared feature icon component for displaying checkmarks, crosses, or text values
 * in feature comparison tables. Used in both marketing and onboarding components.
 */

import React from 'react';
import { CheckIcon } from './CheckIcon';
import type { FeatureIconProps } from '@/lib/pricing';

export function FeatureIcon({
  value,
  className = 'w-4 h-4',
  textColor = 'text-gray-700',
}: FeatureIconProps) {
  if (value === 'check') {
    return (
      <CheckIcon className={`h-4 w-4 text-green-600 ${className || ''}`} />
    );
  }

  if (value === 'cross') {
    return (
      <svg
        className={`h-4 w-4 text-red-600 ${className || ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  }

  return <span className={textColor}>{value}</span>;
}
