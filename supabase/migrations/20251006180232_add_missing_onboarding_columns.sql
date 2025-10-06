-- Add Missing Onboarding Columns
-- This migration adds the missing columns that the onboarding forms are trying to save

-- Add missing company details columns
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Add missing settings columns
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Zurich',
ADD COLUMN IF NOT EXISTS invoice_numbering TEXT DEFAULT 'sequential',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS auto_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS reminder_days TEXT DEFAULT '7,14,30';

-- Add constraints for validation
ALTER TABLE organizations 
ADD CONSTRAINT check_invoice_numbering 
CHECK (invoice_numbering IN ('sequential', 'year-prefix', 'custom'));

ALTER TABLE organizations 
ADD CONSTRAINT check_timezone 
CHECK (timezone IN (
  'Europe/Zurich', 
  'Europe/Berlin', 
  'Europe/Vienna', 
  'Europe/Paris', 
  'Europe/Rome'
));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_phone 
ON organizations(phone) 
WHERE phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_organizations_website 
ON organizations(website) 
WHERE website IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_organizations_timezone 
ON organizations(timezone);

CREATE INDEX IF NOT EXISTS idx_organizations_email_notifications 
ON organizations(email_notifications) 
WHERE email_notifications = true;

-- Add comments for documentation
COMMENT ON COLUMN organizations.phone IS 'Company phone number for contact information';
COMMENT ON COLUMN organizations.website IS 'Company website URL';
COMMENT ON COLUMN organizations.timezone IS 'Organization timezone for scheduling and notifications';
COMMENT ON COLUMN organizations.invoice_numbering IS 'Invoice numbering format (sequential, year-prefix, custom)';
COMMENT ON COLUMN organizations.email_notifications IS 'Whether organization wants email notifications';
COMMENT ON COLUMN organizations.auto_reminders IS 'Whether to send automatic payment reminders';
COMMENT ON COLUMN organizations.reminder_days IS 'Comma-separated days for payment reminders (e.g., "7,14,30")';
