/**
 * Newsletter Welcome Email Template
 *
 * Welcome email sent to new newsletter subscribers with unsubscribe option.
 * Includes branding, feature highlights, and clear unsubscribe functionality.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewsletterWelcomeEmailProps {
  firstName: string;
  lastName: string;
  userEmail: string;
  unsubscribeUrl: string;
  appUrl: string;
}

export const NewsletterWelcomeEmail = ({
  firstName,
  unsubscribeUrl,
  appUrl,
}: NewsletterWelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to PayMatch! Get the latest updates on Swiss invoicing and
        QR-bill compliance.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${appUrl}/logo.png`}
              width="40"
              height="40"
              alt="PayMatch"
              style={logo}
            />
            <Heading style={h1}>Welcome to PayMatch!</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>Hi {firstName},</Text>

            <Text style={text}>
              Thank you for subscribing to the PayMatch newsletter! We&apos;re
              excited to have you join our community of Swiss businesses and
              freelancers who are revolutionizing their invoicing process.
            </Text>

            <Text style={text}>You&apos;ll receive regular updates about:</Text>

            <ul style={list}>
              <li style={listItem}>New PayMatch features and improvements</li>
              <li style={listItem}>
                Swiss invoicing regulations and compliance updates
              </li>
              <li style={listItem}>QR-bill best practices and tips</li>
              <li style={listItem}>Success stories from our community</li>
              <li style={listItem}>
                Exclusive offers and early access to new features
              </li>
            </ul>

            <Text style={text}>
              Ready to get started? Create your first invoice in minutes with
              our Swiss QR-bill compliant system.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/register`}>
                Start Invoicing Now
              </Button>
            </Section>

            <Text style={text}>
              If you have any questions, feel free to reach out to our support
              team. We&apos;re here to help!
            </Text>

            <Text style={text}>
              Best regards,
              <br />
              The PayMatch Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you subscribed to the
              PayMatch newsletter.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe from this newsletter
              </Link>
            </Text>
            <Text style={footerText}>
              PayMatch - Swiss invoicing made simple
              <br />
              <Link href={appUrl} style={link}>
                {appUrl}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  marginBottom: '16px',
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
  padding: '0 24px',
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
  backgroundColor: '#0891b2',
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

const footer = {
  borderTop: '1px solid #e5e7eb',
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
};

const unsubscribeLink = {
  color: '#dc2626',
  textDecoration: 'underline',
};

const link = {
  color: '#0891b2',
  textDecoration: 'underline',
};

export default NewsletterWelcomeEmail;
