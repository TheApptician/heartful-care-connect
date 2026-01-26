import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Award, TrendingUp } from "lucide-react";

const ParallaxSection = () => {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Enhanced Parallax Background with Overlay Pattern */}
            <div
                className="absolute inset-0 bg-fixed bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: 'url("/parallax_bg.png")' }}
            />

            {/* Multi-layer Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/80 via-[#111827]/70 to-[#1a9e8c]/60 backdrop-blur-sm" />

            {/* Animated Geometric Patterns */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-64 h-64 border-2 border-white rounded-full animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-[#1a9e8c] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.25em] mb-12 mt-12 shadow-2xl">
                    <Award className="w-4 h-4 text-[#1a9e8c]" />
                    Introductory Agency Excellence
                </div>

                <h2 className="text-5xl lg:text-8xl font-black text-white mb-10 tracking-tighter leading-none max-w-5xl mx-auto">
                    Proven vetting standards. <br />
                    <span className="text-[#1a9e8c]">Unmatched peace of mind.</span>
                </h2>

                <div className="text-lg lg:text-xl text-white/90 font-medium max-w-4xl mx-auto mb-16 leading-relaxed space-y-6 text-left lg:text-center">
                    <p>
                        Every carer using the Heems platform goes through a robust, multi-stage verification process designed to promote safety, professionalism, and trust.
                    </p>
                    <p>
                        This includes identity verification to a high digital standard, confirmation of the right to work in the UK, and a detailed review of experience, skills, and suitability for care roles. Carers are also required to provide verified professional references, which are independently checked as part of onboarding.
                    </p>
                    <p>
                        Our approach combines technology-led checks with human review to ensure that families and organisations can make informed decisions, while carers are recognised for their professionalism and commitment.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <ShieldCheck className="w-8 h-8 text-[#1a9e8c]" />
                            <p className="text-4xl font-black text-white">100%</p>
                        </div>
                        <p className="text-sm font-bold text-white/70 uppercase tracking-widest">DBS Verified</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <TrendingUp className="w-8 h-8 text-[#1a9e8c]" />
                            <p className="text-4xl font-black text-white">593+</p>
                        </div>
                        <p className="text-sm font-bold text-white/70 uppercase tracking-widest">Elite Carers</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Award className="w-8 h-8 text-[#1a9e8c]" />
                            <p className="text-4xl font-black text-white">99.2%</p>
                        </div>
                        <p className="text-sm font-bold text-white/70 uppercase tracking-widest">Satisfaction</p>
                    </div>
                </div>

                {/* CTA Button */}
                <Button size="lg" className="h-20 px-16 rounded-3xl bg-[#1a9e8c] text-white font-black text-xl hover:bg-[#15806c] shadow-2xl shadow-[#1a9e8c]/30 transition-all border-none group" asChild>
                    <Link to="/marketplace">
                        View Verified Professionals
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </Button>

                {/* Trust Indicators */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#1a9e8c]" />
                        <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#1a9e8c]" />
                        <span>Introductory Agency Standards</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ParallaxSection;
