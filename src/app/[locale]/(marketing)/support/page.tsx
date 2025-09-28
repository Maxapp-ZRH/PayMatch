/**
 * Support Page - Redesigned
 *
 * Comprehensive support page with enhanced FAQ search, improved form validation,
 * better typography, and professional feedback modals. Features a clean layout
 * with consistent design patterns and Swiss market focus.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
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
import { faqData, faqCategories, searchFAQs, getPopularFAQs } from '@/data/faq';

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
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Thank you for contacting us. We&apos;ve received your message
                and our team will get back to you within 24 hours.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
                <Clock className="w-4 h-4" />
                <span>Typical response time: 24 hours</span>
              </div>
              <Button onClick={onClose} color="cyan" className="w-full">
                Got it, thanks!
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
}: {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Failed to Send Message
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {errorMessage ||
                  'An unexpected error occurred. Please try again.'}
              </p>
              <div className="flex space-x-3">
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Close
                </Button>
                <Button onClick={onClose} color="cyan" className="flex-1">
                  Try Again
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
}: {
  onQuestionClick?: (question: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(4);

  // Filter FAQs based on search and category
  const allFilteredFAQs = useMemo(() => {
    return searchFAQs(searchQuery, selectedCategory || undefined);
  }, [searchQuery, selectedCategory]);

  // Paginated FAQs
  const filteredFAQs = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return allFilteredFAQs.slice(0, endIndex);
  }, [allFilteredFAQs, currentPage, questionsPerPage]);

  // Check if there are more questions to load
  const hasMoreQuestions = useMemo(() => {
    return filteredFAQs.length < allFilteredFAQs.length;
  }, [filteredFAQs.length, allFilteredFAQs.length]);

  // Get popular FAQs for quick access
  const popularFAQs = useMemo(() => getPopularFAQs().slice(0, 6), []);

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
    <div className="bg-gray-50 rounded-2xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
          Knowledge Base & FAQ Forum
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Browse our comprehensive knowledge base and find answers to common
          questions. Can&apos;t find what you&apos;re looking for? Contact our
          support team.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {faqCategories.map((category) => {
            const Icon =
              categoryIcons[category.id as keyof typeof categoryIcons];
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
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
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                Category:{' '}
                {faqCategories.find((c) => c.id === selectedCategory)?.name}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Forum Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600 mb-1">
              {faqData.length}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600 mb-1">
              {faqCategories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600 mb-1">
              {getPopularFAQs().length}
            </div>
            <div className="text-sm text-gray-600">Popular Topics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600 mb-1">24h</div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
        </div>
      </div>

      {/* Popular FAQs */}
      {!searchQuery && !selectedCategory && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularFAQs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer transition-all duration-200 hover:border-teal-200"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleQuestionClick(faq.question)}
              >
                <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                  {faq.question}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {faq.answer}
                </p>
                <div className="mt-4 flex items-center text-sm text-teal-600 font-medium">
                  <span>Contact support →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {allFilteredFAQs.length}{' '}
            {allFilteredFAQs.length === 1 ? 'Question' : 'Questions'} Found
            {filteredFAQs.length < allFilteredFAQs.length && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Showing {filteredFAQs.length} of {allFilteredFAQs.length})
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
                  className="w-full px-6 py-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-teal-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 pr-4 text-left text-lg leading-tight">
                          {faq.question}
                        </h4>
                        <div className="flex items-center space-x-4 mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                            {faq.category
                              .replace('-', ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {faq.priority === 'high' ? 'Popular' : faq.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {faq.tags.length} tags
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
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
                      <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                        <div className="pt-6">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-6">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full font-medium hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors"
                              >
                                #{tag.toLowerCase()}
                              </span>
                            ))}
                          </div>
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleQuestionClick(faq.question)}
                              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Still need help? Contact support
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
              No questions found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse all categories.
            </p>
            <button
              onClick={clearFilters}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMoreQuestions && filteredFAQs.length > 0 && (
          <div className="text-center pt-8 border-t border-gray-200">
            <motion.button
              onClick={loadMoreQuestions}
              className="inline-flex items-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Load More Questions</span>
              <ChevronDown className="w-5 h-5 ml-2" />
            </motion.button>
            <p className="text-sm text-gray-500 mt-4">
              {allFilteredFAQs.length - filteredFAQs.length} more questions
              available
            </p>
            <div className="mt-2 text-xs text-gray-400">
              Showing {filteredFAQs.length} of {allFilteredFAQs.length}{' '}
              questions
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
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
        throw new Error('Failed to send message');
      }

      setShowSuccessModal(true);
      reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'An unexpected error occurred'
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
      <Container className="py-16">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="mb-16 px-8" variants={itemVariants}>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Get Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed mb-8">
              We&apos;re here to help! Find answers in our FAQ section or send
              us a message and we&apos;ll get back to you as soon as possible.
            </p>
            <div className="border-t border-gray-200"></div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div className="mb-16" variants={itemVariants}>
            <EnhancedFAQSection onQuestionClick={handleFAQQuestionClick} />
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-8"
            variants={itemVariants}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg text-gray-600">
                Send us a message and our team will get back to you within 24
                hours.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Company (Optional)
                  </label>
                  <input
                    {...register('company')}
                    type="text"
                    id="company"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              {/* Issue Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Issue Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Category *
                    </label>
                    <select
                      {...register('category')}
                      id="category"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    >
                      {supportCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {selectedCategory && (
                      <p className="mt-2 text-sm text-gray-600">
                        {selectedCategory.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Priority *
                    </label>
                    <select
                      {...register('priority')}
                      id="priority"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    >
                      {supportPriorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                    {selectedPriority && (
                      <p
                        className={`mt-2 text-sm font-medium ${selectedPriority.color}`}
                      >
                        {selectedPriority.description}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Subject *
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    id="subject"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                      errors.subject ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of your issue"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Message</h3>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Detailed Message *
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={6}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none ${
                      errors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Please provide as much detail as possible about your issue, including steps to reproduce if applicable..."
                  />
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>Minimum 10 characters</span>
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
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    {...register('consent')}
                    type="checkbox"
                    id="consent"
                    className="mt-1 h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    I agree to the{' '}
                    <Link
                      href="/privacy"
                      className="text-teal-600 hover:text-teal-700 underline font-semibold"
                    >
                      Privacy Policy
                    </Link>{' '}
                    and consent to PayMatch processing my personal data to
                    respond to this inquiry. *
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-sm text-red-600 font-medium">
                    {errors.consent.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={itemVariants}
          >
            <div className="p-8 bg-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl mb-6 flex items-center justify-center">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Email Support
              </h3>
              <p className="text-gray-600 mb-4">support@paymatch.app</p>
              <p className="text-sm text-gray-500">Available 24/7</p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl mb-6 flex items-center justify-center">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Response Time
              </h3>
              <p className="text-gray-600 mb-4">Within 24 hours</p>
              <p className="text-sm text-gray-500">Usually much faster</p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl mb-6 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Emergency
              </h3>
              <p className="text-gray-600 mb-4">Use urgent priority</p>
              <p className="text-sm text-gray-500">For critical issues</p>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />
    </>
  );
}
