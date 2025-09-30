/**
 * Support Confirmation Email Template
 *
 * React Email template for confirming support request submission.
 * Sent to users after they submit a support form.
 */

import {
  Body,
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
import { getEmailLogoConfig, generateCombinedLogo } from './logo-utils';

interface SupportConfirmationEmailProps {
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  supportEmail: string;
  appUrl: string;
}

export const SupportConfirmationEmail = ({
  userName,
  userEmail,
  subject,
  category,
  priority,
  supportEmail,
  appUrl,
}: SupportConfirmationEmailProps) => {
  const logoConfig = getEmailLogoConfig(appUrl, 'large');

  const priorityColor =
    {
      urgent: '#dc2626',
      high: '#ea580c',
      medium: '#d97706',
      low: '#16a34a',
    }[priority] || '#16a34a';

  const priorityLabel =
    {
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    }[priority] || 'Low';

  return (
    <Html>
      <Head />
      <Preview>We&apos;ve received your support request - PayMatch</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div
              dangerouslySetInnerHTML={{
                __html: generateCombinedLogo(logoConfig, 'PayMatch', '#E4262A'),
              }}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Support Request Received</Heading>

            <Text style={text}>Hi {userName},</Text>

            <Text style={text}>
              Thank you for contacting PayMatch support! We&apos;ve received
              your request and our team will get back to you as soon as
              possible.
            </Text>

            {/* Request Details */}
            <Section style={detailsBox}>
              <Heading style={h2}>Your Request Details</Heading>

              <Text style={detailText}>
                <strong>Subject:</strong> {subject}
              </Text>
              <Text style={detailText}>
                <strong>Category:</strong> {category}
              </Text>
              <Text style={detailText}>
                <strong>Priority:</strong>{' '}
                <span style={{ color: priorityColor, fontWeight: 'bold' }}>
                  {priorityLabel}
                </span>
              </Text>
              <Text style={detailText}>
                <strong>Submitted:</strong>{' '}
                {new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
              </Text>
            </Section>

            {/* Response Time Info */}
            <Section style={responseTimeBox}>
              <Heading style={h3}>What happens next?</Heading>
              <Text style={text}>
                • Our support team will review your request within 24 hours •
                You&apos;ll receive a response at <strong>{userEmail}</strong>•
                For urgent issues, we&apos;ll prioritize your request • You can
                always reach us directly at {supportEmail}
              </Text>
            </Section>

            {/* Helpful Links */}
            <Section style={linksBox}>
              <Heading style={h3}>Need immediate help?</Heading>
              <Text style={text}>
                Check out our{' '}
                <Link href={`${appUrl}/support`} style={link}>
                  FAQ section
                </Link>{' '}
                for quick answers to common questions.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated confirmation. Please do not reply to this
              email.
            </Text>
            <Text style={footerText}>
              If you need to add more information to your request, please reply
              to our support team at {supportEmail}.
            </Text>
            <Text style={footerText}>
              Best regards,
              <br />
              The PayMatch Team
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
  padding: '20px 30px',
  borderBottom: '1px solid #e5e7eb',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '30px',
};

const h1 = {
  color: '#E4262A',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  lineHeight: '1.25',
};

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const h3 = {
  color: '#374151',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px 0',
};

const detailText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
};

const detailsBox = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #e5e7eb',
};

const responseTimeBox = {
  backgroundColor: '#f0f9ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #bae6fd',
};

const linksBox = {
  backgroundColor: '#f0fdf4',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #bbf7d0',
};

const link = {
  color: '#E4262A',
  textDecoration: 'underline',
  fontWeight: 'bold',
};

const footer = {
  padding: '20px 30px',
  borderTop: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
};

export default SupportConfirmationEmail;
