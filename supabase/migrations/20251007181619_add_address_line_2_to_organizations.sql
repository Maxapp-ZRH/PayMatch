-- Add address_line_2 field to organizations table
-- This allows for better address structure with separate address lines

-- Add the new address_line_2 column
ALTER TABLE public.organizations 
ADD COLUMN address_line_2 TEXT;

-- Add comment to document the field
COMMENT ON COLUMN public.organizations.address_line_2 IS 'Optional second address line (apartment, suite, unit, building, floor, etc.)';

-- Update existing data: if street contains comma, split it into address_line_1 and address_line_2
-- This handles cases where existing addresses might have been stored with comma separation
UPDATE public.organizations 
SET 
  street = CASE 
    WHEN street LIKE '%,%' THEN 
      TRIM(SPLIT_PART(street, ',', 1))
    ELSE street
  END,
  address_line_2 = CASE 
    WHEN street LIKE '%,%' THEN 
      TRIM(SPLIT_PART(street, ',', 2))
    ELSE NULL
  END
WHERE street IS NOT NULL AND street != '';

-- Rename street column to address_line_1 for consistency
ALTER TABLE public.organizations 
RENAME COLUMN street TO address_line_1;

-- Add comment to document the renamed field
COMMENT ON COLUMN public.organizations.address_line_1 IS 'Primary address line (street address)';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_organizations_address_line_1 ON public.organizations(address_line_1);
CREATE INDEX IF NOT EXISTS idx_organizations_address_line_2 ON public.organizations(address_line_2);
