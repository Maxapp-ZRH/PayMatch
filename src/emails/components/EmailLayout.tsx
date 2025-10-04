/**
 * Common Email Layout Component
 *
 * Provides a consistent header and footer for all PayMatch emails.
 * Includes the PayMatch logo with text and Swiss branding.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  appUrl?: string;
  unsubscribeUrl?: string;
  showUnsubscribe?: boolean;
}

export const EmailLayout = ({
  children,
  preview,
  appUrl = 'https://paymatch.app',
  unsubscribeUrl,
  showUnsubscribe = true,
}: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Link href={appUrl} style={logoLink}>
              <Img
                src={`${appUrl}/logo.png`}
                alt="PayMatch"
                width="40"
                height="40"
                style={logoImage}
              />
              <Text style={logoText}>PayMatch</Text>
            </Link>
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>PayMatch - Swiss QR-Bill Invoicing</Text>
            <Text style={footerText}>
              <Link href={`${appUrl}/support`} style={footerLink}>
                Support
              </Link>
              {' • '}
              <Link href={`${appUrl}/privacy`} style={footerLink}>
                Privacy Policy
              </Link>
              {' • '}
              <Link href={`${appUrl}/terms`} style={footerLink}>
                Terms of Service
              </Link>
            </Text>
            {showUnsubscribe && unsubscribeUrl && (
              <Text style={footerText}>
                <Link href={unsubscribeUrl} style={unsubscribeLink}>
                  Unsubscribe from these emails
                </Link>
              </Text>
            )}
            <Text style={footerText}>
              © {new Date().getFullYear()} PayMatch. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px 24px',
  borderBottom: '1px solid #e2e8f0',
  textAlign: 'center' as const,
};

const logoLink = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none',
  color: '#1e293b',
};

const logoImage = {
  display: 'block',
};

const logoText = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0',
  letterSpacing: '-0.025em',
};

const content = {
  padding: '24px',
};

const footer = {
  padding: '24px',
  borderTop: '1px solid #e2e8f0',
  textAlign: 'center' as const,
  backgroundColor: '#f8fafc',
};

const footerText = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const footerLink = {
  color: '#dc2626',
  textDecoration: 'none',
  fontWeight: '500',
};

const unsubscribeLink = {
  color: '#dc2626',
  textDecoration: 'underline',
  fontWeight: '500',
};

export default EmailLayout;
