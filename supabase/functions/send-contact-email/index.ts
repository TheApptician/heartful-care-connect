// Supabase Edge Function: Send Contact Form Email
// Deploy with: supabase functions deploy send-contact-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "support@heems.com";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { name, email, subject, message }: ContactFormData = await req.json();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            throw new Error("All fields are required");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        // If RESEND_API_KEY is configured, send via Resend
        if (RESEND_API_KEY) {
            const emailResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Heems Contact Form <noreply@heems.com>",
                    to: [ADMIN_EMAIL],
                    reply_to: email,
                    subject: `[Heems Contact] ${subject}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: #111827; padding: 24px; text-align: center;">
                                <h1 style="color: #1a9e8c; margin: 0;">New Contact Form Submission</h1>
                            </div>
                            <div style="padding: 24px; background: #f9fafb;">
                                <p style="margin: 0 0 16px;"><strong>From:</strong> ${name}</p>
                                <p style="margin: 0 0 16px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                                <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${subject}</p>
                                <div style="margin-top: 24px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
                                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                                </div>
                            </div>
                            <div style="padding: 16px; text-align: center; color: #6b7280; font-size: 12px;">
                                <p>This email was sent from the Heems contact form.</p>
                            </div>
                        </div>
                    `,
                }),
            });

            if (!emailResponse.ok) {
                const errorData = await emailResponse.json();
                console.error("Resend API error:", errorData);
                throw new Error("Failed to send email");
            }

            // Also send confirmation to the user
            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Heems <noreply@heems.com>",
                    to: [email],
                    subject: "We've received your message - Heems",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: #111827; padding: 24px; text-align: center;">
                                <h1 style="color: #1a9e8c; margin: 0;">Thank You, ${name}!</h1>
                            </div>
                            <div style="padding: 24px;">
                                <p>We've received your message and will get back to you within 24 hours.</p>
                                <p><strong>Your message:</strong></p>
                                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin: 16px 0;">
                                    <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
                                    <p style="margin: 8px 0 0; white-space: pre-wrap;">${message}</p>
                                </div>
                                <p>If you need immediate assistance, you can call us at <strong>07472414103</strong> (Mon-Fri, 9am-5pm).</p>
                                <p style="margin-top: 24px;">Best regards,<br><strong>The Heems Team</strong></p>
                            </div>
                        </div>
                    `,
                }),
            });
        }

        // Store in database for record keeping
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (supabaseUrl && supabaseKey) {
            await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": supabaseKey,
                    "Authorization": `Bearer ${supabaseKey}`,
                    "Prefer": "return=minimal",
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message,
                    status: "sent",
                }),
            });
        }

        return new Response(
            JSON.stringify({ success: true, message: "Email sent successfully" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error sending contact email:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
