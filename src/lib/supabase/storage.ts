/**
 * Supabase Storage Service
 *
 * Handles file uploads to Supabase storage buckets with proper
 * organization-based access control and file management.
 */

import { createClient } from './client';
import { supabaseAdmin } from './admin';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Upload file to Supabase storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: {
    upsert?: boolean;
    contentType?: string;
  }
): Promise<UploadResult> {
  try {
    const supabase = createClient();

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? true,
        contentType: options?.contentType ?? file.type,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete file from Supabase storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<DeleteResult> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Storage delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Upload organization logo
 */
export async function uploadOrganizationLogo(
  orgId: string,
  file: File
): Promise<UploadResult> {
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const fileName = `logo-${timestamp}.${fileExtension}`;
  const path = `organizations/${orgId}/${fileName}`;

  return uploadFile('logos', path, file, {
    upsert: true,
    contentType: file.type,
  });
}

/**
 * Delete organization logo
 */
export async function deleteOrganizationLogo(
  orgId: string,
  logoUrl: string
): Promise<DeleteResult> {
  try {
    // Extract path from URL
    const url = new URL(logoUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex((part) => part === 'logos');

    if (bucketIndex === -1) {
      return {
        success: false,
        error: 'Invalid logo URL',
      };
    }

    const path = pathParts.slice(bucketIndex + 1).join('/');
    return deleteFile('logos', path);
  } catch (error) {
    return {
      success: false,
      error: 'Invalid logo URL',
    };
  }
}

/**
 * Get organization logo URL
 */
export function getOrganizationLogoUrl(
  orgId: string,
  fileName: string
): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from('logos')
    .getPublicUrl(`organizations/${orgId}/${fileName}`);

  return data.publicUrl;
}

/**
 * List organization files
 */
export async function listOrganizationFiles(orgId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from('logos')
      .list(`organizations/${orgId}`);

    if (error) {
      console.error('Storage list error:', error);
      return {
        success: false,
        files: [],
        error: error.message,
      };
    }

    return {
      success: true,
      files: data || [],
    };
  } catch (error) {
    console.error('List files error:', error);
    return {
      success: false,
      files: [],
      error: error instanceof Error ? error.message : 'List failed',
    };
  }
}
