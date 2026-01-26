import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Shield, Lock, Server, Fingerprint, Eye, CheckCircle2, FileCheck, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Security = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl">
                            <Badge className="mb-6 bg-[#1a9e8c]/10 text-[#1a9e8c] border-[#1a9e8c]/20 py-1 px-4 text-xs font-black uppercase tracking-widest">Trust & Reliability</Badge>
                            <h1 className="text-6xl font-black text-[#111827] mb-8 leading-tight">Bank-grade security for <span className="text-[#1a9e8c]">trusted care</span>.</h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                                We protect your most sensitive data with the same intensity we use to vet our carers. Heems is built on a foundation of high-trust infrastructure.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: Lock,
                                    title: "End-to-End Encryption",
                                    desc: "All sensitive health data and communications are encrypted at rest and in transit using AES-256 and TLS 1.3 standards."
                                },
                                {
                                    icon: Server,
                                    title: "Sovereign Cloud Infrastructure",
                                    desc: "Your data stays where it belongs. We use localized, high-security data centers with 99.99% uptime guarantees."
                                },
                                {
                                    icon: Fingerprint,
                                    title: "Secure Account Protection",
                                    desc: "Multi-factor authentication (MFA) and biometric verification ensure that only authorized individuals can access account data."
                                }
                            ].map((pillar, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-black/5 shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all">
                                    <div className="h-16 w-16 rounded-2xl bg-[#1a9e8c] flex items-center justify-center mb-8">
                                        <pillar.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-4">{pillar.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vetting Infrastructure */}
                <section className="py-32 bg-[#111827] text-white overflow-hidden relative">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <h2 className="text-4xl font-black mb-8 leading-tight">Our Vetting Infrastructure</h2>
                                <p className="text-white/60 text-lg font-medium mb-12">We've automated the most rigorous verification standards in the industry to ensure that every participant in the Heems ecosystem is verified and compliant.</p>

                                <div className="space-y-8">
                                    {[
                                        { icon: FileCheck, title: "DBS & Criminal Record Checks", info: "Automated integrations with government databases for real-time verification." },
                                        { icon: Eye, title: "Identity Forgery Detection", info: "AI-driven analysis of government IDs to prevent impersonation and fraud." },
                                        { icon: Globe, title: "Right to Work Verification", info: "Comprehensive checks ensuring all professional carers are legally eligible to work." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6">
                                            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <item.icon className="h-6 w-6 text-[#1a9e8c]" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                                <p className="text-white/40 text-sm font-medium">{item.info}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/5] bg-white/5 rounded-[3rem] border border-white/10 flex flex-col p-8 overflow-hidden">
                                    <div className="flex items-center justify-between mb-8">
                                        <Badge className="bg-[#1a9e8c] text-white border-none py-1 px-3">VERIFIED</Badge>
                                        <Shield className="h-8 w-8 text-[#1a9e8c]/20" />
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                                                <div className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                                                <div className="h-2 w-1/3 bg-white/10 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-8 border-t border-white/10">
                                        <p className="text-xs font-black uppercase tracking-widest text-[#1a9e8c]">Compliance Engine v4.0</p>
                                    </div>
                                </div>
                                {/* Floating Badge */}
                                <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-3xl text-[#111827] flex items-center gap-4">
                                    <CheckCircle2 className="h-10 w-10 text-[#1a9e8c]" />
                                    <div>
                                        <p className="text-2xl font-black">AES-256</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank-Grade Security</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reporting */}
                <section className="py-32">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-4xl font-black text-[#111827] mb-8">Report a Security Issue</h2>
                            <p className="text-lg text-slate-600 font-medium mb-10">We take security reports from the community seriously. If you've identified a vulnerability, please reach out directly to our security team.</p>
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-[#111827] text-white font-black text-lg hover:bg-[#1a9e8c] transition-all shadow-xl" asChild>
                                <Link to="/contact">Contact Security Team</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Security;
