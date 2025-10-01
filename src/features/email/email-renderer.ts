/**
 * Email Renderer Utility
 *
 * Renders React Email components to HTML with proper inline image support.
 * Uses @react-email/render for server-side rendering.
 */

import { render } from '@react-email/render';
import { ReactElement } from 'react';

/**
 * Render a React Email component to HTML string
 */
export async function renderEmailToHtml(
  component: ReactElement
): Promise<string> {
  try {
    return await render(component);
  } catch (error) {
    console.error('Failed to render email component:', error);
    throw new Error('Failed to render email template');
  }
}

/**
 * Render email component with error handling
 */
export async function renderEmailComponent(
  component: ReactElement,
  fallbackHtml?: string
): Promise<string> {
  try {
    return renderEmailToHtml(component);
  } catch (error) {
    console.error('Email rendering error:', error);

    if (fallbackHtml) {
      console.warn('Using fallback HTML for email');
      return fallbackHtml;
    }

    throw error;
  }
}
