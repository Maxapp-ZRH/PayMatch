/**
 * Centralized FAQ Management System
 *
 * This system provides a hybrid approach where:
 * 1. FAQ data is defined in TypeScript with translation keys
 * 2. Translation content is automatically generated and managed
 * 3. Type safety is maintained throughout
 * 4. Easy to add new FAQs without manual message file updates
 */

import {
  Lightbulb,
  User,
  FileText,
  CreditCard,
  Settings,
  Shield,
} from 'lucide-react';

// Base FAQ item interface
export interface BaseFAQItem {
  id: string;
  category: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

// FAQ item with translation keys
export interface FAQItem extends BaseFAQItem {
  questionKey: string;
  answerKey: string;
}

// FAQ item with translated content (for display)
export interface TranslatedFAQItem extends BaseFAQItem {
  question: string;
  answer: string;
}

// FAQ category definition
export interface FAQCategory {
  id: string;
  nameKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

// FAQ data structure with translation keys
export const faqCategories: FAQCategory[] = [
  { id: 'general', nameKey: 'faq.categories.general', icon: Lightbulb },
  { id: 'account', nameKey: 'faq.categories.account', icon: User },
  { id: 'invoicing', nameKey: 'faq.categories.invoicing', icon: FileText },
  { id: 'payments', nameKey: 'faq.categories.payments', icon: CreditCard },
  { id: 'technical', nameKey: 'faq.categories.technical', icon: Settings },
  {
    id: 'swiss-compliance',
    nameKey: 'faq.categories.swiss-compliance',
    icon: Shield,
  },
] as const;

// Centralized FAQ data with automatic key generation
export const faqData: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-paymatch',
    questionKey: 'faq.whatIsPayMatch.question',
    answerKey: 'faq.whatIsPayMatch.answer',
    category: 'general',
    tags: ['overview', 'swiss', 'invoicing', 'qr-bill'],
    priority: 'high',
  },
  {
    id: 'who-can-use',
    questionKey: 'faq.whoCanUse.question',
    answerKey: 'faq.whoCanUse.answer',
    category: 'general',
    tags: ['eligibility', 'swiss', 'business', 'freelancer'],
    priority: 'high',
  },
  {
    id: 'pricing-plans',
    questionKey: 'faq.pricingPlans.question',
    answerKey: 'faq.pricingPlans.answer',
    category: 'general',
    tags: ['pricing', 'plans', 'cost', 'subscription'],
    priority: 'high',
  },

  // Account & Billing
  {
    id: 'create-account',
    questionKey: 'faq.createAccount.question',
    answerKey: 'faq.createAccount.answer',
    category: 'account',
    tags: ['registration', 'signup', 'account', 'setup'],
    priority: 'high',
  },
  {
    id: 'change-plan',
    questionKey: 'faq.changePlan.question',
    answerKey: 'faq.changePlan.answer',
    category: 'account',
    tags: ['billing', 'upgrade', 'downgrade', 'plan'],
    priority: 'medium',
  },
  {
    id: 'cancel-subscription',
    questionKey: 'faq.cancelSubscription.question',
    answerKey: 'faq.cancelSubscription.answer',
    category: 'account',
    tags: ['cancellation', 'billing', 'subscription', 'export'],
    priority: 'medium',
  },
  {
    id: 'billing-invoices',
    questionKey: 'faq.billingInvoices.question',
    answerKey: 'faq.billingInvoices.answer',
    category: 'account',
    tags: ['billing', 'invoices', 'receipts', 'payment'],
    priority: 'medium',
  },

  // Invoicing
  {
    id: 'create-invoice',
    questionKey: 'faq.createInvoice.question',
    answerKey: 'faq.createInvoice.answer',
    category: 'invoicing',
    tags: ['create', 'invoice', 'qr-bill', 'client'],
    priority: 'high',
  },
  {
    id: 'invoice-templates',
    questionKey: 'faq.invoiceTemplates.question',
    answerKey: 'faq.invoiceTemplates.answer',
    category: 'invoicing',
    tags: ['templates', 'customization', 'branding', 'design'],
    priority: 'medium',
  },
  {
    id: 'invoice-languages',
    questionKey: 'faq.invoiceLanguages.question',
    answerKey: 'faq.invoiceLanguages.answer',
    category: 'invoicing',
    tags: ['languages', 'multilingual', 'swiss', 'localization'],
    priority: 'medium',
  },
  {
    id: 'recurring-invoices',
    questionKey: 'faq.recurringInvoices.question',
    answerKey: 'faq.recurringInvoices.answer',
    category: 'invoicing',
    tags: ['recurring', 'automation', 'scheduled', 'regular'],
    priority: 'medium',
  },

