/**
 * Success Step Component
 *
 * Final step of the onboarding wizard - completion confirmation.
 * Shows success message and next steps.
 */

'use client';

import { CheckCircle, ArrowRight, FileText, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { StepProps } from '../../types';

export function SuccessStep({}: StepProps) {
  const router = useRouter();

  const handleComplete = () => {
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900">
          Welcome to PayMatch! 🎉
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Your account has been set up successfully. You&apos;re now ready to
          create Swiss QR-Bill compliant invoices and manage your business
          finances.
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          What&apos;s Next?
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create First Invoice */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Create Your First Invoice
            </h4>
            <p className="text-sm text-gray-600">
              Start by creating your first Swiss QR-Bill compliant invoice
            </p>
          </div>

          {/* Add Clients */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Add Your Clients
            </h4>
            <p className="text-sm text-gray-600">
              Import or add your existing clients to get started quickly
            </p>
          </div>

          {/* Explore Features */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Explore Features
            </h4>
            <p className="text-sm text-gray-600">
              Discover all the powerful features PayMatch has to offer
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">5</div>
          <div className="text-sm text-gray-600">Free Invoices</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
          <div className="text-sm text-gray-600">Swiss QR-Bill Compliant</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
          <div className="text-sm text-gray-600">Support Available</div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="pt-6">
        <button
          onClick={handleComplete}
          className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
