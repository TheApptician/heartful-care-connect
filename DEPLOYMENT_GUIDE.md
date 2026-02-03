# 🚀 Heems Platform - Deployment Guide

**Last Updated:** February 3, 2026  
**Version:** 1.0.0

This guide covers the complete deployment process for the Heems care marketplace platform.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Create/update your `.env` file with the following variables:

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
```

### 2. Supabase Project Setup

#### A. Storage Buckets

1. Go to **Supabase Dashboard → Storage**
2. Create the following buckets:

| Bucket Name | Access | Max Size | Allowed MIME Types |
|------------|--------|----------|-------------------|
| `verification-documents` | Private | 5MB | `application/pdf`, `image/jpeg`, `image/png` |
| `message-attachments` | Private | 10MB | All |
| `avatars` | Public | 2MB | `image/jpeg`, `image/png`, `image/webp` |

3. Run the SQL in `STORAGE_AND_CONTACT_SETUP.sql` to apply RLS policies

#### B. Edge Function Secrets

Go to **Supabase Dashboard → Edge Functions → Manage Secrets** and add:

| Secret Name | Description |
|------------|-------------|
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key (sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe Dashboard |
| `RESEND_API_KEY` | API key from resend.com for emails |
| `ADMIN_EMAIL` | Email to receive contact form submissions |
| `APP_URL` | Your production URL (https://heems.com) |
| `ALLOWED_ORIGINS` | CORS allowed origins (https://heems.com) |

#### C. Deploy Edge Functions

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all edge functions
supabase functions deploy stripe-connect-account
supabase functions deploy stripe-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy process-payouts
supabase functions deploy approve-refund
supabase functions deploy cancel-booking
supabase functions deploy check-document-expiry
supabase functions deploy send-account-approved-email
supabase functions deploy send-contact-email
```

#### D. Set Up Cron Jobs

For automatic document expiry checking, set up a daily cron job:

**Option 1: Using pg_cron (Recommended)**

```sql
-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily check at 2 AM UTC
SELECT cron.schedule(
  'daily-document-expiry-check',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/check-document-expiry',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

**Option 2: Using External Cron Service**

Use services like cron-job.org, EasyCron, or GitHub Actions to call:
```
POST https://YOUR_PROJECT.supabase.co/functions/v1/check-document-expiry
Headers: Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

---

## 🔧 Stripe Configuration

### 1. Stripe Dashboard Setup

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Add endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `transfer.created`

4. Copy the webhook signing secret to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

### 2. Stripe Connect Setup

1. Go to **Stripe Dashboard → Settings → Connect**
2. Enable Express accounts
3. Configure your platform branding
4. Set redirect URLs:
   - Refresh URL: `https://heems.com/carer/earnings?stripe=refresh`
   - Return URL: `https://heems.com/carer/earnings?stripe=success`

---

## 🗄️ Database Migrations

Run the following SQL files in order:

1. `STORAGE_AND_CONTACT_SETUP.sql` - Storage policies and contact table
2. Any pending migration files in `/supabase/migrations/`

### Required Tables Check

Ensure these tables exist with proper columns:

```sql
-- Check carer_details has Stripe columns
ALTER TABLE carer_details ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE carer_details ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE carer_details ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE carer_details ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE carer_details ADD COLUMN IF NOT EXISTS stripe_onboarded_at TIMESTAMPTZ;

-- Check bookings has payment columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Check profiles has status column for suspension
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
  CHECK (status IN ('active', 'suspended', 'pending'));
```

---

## 🌐 Production Build

### Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build locally
npm run preview
```

### Deploy to Hosting

**Vercel (Recommended):**
```bash
npx vercel --prod
```

**Netlify:**
```bash
npx netlify deploy --prod
```

**Manual (any static host):**
Upload the contents of the `dist/` folder to your hosting provider.

---

## 🔒 Security Checklist

- [ ] All environment variables are set in production, not committed to git
- [ ] `ALLOWED_ORIGINS` is set to your production domain in Edge Functions
- [ ] Stripe is in live mode with real API keys
- [ ] RLS (Row Level Security) is enabled on all tables
- [ ] Storage bucket policies are applied
- [ ] Admin accounts use strong passwords and 2FA
- [ ] HTTPS is enforced on your domain

---

## 📊 Monitoring

### Supabase Dashboard

- **Edge Function Logs:** Dashboard → Edge Functions → Logs
- **Database Logs:** Dashboard → Database → Logs
- **Auth Logs:** Dashboard → Authentication → Logs

### Stripe Dashboard

- **Payment Logs:** Dashboard → Payments
- **Webhook Logs:** Dashboard → Developers → Webhooks → Select endpoint → Events

---

## 🐛 Troubleshooting

### Edge Function Returns 404
- Ensure the function is deployed: `supabase functions list`
- Check function name matches exactly

### Stripe Payments Not Working
- Verify `STRIPE_SECRET_KEY` is set correctly
- Check Supabase Edge Function logs for errors
- Ensure webhook endpoint is registered in Stripe

### Documents Not Uploading
- Verify storage bucket exists: `verification-documents`
- Check RLS policies are applied
- Ensure file size is under 5MB

### Contact Form Not Sending Emails
- Verify `RESEND_API_KEY` is set
- Check Edge Function `send-contact-email` is deployed
- Verify from email domain is configured in Resend

---

## 📞 Support Contacts

- **Platform Issues:** support@heems.com
- **Billing Questions:** billing@heems.com
- **Technical Support:** tech@heems.com

---

## 📈 Post-Deployment Tasks

1. [ ] Test user registration flow (all roles)
2. [ ] Test carer verification document upload
3. [ ] Test booking flow with real payment
4. [ ] Test admin user management
5. [ ] Test messaging between client and carer
6. [ ] Verify email notifications are received
7. [ ] Test Stripe Connect onboarding for carers
8. [ ] Confirm daily cron job runs (check logs next day)
