/**
 * Unified Unsubscribe Page
 *
 * Handles unsubscription for all email types with token validation and user feedback.
 * Provides confirmation and success/error states for unsubscribe process.
 * Supports newsletter, support, and transactional email unsubscription.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/marketing_pages/Container';
import { Button } from '@/components/marketing_pages/Button';
import Image from 'next/image';
import Link from 'next/link';

interface Subscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  emailType:
    | 'newsletter_promotional'
    | 'newsletter_informational'
    | 'newsletter_news'
    | 'support'
    | 'transactional'
    | 'security'
    | 'legal'
    | 'business_notifications'
    | 'overdue_alerts';
}

interface UnsubscribeResponse {
  success: boolean;
  message: string;
  subscriber: Subscriber;
  alreadyUnsubscribed?: boolean;
  error?: string;
}

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const errorParam = searchParams.get('error');

  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailType, setEmailType] = useState<
    | 'newsletter_promotional'
    | 'newsletter_informational'
    | 'newsletter_news'
    | 'support'
    | 'transactional'
    | 'security'
    | 'legal'
    | 'business_notifications'
    | 'overdue_alerts'
  >('newsletter_promotional');

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'invalid-token':
        return 'Invalid or expired unsubscribe link. Please request a new one.';
      case 'server-error':
        return 'Server error occurred. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  // Helper function to get email type display name
  const getEmailTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'newsletter_promotional':
        return 'PayMatch Newsletter';
      case 'support':
        return 'Support Emails';
      case 'transactional':
        return 'Transactional Emails';
      default:
        return 'Email Updates';
    }
  };

  useEffect(() => {
    // Handle error from URL parameters
    if (errorParam) {
      setError(getErrorMessage(errorParam));
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid unsubscribe link');
      setIsLoading(false);
      return;
    }

    // Fetch subscriber data
    const fetchSubscriber = async () => {
      try {
        const response = await fetch(`/api/email/unsubscribe?token=${token}`);
        const data: UnsubscribeResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch subscription data');
        }

        setSubscriber(data.subscriber);
        setEmailType(data.subscriber.emailType);

        if (data.alreadyUnsubscribed) {
          setIsUnsubscribed(true);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load subscription data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriber();
  }, [token, errorParam]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setIsUnsubscribing(true);
    setError(null);

    try {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data: UnsubscribeResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setIsUnsubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container>
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Return to Home
            </Link>
          </motion.div>
        </Container>
      </div>
    );
  }

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container>
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Unsubscribed Successfully
            </h1>
            <p className="text-gray-600 mb-6">
              You have been unsubscribed from{' '}
              {getEmailTypeDisplayName(emailType)}. You will no longer receive{' '}
              {emailType === 'newsletter_promotional' ? 'updates' : 'emails'}{' '}
              from us.
            </p>
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button color="cyan" className="w-full">
                  Return to PayMatch
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Changed your mind? You can always{' '}
                <Link
                  href="/register"
                  className="text-cyan-600 hover:text-cyan-700"
                >
                  sign up for PayMatch
                </Link>{' '}
                to stay updated.
              </p>
            </div>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container>
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <Image
              src="/logo.png"
              alt="PayMatch"
              width={48}
              height={48}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Unsubscribe from {getEmailTypeDisplayName(emailType)}
            </h1>
            <p className="text-gray-600">
              Are you sure you want to unsubscribe from{' '}
              {getEmailTypeDisplayName(emailType).toLowerCase()}?
            </p>
          </div>

          {subscriber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">
                {emailType === 'newsletter_promotional'
                  ? 'Subscribed as:'
                  : 'Email address:'}
              </p>
              {(subscriber.firstName || subscriber.lastName) && (
                <p className="font-medium text-gray-900">
                  {subscriber.firstName} {subscriber.lastName}
                </p>
              )}
              <p className="text-sm text-gray-600">{subscriber.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Type: {getEmailTypeDisplayName(subscriber.emailType)}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleUnsubscribe}
              disabled={isUnsubscribing}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isUnsubscribing ? 'Unsubscribing...' : 'Yes, Unsubscribe'}
            </Button>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {emailType === 'newsletter_promotional'
                ? 'You can always resubscribe by visiting our website and using the newsletter signup form.'
                : 'You can always re-enable these emails by contacting our support team.'}
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
