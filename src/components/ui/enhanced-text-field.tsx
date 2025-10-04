/**
 * Enhanced Text Field Component
 *
 * Text input with mandatory field indicators and improved styling.
 */

'use client';

import { useId } from 'react';
import clsx from 'clsx';

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

interface EnhancedTextFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function EnhancedTextField({
  label,
  required = false,
  error,
  className,
  ...props
}: EnhancedTextFieldProps) {
  const id = useId();

  return (
    <div className={className}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <input
        id={id}
        {...props}
        className={clsx(
          formClasses,
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
