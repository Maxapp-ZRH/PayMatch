/**
 * Support API Route
 *
 * Handles support form submissions and sends emails via Resend.
 * Validates form data and provides appropriate error handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supportFormSchema } from '@/schemas/support';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = supportFormSchema.parse(body);

    // Prepare email content
    const emailContent = `
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

---
This message was sent via the PayMatch support form.
    `.trim();

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'PayMatch Support <noreply@paymatch.app>',
      to: [process.env.SUPPORT_EMAIL || 'support@paymatch.app'],
      replyTo: validatedData.email,
      subject: `[${validatedData.priority.toUpperCase()}] ${validatedData.subject}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
            New Support Request
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Personal Information</h3>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Issue Details</h3>
            <p><strong>Category:</strong> ${validatedData.category}</p>
            <p><strong>Priority:</strong> <span style="color: ${
              validatedData.priority === 'urgent'
                ? '#dc2626'
                : validatedData.priority === 'high'
                  ? '#ea580c'
                  : validatedData.priority === 'medium'
                    ? '#d97706'
                    : '#16a34a'
            }">${validatedData.priority.toUpperCase()}</span></p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <div style="white-space: pre-wrap; line-height: 1.6;">${validatedData.message}</div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This message was sent via the PayMatch support form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: data?.id,
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
