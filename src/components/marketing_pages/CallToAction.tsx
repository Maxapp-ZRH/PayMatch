'use client';

import { Button } from '@/components/marketing_pages/Button';
import { CircleBackground } from '@/components/marketing_pages/CircleBackground';
import { Container } from '@/components/marketing_pages/Container';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

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
        <motion.div
          className="mx-auto max-w-md sm:text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-base sm:text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          >
            {t('subtitle')}
          </motion.p>
          <motion.div
            className="mt-6 sm:mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          >
            <Button
              href="/register"
              color="cyan"
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold w-full sm:w-auto"
            >
              {t('cta')}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
