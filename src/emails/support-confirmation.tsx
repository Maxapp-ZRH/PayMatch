/**
 * Support Confirmation Email Template
 *
 * React Email template for confirming support request submission.
 * Sent to users after they submit a support form.
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
      {/* Header */}
      <Section style={header}>
        <Heading style={h1}>Support Request Received</Heading>
      </Section>

      {/* Main Content */}
      <Section style={content}>
        <Text style={text}>Hi {userName},</Text>

        <Text style={text}>
          We&apos;ve received your support request and will respond within 24
          hours.
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
      </Section>

      {/* Additional Info */}
      <Section style={additionalInfo}>
        <Text style={additionalInfoText}>
          Automated confirmation. Don&apos;t reply to this email.
        </Text>
        <Text style={additionalInfoText}>Add info: {supportEmail}</Text>
        <Text style={additionalInfoText}>— PayMatch Team</Text>
      </Section>
    </EmailLayout>
  );
};

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

const additionalInfo = {
  borderTop: '1px solid #e5e7eb',
  padding: '24px 0 0 0',
  marginTop: '24px',
};

const additionalInfoText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
};

export default SupportConfirmationEmail;
