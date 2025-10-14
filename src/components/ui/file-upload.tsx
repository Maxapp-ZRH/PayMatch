/**
 * File Upload Component
 *
 * Drag-and-drop file upload component with mobile support, image preview,
 * and Supabase storage integration for organization logos.
 */

'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onFileUpload: (file: File) => Promise<string>;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  currentUrl?: string;
  label?: string;
  error?: string;
}

interface UploadState {
  isDragging: boolean;
  isUploading: boolean;
  error: string | null;
  preview: string | null;
}

export function FileUpload({
  onFileSelect,
  onFileUpload,
  accept = 'image/*',
  maxSize = 2, // 2MB default for optimal storage
  className,
  disabled = false,
  currentUrl,
  label = 'Upload File',
  error,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({
    isDragging: false,
    isUploading: false,
    error: null,
    preview: currentUrl || null,
  });

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        return 'Please select an image file';
      }

      // Check file size
      const maxSizeBytes = maxSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSize}MB`;
      }

      return null;
    },
    [maxSize]
  );

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setState((prev) => ({ ...prev, error: validationError }));
        return;
      }

      setState((prev) => ({ ...prev, error: null, isUploading: true }));

      try {
        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setState((prev) => ({ ...prev, preview: previewUrl }));

        // Upload file
        const uploadedUrl = await onFileUpload(file);

        // Update preview with uploaded URL
        setState((prev) => ({
          ...prev,
          preview: uploadedUrl,
          isUploading: false,
        }));

        onFileSelect(file);
      } catch (error) {
        console.error('Upload error:', error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Upload failed',
          isUploading: false,
          preview: null,
        }));
      }
    },
    [validateFile, onFileUpload, onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setState((prev) => ({ ...prev, isDragging: true }));
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isDragging: false }));

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemoveFile = useCallback(() => {
    setState((prev) => ({
      ...prev,
      preview: null,
      error: null,
    }));
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          'hover:border-blue-400 hover:bg-blue-50',
          state.isDragging && 'border-blue-500 bg-blue-100',
          state.isUploading && 'border-yellow-400 bg-yellow-50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-400 bg-red-50',
          state.preview && 'border-green-400 bg-green-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {state.preview ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative mx-auto w-32 h-32">
              <Image
                src={state.preview}
                alt="Preview"
                fill
                className="object-cover rounded-lg border border-gray-200"
              />
              {!state.isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Upload Status */}
            <div className="text-center">
              {state.isUploading ? (
                <div className="flex items-center justify-center space-x-2 text-yellow-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm">Logo uploaded successfully</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center">
              {state.isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {state.isUploading
                  ? 'Uploading...'
                  : 'Drag and drop your logo here'}
              </p>
              <p className="text-xs text-gray-500">
                or{' '}
                <span className="text-blue-600 underline">click to browse</span>
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {(error || state.error) && (
          <div className="mt-4 flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error || state.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
