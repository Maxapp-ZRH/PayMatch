/**
 * Support Team Notification Email Template
 *
 * React Email template for notifying the support team about new support requests.
 * Sent to the support team when users submit support forms.
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface Attachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface SupportTeamNotificationEmailProps {
  userName: string;
  userEmail: string;
  userCompany?: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
  attachments?: Attachment[];
}

export const SupportTeamNotificationEmail = ({
  userName,
  userEmail,
  userCompany,
  category,
  priority,
  subject,
  message,
  attachments = [],
}: SupportTeamNotificationEmailProps) => {
  const priorityColor =
    {
      urgent: '#dc2626',
      high: '#ea580c',
      medium: '#d97706',
      low: '#16a34a',
    }[priority] || '#16a34a';

  const priorityLabel =
    {
      urgent: 'URGENT',
      high: 'HIGH',
      medium: 'MEDIUM',
      low: 'LOW',
    }[priority] || 'LOW';

  return (
    <Html>
      <Head />
      <Preview>New Support Request - {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>New Support Request</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Personal Information */}
            <Section style={infoBox}>
              <Heading style={h2}>Contact</Heading>
              <Text style={text}>
                <strong>{userName}</strong> • {userEmail}
                {userCompany && ` • ${userCompany}`}
              </Text>
            </Section>

            {/* Issue Details */}
            <Section style={infoBox}>
              <Heading style={h2}>Issue</Heading>
              <Text style={text}>
                <strong>{category}</strong> •{' '}
                <span style={{ color: priorityColor, fontWeight: 'bold' }}>
                  {priorityLabel}
                </span>
              </Text>
              <Text style={text}>
                <strong>{subject}</strong>
              </Text>
            </Section>

            {/* Message */}
            <Section style={infoBox}>
              <Heading style={h2}>Message</Heading>
              <Text style={messageText}>{message}</Text>
            </Section>

            {/* Attachments */}
            {attachments && attachments.length > 0 && (
              <Section style={infoBox}>
                <Heading style={h2}>Attachments ({attachments.length})</Heading>
                {attachments.map((attachment, index) => (
                  <Text key={index} style={text}>
                    {attachment.name} (
                    {(attachment.size / 1024 / 1024).toFixed(1)} MB)
                  </Text>
                ))}
              </Section>
            )}

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                PayMatch support form • Reply to respond
              </Text>
            </Section>
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
  textAlign: 'center' as const,
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
  borderBottom: '2px solid #E4262A',
  paddingBottom: '10px',
};

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
};

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const infoBox = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #e5e7eb',
};

const footer = {
  padding: '20px 0',
  borderTop: '1px solid #e5e7eb',
  marginTop: '30px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
};

export default SupportTeamNotificationEmail;
