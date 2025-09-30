/**
 * Support API Route
 *
 * Handles support form submissions and sends emails via Resend.
 * Sends support request to team and confirmation email to user.
 * Validates form data and provides appropriate error handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supportFormSchema } from '@/schemas/support';
import { SupportConfirmationEmail } from '@/emails/support-confirmation';
import { SupportTeamNotificationEmail } from '@/emails/support-team-notification';
import { render } from '@react-email/render';
import { cleanupAfterEmailProcessing } from '@/utils/file-cleanup';

const resend = new Resend(process.env.RESEND_API_KEY);

// Environment variables with fallbacks
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@paymatch.app';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@paymatch.app';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'PayMatch';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = supportFormSchema.parse(body);

    // Prepare support team email content
    const supportEmailContent = `
New Support Request

Personal Information:
- Name: ${validatedData.name}
- Email: ${validatedData.email}
${validatedData.company ? `- Company: ${validatedData.company}` : ''}

Issue Details:
- Category: ${validatedData.category}
- Priority: ${validatedData.priority.toUpperCase()}
- Subject: ${validatedData.subject}

Message:
${validatedData.message}

${
  validatedData.attachments && validatedData.attachments.length > 0
    ? `
Attachments (${validatedData.attachments.length}):
${validatedData.attachments
  .map(
    (file, index) =>
      `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
  )
  .join('\n')}
`
    : ''
}

---
This message was sent via the PayMatch support form.
    `.trim();

    // Generate support team email HTML
    const supportTeamEmailHtml = await render(
      SupportTeamNotificationEmail({
        userName: validatedData.name,
        userEmail: validatedData.email,
        userCompany: validatedData.company,
        category: validatedData.category,
        priority: validatedData.priority,
        subject: validatedData.subject,
        message: validatedData.message,
        attachments: validatedData.attachments || [],
      })
    );

    // Prepare email attachments
    const emailAttachments =
      validatedData.attachments?.map((file) => ({
        filename: file.name,
        content: file.url, // In a real implementation, this would be the actual file content
        contentType: file.type,
      })) || [];

    // Send support email to team
    const supportEmailResult = await resend.emails.send({
      from: `${FROM_NAME} Support <${FROM_EMAIL}>`,
      to: [SUPPORT_EMAIL],
      replyTo: validatedData.email,
      subject: `[${validatedData.priority.toUpperCase()}] ${validatedData.subject}`,
      text: supportEmailContent,
      html: supportTeamEmailHtml,
      attachments: emailAttachments,
    });

    if (supportEmailResult.error) {
      console.error('Support email error:', supportEmailResult.error);
      return NextResponse.json(
        { error: 'Failed to send support email' },
        { status: 500 }
      );
    }

    // Generate confirmation email HTML
    const confirmationEmailHtml = await render(
      SupportConfirmationEmail({
        userName: validatedData.name,
        userEmail: validatedData.email,
        subject: validatedData.subject,
        category: validatedData.category,
        priority: validatedData.priority,
        supportEmail: SUPPORT_EMAIL,
        appUrl: APP_URL,
      })
    );

    // Send confirmation email to user
    const confirmationEmailResult = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [validatedData.email],
      subject: `Support Request Received - ${validatedData.subject}`,
      html: confirmationEmailHtml,
    });

    if (confirmationEmailResult.error) {
      console.error('Confirmation email error:', confirmationEmailResult.error);
      // Don't fail the request if confirmation email fails, just log it
      console.warn('Support request was sent but confirmation email failed');
    }

    // Clean up temporary files after successful email processing
    if (validatedData.attachments && validatedData.attachments.length > 0) {
      try {
        await cleanupAfterEmailProcessing(validatedData.attachments);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
        // Don't fail the request if cleanup fails, just log it
      }
    }

    return NextResponse.json(
      {
        success: true,
        messageId: supportEmailResult.data?.id,
        confirmationSent: !confirmationEmailResult.error,
        message: 'Support request sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Support API error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
