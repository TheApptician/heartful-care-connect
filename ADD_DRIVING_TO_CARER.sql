-- Add driving status to carer_details
ALTER TABLE public.carer_details
ADD COLUMN IF NOT EXISTS has_transportation BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.carer_details.has_transportation IS 'Indicates if the carer drives and has transportation';
