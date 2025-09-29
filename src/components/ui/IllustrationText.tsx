/**
 * Illustration Text Component
 *
 * A component for text that should appear in illustrations, diagrams,
 * or technical visualizations using the Geist Mono font. This ensures
 * consistent typography for technical content that needs monospace styling.
 */

import clsx from 'clsx';

interface IllustrationTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'accent' | 'white';
}

export function IllustrationText({
  children,
  className,
  size = 'base',
  weight = 'normal',
  color = 'default',
}: IllustrationTextProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    accent: 'text-red-500',
    white: 'text-white',
  };

  return (
    <span
      className={clsx(
        'font-mono', // Use Geist Mono for illustrations
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  );
}

// Pre-configured variants for common illustration use cases
export function CodeLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <IllustrationText
      size="sm"
      weight="medium"
      color="muted"
      className={className}
    >
      {children}
    </IllustrationText>
  );
}

export function TechnicalValue({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <IllustrationText
      size="base"
      weight="semibold"
      color="default"
      className={className}
    >
      {children}
    </IllustrationText>
  );
}

export function DiagramText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <IllustrationText
      size="sm"
      weight="normal"
      color="accent"
      className={className}
    >
      {children}
    </IllustrationText>
  );
}
