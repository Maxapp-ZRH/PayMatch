/**
 * Modern Password Reset Template
 *
 * React Email template for password reset emails.
 * Inspired by Slack's clean design with modern styling.
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
      <Heading style={h1}>Reset your password</Heading>

      <Text style={heroText}>
        Hi {userName}! We received a request to reset your PayMatch password.
        Click below to set a new password.
      </Text>

      <Section style={buttonContainer}>
        <Button style={button} href={resetUrl}>
          Reset Password
        </Button>
      </Section>

      <Text style={text}>
        If you didn&apos;t request this email, there&apos;s nothing to worry
        about, you can safely ignore it.
      </Text>

      <Text style={text}>
        <Link href={resetUrl} style={link}>
          {resetUrl}
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

export default PasswordReset;
