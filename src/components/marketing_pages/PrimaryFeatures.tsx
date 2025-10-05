'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import {
  type MotionProps,
  type Variant,
  type Variants,
  AnimatePresence,
  motion,
} from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';

import { AppScreen } from '@/components/marketing_pages/AppScreen';
import { CircleBackground } from '@/components/marketing_pages/CircleBackground';
import { Container } from '@/components/marketing_pages/Container';
import { PhoneFrame } from '@/components/marketing_pages/PhoneFrame';
import { useTranslations } from 'next-intl';

// Define Feature type
interface Feature {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  screen: React.ComponentType<{
    t: (key: string) => string;
    animated?: boolean;
    custom?: CustomAnimationProps;
  }>;
}

const MotionAppScreenHeader = motion.create(AppScreen.Header);
const MotionAppScreenBody = motion.create(AppScreen.Body);

interface CustomAnimationProps {
  isForwards: boolean;
  changeCount: number;
}

// Features will be loaded from translations

function DeviceUserIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

function DeviceNotificationIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#A3A3A3"
      />
      <path
        d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
        fill="#737373"
      />
    </svg>
  );
}

function DeviceTouchIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  const gradientId = 'device-touch-gradient';

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient
          id={gradientId}
          x1={14}
          y1={14.5}
          x2={7}
          y2={17}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="#D4D4D4" stopOpacity={0} />
        </linearGradient>
      </defs>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v13h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h4v2H9a4 4 0 01-4-4V4z"
        fill="#A3A3A3"
      />
      <path
        d="M7 22c0-4.694 3.5-8 8-8"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 20l.217-5.513a1.431 1.431 0 00-2.85-.226L17.5 21.5l-1.51-1.51a2.107 2.107 0 00-2.98 0 .024.024 0 00-.005.024l3.083 9.25A4 4 0 0019.883 32H25a4 4 0 004-4v-5a3 3 0 00-3-3h-5z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

const headerAnimation: Variants = {
  initial: { opacity: 0, transition: { duration: 0.3 } },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const maxZIndex = 2147483647;

const bodyVariantBackwards: Variant = {
  opacity: 0.4,
  scale: 0.8,
  zIndex: 0,
  filter: 'blur(4px)',
  transition: { duration: 0.4 },
};

const bodyVariantForwards: Variant = (custom: CustomAnimationProps) => ({
  y: '100%',
  zIndex: maxZIndex - custom.changeCount,
  transition: { duration: 0.4 },
});

const bodyAnimation: MotionProps = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: {
    initial: (custom: CustomAnimationProps, ...props) =>
      custom.isForwards
        ? bodyVariantForwards(custom, ...props)
        : bodyVariantBackwards,
    animate: (custom: CustomAnimationProps) => ({
      y: '0%',
      opacity: 1,
      scale: 1,
      zIndex: maxZIndex / 2 - custom.changeCount,
      filter: 'blur(0px)',
      transition: { duration: 0.4 },
    }),
    exit: (custom: CustomAnimationProps, ...props) =>
      custom.isForwards
        ? bodyVariantBackwards
        : bodyVariantForwards(custom, ...props),
  },
};

type ScreenProps =
  | {
      animated: true;
      custom: CustomAnimationProps;
    }
  | { animated?: false };

