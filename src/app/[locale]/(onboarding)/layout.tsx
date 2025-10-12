/**
 * Onboarding Layout
 *
 * Layout for onboarding pages with unified session management.
 * Provides session context for all onboarding routes.
 */

import { SessionProvider } from '@/features/auth/components/SessionProvider';

type Props = {
  children: React.ReactNode;
};

export default function OnboardingLayout({ children }: Props) {
  return (
    <SessionProvider requireEmailVerification={true} requireOrganization={true}>
      {children}
    </SessionProvider>
  );
}
