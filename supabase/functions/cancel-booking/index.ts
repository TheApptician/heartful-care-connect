// Supabase Edge Function: Cancel Booking & Refund Logic
// Deploy to: supabase/functions/cancel-booking/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { differenceInHours } from "https://esm.sh/date-fns@2.30.0";

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

        // Get User from Auth Header (to ensure ownership)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error('No authorization header');

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
        if (authError || !user) throw new Error('Unadhorized');

        const { bookingId, reason } = await req.json();

        if (!bookingId) throw new Error("Booking ID is required");

        // 1. Fetch Booking
        const { data: booking, error: fetchError } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking) throw new Error("Booking not found");

        if (booking.client_id !== user.id) {
            throw new Error("You are not authorized to cancel this booking");
        }

        if (booking.status === 'cancelled') {
            return new Response(JSON.stringify({ message: "Booking is already cancelled" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        // 2. Check Refund Policy
        const startTime = new Date(booking.start_time);
        const now = new Date();
        const hoursUntilStart = differenceInHours(startTime, now);

        console.log(`Booking ${bookingId}: Hours until start: ${hoursUntilStart}`);

        // Logic:
        // > 48h: Full Refund (Automated)
        // < 48h: Cancellation Requested (Manual Approval by Carer)

        const isEligibleForAutoRefund = hoursUntilStart >= 48;

        if (isEligibleForAutoRefund) {
            console.log("Processing auto-refund...");

            // Refund via Stripe if paid
            if (booking.payment_status === 'paid' && booking.stripe_payment_intent_id) {
                // Determine Amount to Refund
                // Requirement: "Platform charges being non-refundable"
                // So we refund ONLY the (Total - Client Fee).
                // Or "Full Refund" usually implies Client Fee is also refunded if it was a booking fee? 
                // However, user said "Implement a refund system... Platform charges are non-refundable."

                // So refund amount = booking.total_price - booking.client_fee
                // Assuming client_fee was collected. 
                // But wait, if we refund the charge, Stripe refunds the fees? No, Stripe keeps its fees.
                // If we do a partial refund of (Total - Platform Fee), the client gets back the service cost.

                // Let's check the amounts.
                const total = booking.total_price || 0;
                const platformFee = booking.client_fee || 0;
                let refundAmount = total;

                // If platform charges are non-refundable:
                if (platformFee > 0) {
                    refundAmount = total - platformFee;
                }

                // Convert to pence
                const refundAmountPence = Math.round(refundAmount * 100);

                if (refundAmountPence > 0) {
                    await stripe.refunds.create({
                        payment_intent: booking.stripe_payment_intent_id,
                        amount: refundAmountPence,
                        metadata: {
                            reason: "user_cancellation_auto",
                            booking_id: bookingId
                        }
                    });
                }
            }

            // Update Booking Status
            await supabaseAdmin
                .from('bookings')
                .update({
                    status: 'cancelled',
                    refund_status: 'succeeded',
                    refund_amount_processed: booking.total_price - (booking.client_fee || 0), // Log what we refunded
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId);

            return new Response(JSON.stringify({
                message: "Booking cancelled and refunded successfully.",
                refunded: true,
                status: 'cancelled'
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });

        } else {
            console.log("Requesting cancellation approval...");

            // Update Booking to 'cancellation_requested'
            // If not paid, we can just cancel?
            // Usually if < 48h and NOT paid, it's just cancelled.
            // If paid, we need approval to refund.

            if (booking.payment_status !== 'paid') {
                await supabaseAdmin
                    .from('bookings')
                    .update({ status: 'cancelled' })
                    .eq('id', bookingId);

                return new Response(JSON.stringify({
                    message: "Booking cancelled.",
                    refunded: false,
                    status: 'cancelled'
                }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 200,
                });
            }

            await supabaseAdmin
                .from('bookings')
                .update({
                    status: 'cancellation_requested',
                    refund_status: 'pending_approval',
                    refund_reason: reason || 'User requested late cancellation',
                    refund_amount_proposed: booking.total_price - (booking.client_fee || 0), // Propose full service refund by default
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId);

            // Trigger Notification to Carer (TODO: Add notification logic if needed)

            return new Response(JSON.stringify({
                message: "Cancellation requested. The carer needs to approve the refund.",
                refunded: false,
                status: 'cancellation_requested'
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

    } catch (error: any) {
        console.error("Cancel Booking Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }
});
