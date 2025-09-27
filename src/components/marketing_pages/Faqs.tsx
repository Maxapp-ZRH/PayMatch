import { Container } from '@/components/marketing_pages/Container';

const faqs = [
  [
    {
      question: 'Is PayMatch compliant with Swiss invoicing regulations?',
      answer:
        'Yes, PayMatch is fully compliant with Swiss invoicing standards. We generate proper Swiss QR-bills that meet all legal requirements, including correct VAT calculations and mandatory information fields.',
    },
    {
      question: 'What currencies does PayMatch support?',
      answer:
        'PayMatch supports Swiss Francs (CHF) and Euros (EUR), which covers the majority of Swiss and European business transactions. All currency conversions and calculations are handled automatically.',
    },
    {
      question: 'How does payment reconciliation work?',
      answer:
        'You can upload CAMT files from your bank or connect your bank account for automatic sync. PayMatch will automatically match incoming payments to your invoices based on amount, reference number, and other criteria.',
    },
  ],
  [
    {
      question: 'Is my data secure and GDPR compliant?',
      answer:
        'Absolutely. PayMatch uses bank-level encryption and is fully GDPR compliant. Your financial data is stored securely in Switzerland and we never share your information with third parties without your explicit consent.',
    },
    {
      question: 'Can I use PayMatch for team collaboration?',
      answer:
        'Yes! Our Business and Enterprise plans include team collaboration features. You can invite team members, assign roles, and work together on invoice management and client relationships.',
    },
    {
      question: 'What happens if I exceed my free plan limits?',
      answer:
        "If you exceed 5 invoices per month on the free plan, you can upgrade to a paid plan at any time. We'll notify you when you're approaching your limit and provide easy upgrade options.",
    },
  ],
  [
    {
      question: 'How do I get started with PayMatch?',
      answer:
        'Simply sign up for free and create your first invoice in under 2 minutes. No credit card required for the free plan. You can start invoicing immediately and upgrade when you need more features.',
    },
    {
      question: 'Can I customize my invoices?',
      answer:
        'Yes! You can add your company logo, customize colors, and create professional invoice templates. Business and Enterprise plans include advanced branding options.',
    },
    {
      question: 'What kind of support do you offer?',
      answer:
        'We offer email support for all plans, with priority support for Enterprise customers. Our support team is knowledgeable about Swiss invoicing regulations and can help with any questions.',
    },
  ],
];

export function Faqs() {
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
            Frequently asked questions
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            If you have anything else you want to ask,{' '}
            <a
              href="mailto:support@paymatch.app"
              className="text-gray-900 underline"
            >
              reach out to us
            </a>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
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
