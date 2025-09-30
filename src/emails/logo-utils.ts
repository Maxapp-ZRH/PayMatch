/**
 * Email Logo Utilities
 *
 * Provides utilities for handling logo display in email templates
 * with fallbacks for email clients that block images.
 */

export interface LogoConfig {
  src: string;
  width: number;
  height: number;
  alt: string;
  fallbackText?: string;
}

/**
 * Get logo configuration for email templates
 * @param appUrl - Base URL of the application
 * @param size - Logo size (small, medium, large)
 * @returns Logo configuration object
 */
export function getEmailLogoConfig(
  appUrl: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): LogoConfig {
  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 120, height: 40 },
  };

  const { width, height } = sizes[size];

  return {
    src: `${appUrl}/logo.png`,
    width,
    height,
    alt: 'PayMatch',
    fallbackText: 'PayMatch',
  };
}

/**
 * Generate logo HTML with fallback for email clients
 * @param config - Logo configuration
 * @returns HTML string for logo with fallback
 */
export function generateLogoHtml(config: LogoConfig): string {
  return `
    <div style="text-align: center; margin-bottom: 16px;">
      <img 
        src="${config.src}" 
        width="${config.width}" 
        height="${config.height}" 
        alt="${config.alt}"
        style="display: block; margin: 0 auto; max-width: 100%; height: auto;"
        border="0"
      />
      <!-- Fallback text for email clients that don't load images -->
      <div style="display: none; font-size: 0; line-height: 0; max-height: 0; overflow: hidden;">
        ${config.fallbackText}
      </div>
    </div>
  `;
}

/**
 * Generate text-based logo fallback
 * @param text - Logo text
 * @param color - Text color (default: #E4262A)
 * @returns HTML string for text logo
 */
export function generateTextLogo(
  text: string = 'PayMatch',
  color: string = '#E4262A'
): string {
  return `
    <div style="text-align: center; margin-bottom: 16px;">
      <h1 style="color: ${color}; font-size: 24px; font-weight: bold; margin: 0; padding: 0;">
        ${text}
      </h1>
    </div>
  `;
}

/**
 * Generate combined logo with image and text
 * @param config - Logo configuration
 * @param text - Logo text (default: "PayMatch")
 * @param color - Text color (default: #E4262A)
 * @returns HTML string for combined logo
 */
export function generateCombinedLogo(
  config: LogoConfig,
  text: string = 'PayMatch',
  color: string = '#E4262A'
): string {
  return `
    <div style="text-align: center; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
        <img 
          src="${config.src}" 
          width="${config.width}" 
          height="${config.height}" 
          alt="${config.alt}"
          style="display: block; max-width: 100%; height: auto;"
          border="0"
        />
        <span style="color: ${color}; font-size: 24px; font-weight: bold; margin: 0; padding: 0;">
          ${text}
        </span>
      </div>
      <!-- Fallback text for email clients that don't load images -->
      <div style="display: none; font-size: 0; line-height: 0; max-height: 0; overflow: hidden;">
        ${config.fallbackText}
      </div>
    </div>
  `;
}
