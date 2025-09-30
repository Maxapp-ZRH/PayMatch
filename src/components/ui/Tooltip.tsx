/**
 * Tooltip Component
 *
 * A reusable tooltip component for displaying validation errors and helpful hints.
 * Supports keyboard navigation and accessibility features.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  variant = 'error',
  disabled = false,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = isVisible || isFocused;

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setIsFocused(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTooltip]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
        setIsFocused(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showTooltip]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return 'bg-red-600 text-white border-red-700';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'info':
        return 'bg-blue-600 text-white border-blue-700';
      case 'success':
        return 'bg-green-600 text-white border-green-700';
      default:
        return 'bg-gray-800 text-white border-gray-900';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 border-t-4 border-x-transparent border-x-4';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800 border-b-4 border-x-transparent border-x-4';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800 border-l-4 border-y-transparent border-y-4';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800 border-r-4 border-y-transparent border-y-4';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 border-t-4 border-x-transparent border-x-4';
    }
  };

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="inline-block"
      >
        {children}
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-lg border max-w-xs ${getVariantStyles()} ${getPositionStyles()} ${className}`}
            role="tooltip"
            aria-live="polite"
          >
            {content}
            <div className={`absolute w-0 h-0 ${getArrowStyles()}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip;
