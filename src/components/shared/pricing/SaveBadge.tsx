/**
 * SaveBadge Component
 *
 * Shared save badge component for displaying annual billing discount.
 * Used in both marketing and onboarding pricing sections.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SaveBadgeProps {
  discountPercent: number;
  className?: string;
}

export function SaveBadge({ discountPercent, className }: SaveBadgeProps) {
  return (
    <motion.div
      className={`flex justify-center ${className || ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-green-800">
            Save {discountPercent}% with annual billing
          </span>
        </div>
      </div>
    </motion.div>
  );
}
