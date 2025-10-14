/**
 * Image Upload Component
 *
 * Generalized image upload component with drag-and-drop, mobile support,
 * and Supabase storage integration. Can be used for logos, avatars, or any image.
 */

'use client';

import React, { useCallback, useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { uploadFile } from '@/lib/supabase/storage';

export interface ImageUploadProps {
  /** Unique identifier for the upload (e.g., orgId, userId) */
  entityId: string;
  /** Type of entity (e.g., 'organization', 'user') */
  entityType: 'organization' | 'user';
  /** Subfolder within the bucket (e.g., 'logos', 'avatars') */
  folder: string;
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
  /** Accepted file types */
  accept?: string;
  /** Custom className */
  className?: string;
}

export function ImageUpload({
  entityId,
  entityType,
  folder,
  onImageChange,
  currentImageUrl,
  error,
  disabled = false,
  label = 'Upload Image',
  maxSize = 2, // 2MB default for optimal storage
  accept = 'image/*',
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);

      try {
        // Generate file path based on entity type and ID
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${folder}-${timestamp}.${fileExtension}`;
        const path = `${entityType}s/${entityId}/${fileName}`;

        const result = await uploadFile(folder, path, file, {
          upsert: true,
          contentType: file.type,
        });

        if (!result.success || !result.url) {
          throw new Error(result.error || 'Upload failed');
        }

        return result.url;
      } catch (error) {
        console.error('Image upload error:', error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [entityId, entityType, folder]
  );

  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (file) {
        // File selected, will be handled by handleFileUpload
        return;
      } else {
        // File removed
        onImageChange(null);
      }
    },
    [onImageChange]
  );

  return (
    <FileUpload
      onFileSelect={handleFileSelect}
      onFileUpload={handleFileUpload}
      accept={accept}
      maxSize={maxSize}
      currentUrl={currentImageUrl}
      label={label}
      error={error}
      disabled={disabled || isUploading}
      className={className}
    />
  );
}
