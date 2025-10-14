/**
 * Customer Portal Button Component
 *
 * Button that opens the Stripe Customer Portal for subscription management.
 * Allows customers to update payment methods, view invoices, and manage subscriptions.
 */

'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/marketing_pages/Button';
import { createPortalSession } from '../server/actions/create-portal-session';
import { StripeToast } from '@/lib/toast';

interface CustomerPortalButtonProps {
  orgId: string;
  returnUrl?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function CustomerPortalButton({
  orgId,
  returnUrl,
  variant = 'outline',
  className,
  children,
}: CustomerPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPortal = async () => {
    setIsLoading(true);

    try {
      const result = await createPortalSession({
        orgId,
        returnUrl,
      });

      if (result.success && result.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = result.url;
      } else {
        StripeToast.customerPortal.failed();
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      StripeToast.customerPortal.failed();
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonProps = () => {
    const baseProps = {
      onClick: handleOpenPortal,
      disabled: isLoading,
      className,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseProps,
          color: 'swiss' as const,
        };
      case 'secondary':
        return {
          ...baseProps,
          color: 'gray' as const,
        };
      case 'outline':
      default:
        return {
          ...baseProps,
          color: 'swiss' as const,
          variant: 'outline' as const,
        };
    }
  };

  return (
    <Button {...getButtonProps()}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening Portal...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || 'Manage Billing'}
        </>
      )}
    </Button>
  );
}

// Convenience components for common use cases
export function ManageBillingButton({
  orgId,
  returnUrl,
  className,
}: Omit<CustomerPortalButtonProps, 'children'>) {
  return (
    <CustomerPortalButton
      orgId={orgId}
      returnUrl={returnUrl}
      className={className}
    >
      Manage Billing
    </CustomerPortalButton>
  );
}

export function UpdatePaymentMethodButton({
  orgId,
  returnUrl,
  className,
}: Omit<CustomerPortalButtonProps, 'children'>) {
  return (
    <CustomerPortalButton
      orgId={orgId}
      returnUrl={returnUrl}
      variant="outline"
      size="sm"
      className={className}
    >
      Update Payment Method
    </CustomerPortalButton>
  );
}
