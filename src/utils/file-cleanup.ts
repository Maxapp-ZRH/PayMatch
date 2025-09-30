/**
 * File Cleanup Utilities
 *
 * Utilities for cleaning up temporary files and managing file storage.
 * Handles cleanup of uploaded files after email processing.
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface FileCleanupOptions {
  maxAge?: number; // Maximum age in milliseconds before cleanup
  tempDir?: string; // Temporary directory path
}

export class FileCleanupManager {
  private tempDir: string;
  private maxAge: number;

  constructor(options: FileCleanupOptions = {}) {
    this.tempDir = options.tempDir || '/tmp/paymatch-uploads';
    this.maxAge = options.maxAge || 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Clean up old files from the temporary directory
   */
  async cleanupOldFiles(): Promise<{ cleaned: number; errors: string[] }> {
    const errors: string[] = [];
    let cleaned = 0;

    try {
      // Ensure temp directory exists
      await fs.mkdir(this.tempDir, { recursive: true });

      const files = await fs.readdir(this.tempDir);
      const now = Date.now();

      for (const file of files) {
        try {
          const filePath = path.join(this.tempDir, file);
          const stats = await fs.stat(filePath);

          // Check if file is older than maxAge
          if (now - stats.mtime.getTime() > this.maxAge) {
            await fs.unlink(filePath);
            cleaned++;
            console.log(`Cleaned up old file: ${file}`);
          }
        } catch (error) {
          const errorMsg = `Failed to clean up file ${file}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = `Failed to access temp directory: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }

    return { cleaned, errors };
  }

  /**
   * Clean up specific files by their URLs
   */
  async cleanupFiles(
    fileUrls: string[]
  ): Promise<{ cleaned: number; errors: string[] }> {
    const errors: string[] = [];
    let cleaned = 0;

    for (const url of fileUrls) {
      try {
        // Extract filename from URL (assuming it's a local file URL)
        const filename = path.basename(url);
        const filePath = path.join(this.tempDir, filename);

        // Check if file exists and delete it
        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
          cleaned++;
          console.log(`Cleaned up file: ${filename}`);
        } catch {
          // File doesn't exist or can't be deleted, skip silently
          console.warn(`File not found or can't be deleted: ${filename}`);
        }
      } catch (error) {
        const errorMsg = `Failed to clean up file ${url}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return { cleaned, errors };
  }

  /**
   * Schedule periodic cleanup (for use in cron jobs or background tasks)
   */
  scheduleCleanup(intervalMs: number = 60 * 60 * 1000): NodeJS.Timeout {
    return setInterval(async () => {
      console.log('Running scheduled file cleanup...');
      const result = await this.cleanupOldFiles();
      console.log(
        `Cleanup completed: ${result.cleaned} files cleaned, ${result.errors.length} errors`
      );
    }, intervalMs);
  }
}

// Default cleanup manager instance
export const fileCleanup = new FileCleanupManager();

/**
 * Utility function to clean up files after email processing
 */
export async function cleanupAfterEmailProcessing(
  attachments: Array<{ url: string }>
): Promise<void> {
  if (!attachments || attachments.length === 0) return;

  try {
    const fileUrls = attachments.map((attachment) => attachment.url);
    const result = await fileCleanup.cleanupFiles(fileUrls);

    if (result.errors.length > 0) {
      console.warn('Some files could not be cleaned up:', result.errors);
    }

    console.log(`Cleaned up ${result.cleaned} files after email processing`);
  } catch (error) {
    console.error('Error during file cleanup:', error);
  }
}

/**
 * Utility function to get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Utility function to validate file type
 */
export function isValidFileType(
  fileName: string,
  allowedTypes: string[]
): boolean {
  const extension = path.extname(fileName).toLowerCase();
  const mimeType = getMimeTypeFromExtension(extension);
  return allowedTypes.includes(mimeType);
}

/**
 * Get MIME type from file extension
 */
function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx':
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.7z': 'application/x-7z-compressed',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}
