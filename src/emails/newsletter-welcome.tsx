/**
 * Newsletter Welcome Email Template
 *
 * Welcome email sent to new newsletter subscribers with unsubscribe option.
 * Includes branding, feature highlights, and clear unsubscribe functionality.
 */

import { Button, Heading, Link, Section, Text } from '@react-email/components';
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
  lastName,
  userEmail,
  unsubscribeUrl,
  appUrl,
}: NewsletterWelcomeEmailProps) => {
  return (
    <EmailLayout
      preview="Welcome to PayMatch! Get the latest updates on Swiss invoicing and QR-bill compliance."
      appUrl={appUrl}
    >
      {/* Header */}
      <Section style={header}>
        <Heading style={h1}>Welcome to PayMatch!</Heading>
      </Section>

      {/* Main Content */}
      <Section style={content}>
        <Text style={text}>
          Dear {firstName} {lastName},
        </Text>

        <Text style={text}>
          Welcome to PayMatch! You&apos;re now part of Switzerland&apos;s
          leading invoicing community.
        </Text>

        <Text style={text}>
          Updates sent to{' '}
          <strong style={{ color: '#E4262A' }}>{userEmail}</strong>. Update
          preferences anytime via unsubscribe link below.
        </Text>

        <Text style={text}>You&apos;ll receive regular updates about:</Text>

        <ul style={list}>
          <li style={listItem}>New features & improvements</li>
          <li style={listItem}>Swiss invoicing compliance updates</li>
          <li style={listItem}>QR-bill best practices</li>
          <li style={listItem}>Community success stories</li>
          <li style={listItem}>Exclusive offers & early access</li>
        </ul>

        <Text style={text}>
          Ready? Create your first Swiss QR-bill invoice in minutes.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${appUrl}/register`}>
            Start Invoicing Now
          </Button>
        </Section>

        <Text style={text}>Questions? Our support team is here to help.</Text>

        <Text style={text}>Welcome aboard, {firstName}!</Text>

        <Text style={text}>
          Best regards,
          <br />
          The PayMatch Team
        </Text>
      </Section>

      {/* Unsubscribe Section */}
      <Section style={unsubscribeSection}>
        <Text style={unsubscribeText}>
          You&apos;re receiving this email because {firstName} {lastName} (
          {userEmail}) subscribed to the PayMatch newsletter.
        </Text>
        <Text style={unsubscribeText}>
          <Link href={unsubscribeUrl} style={unsubscribeLink}>
            Unsubscribe from this newsletter
          </Link>
        </Text>
      </Section>
    </EmailLayout>
  );
};

// Styles
const header = {
  padding: '0 0 24px 0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  padding: '0',
  lineHeight: '1.25',
};

const content = {
  padding: '0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px',
};

const list = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px',
  paddingLeft: '20px',
};

const listItem = {
  margin: '0 0 8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#E4262A',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: 'none',
  cursor: 'pointer',
};

const unsubscribeSection = {
  borderTop: '1px solid #e5e7eb',
  padding: '24px 0 0 0',
  marginTop: '24px',
};

const unsubscribeText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
};

const unsubscribeLink = {
  color: '#dc2626',
  textDecoration: 'underline',
};

export default NewsletterWelcomeEmail;
