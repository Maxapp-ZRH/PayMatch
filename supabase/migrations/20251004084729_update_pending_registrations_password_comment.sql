/**
 * Update Pending Registrations Password Comment
 * 
 * Updates the column comment to reflect that we temporarily store plain passwords
 * in pending_registrations. This is necessary because Supabase expects plain passwords
 * for user creation, but we clean up these records immediately after verification.
 * 
 * SECURITY NOTE: Plain passwords are only stored temporarily (max 24 hours)
 * and are automatically deleted after email verification or expiration.
 */

-- Update the column comment
COMMENT ON COLUMN public.pending_registrations.password_hash IS 'Temporarily stored plain password (max 24 hours, deleted after verification)';
