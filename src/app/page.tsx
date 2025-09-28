/**
 * Root Page
 *
 * Redirects users to the default locale when accessing the root path.
 */

import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function RootPage() {
  // Redirect to the default locale
  redirect(`/${routing.defaultLocale}`);
}
