/**
 * Consent Proof API Route
 *
 * Generates consent certificates for compliance audits.
 * Provides cryptographic proof of consent decisions for GDPR/Switzerland FADP compliance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ConsentService } from '@/features/cookies/services/consent-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // json, pdf, csv

    // Generate consent proof
    const proofResult = await ConsentService.generateConsentProof(
      user.id,
      user.email
    );

    if (!proofResult.success || !proofResult.proof) {
      return NextResponse.json(
        { error: proofResult.error || 'Failed to generate consent proof' },
        { status: 500 }
      );
    }

    const proof = proofResult.proof;

    // Format response based on requested format
    switch (format.toLowerCase()) {
      case 'json':
        return NextResponse.json({
          success: true,
          proof: {
            ...proof,
            // Convert dates to ISO strings for JSON serialization
            generatedAt: proof.generatedAt.toISOString(),
            validUntil: proof.validUntil.toISOString(),
            consentRecords: proof.consentRecords.map((record) => ({
              ...record,
              consentGivenAt: record.consentGivenAt?.toISOString(),
              consentWithdrawnAt: record.consentWithdrawnAt?.toISOString(),
            })),
          },
        });

      case 'csv':
        // Generate CSV format for compliance reporting
        const csvHeaders = [
          'Consent Type',
          'Consent Given',
          'Consent Given At',
          'Consent Withdrawn',
          'Consent Withdrawn At',
          'Consent Method',
          'IP Address',
          'User Agent',
          'Source',
        ].join(',');

        const csvRows = proof.consentRecords.map((record) =>
          [
            record.consentType,
            record.consentGiven,
            record.consentGivenAt?.toISOString() || '',
            record.consentWithdrawn || false,
            record.consentWithdrawnAt?.toISOString() || '',
            record.consentMethod,
            record.ipAddress || '',
            record.userAgent || '',
            record.consentSource || '',
          ]
            .map((field) => `"${field}"`)
            .join(',')
        );

        const csvContent = [csvHeaders, ...csvRows].join('\n');

        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="consent-proof-${user.id}-${Date.now()}.csv"`,
          },
        });

      default:
        return NextResponse.json(
          { error: 'Unsupported format. Use: json, csv' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Consent proof API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, consentType, reason } = body;

    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    switch (action) {
      case 'withdraw':
        if (!consentType) {
          return NextResponse.json(
            { error: 'Consent type is required for withdrawal' },
            { status: 400 }
          );
        }

        const withdrawResult = await ConsentService.withdrawConsent(
          consentType,
          user.id,
          user.email,
          reason
        );

        if (!withdrawResult.success) {
          return NextResponse.json(
            { error: withdrawResult.error || 'Failed to withdraw consent' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Consent withdrawn successfully',
        });

      case 'status':
        const statusResult = await ConsentService.getConsentStatus(
          user.id,
          user.email
        );

        if (!statusResult.success) {
          return NextResponse.json(
            { error: statusResult.error || 'Failed to get consent status' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          status: statusResult.status,
        });

      case 'renewal':
        const renewalResult = await ConsentService.checkConsentRenewal(
          user.id,
          user.email
        );

        if (!renewalResult.success) {
          return NextResponse.json(
            { error: renewalResult.error || 'Failed to check consent renewal' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          renewals: renewalResult.renewals,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: withdraw, status, renewal' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Consent management API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
