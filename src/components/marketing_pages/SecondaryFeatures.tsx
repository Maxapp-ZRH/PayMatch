'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import { Container } from '@/components/marketing_pages/Container';

const getFeatures = (t: (key: string) => string) => [
  {
    name: t('features.multiCurrency.name'),
    description: t('features.multiCurrency.description'),
    icon: DeviceArrowIcon,
  },
  {
    name: t('features.clientManagement.name'),
    description: t('features.clientManagement.description'),
    icon: DeviceCardsIcon,
  },
  {
    name: t('features.pwa.name'),
    description: t('features.pwa.description'),
    icon: DevicePwaIcon,
  },
  {
    name: t('features.collaboration.name'),
    description: t('features.collaboration.description'),
    icon: DeviceListIcon,
  },
  {
    name: t('features.security.name'),
    description: t('features.security.description'),
    icon: DeviceLockIcon,
  },
  {
    name: t('features.reporting.name'),
    description: t('features.reporting.description'),
    icon: DeviceChartIcon,
  },
];

function DeviceArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <path
        d="M12 25l8-8m0 0h-6m6 0v6"
        stroke="#171717"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
    </svg>
  );
}

function DeviceCardsIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  const gradientId = 'device-cards-gradient';

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 13a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm1 5a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-1-1H10z"
        fill={`url(#${gradientId})`}
      />
      <rect x={9} y={6} width={14} height={4} rx={1} fill="#171717" />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <defs>
        <linearGradient
          id={gradientId}
          x1={16}
          y1={12}
          x2={16}
          y2={28}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="#737373" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DevicePwaIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  const gradientId = 'device-pwa-gradient';

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      {/* PWA App Icon */}
      <rect x={10} y={6} width={12} height={8} rx={1.5} fill="#171717" />
      {/* PWA Symbol - Download/Install Arrow */}
      <path
        d="M14 10l2-2m0 0l2 2m-2-2v4"
        stroke="#737373"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* PWA Features - Grid of dots representing app features */}
      <circle cx={12} cy={18} r={1} fill={`url(#${gradientId})`} />
      <circle cx={16} cy={18} r={1} fill={`url(#${gradientId})`} />
      <circle cx={20} cy={18} r={1} fill={`url(#${gradientId})`} />
      <circle cx={12} cy={22} r={1} fill={`url(#${gradientId})`} />
      <circle cx={16} cy={22} r={1} fill={`url(#${gradientId})`} />
      <circle cx={20} cy={22} r={1} fill={`url(#${gradientId})`} />
      {/* PWA Status Indicator */}
      <circle cx={20} cy={8} r={1.5} fill="#10B981" />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <defs>
        <linearGradient
          id={gradientId}
          x1={16}
          y1={16}
          x2={16}
          y2={24}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="#737373" stopOpacity={0.6} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DeviceListIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <circle cx={11} cy={14} r={2} fill="#171717" />
      <circle cx={11} cy={20} r={2} fill="#171717" />
      <circle cx={11} cy={26} r={2} fill="#171717" />
      <path
        d="M16 14h6M16 20h6M16 26h6"
        stroke="#737373"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
    </svg>
  );
}

function DeviceLockIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v10h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h5v2H9a4 4 0 01-4-4V4z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 19.5a3.5 3.5 0 117 0V22a2 2 0 012 2v6a2 2 0 01-2 2h-7a2 2 0 01-2-2v-6a2 2 0 012-2v-2.5zm2 2.5h3v-2.5a1.5 1.5 0 00-3 0V22z"
        fill="#171717"
      />
    </svg>
  );
}

function DeviceChartIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 13.838V26a2 2 0 01-2 2H11a2 2 0 01-2-2V15.65l2.57 3.212a1 1 0 001.38.175L15.4 17.2a1 1 0 011.494.353l1.841 3.681c.399.797 1.562.714 1.843-.13L23 13.837z"
        fill="#171717"
      />
      <path
        d="M10 12h12"
        stroke="#737373"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
    </svg>
  );
}

export function SecondaryFeatures() {
  const t = useTranslations('secondaryFeatures');
  const features = getFeatures(t);

  return (
    <section
      id="secondary-features"
      aria-label="Features for professional invoicing and payment management"
      className="py-12 sm:py-20 lg:py-32"
    >
      <Container>
        <motion.div
          className="mx-auto max-w-2xl sm:text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </motion.div>
        <motion.ul
          role="list"
          className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 text-sm sm:mt-16 sm:grid-cols-2 sm:gap-6 md:gap-y-8 lg:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-y-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {features.map((feature, index) => (
            <motion.li
              key={feature.name}
              className="rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + index * 0.1,
                ease: 'easeOut',
              }}
            >
              <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              <h3 className="mt-4 sm:mt-6 font-semibold text-gray-900 text-sm sm:text-base">
                {feature.name}
              </h3>
              <p className="mt-2 text-gray-700 text-xs sm:text-sm">
                {feature.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
