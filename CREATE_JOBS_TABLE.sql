-- Create a table for posting jobs
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Question 1: Care Type details
    care_type text NOT NULL, -- 'hourly', 'overnight', 'live_in'
    care_subtype text, -- 'hourly', 'sleeping', 'waking', 'part_time', 'full_time'
    live_in_confirmed boolean DEFAULT false, -- For the disclaimer
    
    -- Question 2: Start Date
    start_timeline text, -- 'immediate', 'few_weeks', 'specific_date'
    specific_start_date date,
    
    -- Question 3: Recipient
    recipient_relationship text, -- 'myself', 'family', 'friend'
    
    -- Question 5: Funding
    funding_source text, -- 'self', 'local_authority', 'nhs'
    
    -- Question 6: Preferences
    driver_required text, -- 'yes', 'no', 'dont_mind'
    non_smoker_required text, -- 'yes', 'no', 'dont_mind'
    has_pets boolean, -- true/false
    
    -- Question 7: Carer Gender Preference
    gender_preference text, -- 'male', 'female', 'dont_mind'
    
    -- Question 8: Location
    postcode text NOT NULL,
    address text,
    
    -- Question 9: Additional Info
    additional_info text,
    
    -- Metadata
    status text DEFAULT 'open', -- 'open', 'closed', 'filled', 'draft'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Clients can create their own jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view their own jobs" ON public.jobs
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Carers can view open jobs" ON public.jobs
    FOR SELECT USING (
        status = 'open' 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'carer'
        )
    );

CREATE POLICY "Clients can update their own jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() = client_id);
