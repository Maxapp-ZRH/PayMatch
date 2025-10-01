/**
 * Page Transition Wrapper
 *
 * Simple fade transition system for Next.js App Router.
 * Provides smooth fade transitions between pages without loading states.
 */

'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export function PageTransitionWrapper({
  children,
}: PageTransitionWrapperProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
