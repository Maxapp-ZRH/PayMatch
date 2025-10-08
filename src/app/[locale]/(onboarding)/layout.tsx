/**
 * Onboarding Layout
 *
 * Layout for onboarding pages with session timeout management.
 * Provides session timeout warnings and management for all onboarding routes.
 */

import { SessionTimeoutProvider } from '@/features/auth/components/SessionTimeoutProvider';

type Props = {
  children: React.ReactNode;
};

export default function OnboardingLayout({ children }: Props) {
  return <SessionTimeoutProvider>{children}</SessionTimeoutProvider>;
}
