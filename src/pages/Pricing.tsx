import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ShieldCheck, Zap, Heart } from "lucide-react";

const Pricing = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main className="pt-32 lg:pt-48 pb-24 lg:pb-40">
                <div className="container mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="max-w-4xl mb-24 lg:mb-32">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 text-[#1a9e8c] text-[10px] font-black uppercase tracking-widest mb-8">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Phase 1: Founder Pricing Active
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-black text-[#111827] leading-[0.9] tracking-tighter mb-10">
                            Introductory Agency. <br />
                            <span className="text-[#1a9e8c]">Pure Transparency.</span>
                        </h1>
                        <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-xl">
                            Heems replaces expensive agency fees with a simple, transactional service fee.
                            No subscriptions. No paywalls to search. Pay only for care delivered.
                        </p>
                    </div>

                    {/* Explainer Section */}
                    <div className="border-t border-black/[0.05] pt-16">
                        <div className="grid lg:grid-cols-2 gap-20">
                            <div>
                                <h2 className="text-4xl font-black text-[#111827] mb-8 tracking-tight">The Transactional Model</h2>
                                <p className="text-[#4B5563] font-medium leading-relaxed mb-8">
                                    Unlike traditional care agencies that charge up to 50% on top of a carer's rate,
                                    Heems operates a high-efficiency introductory model. We charge a flat service fee
                                    to maintain the verification infrastructure, secure messaging, and payment processing.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <Zap className="w-6 h-6 text-[#1a9e8c]" />
                                        <p className="text-sm font-bold text-[#111827]">Phase 2 triggers at 30+ verified carers.</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <Heart className="w-6 h-6 text-[#1a9e8c]" />
                                        <p className="text-sm font-bold text-[#111827]">95% Caregiver retention rate.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-[3rem] p-12 border border-black/[0.03]">
                                <h3 className="text-2xl font-black text-[#111827] mb-6 tracking-tight">Fee Breakdown</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-black/[0.05]">
                                        <span className="text-sm font-bold text-[#111827]">Service Fee (Client Side)</span>
                                        <span className="text-2xl font-black text-[#1a9e8c]">10%</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-black/[0.05]">
                                        <span className="text-sm font-bold text-[#111827]">Support Fee (Carer Side)</span>
                                        <span className="text-2xl font-black text-slate-300">0%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[#111827]">Minimum Hourly Rate</span>
                                        <span className="text-2xl font-black text-[#111827]">£15.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Pricing;
