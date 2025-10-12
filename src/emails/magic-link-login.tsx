/**
 * Magic Link Login Email Template
 *
 * React Email template for magic link authentication.
 * Clean design matching the existing email templates.
 */

import React from 'react';
import { Button, Heading, Link, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface MagicLinkLoginProps {
  magicLinkUrl: string;
  userName: string;
  appUrl: string;
  unsubscribeUrl?: string;
}

export function MagicLinkLogin({
  magicLinkUrl,
  userName,
  appUrl,
  unsubscribeUrl,
}: MagicLinkLoginProps) {
  return (
    <EmailLayout
      preview="Your magic link to sign in to PayMatch"
      appUrl={appUrl}
      unsubscribeUrl={unsubscribeUrl}
      showUnsubscribe={!!unsubscribeUrl}
    >
      <Heading style={h1}>Sign in to PayMatch</Heading>

      <Text style={heroText}>
        Hi {userName}! Click the button below to sign in to your PayMatch
        account. No password required!
      </Text>

      <Section style={buttonContainer}>
        <Button style={button} href={magicLinkUrl}>
          Sign In to PayMatch
        </Button>
      </Section>

      <Text style={text}>
        This magic link will expire in 1 hour for security. If you didn&apos;t
        request this sign-in, you can safely ignore this email.
      </Text>

      <Text style={text}>
        <Link href={magicLinkUrl} style={link}>
          {magicLinkUrl}
        </Link>
      </Text>
    </EmailLayout>
  );
}

// Styles - Matching the existing email templates
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

export default MagicLinkLogin;
