/**
 * Marketing Layout
 *
 * Layout specifically for marketing pages that includes header and footer.
 * Used for the main landing page and other marketing-related pages.
 */

import { Header } from '@/components/marketing_pages/Header';
import { Footer } from '@/components/marketing_pages/Footer';
import { SessionTimeoutProvider } from '@/features/auth/components/SessionTimeoutProvider';

type Props = {
  children: React.ReactNode;
};

export default function MarketingLayout({ children }: Props) {
  return (
    <SessionTimeoutProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </SessionTimeoutProvider>
  );
}
