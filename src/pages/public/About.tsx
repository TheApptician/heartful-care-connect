import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Target, Rocket, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatWidget } from "@/components/shared/ChatWidget";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-6xl font-black text-[#111827] mb-8 leading-tight">We're on a mission to <span className="text-[#1a9e8c]">fix private care</span>.</h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed">
                                Heems was founded with a single goal: to provide families with the infrastructure they need to find, manage, and pay for high-quality private care safely.
                            </p>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-[#1a9e8c]/5 rounded-full blur-[100px]" />
                </section>

                {/* Vision Section */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <h2 className="text-4xl font-black text-[#111827] mb-8 leading-tight">The problem we're solving</h2>
                                <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                                    <p>The traditional care industry is fragmented, slow, and often lacks the necessary oversight to ensure safety and quality. Families are left to navigate complex regulations and vetting processes on their own.</p>
                                    <p>Heems provides digital tools that help families, carers, and organisations connect, communicate, and organise care arrangements more efficiently —so everyone can focus on what matters most.</p>
                                    <p>Through secure onboarding, transparent profiles, and intelligent matching features, the platform helps users make informed decisions while remaining in control of their own care relationships.</p>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <Button className="h-14 px-8 bg-[#111827] hover:bg-[#1a9e8c] text-white rounded-xl font-black" asChild>
                                        <Link to="/marketplace">Browse Our Care Ecosystem</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden">
                                    <img
                                        src="/about-care.png"
                                        alt="Professional carer with elderly client"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Stats Overlay */}
                                <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl shadow-black/5 border border-black/5">
                                    <p className="text-4xl font-black text-[#111827] mb-1">100%</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Vetted Professionals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-32 bg-[#111827] text-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-black mb-6">Our Core Values</h2>
                            <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto">These principles guide every decision we make and every feature we build.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: Shield,
                                    title: "High-Standard Vetting",
                                    desc: "Security isn't a feature; it's our foundation. Every carer undergoes rigorous identity, background, and professional checks."
                                },
                                {
                                    icon: Target,
                                    title: "Hyper-Precision Matching",
                                    desc: "We use data-driven insights to match families with carers who aren't just qualified, but are the right fit for their specific needs."
                                },
                                {
                                    icon: Users,
                                    title: "Empowering Organisations",
                                    desc: "We provide the infrastructure for care agencies to scale safely and efficiently, raising the standard for the entire industry."
                                }
                            ].map((value, i) => (
                                <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="h-14 w-14 rounded-2xl bg-[#1a9e8c] flex items-center justify-center mb-8">
                                        <value.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">{value.title}</h3>
                                    <p className="text-white/60 font-medium leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team/Impact Section */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                                    <img
                                        src="/about-team.png"
                                        alt="Heems team collaborating"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <h2 className="text-4xl font-black text-[#111827] mb-8 leading-tight">Built by technology experts, guided by care experts</h2>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                                    Our team brings together veterans from the healthtech, fintech, and care sectors. We combined high-trust infrastructure principles with deep empathy to create Heems.
                                </p>

                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default About;
