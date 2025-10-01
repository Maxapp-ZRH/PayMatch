/**
 * Code Block Component
 *
 * A reusable component for displaying code snippets and technical content
 * using the Geist Mono font. This ensures consistent typography for
 * code blocks, technical illustrations, and monospace content.
 */

import clsx from 'clsx';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'inline' | 'block';
  language?: string;
}

export function CodeBlock({
  children,
  className,
  variant = 'block',
  language,
}: CodeBlockProps) {
  const baseClasses = 'font-mono text-sm';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 px-3 py-2 rounded-md',
    inline: 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm',
    block: 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto',
  };

  return (
    <code
      className={clsx(baseClasses, variantClasses[variant], className)}
      data-language={language}
    >
      {children}
    </code>
  );
}

// Inline code component for short code snippets
export function InlineCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CodeBlock variant="inline" className={className}>
      {children}
    </CodeBlock>
  );
}

// Block code component for code blocks
export function BlockCode({
  children,
  className,
  language,
}: {
  children: React.ReactNode;
  className?: string;
  language?: string;
}) {
  return (
    <CodeBlock variant="block" className={className} language={language}>
      {children}
    </CodeBlock>
  );
}
