-- Create a storage bucket for organization logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  1048576, -- 1MB limit for optimal storage
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Note: RLS policies for storage.objects are typically managed through the Supabase dashboard
-- or through the Supabase CLI with proper permissions. The storage.objects table is a system table
-- that requires elevated permissions to modify RLS policies.

-- The bucket configuration above will handle:
-- - File size limits (1MB)
-- - Allowed MIME types (image formats only)
-- - Public access settings

-- For RLS policies on storage.objects, you should:
-- 1. Use the Supabase Dashboard > Storage > Policies
-- 2. Or use the Supabase CLI with proper service role permissions
-- 3. Or create a separate migration that runs with elevated privileges

-- Example RLS policies that should be created via dashboard or CLI:
/*
-- Policy for anonymous users to view logos (if public)
CREATE POLICY "Allow public access to logos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'logos');

-- Policy for authenticated users to upload their organization's logos
CREATE POLICY "Allow authenticated users to upload their organization's logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND
  -- Ensure the user is part of the organization they are uploading for
  EXISTS (
    SELECT 1 FROM public.organization_users ou
    WHERE ou.user_id = auth.uid() AND ou.org_id = (
      SELECT id FROM public.organizations WHERE id = (regexp_match(name, '^organizations/([^/]+)/.*$'))[1]::uuid
    )
  )
);

-- Policy for authenticated users to update their organization's logos
CREATE POLICY "Allow authenticated users to update their organization's logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos' AND
  -- Ensure the user is part of the organization they are updating for
  EXISTS (
    SELECT 1 FROM public.organization_users ou
    WHERE ou.user_id = auth.uid() AND ou.org_id = (
      SELECT id FROM public.organizations WHERE id = (regexp_match(name, '^organizations/([^/]+)/.*$'))[1]::uuid
    )
  )
);

-- Policy for authenticated users to delete their organization's logos
CREATE POLICY "Allow authenticated users to delete their organization's logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' AND
  -- Ensure the user is part of the organization they are deleting for
  EXISTS (
    SELECT 1 FROM public.organization_users ou
    WHERE ou.user_id = auth.uid() AND ou.org_id = (
      SELECT id FROM public.organizations WHERE id = (regexp_match(name, '^organizations/([^/]+)/.*$'))[1]::uuid
    )
  )
);
*/
