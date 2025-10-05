/**
 * Modern Support Team Notification Email Template
 *
 * React Email template for notifying the support team about new support requests.
 * Inspired by Slack's clean design with modern styling.
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
          <Heading style={h1}>New support request</Heading>

          <Text style={heroText}>
            A new support request has been submitted and requires your
            attention.
          </Text>

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

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const messageText = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  textAlign: 'left' as const,
};

const infoBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginBottom: '30px',
  padding: '40px 20px',
  textAlign: 'center' as const,
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

export default SupportTeamNotificationEmail;
