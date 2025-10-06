-- Add legal_entity_type column to organizations table
-- This column stores the Swiss legal entity type (GmbH, AG, etc.)

ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS legal_entity_type TEXT;

-- Add constraint for valid Swiss legal entity types
ALTER TABLE organizations 
ADD CONSTRAINT check_legal_entity_type 
CHECK (legal_entity_type IS NULL OR legal_entity_type IN (
  'GmbH', 
  'AG', 
  'Einzelunternehmen', 
  'Partnerschaft', 
  'Verein', 
  'Stiftung', 
  'Other'
));

-- Add comment for documentation
COMMENT ON COLUMN organizations.legal_entity_type IS 'Swiss legal entity type (GmbH, AG, Einzelunternehmen, etc.)';
