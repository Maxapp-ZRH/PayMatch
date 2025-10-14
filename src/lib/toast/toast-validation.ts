/**
 * Toast Message Validation Utilities
 *
 * Provides runtime validation and type safety for toast messages.
 * Ensures all message keys exist and are properly typed.
 */

import { TOAST_MESSAGES } from './toast-messages';

/**
 * Validates that a message key exists in the registry
 */
export function validateMessageKey(
  category: keyof typeof TOAST_MESSAGES,
  subcategory: string,
  messageKey: string
): boolean {
  try {
    const categoryObj = TOAST_MESSAGES[category] as Record<string, unknown>;
    const subcategoryObj = categoryObj[subcategory] as Record<string, unknown>;
    return messageKey in subcategoryObj;
  } catch {
    return false;
  }
}

/**
 * Gets a message by key with runtime validation
 */
export function getMessage(
  category: keyof typeof TOAST_MESSAGES,
  subcategory: string,
  messageKey: string
): string | null {
  if (!validateMessageKey(category, subcategory, messageKey)) {
    console.warn(
      `Invalid toast message key: ${category}.${subcategory}.${messageKey}`
    );
    return null;
  }

  try {
    const categoryObj = TOAST_MESSAGES[category] as Record<string, unknown>;
    const subcategoryObj = categoryObj[subcategory] as Record<string, unknown>;
    return subcategoryObj[messageKey] as string;
  } catch {
    return null;
  }
}

/**
 * Type-safe message key extractor
 */
export function extractMessageKeys<T extends keyof typeof TOAST_MESSAGES>(
  category: T
): Array<keyof (typeof TOAST_MESSAGES)[T]> {
  return Object.keys(TOAST_MESSAGES[category]) as Array<
    keyof (typeof TOAST_MESSAGES)[T]
  >;
}

/**
 * Validates all message keys at runtime (useful for testing)
 */
export function validateAllMessageKeys(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate auth messages
  const authKeys = extractMessageKeys('auth');
  for (const subcategory of authKeys) {
    const subcategoryObj = TOAST_MESSAGES.auth[subcategory] as Record<
      string,
      unknown
    >;
    for (const messageKey of Object.keys(subcategoryObj)) {
      if (typeof subcategoryObj[messageKey] !== 'string') {
        errors.push(
          `auth.${String(subcategory)}.${messageKey} is not a string`
        );
      }
    }
  }

  // Validate stripe messages
  const stripeKeys = extractMessageKeys('stripe');
  for (const subcategory of stripeKeys) {
    const subcategoryObj = TOAST_MESSAGES.stripe[subcategory] as Record<
      string,
      unknown
    >;
    for (const messageKey of Object.keys(subcategoryObj)) {
      if (typeof subcategoryObj[messageKey] !== 'string') {
        errors.push(
          `stripe.${String(subcategory)}.${messageKey} is not a string`
        );
      }
    }
  }

  // Validate onboarding messages
  const onboardingKeys = extractMessageKeys('onboarding');
  for (const subcategory of onboardingKeys) {
    const subcategoryObj = TOAST_MESSAGES.onboarding[subcategory] as Record<
      string,
      unknown
    >;
    for (const messageKey of Object.keys(subcategoryObj)) {
      if (typeof subcategoryObj[messageKey] !== 'string') {
        errors.push(
          `onboarding.${String(subcategory)}.${messageKey} is not a string`
        );
      }
    }
  }

  // Validate general messages
  const generalKeys = extractMessageKeys('general');
  for (const messageKey of generalKeys) {
    if (typeof TOAST_MESSAGES.general[messageKey] !== 'string') {
      errors.push(`general.${String(messageKey)} is not a string`);
    }
  }

  // Validate validation messages
  const validationKeys = extractMessageKeys('validation');
  for (const messageKey of validationKeys) {
    if (typeof TOAST_MESSAGES.validation[messageKey] !== 'string') {
      errors.push(`validation.${String(messageKey)} is not a string`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Development-only validation that runs in development mode
 */
export function validateInDevelopment(): void {
  if (process.env.NODE_ENV === 'development') {
    const validation = validateAllMessageKeys();
    if (!validation.valid) {
      console.error('Toast message validation failed:', validation.errors);
    } else {
      console.log('✅ All toast messages are valid');
    }
  }
}

// Auto-validate in development
if (typeof window !== 'undefined') {
  validateInDevelopment();
}
