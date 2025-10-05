import clsx from 'clsx';

const formClasses =
  'block w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-hidden focus:ring-cyan-500 sm:py-[calc(--spacing(2)-1px)] sm:px-[calc(--spacing(3)-1px)]';

// Counter for generating stable IDs
let fieldIdCounter = 0;

function generateStableId(prefix: string = 'field'): string {
  return `${prefix}-${++fieldIdCounter}`;
}

function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-semibold text-gray-900"
    >
      {children}
    </label>
  );
}

export function TextField({
  label,
  type = 'text',
  className,
  name,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> & { label?: string }) {
  // Use name prop for stable ID generation, fallback to counter
  const id = name ? `text-field-${name}` : generateStableId('text-field');

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input
        id={id}
        type={type}
        name={name}
        {...props}
        className={clsx(
          formClasses,
          'className' in props ? (props.className as string) : undefined
        )}
      />
    </div>
  );
}

export function SelectField({
  label,
  className,
  name,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'select'>, 'id'> & { label?: string }) {
  // Use name prop for stable ID generation, fallback to counter
  const id = name ? `select-field-${name}` : generateStableId('select-field');

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select
        id={id}
        name={name}
        {...props}
        className={clsx(formClasses, 'pr-8')}
      />
    </div>
  );
}
