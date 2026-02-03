-- HEEMS - SEED DEMO CARERS (FINAL STABLE VERSION)
-- This script updates existing carer users with high-quality demo data.

-- IMPORTANT: You must have existing users with the role 'carer' in the profiles table.
-- You can create them via Supabase Auth or use the create-demo-carers.js script.

DO $$
DECLARE
    carer_ids UUID[];
    carer_id UUID;
    i INTEGER := 1;
    demo_data JSONB[] := ARRAY[
        '{"bio": "Nurse with 12 years of experience in elderly care and dementia support. Expert in medication management and clinical oversight.", "hourly_rate": 24, "experience_years": "12 Years Exp.", "specializations": ["Personal Care", "Dementia Care", "Palliative Care", "Medication Support"]}'::jsonb,
        '{"bio": "Senior Carer with 8 years experience. Specialized in mobility assistance and physical rehabilitation support.", "hourly_rate": 22, "experience_years": "8 Years Exp.", "specializations": ["Mobility Assistance", "Physical Disabilities", "Companionship"]}'::jsonb,
        '{"bio": "Companion Care professional with 15 years of experience. Dedicated to enriching lives through meaningful companionship.", "hourly_rate": 20, "experience_years": "15 Years Exp.", "specializations": ["Companionship", "Elderly Care", "Mental Health Support", "Light Housekeeping"]}'::jsonb,
        '{"bio": "Palliative Care expert with 10 years experience providing end-of-life care with dignity and compassion.", "hourly_rate": 28, "experience_years": "10 Years Exp.", "specializations": ["Palliative Care", "Pain Management", "Family Support", "Clinical Care"]}'::jsonb,
        '{"bio": "Dementia Care expert with 6 years of focused experience. Trained in person-centered memory care approaches.", "hourly_rate": 24, "experience_years": "6 Years Exp.", "specializations": ["Dementia Care", "Memory Care", "Behavioral Support", "Personal Care"]}'::jsonb,
        '{"bio": "Night Support expert with 9 years experience. Expert in sleep hygiene and overnight monitoring.", "hourly_rate": 26, "experience_years": "9 Years Exp.", "specializations": ["Night Care", "Sleep Support", "Emergency Response", "Personal Care"]}'::jsonb,
        '{"bio": "Learning Disabilities expert with 7 years experience. Passionate about enabling independence and life skills.", "hourly_rate": 23, "experience_years": "7 Years Exp.", "specializations": ["Learning Disabilities", "Autism Support", "Life Skills"]}'::jsonb,
        '{"bio": "Physiotherapy-trained carer with 5 years supporting post-surgery rehabilitation and injury recovery.", "hourly_rate": 21, "experience_years": "5 Years Exp.", "specializations": ["Rehabilitation", "Exercise Therapy", "Post-Surgery Care"]}'::jsonb
    ];
    demo_item JSONB;
BEGIN
    -- Get all carer user IDs
    SELECT ARRAY_AGG(id) INTO carer_ids FROM profiles WHERE role = 'carer';
    
    IF carer_ids IS NULL OR array_length(carer_ids, 1) IS NULL THEN
        RAISE NOTICE 'No carer users found. Please create carer accounts first via Auth.';
        RETURN;
    END IF;
    
    -- Update each carer with demo data
    FOREACH carer_id IN ARRAY carer_ids LOOP
        demo_item := demo_data[((i - 1) % array_length(demo_data, 1)) + 1];
        
        -- Insert/Update carer_details
        INSERT INTO carer_details (
            id, 
            bio, 
            hourly_rate, 
            experience_years, 
            specializations, 
            verification_status, 
            availability_status,
            has_dbs,
            has_insurance,
            has_right_to_work,
            dbs_expiry,
            insurance_expiry,
            rtw_expiry
        )
        VALUES (
            carer_id,
            demo_item->>'bio',
            (demo_item->>'hourly_rate')::numeric,
            demo_item->>'experience_years',
            ARRAY(SELECT jsonb_array_elements_text(demo_item->'specializations')),
            'verified',
            'available',
            true,
            true,
            true,
            CURRENT_DATE + interval '365 days',
            CURRENT_DATE + interval '180 days',
            CURRENT_DATE + interval '730 days'
        )
        ON CONFLICT (id) DO UPDATE SET
            bio = EXCLUDED.bio,
            hourly_rate = EXCLUDED.hourly_rate,
            experience_years = EXCLUDED.experience_years,
            specializations = EXCLUDED.specializations,
            verification_status = 'verified',
            availability_status = 'available',
            has_dbs = true,
            has_insurance = true,
            has_right_to_work = true,
            dbs_expiry = EXCLUDED.dbs_expiry,
            insurance_expiry = EXCLUDED.insurance_expiry,
            rtw_expiry = EXCLUDED.rtw_expiry;
        
        -- Also update profile to be verified
        UPDATE public.profiles SET verified = true WHERE id = carer_id;
        
        -- Add verification records
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'carer_verification') THEN
            INSERT INTO public.carer_verification (
                id, 
                dbs_status, 
                id_status, 
                rtw_status, 
                insurance_status, 
                overall_status,
                dbs_expiry,
                rtw_expiry,
                insurance_expiry
            )
            VALUES (
                carer_id, 
                'verified', 
                'verified', 
                'verified', 
                'verified', 
                'verified',
                CURRENT_DATE + interval '365 days',
                CURRENT_DATE + interval '730 days',
                CURRENT_DATE + interval '180 days'
            )
            ON CONFLICT (id) DO UPDATE SET 
                dbs_status = 'verified', 
                overall_status = 'verified';
        END IF;

        RAISE NOTICE 'Updated carer: %', carer_id;
        i := i + 1;
    END LOOP;
    
    RAISE NOTICE 'Successfully seeded % carers with premium demo data.', array_length(carer_ids, 1);
END $$;
