const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    email: string;
    name: string;
}

const handler = async (req: Request): Promise<Response> => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { email, name }: EmailRequest = await req.json();

        if (!email) {
            throw new Error("Email is required");
        }

        if (!RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not set");
            return new Response(
                JSON.stringify({ error: "Server configuration error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Heems <onboarding@resend.dev>",
                to: [email],
                subject: "Your Heems Account has been Approved",
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #111827;">Welcome to Heems, ${name || 'User'}!</h1>
            <p style="font-size: 16px; color: #4b5563;">
              We are pleased to inform you that your account has been verified and approved by our administration team.
            </p>
            <p style="font-size: 16px; color: #4b5563;">
              You now have full access to the platform.
            </p>
            <div style="margin-top: 32px; margin-bottom: 32px;">
              <a href="https://heartful-care-connect.vercel.app/login" 
                 style="background-color: #1a9e8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Login to Dashboard
              </a>
            </div>
            <p style="font-size: 14px; color: #9ca3af;">
              If the button doesn't work, copy and paste this link into your browser: https://heartful-care-connect.vercel.app/login
            </p>
          </div>
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Resend API specific error:", data);
            throw new Error(JSON.stringify(data));
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    } catch (error: any) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            }
        );
    }
};

Deno.serve(handler);
