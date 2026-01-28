// Supabase Edge Function: Process Delayed Payouts
// Deploy to: supabase/functions/process-payouts/index.ts
// Schedule: Every hour (cron)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
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
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase environment variables are missing");
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        console.log("Starting payout processing...");

        // 1. Fetch eligible bookings for payout
        // Criteria:
        // - Status is confirmed/completed
        // - Payment is paid
        // - Payout status is pending
        // - Payout due date is in the past
        // - Need stripe_payment_intent_id to reference source transaction for metadata (optional)

        const now = new Date().toISOString();
        const { data: bookings, error: fetchError } = await supabaseAdmin
            .from('bookings')
            .select(`
                id,
                carer_id,
                total_price,
                client_fee,
                carer_fee,
                stripe_payment_intent_id,
                rate_per_hour,
                start_time,
                end_time
            `)
            .eq('payout_status', 'pending')
            .eq('payment_status', 'paid')
            .lte('payout_due_at', now) // Only if due date passed
            .limit(50); // Process in batches

        if (fetchError) {
            throw new Error(`Error fetching bookings: ${fetchError.message}`);
        }

        console.log(`Found ${bookings?.length || 0} bookings eligible for payout.`);

        if (!bookings || bookings.length === 0) {
            return new Response(JSON.stringify({ message: "No payouts to process" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        const stats = { success: 0, failed: 0 };

        // 2. Process each payout
        for (const booking of bookings) {
            try {
                console.log(`Processing booking ${booking.id}...`);

                // Fetch Carer Details (Stripe Account)
                const { data: carerDetails, error: carerError } = await supabaseAdmin
                    .from('carer_details')
                    .select('stripe_account_id')
                    .eq('id', booking.carer_id)
                    .single();

                if (carerError || !carerDetails) {
                    console.error(`Could not find carer details for ${booking.carer_id}`);
                    continue; // Skip if carer not found
                }

                const destinationAccount = carerDetails.stripe_account_id;

                if (!destinationAccount) {
                    throw new Error(`Carer ${booking.carer_id} has no connected Stripe account.`);
                }

                // Calculate Payout Amount
                // carer_earnings = total_price - client_fee - carer_fee
                // All values assumed to be stored in DB correctly.
                // Note: The payment was collected in 'pence' (or lowest unit) if DB stores floats, we must convert.
                // Assuming DB stores standard currency (e.g. 150.00)

                const total = booking.total_price || 0;
                const cFee = booking.client_fee || 0;
                const crFee = booking.carer_fee || 0;

                // Carer Earnings in standard unit (GBP)
                const earnings = total - cFee - crFee;

                // Convert to pence for Stripe
                const amountInPence = Math.round(earnings * 100);

                if (amountInPence <= 0) {
                    console.log(`Booking ${booking.id}: Earnings <= 0, marking as paid (nothing to transfer).`);
                    await supabaseAdmin
                        .from('bookings')
                        .update({
                            payout_status: 'paid',
                            payout_processed_at: new Date().toISOString()
                        })
                        .eq('id', booking.id);
                    continue;
                }

                // Create Transfer
                // Using Separate Charges and Transfers
                // Source transaction allows linking the transfer to the original charge (helps heavily with fees & disputes)
                // But requires the charge to be on the platform account (which it is)
                // And sufficient funds (which should be there).

                const transferParams: any = {
                    amount: amountInPence,
                    currency: "gbp",
                    destination: destinationAccount,
                    metadata: {
                        booking_id: booking.id,
                        type: "care_payout"
                    }
                };

                // Ensure idempotency using transfer_group logic if needed, or unique transfer_group
                transferParams.transfer_group = booking.id;

                // If we want to link it precisely to source charge:
                if (booking.stripe_payment_intent_id) {
                    // Get latest charge ID from PI is complex without API call, 
                    // but simply referencing source_transaction is optimal if available.
                    // Often PI ID corresponds to the PI object, not Charge.
                    // The Transfer API `source_transaction` expects a Charge ID (ch_...)
                    // We can fetch the PI to get the latest_charge
                    const pi = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);
                    if (pi.latest_charge) {
                        transferParams.source_transaction = pi.latest_charge;
                    }
                }

                console.log(`Transferring ${amountInPence} pence to ${destinationAccount}`);
                const transfer = await stripe.transfers.create(transferParams);

                // Update Booking
                const { error: updateError } = await supabaseAdmin
                    .from('bookings')
                    .update({
                        payout_status: 'paid',
                        payout_processed_at: new Date().toISOString(),
                        stripe_transfer_id: transfer.id
                    })
                    .eq('id', booking.id);

                if (updateError) throw updateError;

                stats.success++;

            } catch (err: any) {
                console.error(`Failed to process booking ${booking.id}:`, err);
                stats.failed++;

                // Log failure to DB (optional: add error_log column or just leave pending)
                // Could update metadata or status to 'failed' if we want manual intervention
            }
        }

        return new Response(JSON.stringify({
            message: "Payout processing complete",
            processed: bookings.length,
            stats
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Critical Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
    }
});
