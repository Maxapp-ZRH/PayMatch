/**
 * Saving Status Badge Component
 *
 * Compact badge that shows saving status in the header.
 * Prevents layout shifts by maintaining consistent dimensions.
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';

interface SavingStatusBadgeProps {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  className?: string;
}

export function SavingStatusBadge({
  isSaving,
  lastSaved,
  saveError,
  className = '',
}: SavingStatusBadgeProps) {
  // Don't show anything if no activity
  if (!isSaving && !lastSaved && !saveError) {
    return <div className={`w-20 h-6 ${className}`} />; // Maintain space to prevent layout shift
  }

  return (
    <div className={`flex items-center ${className}`}>
      <AnimatePresence mode="wait">
        {isSaving && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1.5 text-sm text-red-600"
          >
            <Save className="w-4 h-4 animate-pulse" />
            <span className="font-medium">Saving...</span>
          </motion.div>
        )}

        {!isSaving && lastSaved && !saveError && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1.5 text-sm text-green-600"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Saved</span>
          </motion.div>
        )}

        {!isSaving && saveError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1.5 text-sm text-red-600"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Save failed</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
