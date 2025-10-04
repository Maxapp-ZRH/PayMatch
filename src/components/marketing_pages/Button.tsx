import Link from 'next/link';
import clsx from 'clsx';

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold transition-colors',
  outline:
    'inline-flex justify-center rounded-lg border py-[calc(--spacing(2)-1px)] px-[calc(--spacing(3)-1px)] text-sm transition-colors',
};

const variantStyles = {
  solid: {
    cyan: 'relative overflow-hidden bg-red-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-red-600 active:text-white/80 before:transition-colors',
    white:
      'bg-white text-gray-900 hover:bg-white/90 active:bg-white/90 active:text-gray-900/70',
    gray: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-900 active:text-white/80',
    swiss:
      'bg-red-500 text-white hover:bg-red-600 active:bg-red-500 active:text-white/80',
  },
  outline: {
    gray: 'border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80',
    swiss:
      'border-red-500 text-red-500 hover:border-red-600 active:bg-red-50 active:text-red-600/80',
  },
};

type ButtonProps = (
  | {
      variant?: 'solid';
      color?: keyof typeof variantStyles.solid;
    }
  | {
      variant: 'outline';
      color?: keyof typeof variantStyles.outline;
    }
) &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'>
    | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & {
        href?: undefined;
        disabled?: boolean;
      })
  );

export function Button({
  className,
  disabled,
  ...props
}: ButtonProps & { disabled?: boolean }) {
  props.variant ??= 'solid';
  props.color ??= 'gray';

  className = clsx(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[props.color]
      : props.variant === 'solid'
        ? variantStyles.solid[props.color]
        : undefined,
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  return typeof props.href === 'undefined' ? (
    <button className={className} disabled={disabled} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}
