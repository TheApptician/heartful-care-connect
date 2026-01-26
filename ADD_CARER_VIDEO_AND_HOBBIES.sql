-- ============================================
-- MIGRATION: ADD CARER VIDEO AND HOBBIES
-- ============================================

-- 1. Add new columns to carer_details
ALTER TABLE public.carer_details
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS hobbies text,
ADD COLUMN IF NOT EXISTS visiting_care boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_transportation boolean DEFAULT false; -- Just in case

-- 2. Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'carer_details' 
  AND column_name IN ('video_url', 'hobbies', 'visiting_care', 'has_transportation');
