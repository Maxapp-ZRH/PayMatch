/**
 * FAQ Section Component
 *
 * Interactive FAQ section with search functionality, category filtering,
 * and expandable questions. Helps users find answers before submitting support tickets.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Filter,
  X,
  Settings,
} from 'lucide-react';

import {
  faqData,
  faqCategories,
  getPopularFAQs,
  createTranslatedFAQs,
  createTranslatedCategories,
} from '@/utils/faq-manager';
import { useTranslations } from 'next-intl';

// Category icons are now imported from faqCategories in the data file

interface FAQSectionProps {
  onQuestionClick?: (question: string) => void;
}

export function FAQSection({ onQuestionClick }: FAQSectionProps) {
  const t = useTranslations('support.faqSection');
  const tFaq = useTranslations('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Use the centralized helper function
  const getTranslatedFAQs = useCallback(
    (faqs: typeof faqData) => {
      return createTranslatedFAQs(faqs, tFaq);
    },
    [tFaq]
  );

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let results = faqData;

    // Filter by category
    if (selectedCategory) {
      results = results.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query (search in translated content)
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      results = results.filter((item) => {
        const translatedQuestion = tFaq(item.questionKey).toLowerCase();
        const translatedAnswer = tFaq(item.answerKey).toLowerCase();
        return (
          translatedQuestion.includes(searchTerm) ||
          translatedAnswer.includes(searchTerm) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      });
    }

    const translatedResults = getTranslatedFAQs(results);
    return showAll ? translatedResults : translatedResults.slice(0, 6);
  }, [searchQuery, selectedCategory, showAll, getTranslatedFAQs, tFaq]);

  // Get popular FAQs for quick access
  const popularFAQs = useMemo(
    () => getTranslatedFAQs(getPopularFAQs().slice(0, 3)),
    [getTranslatedFAQs]
  );

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
  };

  const handleQuestionClick = (question: string) => {
    onQuestionClick?.(question);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-xl mb-8">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl mb-6">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('allCategories')}
            </button>
            {createTranslatedCategories(tFaq).map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
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
              <span className="text-sm text-gray-600">
                {t('activeFilters')}
              </span>
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {t('searchLabel')}: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedCategory && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {t('categoryLabel')}:{' '}
                  {
                    createTranslatedCategories(tFaq).find(
                      (c) => c.id === selectedCategory
                    )?.name
                  }
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                {t('clearAll')}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Popular FAQs */}
      {!searchQuery && !selectedCategory && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('popularQuestions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularFAQs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleQuestionClick(faq.question)}
              >
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {faq.question}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FAQ List */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredFAQs.length}{' '}
            {filteredFAQs.length === 1
              ? t('questionFound')
              : t('questionsFound')}
          </h3>
          {filteredFAQs.length > 6 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Show all {faqData.length} questions
            </button>
          )}
        </div>

        <AnimatePresence>
          {filteredFAQs.map((faq, index) => {
            const isExpanded = expandedItems.has(faq.id);
            const category = faqCategories.find(
              (cat) => cat.id === faq.category
            );
            const Icon = category?.icon || Settings; // fallback to Settings icon

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 pr-4">
                          {faq.question}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 capitalize">
                            {faq.category}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {faq.priority === 'high' ? 'Popular' : faq.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
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
                      <div className="px-6 pb-4 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleQuestionClick(faq.question)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Still need help? Contact support →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noQuestionsFound')}
            </h3>
            <p className="text-gray-600 mb-4">{t('noQuestionsDescription')}</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('clearFilters')}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
