/**
 * FAQ Data for Support Page
 *
 * Comprehensive list of frequently asked questions organized by category
 * to help users find answers quickly before submitting support tickets.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

export const faqCategories = [
  { id: 'general', name: 'General', icon: '💡' },
  { id: 'account', name: 'Account & Billing', icon: '👤' },
  { id: 'invoicing', name: 'Invoicing', icon: '📄' },
  { id: 'payments', name: 'Payments', icon: '💳' },
  { id: 'technical', name: 'Technical', icon: '🔧' },
  { id: 'swiss-compliance', name: 'Swiss Compliance', icon: '🇨🇭' },
] as const;

export const faqData: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-paymatch',
    question: 'What is PayMatch?',
    answer:
      'PayMatch is a Swiss QR-bill invoicing platform designed specifically for Swiss businesses. It helps you create, send, and reconcile Swiss QR-bill compliant invoices effortlessly, with built-in payment matching and Swiss tax compliance features.',
    category: 'general',
    tags: ['overview', 'swiss', 'invoicing', 'qr-bill'],
    priority: 'high',
  },
  {
    id: 'who-can-use',
    question: 'Who can use PayMatch?',
    answer:
      'PayMatch is designed for Swiss businesses, freelancers, and SMEs who need to create Swiss QR-bill compliant invoices. We support businesses in Switzerland, Germany, France, and Italy, with plans for individual freelancers and enterprise teams.',
    category: 'general',
    tags: ['eligibility', 'swiss', 'business', 'freelancer'],
    priority: 'high',
  },
  {
    id: 'pricing-plans',
    question: 'What pricing plans do you offer?',
    answer:
      'We offer three main plans: Free (5 invoices/month), Freelancer (CHF 5/month, unlimited invoices), Business (CHF 50/month, team features), and Enterprise (CHF 150/month, unlimited users). All prices include Swiss VAT.',
    category: 'general',
    tags: ['pricing', 'plans', 'cost', 'subscription'],
    priority: 'high',
  },

  // Account & Billing
  {
    id: 'create-account',
    question: 'How do I create an account?',
    answer:
      'Simply visit our registration page, enter your business details, and verify your email address. You can start with our free plan and upgrade anytime. We require basic business information for Swiss compliance.',
    category: 'account',
    tags: ['registration', 'signup', 'account', 'setup'],
    priority: 'high',
  },
  {
    id: 'change-plan',
    question: 'How do I change my plan?',
    answer:
      'You can upgrade or downgrade your plan anytime from your account settings. Changes take effect at the next billing cycle. Downgrades may require data migration depending on your current usage.',
    category: 'account',
    tags: ['billing', 'upgrade', 'downgrade', 'plan'],
    priority: 'medium',
  },
  {
    id: 'cancel-subscription',
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your subscription anytime from your account settings. Your account will remain active until the end of your current billing period. You can export your data before cancellation.',
    category: 'account',
    tags: ['cancellation', 'billing', 'subscription', 'export'],
    priority: 'medium',
  },
  {
    id: 'billing-invoices',
    question: 'Where can I find my billing invoices?',
    answer:
      'All billing invoices are available in your account settings under "Billing History". You can download PDF copies and view payment status. Invoices are also sent to your registered email address.',
    category: 'account',
    tags: ['billing', 'invoices', 'receipts', 'payment'],
    priority: 'medium',
  },

  // Invoicing
  {
    id: 'create-invoice',
    question: 'How do I create a new invoice?',
    answer:
      'Click "Create Invoice" in your dashboard, fill in the client details, add line items, and the system will automatically generate a Swiss QR-bill compliant invoice. You can preview before sending.',
    category: 'invoicing',
    tags: ['create', 'invoice', 'qr-bill', 'client'],
    priority: 'high',
  },
  {
    id: 'invoice-templates',
    question: 'Can I customize invoice templates?',
    answer:
      'Yes! You can customize your invoice templates with your logo, colors, and company branding. We provide several professional templates that comply with Swiss invoicing standards.',
    category: 'invoicing',
    tags: ['templates', 'customization', 'branding', 'design'],
    priority: 'medium',
  },
  {
    id: 'invoice-languages',
    question: 'What languages are supported for invoices?',
    answer:
      "We support German, French, Italian, and English for invoice creation. The Swiss QR-bill section is automatically generated in the appropriate language based on your client's location.",
    category: 'invoicing',
    tags: ['languages', 'multilingual', 'swiss', 'localization'],
    priority: 'medium',
  },
  {
    id: 'recurring-invoices',
    question: 'Can I create recurring invoices?',
    answer:
      'Yes, you can set up recurring invoices for regular clients. Set the frequency (monthly, quarterly, yearly) and the system will automatically generate and send invoices on schedule.',
    category: 'invoicing',
    tags: ['recurring', 'automation', 'scheduled', 'regular'],
    priority: 'medium',
  },

  // Payments
  {
    id: 'payment-methods',
    question: 'What payment methods do you support?',
    answer:
      'We support all major Swiss payment methods including bank transfers, credit cards, and digital wallets. Payments are processed securely through Stripe with Swiss banking integration.',
    category: 'payments',
    tags: ['payment', 'methods', 'stripe', 'swiss', 'banking'],
    priority: 'high',
  },
  {
    id: 'payment-matching',
    question: 'How does payment matching work?',
    answer:
      'Upload your CAMT.053 bank statement files and our system automatically matches incoming payments to outstanding invoices. You can also manually match payments or set up automatic rules.',
    category: 'payments',
    tags: ['matching', 'camt', 'reconciliation', 'banking'],
    priority: 'high',
  },
  {
    id: 'payment-reminders',
    question: 'Can I send payment reminders?',
    answer:
      'Yes, you can send automated payment reminders at customizable intervals. Set up reminder schedules and the system will automatically send follow-up emails for overdue invoices.',
    category: 'payments',
    tags: ['reminders', 'automation', 'overdue', 'follow-up'],
    priority: 'medium',
  },
  {
    id: 'refund-process',
    question: 'How do I process refunds?',
    answer:
      'Refunds can be processed directly from the invoice details page. You can issue partial or full refunds, and the system will automatically update the payment status and generate refund receipts.',
    category: 'payments',
    tags: ['refunds', 'returns', 'cancellation', 'reversal'],
    priority: 'low',
  },

  // Technical
  {
    id: 'browser-support',
    question: 'Which browsers are supported?',
    answer:
      'PayMatch works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience.',
    category: 'technical',
    tags: ['browser', 'compatibility', 'chrome', 'firefox', 'safari'],
    priority: 'medium',
  },
  {
    id: 'mobile-app',
    question: 'Is there a mobile app?',
    answer:
      "PayMatch is a Progressive Web App (PWA) that works on mobile devices. You can install it on your phone's home screen for a native app-like experience with offline capabilities.",
    category: 'technical',
    tags: ['mobile', 'app', 'pwa', 'offline', 'install'],
    priority: 'medium',
  },
  {
    id: 'data-export',
    question: 'Can I export my data?',
    answer:
      'Yes, you can export all your data including invoices, clients, and reports in various formats (PDF, Excel, CSV). Data export is available from your account settings and is GDPR compliant.',
    category: 'technical',
    tags: ['export', 'data', 'gdpr', 'backup', 'migration'],
    priority: 'high',
  },
  {
    id: 'api-access',
    question: 'Do you provide API access?',
    answer:
      'API access is available for Business and Enterprise plans. Our REST API allows you to integrate PayMatch with your existing business systems and automate invoice creation.',
    category: 'technical',
    tags: ['api', 'integration', 'automation', 'business', 'enterprise'],
    priority: 'low',
  },

  // Swiss Compliance
  {
    id: 'qr-bill-compliance',
    question: 'Is PayMatch Swiss QR-bill compliant?',
    answer:
      'Yes, all invoices generated by PayMatch are fully compliant with Swiss QR-bill standards (ISO 20022). We automatically include all required elements and ensure proper formatting.',
    category: 'swiss-compliance',
    tags: ['qr-bill', 'compliance', 'swiss', 'iso20022', 'standards'],
    priority: 'high',
  },
  {
    id: 'vat-handling',
    question: 'How does VAT handling work?',
    answer:
      'PayMatch automatically calculates Swiss VAT based on your business type and invoice details. We support standard (7.7%), reduced (2.5%), and zero-rate VAT as per Swiss tax regulations.',
    category: 'swiss-compliance',
    tags: ['vat', 'tax', 'swiss', 'calculation', 'compliance'],
    priority: 'high',
  },
  {
    id: 'tax-reporting',
    question: 'Can I generate tax reports?',
    answer:
      'Yes, PayMatch generates comprehensive tax reports for Swiss authorities including VAT returns and annual summaries. Reports are formatted according to Swiss tax office requirements.',
    category: 'swiss-compliance',
    tags: ['tax', 'reports', 'vat', 'authorities', 'swiss'],
    priority: 'high',
  },
  {
    id: 'data-retention',
    question: 'How long do you keep my data?',
    answer:
      'We retain invoice data for 10 years as required by Swiss law, account data for 7 years, and payment data for 7 years. You can request data deletion after the legal retention period.',
    category: 'swiss-compliance',
    tags: ['retention', 'data', 'swiss', 'law', 'deletion'],
    priority: 'medium',
  },
  {
    id: 'gdpr-compliance',
    question: 'Are you GDPR compliant?',
    answer:
      'Yes, PayMatch is fully GDPR compliant and also adheres to the Swiss Federal Data Protection Act (FADP). We implement appropriate technical and organizational measures to protect your data.',
    category: 'swiss-compliance',
    tags: ['gdpr', 'privacy', 'data-protection', 'swiss', 'fadp'],
    priority: 'high',
  },
];

// Search functionality
export function searchFAQs(query: string, category?: string): FAQItem[] {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    return category
      ? faqData.filter((item) => item.category === category)
      : faqData;
  }

  return faqData.filter((item) => {
    const matchesCategory = !category || item.category === category;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm) ||
      item.answer.toLowerCase().includes(searchTerm) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    return matchesCategory && matchesSearch;
  });
}

// Get FAQs by category
export function getFAQsByCategory(category: string): FAQItem[] {
  return faqData.filter((item) => item.category === category);
}

// Get popular FAQs (high priority)
export function getPopularFAQs(): FAQItem[] {
  return faqData.filter((item) => item.priority === 'high');
}
