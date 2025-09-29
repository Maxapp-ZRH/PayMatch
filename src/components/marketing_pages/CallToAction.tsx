import { Button } from '@/components/marketing_pages/Button';
import { CircleBackground } from '@/components/marketing_pages/CircleBackground';
import { Container } from '@/components/marketing_pages/Container';
import { useTranslations } from 'next-intl';

export function CallToAction() {
  const t = useTranslations('callToAction');

  return (
    <section
      id="start-free-trial"
      className="relative overflow-hidden bg-gray-900 py-12 sm:py-20 lg:py-28"
    >
      <div className="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="#E4262A" className="animate-spin-slower" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-300">
            {t('subtitle')}
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Button
              href="/register"
              color="cyan"
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold w-full sm:w-auto"
            >
              {t('cta')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
