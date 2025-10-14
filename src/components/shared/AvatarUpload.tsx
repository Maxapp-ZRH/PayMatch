/**
 * Avatar Upload Component
 *
 * Specialized component for user avatar uploads.
 * Uses the generalized ImageUpload component with user-specific settings.
 */

'use client';

import React from 'react';
import { ImageUpload, ImageUploadProps } from './ImageUpload';

export interface AvatarUploadProps
  extends Omit<ImageUploadProps, 'entityType' | 'folder'> {
  /** User ID */
  userId: string;
}

export function AvatarUpload({
  userId,
  onImageChange,
  currentImageUrl,
  error,
  disabled = false,
  label = 'Profile Picture',
  maxSize = 1, // 1MB for avatars (optimal storage)
  className,
}: AvatarUploadProps) {
  return (
    <ImageUpload
      entityId={userId}
      entityType="user"
      folder="avatars"
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
