// Supabase Edge Function: Carer Approve Refund
// Deploy to: supabase/functions/approve-refund/index.ts

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

        // Get User from Auth Header (carer)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error('No authorization header');

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
        if (authError || !user) throw new Error('Unauthorized');

        const { bookingId, action, amount } = await req.json();
        // action: 'approve' | 'decline'

        if (!bookingId || !action) throw new Error("Booking ID and action are required");

        // 1. Fetch Booking
        const { data: booking, error: fetchError } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking) throw new Error("Booking not found");

        if (booking.carer_id !== user.id) {
            throw new Error("You are not authorized to manage this refund");
        }

        if (booking.status !== 'cancellation_requested') {
            throw new Error(`Booking status is ${booking.status}, cannot approve refund.`);
        }

        if (action === 'approve') {
            console.log(`Carer ${user.id} approved refund for ${bookingId}`);

            // Refund Logic
            // Calculate Amount (Non-refundable platform fee rule)
            // Refund = Total - Client Fee
            const total = booking.total_price || 0;
            const clientFee = booking.client_fee || 0;

            // If partial refund proposed/agreed
            // For now, defaulting to Full Refund of Service Cost
            let refundAmount = total - clientFee;
            if (refundAmount < 0) refundAmount = 0;

            const refundAmountPence = Math.round(refundAmount * 100);

            if (booking.payment_status === 'paid' && booking.stripe_payment_intent_id && refundAmountPence > 0) {
                await stripe.refunds.create({
                    payment_intent: booking.stripe_payment_intent_id,
                    amount: refundAmountPence,
                    metadata: {
                        reason: "carer_approved_cancellation",
                        booking_id: bookingId
                    }
                });
            }

            // Update Booking
            await supabaseAdmin
                .from('bookings')
                .update({
                    status: 'cancelled',
                    refund_status: 'succeeded',
                    refund_amount_processed: refundAmount,
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId);

            return new Response(JSON.stringify({
                message: "Refund approved and processed.",
                status: 'cancelled'
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });

        } else if (action === 'decline') {
            console.log(`Carer ${user.id} declined refund for ${bookingId}`);

            // Update Booking to 'confirmed' (Revert cancellation request)
            // Or 'disputed'? Usually reverts to 'confirmed' if request denied, 
            // but maybe with a flag? or stay 'confirmed' and notify client?
            // "Carers can ... decline refund requests."
            // If declined, booking arguably stands? Or is it cancelled but NO refund?
            // If 48h passed, late cancellation usually means "Cancelled, Charge Applies".
            // So status should be 'cancelled', payment kept.

            await supabaseAdmin
                .from('bookings')
                .update({
                    status: 'cancelled', // Booking is still cancelled, but no refund
                    refund_status: 'declined',
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId);

            return new Response(JSON.stringify({
                message: "Refund declined. Booking cancelled without refund.",
                status: 'cancelled'
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        throw new Error("Invalid action");

    } catch (error: any) {
        console.error("Approve Refund Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }
});
