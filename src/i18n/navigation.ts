/**
 * Internationalization Navigation APIs
 *
 * Provides type-safe navigation wrappers around Next.js navigation APIs
 * that automatically handle locale routing and pathname localization.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Create navigation APIs with routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

// Re-export routing for convenience
export { routing } from './routing';
export type { Locale } from './routing';