  // Payments
  {
    id: 'payment-methods',
    questionKey: 'faq.paymentMethods.question',
    answerKey: 'faq.paymentMethods.answer',
    category: 'payments',
    tags: ['payment', 'methods', 'stripe', 'swiss', 'banking'],
    priority: 'high',
  },
  {
    id: 'payment-matching',
    questionKey: 'faq.paymentMatching.question',
    answerKey: 'faq.paymentMatching.answer',
    category: 'payments',
    tags: ['matching', 'camt', 'reconciliation', 'banking'],
    priority: 'high',
  },
  {
    id: 'payment-reminders',
    questionKey: 'faq.paymentReminders.question',
    answerKey: 'faq.paymentReminders.answer',
    category: 'payments',
    tags: ['reminders', 'automation', 'overdue', 'follow-up'],
    priority: 'medium',
  },
  {
    id: 'refund-process',
    questionKey: 'faq.refundProcess.question',
    answerKey: 'faq.refundProcess.answer',
    category: 'payments',
    tags: ['refunds', 'returns', 'cancellation', 'reversal'],
    priority: 'low',
  },

  // Technical
  {
    id: 'browser-support',
    questionKey: 'faq.browserSupport.question',
    answerKey: 'faq.browserSupport.answer',
    category: 'technical',
    tags: ['browser', 'compatibility', 'chrome', 'firefox', 'safari'],
    priority: 'medium',
  },
  {
    id: 'mobile-app',
    questionKey: 'faq.mobileApp.question',
    answerKey: 'faq.mobileApp.answer',
    category: 'technical',
    tags: ['mobile', 'app', 'pwa', 'offline', 'install'],
    priority: 'medium',
  },
  {
    id: 'data-export',
    questionKey: 'faq.dataExport.question',
    answerKey: 'faq.dataExport.answer',
    category: 'technical',
    tags: ['export', 'data', 'gdpr', 'backup', 'migration'],
    priority: 'high',
  },
  {
    id: 'api-access',
    questionKey: 'faq.apiAccess.question',
    answerKey: 'faq.apiAccess.answer',
    category: 'technical',
    tags: ['api', 'integration', 'automation', 'business', 'enterprise'],
    priority: 'low',
  },

  // Swiss Compliance
  {
    id: 'qr-bill-compliance',
    questionKey: 'faq.qrBillCompliance.question',
    answerKey: 'faq.qrBillCompliance.answer',
    category: 'swiss-compliance',
    tags: ['qr-bill', 'compliance', 'swiss', 'iso20022', 'standards'],
    priority: 'high',
  },
  {
    id: 'vat-handling',
    questionKey: 'faq.vatHandling.question',
    answerKey: 'faq.vatHandling.answer',
    category: 'swiss-compliance',
    tags: ['vat', 'tax', 'swiss', 'calculation', 'compliance'],
    priority: 'high',
  },
  {
    id: 'tax-reporting',
    questionKey: 'faq.taxReporting.question',
    answerKey: 'faq.taxReporting.answer',
    category: 'swiss-compliance',
    tags: ['tax', 'reports', 'vat', 'authorities', 'swiss'],
    priority: 'high',
  },
  {
    id: 'data-retention',
    questionKey: 'faq.dataRetention.question',
    answerKey: 'faq.dataRetention.answer',
    category: 'swiss-compliance',
    tags: ['retention', 'data', 'swiss', 'law', 'deletion'],
    priority: 'medium',
  },
  {
    id: 'gdpr-compliance',
    questionKey: 'faq.gdprCompliance.question',
    answerKey: 'faq.gdprCompliance.answer',
    category: 'swiss-compliance',
    tags: ['gdpr', 'privacy', 'data-protection', 'swiss', 'fadp'],
    priority: 'high',
  },

