/**
 * Modern Email Layout Component
 *
 * Provides a consistent, modern header and footer for all PayMatch emails.
 * Inspired by Slack's clean design with Swiss branding and just the logo.
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
          {/* Header with Logo Only */}
          <Section style={logoContainer}>
            <Link href={appUrl} style={logoLink}>
              <Img
                src={`${appUrl}/logo.png`}
                alt="PayMatch"
                width="120"
                height="36"
                style={logoImage}
              />
            </Link>
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
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

// Styles - Inspired by Slack's clean design
const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '0px 20px',
  maxWidth: '600px',
};

const logoContainer = {
  marginTop: '32px',
  textAlign: 'center' as const,
};

const logoLink = {
  display: 'inline-block',
  textDecoration: 'none',
};

const logoImage = {
  display: 'block',
  margin: '0 auto',
};

const content = {
  padding: '0 0 40px 0',
};

const footer = {
  padding: '32px 0 50px 0',
  textAlign: 'center' as const,
  borderTop: '1px solid #e2e8f0',
};

const footerText = {
  fontSize: '12px',
  color: '#b7b7b7',
  lineHeight: '15px',
  textAlign: 'center' as const,
  margin: '0 0 8px 0',
};

const footerLink = {
  color: '#b7b7b7',
  textDecoration: 'underline',
};

const unsubscribeLink = {
  color: '#b7b7b7',
  textDecoration: 'underline',
};

export default EmailLayout;
