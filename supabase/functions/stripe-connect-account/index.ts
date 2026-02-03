// Supabase Edge Function: Create Stripe Connect Account
// Deploy to: supabase/functions/stripe-connect-account/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

// Production-ready CORS - set ALLOWED_ORIGINS env var in Supabase Dashboard
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGINS") || "*";
const corsHeaders = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { carerId, email, refreshUrl, returnUrl } = await req.json();

        if (!carerId || !email) {
            throw new Error("Missing required fields: carerId and email");
        }

        // Create Stripe Connect Express account
        const account = await stripe.accounts.create({
            type: "express",
            country: "GB",
            email: email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: "individual",
            metadata: {
                carer_id: carerId,
            },
        });

        // Create account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: refreshUrl || `${Deno.env.get("APP_URL")}/carer/dashboard`,
            return_url: returnUrl || `${Deno.env.get("APP_URL")}/carer/dashboard?stripe=success`,
            type: "account_onboarding",
        });

        // Update carer_details with Stripe account ID
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/carer_details?id=eq.${carerId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": supabaseKey || "",
                "Authorization": `Bearer ${supabaseKey}`,
                "Prefer": "return=minimal",
            },
            body: JSON.stringify({
                stripe_account_id: account.id,
            }),
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update carer_details");
        }

        return new Response(
            JSON.stringify({
                accountId: account.id,
                onboardingUrl: accountLink.url,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error creating Stripe account:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
