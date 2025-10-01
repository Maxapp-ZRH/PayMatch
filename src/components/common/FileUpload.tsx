/**
 * File Upload Component
 *
 * A reusable file upload component with drag-and-drop functionality,
 * file validation, preview, and progress indication. Supports multiple
 * file types with size and count limits.
 */

'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  Archive,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FileUploadProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'text/plain',
    'text/csv',
  ],
  disabled = false,
  className = '',
}) => {
  const tValidation = useTranslations('validation');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || isUploading) return;

      const newFiles: FileData[] = [];
      const totalFiles = files.length + acceptedFiles.length;

      if (totalFiles > maxFiles) {
        // Show error for too many files
        return;
      }

      setIsUploading(true);

      for (const file of acceptedFiles) {
        // Validate file size
        if (file.size > maxSize) {
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            url: '',
            status: 'error',
            error: tValidation('attachments.fileTooLarge'),
          });
          continue;
        }

        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            url: '',
            status: 'error',
            error: tValidation('attachments.invalidType'),
          });
          continue;
        }

        // Create file data
        const fileData: FileData = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          status: 'uploading',
        };

        newFiles.push(fileData);

        // Simulate upload process (in real implementation, upload to server)
        setTimeout(() => {
          const updatedFiles = [...files, ...newFiles];
          const fileIndex = updatedFiles.findIndex((f) => f.id === fileData.id);
          if (fileIndex !== -1) {
            updatedFiles[fileIndex] = { ...fileData, status: 'success' };
            onFilesChange(updatedFiles);
          }
        }, 1000);
      }

      onFilesChange([...files, ...newFiles]);
      setIsUploading(false);
    },
    [
      files,
      onFilesChange,
      maxFiles,
      maxSize,
      acceptedTypes,
      disabled,
      isUploading,
      tValidation,
    ]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - files.length,
    disabled: disabled || isUploading,
  });

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/'))
      return <ImageIcon className="w-4 h-4" aria-hidden="true" />;
    if (type === 'application/pdf')
      return <FileText className="w-4 h-4" aria-hidden="true" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('7z'))
      return <Archive className="w-4 h-4" aria-hidden="true" />;
    return <File className="w-4 h-4" aria-hidden="true" />;
  };

  const getStatusIcon = (status: FileData['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload
            className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
            aria-hidden="true"
          />
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <span className="text-blue-600 font-medium">
                Drop files here...
              </span>
            ) : (
              <span>
                Drag & drop files here, or{' '}
                <span className="text-blue-600 font-medium">
                  click to browse
                </span>
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Max {maxFiles} files, {formatFileSize(maxSize)} each
          </div>
          <div className="text-xs text-gray-400">
            Images, PDF, Office docs, archives, text files
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Upload screenshots, documents, or other files that might help us
            understand your issue better.
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="text-sm font-medium text-gray-700">
              Attached Files ({files.length}/{maxFiles})
            </div>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {file.type.startsWith('image/') &&
                  file.status === 'success' ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={file.url}
                        alt={file.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                    {file.error && (
                      <div className="text-xs text-red-600 mt-1">
                        {file.error}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(file.status)}
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    disabled={disabled}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
