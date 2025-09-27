import { Footer } from '@/components/marketing_pages/Footer';
import { Header } from '@/components/marketing_pages/Header';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-auto">{children}</main>
      <Footer />
    </>
  );
}