function ClientManagementScreen(
  props: ScreenProps & { t: (key: string) => string }
) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader {...(props.animated ? headerAnimation : {})}>
        <AppScreen.Title>
          {props.t('screens.clientManagement.title')}
        </AppScreen.Title>
        <AppScreen.Subtitle>
          {props.t('screens.clientManagement.subtitle')}
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody
        {...(props.animated ? { ...bodyAnimation, custom: props.custom } : {})}
      >
        <div className="px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {props.t('screens.clientManagement.allClients')}
            </h3>
            <div className="rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              {props.t('screens.clientManagement.addClient')}
            </div>
          </div>
          <div className="space-y-3">
            {[
              {
                name: 'Swiss Business AG',
                email: 'contact@swissbusiness.ch',
                location: 'Zürich, CH',
                invoices: '12 invoices',
                color: '#E4262A',
              },
              {
                name: 'Zurich Consulting',
                email: 'info@zurichconsulting.ch',
                location: 'Zürich, CH',
                invoices: '8 invoices',
                color: '#3B82F6',
              },
              {
                name: 'Basel Industries',
                email: 'office@baselind.ch',
                location: 'Basel, CH',
                invoices: '15 invoices',
                color: '#8B5CF6',
              },
              {
                name: 'Geneva Services',
                email: 'hello@genevaservices.ch',
                location: 'Geneva, CH',
                invoices: '6 invoices',
                color: '#F59E0B',
              },
            ].map((client) => (
              <div
                key={client.name}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
              >
                <div
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: client.color }}
                >
                  {client.name.charAt(0)}
                </div>
                <div className="flex-auto">
                  <div className="font-medium text-gray-900">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.email}</div>
                  <div className="text-xs text-gray-400">
                    {client.location} • {client.invoices}{' '}
                    {props.t('screens.clientManagement.invoices')}
                  </div>
                </div>
                <div className="text-xs text-gray-400">•••</div>
              </div>
            ))}
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function InvoiceCreationScreen(
  props: ScreenProps & { t: (key: string) => string }
) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader {...(props.animated ? headerAnimation : {})}>
        <AppScreen.Title>
          {props.t('screens.invoiceCreation.title')}
        </AppScreen.Title>
        <AppScreen.Subtitle>
          {props.t('screens.invoiceCreation.subtitle')}
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody
        {...(props.animated ? { ...bodyAnimation, custom: props.custom } : {})}
      >
        <div className="px-4 py-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                {props.t('screens.invoiceCreation.selectClient')}
              </label>
              <div className="mt-2 rounded-lg border border-gray-300 bg-white p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white text-sm font-semibold">
                    S
                  </div>
                  <div className="flex-auto">
                    <div className="font-medium text-gray-900">
                      Swiss Business AG
                    </div>
                    <div className="text-sm text-gray-500">
                      contact@swissbusiness.ch
                    </div>
                  </div>
                  <div className="text-red-500">✓</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {props.t('screens.invoiceCreation.amount')}
                </label>
                <div className="mt-2 rounded-lg border border-gray-300 bg-white p-3">
                  <div className="text-sm text-gray-900">CHF 1,250.00</div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {props.t('screens.invoiceCreation.dueDate')}
                </label>
                <div className="mt-2 rounded-lg border border-gray-300 bg-white p-3">
                  <div className="text-sm text-gray-900">30 days</div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {props.t('screens.invoiceCreation.description')}
              </label>
              <div className="mt-2 rounded-lg border border-gray-300 bg-white p-3">
                <div className="text-sm text-gray-900">
                  {props.t('screens.invoiceCreation.consultingServices')}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="rounded-lg bg-red-500 px-4 py-3 text-center text-sm font-semibold text-white">
              {props.t('screens.invoiceCreation.generateQRBill')}
            </div>
            <div className="text-center text-xs text-gray-500">
              {props.t('screens.invoiceCreation.autoTaxCalculation')}
            </div>
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function ReconciliationScreen(
  props: ScreenProps & { t: (key: string) => string }
) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader {...(props.animated ? headerAnimation : {})}>
        <AppScreen.Title>
          {props.t('screens.reconciliation.title')}
        </AppScreen.Title>
        <AppScreen.Subtitle>
          {props.t('screens.reconciliation.subtitle')}
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody
        {...(props.animated ? { ...bodyAnimation, custom: props.custom } : {})}
      >
        <div className="px-4 py-6">
          <div className="mb-4 space-y-3">
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <div className="flex items-center gap-2">
                <div className="text-green-600">🔄</div>
                <div className="text-sm font-medium text-green-900">
                  {props.t('screens.reconciliation.autoSync')}
                </div>
                <div className="ml-auto text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  {props.t('screens.reconciliation.active')}
                </div>
              </div>
              <div className="text-xs text-green-700 mt-1">
                {props.t('screens.reconciliation.lastSync')}
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <div className="flex items-center gap-2">
                <div className="text-blue-600">📄</div>
                <div className="text-sm font-medium text-blue-900">
                  {props.t('screens.reconciliation.manualUpload')}
                </div>
                <div className="ml-auto text-xs text-blue-500">
                  {props.t('screens.reconciliation.fallback')}
                </div>
              </div>
              <div className="text-xs text-blue-700 mt-1">
                {props.t('screens.reconciliation.dragDropCAMT')}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              {props.t('screens.reconciliation.recentInvoices')}
            </div>
            {[
              {
                name: 'Invoice #2024-001',
                client: 'Swiss Business AG',
                amount: 'CHF 750.00',
                status: 'Paid',
                statusColor: '#16A34A',
                match: true,
              },
              {
                name: 'Invoice #2024-002',
                client: 'Zurich Consulting',
                amount: 'CHF 850.00',
                status: 'Pending',
                statusColor: '#F59E0B',
                match: false,
              },
              {
                name: 'Invoice #2024-003',
                client: 'Basel Industries',
                amount: 'CHF 950.00',
                status: 'Matched',
                statusColor: '#3B82F6',
                match: true,
              },
            ].map((invoice) => (
              <div
                key={invoice.name}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs">
                  {invoice.match ? '✓' : '⏳'}
                </div>
                <div className="flex-auto">
                  <div className="font-medium text-gray-900">
                    {invoice.name}
                  </div>
                  <div className="text-sm text-gray-500">{invoice.client}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {invoice.amount}
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: invoice.statusColor }}
                  >
                    {invoice.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3">
            <div className="text-sm font-medium text-green-900">
              {props.t('screens.reconciliation.autoMatched')}
            </div>
            <div className="text-xs text-green-700">
              {props.t('screens.reconciliation.total')}
            </div>
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function FeaturesDesktop({
  features,
  t,
}: {
  features: Feature[];
  t: (key: string) => string;
}) {
  const [changeCount, setChangeCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const prevIndex = usePrevious(selectedIndex);
  const isForwards = prevIndex === undefined ? true : selectedIndex > prevIndex;

  const onChange = useDebouncedCallback(
    (selectedIndex) => {
      setSelectedIndex(selectedIndex);
      setChangeCount((changeCount) => changeCount + 1);
    },
    100,
    { leading: true }
  );

  return (
    <TabGroup
      id="primary-features-tabs"
      className="grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24"
      selectedIndex={selectedIndex}
      onChange={onChange}
      vertical
    >
      <TabList className="relative z-10 order-last col-span-6 space-y-6">
        {features.map((feature, featureIndex) => (
          <div
            key={feature.name}
            className="relative rounded-2xl transition-colors hover:bg-gray-800/30"
          >
            {featureIndex === selectedIndex && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-gray-800"
                initial={{ borderRadius: 16 }}
              />
            )}
            <div className="relative z-10 p-8">
              <feature.icon className="h-8 w-8" />
              <h3 className="mt-6 text-lg font-semibold text-white">
                <Tab
                  id={`primary-features-tab-${featureIndex}`}
                  className="text-left data-selected:not-data-focus:outline-hidden"
                >
                  <span className="absolute inset-0 rounded-2xl" />
                  {feature.name}
                </Tab>
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </TabList>
      <div className="relative col-span-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <CircleBackground
            color="#E4262A"
            className="animate-spin-slower"
            id="primary-features-main-circle"
          />
        </div>
        <PhoneFrame className="z-10 mx-auto w-full max-w-[366px]">
          <TabPanels as={Fragment}>
            <AnimatePresence
              initial={false}
              custom={{ isForwards, changeCount }}
            >
              {features.map((feature, featureIndex) =>
                selectedIndex === featureIndex ? (
                  <TabPanel
                    id={`primary-features-panel-${featureIndex}`}
                    static
                    key={feature.name + changeCount}
                    className="col-start-1 row-start-1 flex focus:outline-offset-32 data-selected:not-data-focus:outline-hidden"
                  >
                    <feature.screen
                      animated
                      custom={{ isForwards, changeCount }}
                      t={t}
                    />
                  </TabPanel>
                ) : null
              )}
            </AnimatePresence>
          </TabPanels>
        </PhoneFrame>
      </div>
    </TabGroup>
  );
}

function FeaturesMobile({
  features,
  t,
}: {
  features: Feature[];
  t: (key: string) => string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideContainerRef = useRef<React.ElementRef<'div'>>(null);
  const slideRefs = useRef<Array<React.ElementRef<'div'>>>([]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target instanceof HTMLDivElement) {
            setActiveIndex(slideRefs.current.indexOf(entry.target));
            break;
          }
        }
      },
      {
        root: slideContainerRef.current,
        threshold: 0.6,
      }
    );

    for (const slide of slideRefs.current) {
      if (slide) {
        observer.observe(slide);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [slideContainerRef, slideRefs]);

  return (
    <>
      <div
        ref={slideContainerRef}
        className="-mb-4 flex snap-x snap-mandatory -space-x-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-4 lg:-space-x-6 [&::-webkit-scrollbar]:hidden"
      >
        {features.map((feature, featureIndex) => (
          <div
            key={featureIndex}
            ref={(ref) => {
              if (ref) {
                slideRefs.current[featureIndex] = ref;
              }
            }}
            className="w-full flex-none snap-center px-3 sm:px-4 lg:px-6"
          >
            <div className="relative transform overflow-hidden rounded-xl sm:rounded-2xl bg-gray-800 px-4 py-4 sm:px-5 sm:py-6">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <CircleBackground
                  color="#E4262A"
                  className={featureIndex % 2 === 1 ? 'rotate-180' : undefined}
                  id={`primary-features-circle-${featureIndex}`}
                />
              </div>
              <PhoneFrame className="relative mx-auto w-full max-w-[280px] sm:max-w-[366px]">
                <feature.screen t={t} />
              </PhoneFrame>
              <div className="absolute inset-x-0 bottom-0 bg-gray-800/95 p-4 backdrop-blur-sm sm:p-6 lg:p-10">
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                <h3 className="mt-4 sm:mt-6 text-sm font-semibold text-white sm:text-base lg:text-lg">
                  {feature.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {features.map((_, featureIndex) => (
          <button
            type="button"
            key={featureIndex}
            className={clsx(
              'relative h-0.5 w-4 rounded-full',
              featureIndex === activeIndex ? 'bg-gray-300' : 'bg-gray-500'
            )}
            aria-label={`Go to slide ${featureIndex + 1}`}
            onClick={() => {
              slideRefs.current[featureIndex].scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
              });
            }}
          >
            <span className="absolute -inset-x-1.5 -inset-y-3" />
          </button>
        ))}
      </div>
    </>
  );
}

export function PrimaryFeatures() {
  const t = useTranslations('features');

  // Create features array from translations
  const features = t
    .raw('features')
    .map(
      (
        feature: { name: string; description: string; icon: string },
        index: number
      ) => ({
        name: feature.name,
        description: feature.description,
        icon: [DeviceUserIcon, DeviceNotificationIcon, DeviceTouchIcon][index],
        screen: [
          ClientManagementScreen,
          InvoiceCreationScreen,
          ReconciliationScreen,
        ][index],
      })
    );

  return (
    <section
      id="features"
      aria-label="Features for Swiss invoicing and payment reconciliation"
      className="bg-gray-900 py-12 sm:py-20 lg:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-400">
            {t('subtitle')}
          </p>
        </div>
      </Container>
      <div className="mt-12 sm:mt-16 md:hidden">
        <FeaturesMobile features={features} t={t} />
      </div>
      <Container className="hidden md:mt-20 md:block">
        <FeaturesDesktop features={features} t={t} />
      </Container>
      <Container className="mt-6 sm:mt-8">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500">{t('disclaimer')}</p>
        </div>
      </Container>
    </section>
  );
}
