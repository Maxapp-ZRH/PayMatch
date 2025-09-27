import { Button } from '@/components/marketing_pages/Button';
import { CircleBackground } from '@/components/marketing_pages/CircleBackground';
import { Container } from '@/components/marketing_pages/Container';

export function CallToAction() {
  return (
    <section
      id="start-free-trial"
      className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
    >
      <div className="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="#14b8a1" className="animate-spin-slower" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Send your first Invoice
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Create your first Swiss QR-bill invoice in under 2 minutes. No
            credit card required. Start free and scale as you grow.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              href="/register"
              color="cyan"
              className="px-8 py-3 text-base font-semibold"
            >
              Start for Free
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
