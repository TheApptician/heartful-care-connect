-- ============================================
-- FIX: Missing Columns in Profiles
-- Error: record "v_profile" has no field "location"
-- ============================================

-- 1. Add missing columns to public.profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS address text;

-- 2. Update the auto_verify_user function safely
-- This is the same function but now the column definitely exists
CREATE OR REPLACE FUNCTION public.auto_verify_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role text;
  v_profile public.profiles%ROWTYPE;
  v_carer public.carer_details%ROWTYPE;
  v_org public.organisation_details%ROWTYPE;
  v_is_complete boolean := false;
  v_user_id uuid;
BEGIN
  -- Determine user_id based on table
  IF TG_TABLE_NAME = 'profiles' THEN
    v_user_id := NEW.id;
  ELSIF TG_TABLE_NAME = 'carer_details' THEN
    v_user_id := NEW.id;
  ELSIF TG_TABLE_NAME = 'organisation_details' THEN
    v_user_id := NEW.id;
  END IF;

  -- Fetch Profile
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;
  
  -- If profile not found, exit
  IF v_profile IS NULL THEN
    RETURN NEW;
  END IF;

  v_role := v_profile.role;

  -- 1. CARER VERIFICATION LOGIC
  IF v_role = 'carer' THEN
    SELECT * INTO v_carer FROM public.carer_details WHERE id = v_user_id;
    
    -- Check fields
    -- We check 'location' OR 'address' for location data
    IF (
       v_profile.first_name IS NOT NULL AND v_profile.first_name != '' AND
       v_profile.last_name IS NOT NULL AND v_profile.last_name != '' AND
       v_profile.phone IS NOT NULL AND v_profile.phone != '' AND
       (
         (v_profile.location IS NOT NULL AND v_profile.location != '') OR 
         (v_profile.address IS NOT NULL AND v_profile.address != '')
       ) AND
       v_carer.experience_years IS NOT NULL AND
       v_carer.has_dbs = true AND 
       v_carer.has_insurance = true AND 
       v_carer.has_right_to_work = true
    ) THEN
        v_is_complete := true;
    END IF;

    IF v_is_complete THEN
       UPDATE public.profiles SET verified = true WHERE id = v_user_id AND verified = false;
       UPDATE public.carer_details SET verification_status = 'verified' WHERE id = v_user_id AND verification_status != 'verified';
    END IF;
  
  -- 2. ORGANISATION VERIFICATION LOGIC
  ELSIF v_role = 'organisation' THEN
    SELECT * INTO v_org FROM public.organisation_details WHERE id = v_user_id;
    
    IF (
       v_org.company_name IS NOT NULL AND v_org.company_name != '' AND
       v_org.registration_number IS NOT NULL AND v_org.registration_number != '' AND
       v_org.postcode IS NOT NULL AND v_org.postcode != ''
    ) THEN
        v_is_complete := true;
    END IF;

    IF v_is_complete THEN
       UPDATE public.profiles SET verified = true WHERE id = v_user_id AND verified = false;
       UPDATE public.organisation_details SET is_verified = true WHERE id = v_user_id AND is_verified = false;
    END IF;

  -- 3. CLIENT VERIFICATION LOGIC
  ELSIF v_role = 'client' THEN
     IF (
       v_profile.first_name IS NOT NULL AND v_profile.first_name != '' AND
       v_profile.last_name IS NOT NULL AND v_profile.last_name != '' AND
       v_profile.phone IS NOT NULL AND v_profile.phone != ''
    ) THEN
        v_is_complete := true;
    END IF;

    IF v_is_complete THEN
       UPDATE public.profiles SET verified = true WHERE id = v_user_id AND verified = false;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
