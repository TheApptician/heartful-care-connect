-- ============================================
-- HEEMS COMPLETE DATABASE MIGRATION
-- ============================================
-- Run this file in Supabase SQL Editor to set up the complete database
-- This consolidates all migrations into a single file
-- Date: 2026-01-18
-- ============================================

-- ============================================
-- PART 1: CORE TABLES
-- ============================================

-- 1.1 Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('client', 'carer', 'organisation', 'admin')) DEFAULT 'client',
  phone TEXT,
  address TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1.2 Carer Details Table
CREATE TABLE IF NOT EXISTS public.carer_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  skills TEXT[],
  hourly_rate NUMERIC(10, 2),
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  dbs_check_date DATE,
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'away')) DEFAULT 'available',
  -- Stripe Connect fields
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT false,
  stripe_charges_enabled BOOLEAN DEFAULT false,
  stripe_payouts_enabled BOOLEAN DEFAULT false,
  stripe_onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carer_details ENABLE ROW LEVEL SECURITY;

-- 1.3 Organisation Details Table
CREATE TABLE IF NOT EXISTS public.organisation_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  postcode TEXT,
  service_radius_miles INTEGER DEFAULT 10,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organisation_details ENABLE ROW LEVEL SECURITY;

-- 1.4 Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  carer_id UUID REFERENCES public.profiles(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  total_price NUMERIC(10, 2),
  rate_per_hour NUMERIC(10, 2),
  client_fee NUMERIC(10, 2),
  carer_fee NUMERIC(10, 2),
  stripe_transfer_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 1.5 Care Plans Table
CREATE TABLE IF NOT EXISTS public.care_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  medications JSONB DEFAULT '[]',
  routines JSONB DEFAULT '[]',
  emergency_contact JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: VERIFICATION SYSTEM
-- ============================================

-- 2.1 Carer Verification Table (with document URLs)
CREATE TABLE IF NOT EXISTS public.carer_verification (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  -- Document statuses
  id_status TEXT CHECK (id_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  dbs_status TEXT CHECK (dbs_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  rtw_status TEXT CHECK (rtw_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  insurance_status TEXT CHECK (insurance_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  -- Document URLs
  id_document_url TEXT,
  dbs_document_url TEXT,
  rtw_document_url TEXT,
  insurance_document_url TEXT,
  -- Expiry dates
  dbs_expiry DATE,
  insurance_expiry DATE,
  rtw_expiry DATE,
  -- Metadata
  last_vetted_at TIMESTAMPTZ,
  overall_status TEXT CHECK (overall_status IN ('unverified', 'pending', 'verified', 'expired')) DEFAULT 'unverified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carer_verification ENABLE ROW LEVEL SECURITY;

-- 2.2 Carer Referrals Table
CREATE TABLE IF NOT EXISTS public.carer_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  carer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referee_name TEXT NOT NULL,
  referee_email TEXT NOT NULL,
  referee_phone TEXT,
  relationship TEXT,
  status TEXT CHECK (status IN ('pending', 'notified', 'verified', 'rejected')) DEFAULT 'pending',
  verification_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carer_referrals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 3: MESSAGING SYSTEM
-- ============================================

-- 3.1 Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  flagged_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3.2 Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 4: SYSTEM CONFIGURATION
-- ============================================

-- 4.1 System Config Table
CREATE TABLE IF NOT EXISTS public.system_config (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial phase
INSERT INTO public.system_config (id, value, description)
VALUES ('active_phase', '1', 'Current pricing phase (1 or 2)')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 5: INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);
CREATE INDEX IF NOT EXISTS idx_carer_details_stripe_account ON public.carer_details(stripe_account_id) WHERE stripe_account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_carer ON public.bookings(carer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_carer_referrals_carer ON public.carer_referrals(carer_id);

-- ============================================
-- PART 6: HELPER FUNCTIONS
-- ============================================

-- 6.1 Admin check function (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.2 Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.3 Sync carer verification status to profiles
CREATE OR REPLACE FUNCTION public.sync_carer_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.overall_status = 'verified' AND (OLD.overall_status IS NULL OR OLD.overall_status != 'verified') THEN
    UPDATE public.profiles SET verified = true WHERE id = NEW.id AND role = 'carer';
  END IF;
  IF NEW.overall_status != 'verified' AND OLD.overall_status = 'verified' THEN
    UPDATE public.profiles SET verified = false WHERE id = NEW.id AND role = 'carer';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6.4 Update conversation timestamp on new message
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE (participant_1_id = NEW.sender_id AND participant_2_id = NEW.receiver_id)
     OR (participant_1_id = NEW.receiver_id AND participant_2_id = NEW.sender_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6.5 Ensure conversation exists before message
CREATE OR REPLACE FUNCTION public.ensure_conversation_exists()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.conversations (participant_1_id, participant_2_id)
  VALUES (
    LEAST(NEW.sender_id, NEW.receiver_id),
    GREATEST(NEW.sender_id, NEW.receiver_id)
  )
  ON CONFLICT (participant_1_id, participant_2_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 7: TRIGGERS
-- ============================================

-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_sync_carer_verification ON public.carer_verification;
DROP TRIGGER IF EXISTS update_conversation_on_message ON public.messages;
DROP TRIGGER IF EXISTS ensure_conversation_before_message ON public.messages;

-- 7.1 Create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7.2 Sync verification status
CREATE TRIGGER trigger_sync_carer_verification
  AFTER UPDATE ON public.carer_verification
  FOR EACH ROW EXECUTE FUNCTION public.sync_carer_verification_status();

-- 7.3 Update conversation timestamp
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();

-- 7.4 Ensure conversation exists
CREATE TRIGGER ensure_conversation_before_message
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.ensure_conversation_exists();

-- ============================================
-- PART 8: RLS POLICIES
-- ============================================

-- 8.1 Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on profiles" ON public.profiles
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.2 Carer Details Policies
DROP POLICY IF EXISTS "Carer details are viewable by everyone." ON public.carer_details;
DROP POLICY IF EXISTS "Carers can update their own details." ON public.carer_details;
DROP POLICY IF EXISTS "Carers can insert their own details." ON public.carer_details;
DROP POLICY IF EXISTS "Admins can do everything on carer_details" ON public.carer_details;

CREATE POLICY "Carer details are viewable by everyone." ON public.carer_details
  FOR SELECT USING (true);

CREATE POLICY "Carers can insert their own details." ON public.carer_details
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Carers can update their own details." ON public.carer_details
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on carer_details" ON public.carer_details
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.3 Organisation Details Policies
DROP POLICY IF EXISTS "Organisations viewable by everyone" ON public.organisation_details;
DROP POLICY IF EXISTS "Orgs can insert their own details" ON public.organisation_details;
DROP POLICY IF EXISTS "Orgs can update their own details" ON public.organisation_details;
DROP POLICY IF EXISTS "Admins can do everything on organisation_details" ON public.organisation_details;

CREATE POLICY "Organisations viewable by everyone" ON public.organisation_details
  FOR SELECT USING (true);

CREATE POLICY "Orgs can insert their own details" ON public.organisation_details
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Orgs can update their own details" ON public.organisation_details
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on organisation_details" ON public.organisation_details
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.4 Bookings Policies
DROP POLICY IF EXISTS "Users can view their own bookings." ON public.bookings;
DROP POLICY IF EXISTS "Clients can create bookings." ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings." ON public.bookings;
DROP POLICY IF EXISTS "Admins can do everything on bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings." ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = carer_id);

CREATE POLICY "Clients can create bookings." ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own bookings." ON public.bookings
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = carer_id);

CREATE POLICY "Admins can do everything on bookings" ON public.bookings
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.5 Care Plans Policies
DROP POLICY IF EXISTS "Clients and assigned carers can view care plans." ON public.care_plans;
DROP POLICY IF EXISTS "Clients can create care plans." ON public.care_plans;
DROP POLICY IF EXISTS "Clients can update their care plans." ON public.care_plans;
DROP POLICY IF EXISTS "Admins can do everything on care_plans" ON public.care_plans;

CREATE POLICY "Clients and assigned carers can view care plans." ON public.care_plans
  FOR SELECT USING (
    auth.uid() = client_id OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.client_id = care_plans.client_id AND b.carer_id = auth.uid())
  );

CREATE POLICY "Clients can create care plans." ON public.care_plans
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their care plans." ON public.care_plans
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Admins can do everything on care_plans" ON public.care_plans
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.6 Carer Verification Policies
DROP POLICY IF EXISTS "Carer verification viewable by owner and admin" ON public.carer_verification;
DROP POLICY IF EXISTS "Carers can insert their verification" ON public.carer_verification;
DROP POLICY IF EXISTS "Carers can update their verification" ON public.carer_verification;
DROP POLICY IF EXISTS "Admins can do everything on carer_verification" ON public.carer_verification;

CREATE POLICY "Carer verification viewable by owner and admin" ON public.carer_verification
  FOR SELECT USING (auth.uid() = id OR (SELECT public.check_is_admin()));

CREATE POLICY "Carers can insert their verification" ON public.carer_verification
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Carers can update their verification" ON public.carer_verification
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on carer_verification" ON public.carer_verification
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.7 Carer Referrals Policies
DROP POLICY IF EXISTS "Carer referrals viewable by owner and admin" ON public.carer_referrals;
DROP POLICY IF EXISTS "Carers can insert their referrals" ON public.carer_referrals;
DROP POLICY IF EXISTS "Carers can update their referrals" ON public.carer_referrals;
DROP POLICY IF EXISTS "Admins can do everything on carer_referrals" ON public.carer_referrals;

CREATE POLICY "Carer referrals viewable by owner and admin" ON public.carer_referrals
  FOR SELECT USING (auth.uid() = carer_id OR (SELECT public.check_is_admin()));

CREATE POLICY "Carers can insert their referrals" ON public.carer_referrals
  FOR INSERT WITH CHECK (auth.uid() = carer_id);

CREATE POLICY "Carers can update their referrals" ON public.carer_referrals
  FOR UPDATE USING (auth.uid() = carer_id);

CREATE POLICY "Admins can do everything on carer_referrals" ON public.carer_referrals
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.8 Messages Policies
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update received messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can do everything on messages" ON public.messages;

CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received messages" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Admins can do everything on messages" ON public.messages
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.9 Conversations Policies
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can do everything on conversations" ON public.conversations;

CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Admins can do everything on conversations" ON public.conversations
  FOR ALL USING ((SELECT public.check_is_admin()));

-- ============================================
-- PART 9: ENABLE REALTIME (IDEMPOTENT)
-- ============================================

-- Enable realtime for messages (only if not already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;
END $$;

-- ============================================
-- BLOG POSTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  reading_time TEXT DEFAULT '5 min read',
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- RLS for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

-- Admins can manage all posts
CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Admins can view and manage submissions
CREATE POLICY "Admins can manage contact submissions"
  ON public.contact_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- SEED DATA: BLOG POSTS
-- ============================================

INSERT INTO public.blog_posts (title, slug, excerpt, content, author, category, reading_time, is_published, is_featured, published_at) VALUES
(
  'The Future of Specialist Care in the UK',
  'future-of-specialist-care-uk',
  'How technological infrastructure is solving the fragmentation of private care and improving clinical outcomes.',
  '<h2>Introduction</h2>
<p>The UK''s private care sector is undergoing a significant transformation. For decades, families seeking specialist care for their loved ones have navigated a fragmented landscape of agencies, independent carers, and often inadequate vetting processes.</p>

<h2>The Current Challenges</h2>
<p>Traditional care agencies often charge high fees while paying carers relatively little. This creates a situation where quality professionals leave the sector, and families struggle to find reliable, verified care.</p>

<h2>Technology as the Solution</h2>
<p>Platforms like Heems are changing this dynamic by providing clinical-grade vetting infrastructure, real-time matching algorithms, and transparent pricing that benefits both families and carers.</p>

<h2>Looking Ahead</h2>
<p>The future of UK care lies in technology-enabled marketplaces that prioritize safety, transparency, and fair compensation for care professionals.</p>',
  'Dr. Sarah Jameson',
  'Industry Insights',
  '8 min read',
  true,
  false,
  NOW() - INTERVAL '5 days'
),
(
  '5 Things to Look for in a Specialist Carer',
  '5-things-specialist-carer',
  'A comprehensive guide for families navigating the vetting process for complex care needs.',
  '<h2>Finding the Right Carer</h2>
<p>Choosing a carer for a loved one with complex needs is one of the most important decisions a family can make. Here are five critical factors to consider.</p>

<h2>1. Verified Qualifications</h2>
<p>Always verify that your carer has the appropriate qualifications and training for your specific care needs. This includes NVQ levels, specialist certifications, and up-to-date mandatory training.</p>

<h2>2. DBS Check Status</h2>
<p>An Enhanced DBS check is essential. Ensure this has been completed recently and covers the appropriate workforce type.</p>

<h2>3. Professional References</h2>
<p>Look for carers with verifiable references from previous care roles. A good platform will have already vetted these.</p>

<h2>4. Specialist Experience</h2>
<p>If your loved one has specific conditions like dementia, Parkinson''s, or requires palliative care, seek carers with documented experience in these areas.</p>

<h2>5. Personality Fit</h2>
<p>Beyond qualifications, the personal connection matters. Many platforms now offer video introductions or trial visits.</p>',
  'Marcus Thorne',
  'Family Guide',
  '5 min read',
  true,
  false,
  NOW() - INTERVAL '7 days'
),
(
  'Automating Compliance: The Heems Story',
  'automating-compliance-heems-story',
  'Behind the scenes of the engine that ensures every carer on our platform meets the highest standards.',
  '<h2>Building Trust Through Technology</h2>
<p>When we started Heems, we knew that trust would be our most important currency. Families entrusting us with finding care for their loved ones needed absolute confidence in our vetting process.</p>

<h2>The 20-Point Verification System</h2>
<p>Our compliance engine checks 20 distinct data points for every carer, from identity verification to professional references, DBS status to insurance coverage.</p>

<h2>Real-Time Monitoring</h2>
<p>Compliance isn''t a one-time check. Our system continuously monitors document expiry dates, re-verifies credentials, and flags any issues before they become problems.</p>

<h2>The Human Element</h2>
<p>While technology does the heavy lifting, our clinical team reviews edge cases and maintains the human judgment that complex care decisions require.</p>

<h2>Results That Speak</h2>
<p>Since implementing our automated compliance system, we''ve achieved a 99.9% verification accuracy rate with an average verification time of just 24 hours.</p>',
  'James Heems',
  'Engineering',
  '12 min read',
  true,
  false,
  NOW() - INTERVAL '10 days'
),
(
  'Connecting the Dots: How Shared Data is Transforming Clinical-at-Home Outcomes',
  'shared-data-clinical-outcomes',
  'An in-depth analysis of how integrated data layers are giving carers and families the real-time insights they need to prevent hospital readmissions.',
  '<h2>The Data Revolution in Home Care</h2>
<p>Home care has traditionally operated in information silos. The GP has one set of records, the hospital another, and home carers often work with limited information.</p>

<h2>Breaking Down Barriers</h2>
<p>Modern care platforms are changing this by creating integrated data layers that allow relevant health information to be shared securely between all parties involved in a patient''s care.</p>

<h2>Preventing Readmissions</h2>
<p>With access to real-time care logs, medication tracking, and vital signs monitoring, potential issues can be identified and addressed before they escalate to hospital-level interventions.</p>

<h2>The Privacy Balance</h2>
<p>Data sharing must be balanced with privacy. GDPR-compliant systems ensure that only relevant information is shared with those who need it, with full audit trails.</p>

<h2>Looking Forward</h2>
<p>The future will see even greater integration with NHS systems, wearable devices, and AI-powered predictive analytics.</p>',
  'David Elan',
  'Clinical Innovation',
  '10 min read',
  true,
  true,
  NOW() - INTERVAL '3 days'
);

-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

