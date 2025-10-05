/**
 * Modern Support Confirmation Email Template
 *
 * React Email template for confirming support request submission.
 * Inspired by Slack's clean design with modern styling.
 */

import { Heading, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface SupportConfirmationEmailProps {
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  supportEmail: string;
  appUrl: string;
  unsubscribeUrl?: string;
}

export const SupportConfirmationEmail = ({
  userName,
  userEmail,
  subject,
  category,
  priority,
  supportEmail,
  appUrl,
  unsubscribeUrl,
}: SupportConfirmationEmailProps) => {
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
    <EmailLayout
      preview="We've received your support request - PayMatch"
      appUrl={appUrl}
      unsubscribeUrl={unsubscribeUrl}
      showUnsubscribe={!!unsubscribeUrl}
    >
      <Heading style={h1}>Support request received</Heading>

      <Text style={heroText}>
        Hi {userName}! We&apos;ve received your support request and will respond
        within 24 hours.
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
        <Heading style={h3}>Next Steps</Heading>
        <Text style={text}>
          • Response within 24 hours to <strong>{userEmail}</strong>
          <br />
          • Urgent issues prioritized
          <br />• Direct contact: {supportEmail}
        </Text>
      </Section>

      {/* Helpful Links */}
      <Section style={linksBox}>
        <Text style={text}>
          Quick answers:{' '}
          <Link href={`${appUrl}/support`} style={link}>
            FAQ
          </Link>
        </Text>
      </Section>
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

const h2 = {
  color: '#1d1c1d',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#1d1c1d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '20px 0 10px 0',
  textAlign: 'center' as const,
};

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const detailText = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  textAlign: 'left' as const,
};

const detailsBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginBottom: '30px',
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const responseTimeBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginBottom: '30px',
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const linksBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginBottom: '30px',
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const link = {
  color: '#E4262A',
  textDecoration: 'underline',
  fontWeight: '600',
};

export default SupportConfirmationEmail;
