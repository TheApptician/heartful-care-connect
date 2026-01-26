import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const SignupSuccess = () => {
    const location = useLocation();
    const role = location.state?.role || 'client';

    const getRoleContent = () => {
        switch (role) {
            case 'carer':
                return {
                    title: "Verification Steps",
                    subtitle: "Get ready to start your journey as a Heems Carer",
                    steps: [
                        {
                            text: "Check your email and verify your address",
                            desc: "We've sent a link to your inbox. This is required to access your account."
                        },
                        {
                            text: "Complete your Professional Profile",
                            desc: "Log in and add your experience, qualifications, and specialties."
                        },
                        {
                            text: "Upload Compliance Documents",
                            desc: "Provide your DBS, Insurance, and Right to Work documents via the dashboard."
                        },
                        {
                            text: "Get Verified & Start Working",
                            desc: "Once our team reviews your documents, your profile will go live!"
                        }
                    ]
                };
            case 'organisation':
                return {
                    title: "Partner Onboarding",
                    subtitle: "Next steps to activate your Organisation Account",
                    steps: [
                        {
                            text: "Verify your Corporate Email",
                            desc: "Click the verification link sent to your email to confirm ownership."
                        },
                        {
                            text: "Complete Organisation Details",
                            desc: "Log in and provide your CQC number and registration details."
                        },
                        {
                            text: "Await Admin Approval",
                            desc: "We verify all organisations manually. You will be notified upon approval."
                        },
                        {
                            text: "Manage Staff & Shifts",
                            desc: "Once approved, you can post shifts and access the staff bank."
                        }
                    ]
                };
            default: // client
                return {
                    title: "Verify Your Email",
                    subtitle: "One final step to complete your registration",
                    steps: [
                        {
                            text: "Open the email from Heems",
                            desc: "Check your inbox (and spam folder) for our verification email."
                        },
                        {
                            text: "Click the verification link",
                            desc: "This confirms your account and secures your identity."
                        },
                        {
                            text: "Log in & Complete Profile",
                            desc: "Tell us about your care needs so we can match you with the best carers."
                        }
                    ]
                };
        }
    };

    const content = getRoleContent();

    return (
        <AuthLayout
            title={content.title}
            subtitle={content.subtitle}
        >
            <div className="space-y-6 animate-in-up text-center">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#1a9e8c]/10 flex items-center justify-center">
                        <Mail className="w-10 h-10 text-[#1a9e8c]" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-3">
                    <h2 className="text-xl font-black text-[#111827]">
                        Check Your Inbox
                    </h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                        We've sent a confirmation email to your email address. Please click the link in the email to proceed.
                    </p>
                </div>

                {/* Steps */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4 text-left">
                    {content.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#1a9e8c] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {index + 1}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#111827]">
                                    {step.text}
                                </p>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <Button
                    size="lg"
                    className="w-full h-14 rounded-xl bg-[#111827] text-white font-black text-base hover:bg-[#1a9e8c] shadow-xl shadow-black/5 transition-all"
                    asChild
                >
                    <Link to="/login">
                        Go to Login
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>

                {/* Help Text */}
                <p className="text-xs text-slate-400 font-medium">
                    Didn't receive the email?{" "}
                    <button
                        type="button"
                        className="text-[#1a9e8c] font-bold hover:underline"
                        onClick={() => window.location.reload()}
                    >
                        Resend email
                    </button>
                    <span className="block mt-1 text-slate-300">
                        (Check your spam folder just in case)
                    </span>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignupSuccess;