  // Homepage FAQs
  {
    id: 'swiss-compliance-homepage',
    questionKey: 'faq.swissComplianceHomepage.question',
    answerKey: 'faq.swissComplianceHomepage.answer',
    category: 'swiss-compliance',
    tags: ['compliance', 'swiss', 'qr-bill', 'regulations', 'legal'],
    priority: 'high',
  },
  {
    id: 'currencies-supported',
    questionKey: 'faq.currenciesSupported.question',
    answerKey: 'faq.currenciesSupported.answer',
    category: 'general',
    tags: ['currencies', 'chf', 'eur', 'international', 'payments'],
    priority: 'high',
  },
  {
    id: 'payment-reconciliation-homepage',
    questionKey: 'faq.paymentReconciliationHomepage.question',
    answerKey: 'faq.paymentReconciliationHomepage.answer',
    category: 'payments',
    tags: ['reconciliation', 'camt', 'banking', 'automation', 'matching'],
    priority: 'high',
  },
  {
    id: 'data-security-homepage',
    questionKey: 'faq.dataSecurityHomepage.question',
    answerKey: 'faq.dataSecurityHomepage.answer',
    category: 'general',
    tags: ['security', 'gdpr', 'privacy', 'encryption', 'switzerland'],
    priority: 'high',
  },
  {
    id: 'team-collaboration-homepage',
    questionKey: 'faq.teamCollaborationHomepage.question',
    answerKey: 'faq.teamCollaborationHomepage.answer',
    category: 'account',
    tags: ['team', 'collaboration', 'business', 'enterprise', 'roles'],
    priority: 'high',
  },
  {
    id: 'free-plan-limits-homepage',
    questionKey: 'faq.freePlanLimitsHomepage.question',
    answerKey: 'faq.freePlanLimitsHomepage.answer',
    category: 'account',
    tags: ['free-plan', 'limits', 'upgrade', 'billing', 'notifications'],
    priority: 'medium',
  },
  {
    id: 'get-started-homepage',
    questionKey: 'faq.getStartedHomepage.question',
    answerKey: 'faq.getStartedHomepage.answer',
    category: 'general',
    tags: ['getting-started', 'signup', 'free', 'quick-start', 'onboarding'],
    priority: 'high',
  },
  {
    id: 'customize-invoices-homepage',
    questionKey: 'faq.customizeInvoicesHomepage.question',
    answerKey: 'faq.customizeInvoicesHomepage.answer',
    category: 'invoicing',
    tags: ['customization', 'branding', 'templates', 'logo', 'design'],
    priority: 'medium',
  },
  {
    id: 'support-offered-homepage',
    questionKey: 'faq.supportOfferedHomepage.question',
    answerKey: 'faq.supportOfferedHomepage.answer',
    category: 'general',
    tags: ['support', 'email', 'enterprise', 'swiss', 'help'],
    priority: 'medium',
  },
];

// Utility functions
export function searchFAQs(query: string, category?: string): FAQItem[] {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    return category
      ? faqData.filter((item) => item.category === category)
      : faqData;
  }

  // Search by tags since we can't search translated content here
  return faqData.filter((item) => {
    const matchesCategory = !category || item.category === category;
    const matchesSearch = item.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );
    return matchesCategory && matchesSearch;
  });
}

export function getFAQsByCategory(category: string): FAQItem[] {
  return faqData.filter((item) => item.category === category);
}

export function getPopularFAQs(): FAQItem[] {
  return faqData.filter((item) => item.priority === 'high');
}

// Helper function to get translated FAQ items
export function createTranslatedFAQs(
  faqs: FAQItem[],
  translate: (key: string) => string
): TranslatedFAQItem[] {
  return faqs.map((faq) => ({
    ...faq,
    question: translate(faq.questionKey),
    answer: translate(faq.answerKey),
  }));
}

// Helper function to get translated category names
export function createTranslatedCategories(
  translate: (key: string) => string
): Array<FAQCategory & { name: string }> {
  return faqCategories.map((category) => ({
    ...category,
    name: translate(category.nameKey),
  }));
}
