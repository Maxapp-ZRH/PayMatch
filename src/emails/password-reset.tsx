/**
 * Password Reset Template
 *
 * React Email template for password reset emails.
 * Uses the existing email system with proper branding and unsubscribe functionality.
 */

import React from 'react';
import { Button, Heading, Link, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface PasswordResetProps {
  resetUrl: string;
  userName: string;
  appUrl: string;
}

export function PasswordReset({
  resetUrl,
  userName,
  appUrl,
}: PasswordResetProps) {
  return (
    <EmailLayout
      preview="Reset your PayMatch password"
      appUrl={appUrl}
      showUnsubscribe={false}
    >
      <Section style={header}>
        <Heading style={h1}>Reset Your Password</Heading>
      </Section>

      <Section style={content}>
        <Text style={text}>Hi {userName},</Text>

        <Text style={text}>
          We received a request to reset your PayMatch password. Click below to
          set a new password.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
        </Section>

        <Text style={text}>
          This link expires in 24 hours. If you didn&apos;t request this, ignore
          this email.
        </Text>

        <Text style={text}>
          <Link href={resetUrl} style={link}>
            {resetUrl}
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

export default PasswordReset;
