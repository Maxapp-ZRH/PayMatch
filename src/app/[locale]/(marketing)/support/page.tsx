/**
 * Support Page - Redesigned
 *
 * Comprehensive support page with enhanced FAQ search, improved form validation,
 * better typography, and professional feedback modals. Features a clean layout
 * with consistent design patterns and Swiss market focus.
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  AlertTriangle,
  FileText,
  Loader2,
  Search,
  Filter,
  X,
  Lightbulb,
  CreditCard,
  Settings,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { Container } from '@/components/marketing_pages/Container';
import { Button } from '@/components/marketing_pages/Button';
import {
  supportFormSchema,
  supportCategories,
  supportPriorities,
  type SupportFormData,
} from '@/schemas/support';
import {
  faqData,
  faqCategories,
  searchFAQs,
  getPopularFAQs,
  createTranslatedFAQs,
  createTranslatedCategories,
  type TranslatedFAQItem,
} from '@/utils/faq-manager';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// Category icons for FAQ
const categoryIcons = {
  general: Lightbulb,
  account: User,
  invoicing: FileText,
  payments: CreditCard,
  technical: Settings,
  'swiss-compliance': Shield,
} as const;

// Success Modal Component
function SuccessModal({
  isOpen,
  onClose,
  tForm,
}: {
  isOpen: boolean;
  onClose: () => void;
  tForm: (key: string) => string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 sm:mb-6">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                {tForm('modals.success.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {tForm('modals.success.message')}
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{tForm('modals.success.responseTime')}</span>
              </div>
              <Button
                onClick={onClose}
                color="cyan"
                className="w-full text-sm sm:text-base"
              >
                {tForm('modals.success.button')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Error Modal Component
function ErrorModal({
  isOpen,
  onClose,
  errorMessage,
  tForm,
}: {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  tForm: (key: string) => string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-4 sm:mb-6">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                {tForm('modals.error.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {errorMessage || tForm('modals.error.message')}
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 text-sm sm:text-base"
                >
                  {tForm('modals.error.buttons.close')}
                </Button>
                <Button
                  onClick={onClose}
                  color="cyan"
                  className="flex-1 text-sm sm:text-base"
                >
                  {tForm('modals.error.buttons.tryAgain')}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced FAQ Section Component
function EnhancedFAQSection({
  onQuestionClick,
  tForm,
  t,
}: {
  onQuestionClick?: (question: string) => void;
  tForm: (key: string) => string;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const tFaq = useTranslations('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(4);

  // Use the centralized helper function
  const getTranslatedFAQs = useCallback(
    (faqs: typeof faqData) => {
      return createTranslatedFAQs(faqs, tFaq);
    },
    [tFaq]
  );

  // Filter FAQs based on search and category
  const allFilteredFAQs = useMemo((): TranslatedFAQItem[] => {
    const results = searchFAQs(searchQuery, selectedCategory || undefined);
    return getTranslatedFAQs(results);
  }, [searchQuery, selectedCategory, getTranslatedFAQs]);

  // Paginated FAQs
  const filteredFAQs = useMemo((): TranslatedFAQItem[] => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return allFilteredFAQs.slice(0, endIndex);
  }, [allFilteredFAQs, currentPage, questionsPerPage]);

  // Check if there are more questions to load
  const hasMoreQuestions = useMemo(() => {
    return filteredFAQs.length < allFilteredFAQs.length;
  }, [filteredFAQs.length, allFilteredFAQs.length]);

  // Get popular FAQs for quick access
  const popularFAQs = useMemo((): TranslatedFAQItem[] => {
    return getTranslatedFAQs(getPopularFAQs().slice(0, 6));
  }, [getTranslatedFAQs]);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  const loadMoreQuestions = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleQuestionClick = (question: string) => {
    onQuestionClick?.(question);
  };

  // Reset pagination when search or category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-gray-900 mb-3 sm:mb-4">
          Knowledge Base & FAQ Forum
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl">
          Browse our comprehensive knowledge base and find answers to common
          questions. Can&apos;t find what you&apos;re looking for? Contact our
          support team.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base lg:text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {createTranslatedCategories(tFaq).map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory) && (
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                Category:{' '}
                {
                  createTranslatedCategories(tFaq).find(
                    (c) => c.id === selectedCategory
                  )?.name
                }
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600 font-medium underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Forum Stats */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500 mb-1">
              {faqData.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Total Questions
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500 mb-1">
              {faqCategories.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500 mb-1">
              {getPopularFAQs().length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Popular Topics
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500 mb-1">
              24h
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Response Time
            </div>
          </div>
        </div>
      </div>

      {/* Popular FAQs */}
      {!searchQuery && !selectedCategory && (
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Popular Questions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {popularFAQs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 cursor-pointer transition-all duration-200 hover:border-red-200"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleQuestionClick(faq.question)}
              >
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {faq.answer}
                </p>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-red-500 font-medium">
                  <span>Contact support →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {allFilteredFAQs.length}{' '}
            {allFilteredFAQs.length === 1
              ? t('pagination.questionFound')
              : t('pagination.questionsFound')}
            {filteredFAQs.length < allFilteredFAQs.length && (
              <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1 sm:ml-2">
                (
                {t('pagination.showingQuestions', {
                  current: filteredFAQs.length,
                  total: allFilteredFAQs.length,
                })}
                )
              </span>
            )}
          </h3>
        </div>

        <AnimatePresence>
          {filteredFAQs.map((faq, index) => {
            const isExpanded = expandedItems.has(faq.id);
            const Icon =
              categoryIcons[faq.category as keyof typeof categoryIcons];

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 pr-2 sm:pr-4 text-left text-sm sm:text-base lg:text-lg leading-tight">
                          {faq.question}
                        </h4>
                        <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-3">
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {faq.category
                              .replace('-', ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {faq.priority === 'high' ? 'Popular' : faq.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {faq.tags.length} tags
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2 sm:ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100 bg-gray-50">
                        <div className="pt-4 sm:pt-6">
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mt-4 sm:mt-6">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 sm:px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                              >
                                #{tag.toLowerCase()}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleQuestionClick(faq.question)}
                              className="inline-flex items-center px-3 sm:px-4 py-2 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              {tForm('buttons.stillNeedHelp')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredFAQs.length === 0 && (
          <div className="py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('pagination.noQuestionsFound')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('pagination.noQuestionsDescription')}
            </p>
            <button
              onClick={clearFilters}
              className="text-red-500 hover:text-red-600 font-semibold"
            >
              {tForm('buttons.clearFilters')}
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMoreQuestions && filteredFAQs.length > 0 && (
          <div className="text-center pt-8 border-t border-gray-200">
            <motion.button
              onClick={loadMoreQuestions}
              className="inline-flex items-center px-8 py-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{tForm('buttons.loadMoreQuestions')}</span>
              <ChevronDown className="w-5 h-5 ml-2" />
            </motion.button>
            <p className="text-sm text-gray-500 mt-4">
              {allFilteredFAQs.length - filteredFAQs.length}{' '}
              {t('pagination.moreQuestionsAvailable')}
            </p>
            <div className="mt-2 text-xs text-gray-400">
              {t('pagination.showingQuestions', {
                current: filteredFAQs.length,
                total: allFilteredFAQs.length,
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const tForm = useTranslations('support.form');
  const t = useTranslations('support');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      company: '',
      category: 'general',
      priority: 'medium',
      subject: '',
      message: '',
      attachments: [],
      consent: false,
    },
  });

  const watchedCategory = watch('category');
  const watchedPriority = watch('priority');

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setShowSuccessModal(true);
      reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : tForm('modals.error.message')
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = supportCategories.find(
    (cat) => cat.value === watchedCategory
  );
  const selectedPriority = supportPriorities.find(
    (pri) => pri.value === watchedPriority
  );

  const handleFAQQuestionClick = (question: string) => {
    // Pre-fill the subject field with the FAQ question
    const subjectInput = document.getElementById('subject') as HTMLInputElement;
    if (subjectInput) {
      subjectInput.value = question;
      subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Scroll to the form
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Container className="py-8 sm:py-12 lg:py-16">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            className="mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8"
            variants={itemVariants}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
              {tForm('title')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl leading-relaxed mb-6 sm:mb-8">
              {tForm('subtitle')}
            </p>
            <div className="border-t border-gray-200"></div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div className="mb-16" variants={itemVariants}>
            <EnhancedFAQSection
              onQuestionClick={handleFAQQuestionClick}
              tForm={tForm}
              t={t}
            />
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8"
            variants={itemVariants}
          >
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-gray-900 mb-3 sm:mb-4">
                {tForm('stillNeedHelp')}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                {tForm('formSubtitle')}
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              {/* Personal Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {tForm('sections.personalInfo')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
                    >
                      {tForm('fields.name.label')}{' '}
                      {tForm('fields.name.required') && '*'}
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={tForm('fields.name.placeholder')}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {tForm(`validation.${errors.name.message}`)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
                    >
                      {tForm('fields.email.label')}{' '}
                      {tForm('fields.email.required') && '*'}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={tForm('fields.email.placeholder')}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {tForm(`validation.${errors.email.message}`)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
                  >
                    {tForm('fields.company.label')}{' '}
                    {!tForm('fields.company.required') && '(Optional)'}
                  </label>
                  <input
                    {...register('company')}
                    type="text"
                    id="company"
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                    placeholder={tForm('fields.company.placeholder')}
                  />
                </div>
              </div>

              {/* Issue Details */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {tForm('sections.issueDetails')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
                    >
                      {tForm('fields.category.label')}{' '}
                      {tForm('fields.category.required') && '*'}
                    </label>
                    <select
                      {...register('category')}
                      id="category"
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                    >
                      {supportCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {tForm(`categories.${category.value}.label`)}
                        </option>
                      ))}
                    </select>
                    {selectedCategory && (
                      <p className="mt-2 text-sm text-gray-600">
                        {tForm(
                          `categories.${selectedCategory.value}.description`
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
                    >
                      {tForm('fields.priority.label')}{' '}
                      {tForm('fields.priority.required') && '*'}
                    </label>
                    <select
                      {...register('priority')}
                      id="priority"
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                    >
                      {supportPriorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {tForm(`priorities.${priority.value}.label`)}
                        </option>
                      ))}
                    </select>
                    {selectedPriority && (
                      <p
                        className={`mt-2 text-sm font-medium ${selectedPriority.color}`}
                      >
                        {tForm(
                          `priorities.${selectedPriority.value}.description`
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
                >
                  {tForm('fields.subject.label')}{' '}
                  {tForm('fields.subject.required') && '*'}
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  id="subject"
                  className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-sm sm:text-base ${
                    errors.subject ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={tForm('fields.subject.placeholder')}
                />
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {tForm(`validation.${errors.subject.message}`)}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {tForm('sections.message')}
                </h3>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
                  >
                    {tForm('fields.message.label')}{' '}
                    {tForm('fields.message.required') && '*'}
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={4}
                    className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none text-sm sm:text-base ${
                      errors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={tForm('fields.message.placeholder')}
                  />
                  <div className="mt-2 flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>{tForm('fields.message.minLength')}</span>
                    <span
                      className={
                        watch('message')?.length > 2000 ? 'text-red-500' : ''
                      }
                    >
                      {watch('message')?.length || 0}/2000
                    </span>
                  </div>
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      {tForm(`validation.${errors.message.message}`)}
                    </p>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <input
                    {...register('consent')}
                    type="checkbox"
                    id="consent"
                    className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="consent"
                    className="text-xs sm:text-sm text-gray-700 leading-relaxed"
                  >
                    {tForm('fields.consent.label').split('Privacy Policy')[0]}
                    <Link
                      href="/privacy"
                      className="text-red-500 hover:text-red-600 underline font-semibold"
                    >
                      Privacy Policy
                    </Link>
                    {tForm('fields.consent.label').split('Privacy Policy')[1]}
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-sm text-red-600 font-medium">
                    {tForm(`validation.${errors.consent.message}`)}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{tForm('buttons.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{tForm('buttons.sendMessage')}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            variants={itemVariants}
          >
            <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {tForm('contactInfo.emailSupport.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {tForm('contactInfo.emailSupport.email')}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {tForm('contactInfo.emailSupport.availability')}
              </p>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {tForm('contactInfo.responseTime.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {tForm('contactInfo.responseTime.time')}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {tForm('contactInfo.responseTime.note')}
              </p>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {tForm('contactInfo.emergency.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {tForm('contactInfo.emergency.instruction')}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {tForm('contactInfo.emergency.note')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        tForm={tForm}
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        tForm={tForm}
      />
    </>
  );
}
