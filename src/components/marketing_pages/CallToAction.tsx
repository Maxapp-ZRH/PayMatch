import { Button } from '@/components/marketing_pages/Button';
import { CircleBackground } from '@/components/marketing_pages/CircleBackground';
import { Container } from '@/components/marketing_pages/Container';
import { useTranslations } from 'next-intl';

export function CallToAction() {
  const t = useTranslations('callToAction');

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
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-gray-300">{t('subtitle')}</p>
          <div className="mt-8 flex justify-center">
            <Button
              href="/register"
              color="cyan"
              className="px-8 py-3 text-base font-semibold"
            >
              {t('cta')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
