/**
 * PlanIcon Component
 *
 * Shared plan icon component that displays the appropriate icon for each plan type.
 * Used in both marketing and onboarding pricing sections.
 */

import React from 'react';
import { Gift, User, Building2, Crown } from 'lucide-react';
import clsx from 'clsx';
import type { PlanName } from '@/config/plans';

interface PlanIconProps {
  planName: PlanName;
  isFeatured?: boolean;
  className?: string;
}

export function PlanIcon({
  planName,
  isFeatured = false,
  className,
}: PlanIconProps) {
  const iconProps = {
    className: clsx(
      'h-5 w-5 sm:h-6 sm:w-6 flex-none',
      isFeatured ? 'text-red-500' : 'text-gray-600',
      className
    ),
  };

  switch (planName.toLowerCase()) {
    case 'free':
      return <Gift {...iconProps} />;
    case 'freelancer':
      return <User {...iconProps} />;
    case 'business':
      return <Building2 {...iconProps} />;
    case 'enterprise':
      return <Crown {...iconProps} />;
    default:
      return <Gift {...iconProps} />;
  }
}
