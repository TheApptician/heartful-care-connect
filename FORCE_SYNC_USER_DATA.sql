-- ==============================================================================
-- FORCE SYNC: Overwrite Profiles with Auth Data
-- This script fixes empty/blank fields in profiles by FORCE copying from auth.users
-- ==============================================================================

-- 1. Update EMAIL
-- We overwrite profile email if it's NULL or Empty, taking from auth.users
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id
  AND (p.email IS NULL OR TRIM(p.email) = '');

-- 2. Update PHONE
-- We take phone from auth.users (phone column) OR metadata
UPDATE public.profiles p
SET phone = COALESCE(au.phone, au.raw_user_meta_data->>'phone')
FROM auth.users au
WHERE p.id = au.id
  AND (p.phone IS NULL OR TRIM(p.phone) = '')
  AND (au.phone IS NOT NULL OR au.raw_user_meta_data->>'phone' IS NOT NULL);

-- 3. Update NAME
-- We construct full name from metadata if profile name is missing
UPDATE public.profiles p
SET full_name = COALESCE(
    au.raw_user_meta_data->>'full_name',
    TRIM(BOTH ' ' FROM (COALESCE(au.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(au.raw_user_meta_data->>'last_name', ''))),
    'User ' || substr(au.email, 1, 4) -- Fallback to "User abcd" if absolutely no name
)
FROM auth.users au
WHERE p.id = au.id
  AND (p.full_name IS NULL OR TRIM(p.full_name) = '')
  AND (au.raw_user_meta_data->>'full_name' IS NOT NULL OR au.raw_user_meta_data->>'first_name' IS NOT NULL);

-- 4. Update ROLE (fallback)
UPDATE public.profiles p
SET role = COALESCE(au.raw_user_meta_data->>'role', 'client')
FROM auth.users au
WHERE p.id = au.id
  AND (p.role IS NULL OR TRIM(p.role) = '');

-- 5. Verification Check
SELECT count(*) as fixed_profiles FROM public.profiles WHERE email IS NOT NULL AND email != '';
