// Supabase Edge Function: Create Stripe Checkout Session
// Deploy to: supabase/functions/stripe-checkout-session/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripe = new Stripe(stripeSecretKey || "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        if (!stripeSecretKey) {
            throw new Error("STRIPE_SECRET_KEY is not set. Please add it to your Supabase Edge Function secrets.");
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase environment variables are missing");
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const requestData = await req.json();
        console.log("Request received:", JSON.stringify(requestData, null, 2));

        const {
            bookingId,
            carerId,
            clientId,
            amount, // Total amount client pays (in pence)
            applicationFeeAmount, // Platform fee (in pence)
            stripeAccountId, // Carer's Stripe account
            successUrl,
            cancelUrl,
            mode = "payment", // Default to payment mode
        } = requestData;

        // Validations
        if (mode === "payment") {
            if (!bookingId || !carerId || !clientId || !amount || !stripeAccountId) {
                throw new Error("Missing required fields for payment mode");
            }
        } else if (mode === "setup") {
            if (!clientId) {
                throw new Error("Missing clientId for setup mode");
            }
        }

        // 1. Get User Data
        console.log(`Getting user data for clientId: ${clientId}`);

        // Try to get from profiles first (including stripe_customer_id)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', clientId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error("Profile fetch error:", profileError);
        }

        let stripeCustomerId = profile?.stripe_customer_id;
        let userEmail = profile?.email;

        // 2. If email is missing from profile (or profile doesn't exist), get from auth
        if (!userEmail) {
            const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(clientId);
            if (authError || !authUser.user) {
                console.error("Auth user fetch error:", authError);
                throw new Error(`Could not find user with ID: ${clientId}`);
            }
            userEmail = authUser.user.email;
        }

        // 3. Ensure Stripe Customer
        if (!stripeCustomerId) {
            console.log(`Creating new Stripe customer for: ${userEmail}`);
            if (!userEmail) {
                throw new Error("User email is required to create a Stripe customer");
            }

            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: { supabase_id: clientId },
            });
            stripeCustomerId = customer.id;

            // Save back to profiles
            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', clientId);

            if (updateError) {
                console.warn("Could not save stripe_customer_id to profile:", updateError.message);
            }
        }

        // 4. Create Session
        const sessionParams: any = {
            customer: stripeCustomerId,
            mode: mode,
            success_url: successUrl || `${Deno.env.get("APP_URL") || 'http://localhost:8080'}/client/settings?payment=success`,
            cancel_url: cancelUrl || `${Deno.env.get("APP_URL") || 'http://localhost:8080'}/client/settings?payment=cancelled`,
            payment_method_types: ["card"],
        };

        if (mode === "payment") {
            sessionParams.line_items = [
                {
                    price_data: {
                        currency: "gbp",
                        product_data: {
                            name: "Care Booking Service",
                            description: `Reference: ${bookingId}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ];
            // Calculate Carer Earnings for delayed transfer
            const carerEarnings = amount - applicationFeeAmount;

            sessionParams.payment_intent_data = {
                // Remove immediate transfer to support delayed payouts (Separate Charges & Transfers)
                // application_fee_amount: applicationFeeAmount, 
                // transfer_data: { destination: stripeAccountId },

                metadata: {
                    booking_id: bookingId,
                    carer_id: carerId,
                    client_id: clientId,
                    payout_amount: carerEarnings, // Amount to transfer later (in pence)
                    payout_destination: stripeAccountId, // Carer's connected account ID
                },
            };
        } else if (mode === "setup") {
            sessionParams.setup_intent_data = {
                metadata: {
                    client_id: clientId,
                },
            };
        }

        console.log("Creating Stripe session...");
        let session;
        try {
            session = await stripe.checkout.sessions.create(sessionParams);
        } catch (error: any) {
            console.warn("Initial session creation failed:", error.code);

            // Handle valid case where Customer ID exists in DB but not in Stripe (e.g. test mode reset)
            if (error.code === 'resource_missing' && error.param === 'customer') {
                console.log("Stripe customer missing. Recreating...");

                const newCustomer = await stripe.customers.create({
                    email: userEmail,
                    metadata: { supabase_id: clientId },
                });

                // Update DB with new ID
                await supabaseAdmin
                    .from('profiles')
                    .update({ stripe_customer_id: newCustomer.id })
                    .eq('id', clientId);

                // Retry session creation with new customer
                sessionParams.customer = newCustomer.id;
                session = await stripe.checkout.sessions.create(sessionParams);
            } else {
                throw error;
            }
        }
        console.log("Session created:", session.id);

        return new Response(
            JSON.stringify({ sessionId: session.id, url: session.url }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );

    } catch (error) {
        console.error("Critical Function Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }
});
