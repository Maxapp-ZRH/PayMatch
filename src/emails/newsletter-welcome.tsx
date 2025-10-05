/**
 * Modern Newsletter Welcome Email Template
 *
 * Welcome email sent to new newsletter subscribers with unsubscribe option.
 * Inspired by Slack's clean design with modern styling.
 */

import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface NewsletterWelcomeEmailProps {
  firstName: string;
  lastName: string;
  userEmail: string;
  unsubscribeUrl: string;
  appUrl: string;
}

export const NewsletterWelcomeEmail = ({
  firstName,
  userEmail,
  unsubscribeUrl,
  appUrl,
}: NewsletterWelcomeEmailProps) => {
  return (
    <EmailLayout
      preview="Welcome to PayMatch! Get the latest updates on Swiss invoicing and QR-bill compliance."
      appUrl={appUrl}
      unsubscribeUrl={unsubscribeUrl}
      showUnsubscribe={true}
    >
      <Heading style={h1}>Welcome to PayMatch!</Heading>

      <Text style={heroText}>
        Hi {firstName}! You&apos;re now part of Switzerland&apos;s leading
        invoicing community. Get ready for Swiss QR-bill compliance made simple.
      </Text>

      <Text style={text}>
        Updates will be sent to{' '}
        <strong style={{ color: '#E4262A' }}>{userEmail}</strong>. You can
        update your preferences anytime.
      </Text>

      <Text style={text}>You&apos;ll receive regular updates about:</Text>

      <ul style={list}>
        <li style={listItem}>New features & improvements</li>
        <li style={listItem}>Swiss invoicing compliance updates</li>
        <li style={listItem}>QR-bill best practices</li>
        <li style={listItem}>Community success stories</li>
        <li style={listItem}>Exclusive offers & early access</li>
      </ul>

      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/register`}>
          Start Invoicing Now
        </Button>
      </Section>

      <Text style={text}>Questions? Our support team is here to help.</Text>
    </EmailLayout>
  );
};

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

const list = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
  paddingLeft: '20px',
  textAlign: 'left' as const,
};

const listItem = {
  margin: '0 0 8px',
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

export default NewsletterWelcomeEmail;
