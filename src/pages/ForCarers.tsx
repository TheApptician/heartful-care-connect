import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Shield, Zap, Heart, PoundSterling, Laptop, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const ForCarers = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 lg:pt-32">
                {/* Modern Hero Section */}
                <section className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 text-[#1a9e8c] text-xs font-bold uppercase tracking-widest mb-8">
                                <Shield className="w-3 h-3" />
                                Empowering Independence
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-[#111827] mb-8 tracking-tighter leading-[0.95]">
                                Higher Pay. <br />
                                <span className="text-[#1a9e8c]">Total Control.</span>
                            </h1>
                            <p className="text-xl text-[#4B5563] font-medium leading-relaxed mb-10">
                                Join the UK's elite network of independent carers. Build your own brand, set your own rates, and access high-value families directly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="h-14 px-10 rounded-2xl bg-[#111827] text-white font-bold text-base hover:bg-[#1a9e8c] shadow-lg shadow-[#111827]/10 transition-all" asChild>
                                    <Link to="/signup/carer">Apply as a Carer</Link>
                                </Button>
                                <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold border-black/5 hover:bg-slate-50 transition-all text-base" asChild>
                                    <Link to="/login">Sign In</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-black/[0.03]">
                                <img
                                    src="/professional_carers_team.png"
                                    alt="Professional Heems Carers"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Stat Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-black/5 w-64 animate-float">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <PoundSterling className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div className="text-2xl font-black text-[#111827]">£28.50</div>
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Hourly Rate</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="bg-slate-50 py-24 lg:py-40 border-y border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-32">
                            <h2 className="text-3xl lg:text-5xl font-black text-[#111827] mb-6">Designed for Professionals.</h2>
                            <p className="text-[#4B5563] font-medium">We've removed the middleman. You keep what you earn and manage your career like a business leader.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Premium Earnings", icon: PoundSterling, desc: "Set your own rates and keep 100% of your listed price." },
                                { title: "Smart Scheduling", icon: Laptop, desc: "Our intelligent app manages your diary and recurring visits." },
                                { title: "Instant Payments", icon: Zap, desc: "Get paid automatically after every visit. No chasing invoices." },
                                { title: "Top-Tier Support", icon: Heart, desc: "Access guidance and career coaching (Lines Open 9-5)." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-10 rounded-3xl border border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-xl transition-all duration-500">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-black/[0.03]">
                                        <item.icon className="w-6 h-6 text-[#1a9e8c]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#111827] mb-4">{item.title}</h3>
                                    <p className="text-sm text-[#4B5563] font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Requirements */}
                <section className="container mx-auto px-6 lg:px-12 py-24 lg:py-40">
                    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-3xl lg:text-5xl font-black text-[#111827] mb-8">Ready to transition?</h2>
                            <div className="space-y-6 mb-10">
                                {[
                                    "Minimum 6 months care experience",
                                    "Right-to-work in the United Kingdom",
                                    "Enhanced DBS (or willing to obtain)",
                                    "Two professional care references",
                                    "Professional Liability Insurance",
                                    "Commitment to excellence"
                                ].map((req, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-[#1a9e8c]" />
                                        <span className="text-lg font-bold text-[#111827]">{req}</span>
                                    </div>
                                ))}
                            </div>
                            <Button className="h-16 px-12 rounded-2xl bg-[#1a9e8c] text-white font-black hover:bg-[#15806c] shadow-xl shadow-[#1a9e8c]/20 transition-all text-lg" asChild>
                                <Link to="/signup/carer">Start Your Application</Link>
                            </Button>
                        </div>
                        <div className="flex-1 bg-slate-50 p-10 rounded-[3rem] border border-black/5">
                            <div className="flex items-center gap-4 mb-8">
                                <Globe className="w-10 h-10 text-[#1a9e8c]" />
                                <h3 className="text-2xl font-black text-[#111827]">Heems Academy</h3>
                            </div>
                            <p className="text-[#4B5563] font-medium mb-8">
                                All Heems carers get exclusive access to continuous professional development (CPD) accredited training modules through our digital academy.
                            </p>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#1a9e8c] w-3/4" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Progress Tracking</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ForCarers;
