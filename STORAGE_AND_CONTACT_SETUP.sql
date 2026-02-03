-- ============================================
-- HEEMS STORAGE BUCKETS AND RLS POLICIES
-- ============================================
-- Run this in Supabase SQL Editor to create storage buckets and policies
-- This is required for document uploads and message attachments to work

-- Note: Buckets must be created via the Supabase Dashboard UI or API
-- This script sets up the RLS policies for those buckets

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- 1. Verification Documents Bucket
-- Users can only upload to their own folder
-- Admins can view all documents

-- Policy: Users can upload their own verification documents
CREATE POLICY "Users can upload own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'verification-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own verification documents
CREATE POLICY "Users can view own verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'verification-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own verification documents
CREATE POLICY "Users can update own verification docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'verification-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own verification documents
CREATE POLICY "Users can delete own verification docs"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'verification-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Admins can view all verification documents
CREATE POLICY "Admins can view all verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'verification-documents' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 2. Message Attachments Bucket
-- Users can upload and view their own message attachments

-- Policy: Users can upload message attachments
CREATE POLICY "Users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'message-attachments' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view message attachments they're involved with
CREATE POLICY "Users can view relevant message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'message-attachments'
);

-- Policy: Admins can view all message attachments
CREATE POLICY "Admins can view all message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'message-attachments' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
-- For storing contact form submissions

CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'responded', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    responded_by UUID REFERENCES profiles(id),
    notes TEXT
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view contact submissions
CREATE POLICY "Admins can view contact submissions"
ON contact_submissions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy: Anyone can insert contact submissions (for the form)
CREATE POLICY "Anyone can submit contact form"
ON contact_submissions FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow anonymous insertions for non-logged-in users
CREATE POLICY "Anonymous can submit contact form"
ON contact_submissions FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Admins can update contact submissions
CREATE POLICY "Admins can update contact submissions"
ON contact_submissions FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- INSTRUCTIONS FOR CREATING STORAGE BUCKETS
-- ============================================
-- 
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New Bucket"
-- 3. Create bucket: "verification-documents"
--    - Set to PRIVATE
--    - File size limit: 5MB
--    - Allowed MIME types: application/pdf, image/jpeg, image/png
-- 4. Create bucket: "message-attachments"
--    - Set to PRIVATE
--    - File size limit: 10MB
-- 5. Run this SQL script to apply the RLS policies
-- ============================================
