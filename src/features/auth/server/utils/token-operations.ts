/**
 * Token Operations
 *
 * Utility functions for generating and validating authentication tokens.
 * Handles verification tokens, password reset tokens, etc.
 */

import { randomBytes } from 'crypto';

export interface TokenData {
  token: string;
  expiresAt: Date;
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate a verification token with expiration
 */
export function generateVerificationToken(
  expirationHours: number = 24
): TokenData {
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

  return {
    token,
    expiresAt,
  };
}

/**
 * Generate a password reset token with expiration
 */
export function generatePasswordResetToken(
  expirationHours: number = 1
): TokenData {
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

  return {
    token,
    expiresAt,
  };
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Generate a URL-safe token
 */
export function generateUrlSafeToken(length: number = 32): string {
  const token = generateToken(length);
  return Buffer.from(token).toString('base64url');
}
