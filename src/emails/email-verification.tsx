/**
 * Email Verification Template
 *
 * React Email template for user email verification.
 * Uses the existing email system with proper branding and unsubscribe functionality.
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
      <Section style={header}>
        <Heading style={h1}>Welcome to PayMatch!</Heading>
      </Section>

      <Section style={content}>
        <Text style={text}>Hi {userName},</Text>

        <Text style={text}>
          Welcome to PayMatch! Please verify your email to start creating Swiss
          QR-bill compliant invoices.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Verify Email
          </Button>
        </Section>

        <Text style={text}>
          This link expires in 24 hours. If you didn&apos;t create this account,
          ignore this email.
        </Text>

        <Text style={text}>
          <Link href={verificationUrl} style={link}>
            {verificationUrl}
          </Link>
        </Text>

        <Text style={text}>
          Best regards,
          <br />
          The PayMatch Team
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Styles
const header = {
  padding: '0 0 24px 0',
  textAlign: 'center' as const,
};

const content = {
  padding: '0',
};

const h1 = {
  color: '#E4262A',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  lineHeight: '1.25',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#E4262A',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const link = {
  color: '#E4262A',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

export default EmailVerification;
