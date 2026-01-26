-- ============================================
-- FIX: Signup Trigger to capture Phone and Names
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert with all fields from metadata
  INSERT INTO public.profiles (id, full_name, first_name, last_name, phone, avatar_url, role, verified, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', (NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name')),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- AUTO VERIFICATION SYSTEM
-- ============================================

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
  
  -- If profile not found (e.g. race condition), exit
  IF v_profile IS NULL THEN
    RETURN NEW;
  END IF;

  v_role := v_profile.role;

  -- 1. CARER VERIFICATION LOGIC
  IF v_role = 'carer' THEN
    SELECT * INTO v_carer FROM public.carer_details WHERE id = v_user_id;
    
    -- Check critical fields
    IF (
       v_profile.first_name IS NOT NULL AND v_profile.first_name != '' AND
       v_profile.last_name IS NOT NULL AND v_profile.last_name != '' AND
       v_profile.phone IS NOT NULL AND v_profile.phone != '' AND
       v_profile.location IS NOT NULL AND v_profile.location != '' AND
       v_carer.experience_years IS NOT NULL AND
       v_carer.has_dbs = true AND 
       v_carer.has_insurance = true AND 
       v_carer.has_right_to_work = true
    ) THEN
        v_is_complete := true;
    END IF;

    -- Update status
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

-- Triggers to run auto verification
DROP TRIGGER IF EXISTS check_verification_profiles ON public.profiles;
CREATE TRIGGER check_verification_profiles
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_verify_user();

DROP TRIGGER IF EXISTS check_verification_carer ON public.carer_details;
CREATE TRIGGER check_verification_carer
  AFTER INSERT OR UPDATE ON public.carer_details
  FOR EACH ROW EXECUTE FUNCTION public.auto_verify_user();

DROP TRIGGER IF EXISTS check_verification_org ON public.organisation_details;
CREATE TRIGGER check_verification_org
  AFTER INSERT OR UPDATE ON public.organisation_details
  FOR EACH ROW EXECUTE FUNCTION public.auto_verify_user();
