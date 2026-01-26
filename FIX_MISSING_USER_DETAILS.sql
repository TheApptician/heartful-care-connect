-- ============================================
-- FIX: Missing User Details (Email, Phone) in Profiles
-- ============================================

-- 1. Add email and phone columns to profiles table if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text;

-- 2. Update the handle_new_user function to include email and phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email, phone, verified, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NEW.email,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Backfill missing data for existing profiles from auth.users
-- Note: This ensures that current users have their email/phone populated
UPDATE public.profiles p
SET 
    email = u.email,
    phone = COALESCE(u.phone, u.raw_user_meta_data->>'phone')
FROM auth.users u
WHERE p.id = u.id 
  AND (p.email IS NULL OR p.email = '' OR p.phone IS NULL OR p.phone = '');

-- 4. Verify the update
SELECT count(*) as updated_profiles FROM public.profiles WHERE email IS NOT NULL;
