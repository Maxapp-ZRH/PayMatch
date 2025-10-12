/**
 * Dashboard Layout
 *
 * Layout for dashboard pages with unified session management.
 * Provides session context for all dashboard routes.
 */

import { SessionProvider } from '@/features/auth/components/SessionProvider';

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <SessionProvider
      requireEmailVerification={true}
      requireOnboarding={true}
      requireOrganization={true}
    >
      {children}
    </SessionProvider>
  );
}
