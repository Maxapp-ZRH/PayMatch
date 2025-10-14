/**
 * Organization Logo Upload Component
 *
 * Specialized component for organization logo uploads.
 * Uses the generalized ImageUpload component with organization-specific settings.
 */

'use client';

import React from 'react';
import { ImageUpload } from './ImageUpload';

export interface OrganizationLogoUploadProps {
  /** Organization ID */
  orgId: string;
  /** Callback when image URL changes */
  onImageChange: (imageUrl: string | null) => void;
  /** Current image URL */
  currentImageUrl?: string;
  /** Error message to display */
  error?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Label for the upload area */
  label?: string;
  /** Maximum file size in MB */
  maxSize?: number;
  /** Additional CSS classes */
  className?: string;
}

export function OrganizationLogoUpload({
  orgId,
  onImageChange,
  currentImageUrl,
  error,
  disabled = false,
  label = 'Organization Logo',
  maxSize = 1, // 1MB for optimal storage
  className,
}: OrganizationLogoUploadProps) {
  return (
    <ImageUpload
      entityId={orgId}
      entityType="organization"
      folder="logos"
      onImageChange={onImageChange}
      currentImageUrl={currentImageUrl}
      error={error}
      disabled={disabled}
      label={label}
      maxSize={maxSize}
      className={className}
    />
  );
}
