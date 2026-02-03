/**
 * Create Demo Carers Script
 * 
 * This script creates demo carer accounts using Supabase Admin API.
 * 
 * SETUP:
 * 1. Get your Supabase Service Role Key from:
 *    Dashboard -> Settings -> API -> service_role key (secret)
 * 
 * 2. Run: node create-demo-carers.js
 * 
 * NOTE: The service_role key bypasses RLS and can create users directly.
 */

const { createClient } = require('@supabase/supabase-js');

// IMPORTANT: Replace with your actual values
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

// Create admin client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const demoCarers = [
    {
        email: 'sarah.jenkins@demo.heems.com',
        password: 'DemoPass123!',
        full_name: 'Sarah Jenkins',
        bio: 'Nurse with 12 years of experience in elderly care and dementia support.',
        hourly_rate: 24,
        experience_years: '12 years',
        specializations: ['Personal Care', 'Dementia Care', 'Palliative Care', 'Medication Management']
    },
    {
        email: 'david.wilson@demo.heems.com',
        password: 'DemoPass123!',
        full_name: 'David Wilson',
        bio: 'Senior Carer with 8 years experience. Specialized in mobility assistance.',
        hourly_rate: 22,
        experience_years: '8 years',
        specializations: ['Mobility Assistance', 'Physical Disabilities', 'Companionship', 'Personal Care']
    },
    {
        email: 'elizabeth.aris@demo.heems.com',
        password: 'DemoPass123!',
        full_name: 'Elizabeth Aris',
        bio: 'Companion Care professional with 15 years of experience.',
        hourly_rate: 20,
        experience_years: '15 years',
        specializations: ['Companionship', 'Elderly Care', 'Mental Health Support', 'Light Housekeeping']
    },
    {
        email: 'michael.chen@demo.heems.com',
        password: 'DemoPass123!',
        full_name: 'Michael Chen',
        bio: 'Palliative Care expert with 10 years experience providing end-of-life care.',
        hourly_rate: 28,
        experience_years: '10 years',
        specializations: ['Palliative Care', 'Pain Management', 'Family Support', 'Medication Management']
    },
    {
        email: 'sophie.taylor@demo.heems.com',
        password: 'DemoPass123!',
        full_name: 'Sophie Taylor',
        bio: 'Dementia Care expert with 6 years of focused experience.',
        hourly_rate: 24,
        experience_years: '6 years',
        specializations: ['Dementia Care', 'Memory Care', 'Behavioral Support', 'Personal Care']
    },
    {
        email: 'marcus.thompson@demo.heems.com',
        password: 'DemoPass123!',
        full_name: 'Marcus Thompson',
        bio: 'Night Support expert with 9 years experience.',
        hourly_rate: 26,
        experience_years: '9 years',
        specializations: ['Night Care', 'Sleep Support', 'Emergency Response', 'Personal Care']
    }
];

async function createDemoCarers() {
    console.log('Creating demo carers...\n');

    for (const carer of demoCarers) {
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: carer.email,
                password: carer.password,
                email_confirm: true,
                user_metadata: {
                    full_name: carer.full_name,
                    role: 'carer'
                }
            });

            if (authError) {
                console.log(`⚠️  ${carer.full_name}: ${authError.message}`);
                continue;
            }

            const userId = authData.user.id;
            console.log(`✅ Created user: ${carer.full_name} (${userId})`);

            // Update profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name: carer.full_name,
                    email: carer.email,
                    role: 'carer',
                    verified: true
                }, { onConflict: 'id' });

            if (profileError) {
                console.log(`   ⚠️  Profile error: ${profileError.message}`);
            }

            // Create carer_details
            const { error: carerError } = await supabase
                .from('carer_details')
                .upsert({
                    id: userId,
                    bio: carer.bio,
                    hourly_rate: carer.hourly_rate,
                    experience_years: carer.experience_years,
                    specializations: carer.specializations,
                    verification_status: 'verified',
                    availability_status: 'available',
                    has_dbs: true,
                    has_insurance: true,
                    has_right_to_work: true
                }, { onConflict: 'id' });

            if (carerError) {
                console.log(`   ⚠️  Carer details error: ${carerError.message}`);
            } else {
                console.log(`   ✅ Carer details created`);
            }

        } catch (error) {
            console.log(`❌ Error with ${carer.full_name}:`, error.message);
        }
    }

    console.log('\n✅ Demo carers creation complete!');
    console.log('\nYou can now login with any of these accounts:');
    demoCarers.forEach(c => {
        console.log(`   Email: ${c.email}`);
        console.log(`   Password: ${c.password}\n`);
    });
}

createDemoCarers().catch(console.error);
