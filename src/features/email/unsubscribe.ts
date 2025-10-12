/**
 * Unsubscribe Utility Functions
 *
 * Centralized system for managing unsubscribe tokens and URLs
 * for both newsletter and transactional emails.
 */

import { createHash, randomBytes } from 'crypto';
import type { EmailType, UnsubscribeTokenData } from './schemas/email';

/**
 * Generate a secure unsubscribe token
 */
export function generateUnsubscribeToken(data: UnsubscribeTokenData): string {
  const payload = {
    email: data.email,
    type: data.type,
    userId: data.userId,
    expiresAt: data.expiresAt?.toISOString(),
    nonce: randomBytes(16).toString('hex'),
  };

  const payloadString = JSON.stringify(payload);
  const secret = process.env.UNSUBSCRIBE_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      'UNSUBSCRIBE_TOKEN_SECRET environment variable is required'
    );
  }

  const hash = createHash('sha256')
    .update(payloadString + secret)
    .digest('hex');

  // Combine payload and hash for verification
  const token = Buffer.from(payloadString).toString('base64url') + '.' + hash;
  return token;
}

/**
 * Verify and decode an unsubscribe token
 */
export function verifyUnsubscribeToken(
  token: string
): UnsubscribeTokenData | null {
  try {
    const [payloadB64, hash] = token.split('.');
    if (!payloadB64 || !hash) return null;

    const payloadString = Buffer.from(payloadB64, 'base64url').toString(
      'utf-8'
    );
    const secret = process.env.UNSUBSCRIBE_TOKEN_SECRET;

    if (!secret) {
      throw new Error(
        'UNSUBSCRIBE_TOKEN_SECRET environment variable is required'
      );
    }

    const expectedHash = createHash('sha256')
      .update(payloadString + secret)
      .digest('hex');

    if (hash !== expectedHash) return null;

    const payload = JSON.parse(payloadString);

    // Check expiration if set
    if (payload.expiresAt && new Date(payload.expiresAt) < new Date()) {
      return null;
    }

    return {
      email: payload.email,
      type: payload.type,
      userId: payload.userId,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : undefined,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Generate unsubscribe URL for any email type
 */
export function generateUnsubscribeUrl(
  email: string,
  type: EmailType,
  userId?: string,
  expiresInDays?: number
): string {
  // Use environment variable for default expiration, fallback to 30 days
  const defaultExpiration = parseInt(
    process.env.UNSUBSCRIBE_TOKEN_EXPIRES_DAYS || '30',
    10
  );
  const expirationDays = expiresInDays ?? defaultExpiration;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);

  const token = generateUnsubscribeToken({
    email,
    type,
    userId,
    expiresAt,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paymatch.app';
  return `${baseUrl}/unsubscribe?token=${token}`;
}

/**
 * Generate one-click unsubscribe URL for transactional emails
 */
export function generateOneClickUnsubscribeUrl(
  email: string,
  type: EmailType = 'transactional',
  userId?: string
): string {
  const token = generateUnsubscribeToken({
    email,
    type,
    userId,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paymatch.app';
  return `${baseUrl}/api/unsubscribe/one-click?token=${token}`;
}

/**
 * Get unsubscribe headers for Resend API
 */
export function getUnsubscribeHeaders(
  email: string,
  type: EmailType = 'transactional',
  userId?: string
) {
  const unsubscribeUrl = generateUnsubscribeUrl(email, type, userId);
  const oneClickUrl = generateOneClickUnsubscribeUrl(email, type, userId);

  return {
    'List-Unsubscribe': `<${unsubscribeUrl}>, <${oneClickUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}
