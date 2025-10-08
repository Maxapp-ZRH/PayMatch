/**
 * Dashboard Layout
 *
 * Layout for dashboard pages with session timeout management.
 * Provides session timeout warnings and management for all dashboard routes.
 */

import { SessionTimeoutProvider } from '@/features/auth/components/SessionTimeoutProvider';

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return <SessionTimeoutProvider>{children}</SessionTimeoutProvider>;
}
