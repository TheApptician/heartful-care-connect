-- ==============================================================================
-- COMPREHENSIVE FIX: Sync Auth Users to Public Profiles
-- This script fixes missing profiles AND missing details for existing profiles.
-- Run this in the Supabase SQL Editor.
-- ==============================================================================

-- 1. Ensure email and phone columns exist in public.profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text;

-- 2. CREATE MISSING PROFILES
-- Inserts a profile for any user in auth.users that does NOT exist in public.profiles
INSERT INTO public.profiles (id, email, phone, full_name, avatar_url, role, verified, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.phone, au.raw_user_meta_data->>'phone'),
    COALESCE(
        au.raw_user_meta_data->>'full_name', 
        TRIM(BOTH ' ' FROM (COALESCE(au.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(au.raw_user_meta_data->>'last_name', ''))),
        'User ' || substr(au.email, 1, 4)
    ),
    au.raw_user_meta_data->>'avatar_url',
    COALESCE(au.raw_user_meta_data->>'role', 'client'), -- Default to client if unknown
    false, -- Default to unverified
    au.created_at,
    au.last_sign_in_at -- Use last sign in as updated_at, or created_at if null
FROM auth.users au
LEFT JOIN public.profiles pp ON au.id = pp.id
WHERE pp.id IS NULL;

-- 3. UPDATE EXISTING PROFILES WITH MISSING DATA
-- Syncs email, phone, and name from auth.users to public.profiles if they are missing in profiles
UPDATE public.profiles p
SET 
    email = COALESCE(p.email, au.email),
    phone = COALESCE(p.phone, au.phone, au.raw_user_meta_data->>'phone'),
    full_name = COALESCE(
        p.full_name, 
        au.raw_user_meta_data->>'full_name', 
        TRIM(BOTH ' ' FROM (COALESCE(au.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(au.raw_user_meta_data->>'last_name', '')))
    ),
    role = COALESCE(p.role, au.raw_user_meta_data->>'role', 'client')
FROM auth.users au
WHERE p.id = au.id;

-- 4. Verify the results
SELECT 
    (SELECT count(*) FROM auth.users) as total_auth_users,
    (SELECT count(*) FROM public.profiles) as total_public_profiles,
    (SELECT count(*) FROM public.profiles WHERE email IS NOT NULL) as profiles_with_email;
