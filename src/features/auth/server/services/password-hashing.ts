/**
 * Password Hashing Service
 *
 * Server-only password hashing operations using bcrypt.
 * This file should never be imported by client components.
 */

import bcrypt from 'bcrypt';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
