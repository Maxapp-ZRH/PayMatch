/**
 * Modern Email Verification Template
 *
 * React Email template for user email verification.
 * Inspired by Slack's clean design with modern styling.
 */

import React from 'react';
import { Button, Heading, Link, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface EmailVerificationProps {
  verificationUrl: string;
  userName: string;
  appUrl: string;
  unsubscribeUrl?: string;
}

export function EmailVerification({
  verificationUrl,
  userName,
  appUrl,
  unsubscribeUrl,
}: EmailVerificationProps) {
  return (
    <EmailLayout
      preview="Verify your PayMatch account to start invoicing"
      appUrl={appUrl}
      unsubscribeUrl={unsubscribeUrl}
      showUnsubscribe={!!unsubscribeUrl}
    >
      <Heading style={h1}>Welcome to PayMatch!</Heading>

      <Text style={heroText}>
        Hi {userName}! Please verify your email address to complete your account
        setup and start creating Swiss QR-bill compliant invoices.
      </Text>

      <Section style={buttonContainer}>
        <Button style={button} href={verificationUrl}>
          Verify Email Address
        </Button>
      </Section>

      <Text style={text}>
        If you didn&apos;t create this account, you can safely ignore this
        email.
      </Text>

      <Text style={text}>
        <Link href={verificationUrl} style={link}>
          {verificationUrl}
        </Link>
      </Text>
    </EmailLayout>
  );
}

// Styles - Inspired by Slack's clean design
const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
  textAlign: 'center' as const,
};

const heroText = {
  fontSize: '20px',
  lineHeight: '28px',
  marginBottom: '30px',
  color: '#1d1c1d',
  textAlign: 'center' as const,
};

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '40px 0',
};

const button = {
  backgroundColor: '#E4262A',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
  cursor: 'pointer',
};

const link = {
  color: '#E4262A',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  fontSize: '12px',
};

export default EmailVerification;
