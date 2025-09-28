import { Container } from '@/components/marketing_pages/Container';
import { faqData, createTranslatedFAQs } from '@/utils/faq-manager';
import { useTranslations } from 'next-intl';

// Get homepage FAQs from the centralized FAQ data
const homepageFaqIds = [
  'swiss-compliance-homepage',
  'currencies-supported',
  'payment-reconciliation-homepage',
  'data-security-homepage',
  'team-collaboration-homepage',
  'free-plan-limits-homepage',
  'get-started-homepage',
  'customize-invoices-homepage',
  'support-offered-homepage',
];

export function Faqs() {
  const t = useTranslations('faqs');
  const tFaq = useTranslations('faq');

  // Get homepage FAQs and translate them
  const homepageFAQs = faqData.filter((item) =>
    homepageFaqIds.includes(item.id)
  );
  const translatedFAQs = createTranslatedFAQs(homepageFAQs, tFaq);

  // Split FAQs into 3 columns for the grid layout
  const faqsColumns = [
    translatedFAQs.slice(0, 3),
    translatedFAQs.slice(3, 6),
    translatedFAQs.slice(6, 9),
  ];

  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faqs-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            {t('title')}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {t('subtitle')}{' '}
            <a
              href="mailto:support@paymatch.app"
              className="text-gray-900 underline"
            >
              {t('contactUs')}
            </a>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {faqsColumns.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg/6 font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
