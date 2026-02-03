import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 lg:py-40 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a9e8c]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#111827]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="relative rounded-[4rem] overflow-hidden bg-gradient-to-br from-[#111827] via-[#1a2332] to-[#111827] px-8 py-20 lg:px-20 lg:py-32 border border-white/5">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #1a9e8c 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 border border-[#1a9e8c]/20 rounded-full animate-pulse" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-[#1a9e8c]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a9e8c]/10 border border-[#1a9e8c]/20 text-[#1a9e8c] text-xs font-black uppercase tracking-[0.25em] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Join the Elite Care Network
            </div>

            <h2 className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
              Transform your <br />
              <span className="bg-gradient-to-r from-[#1a9e8c] to-[#15806c] bg-clip-text text-transparent">care experience.</span>
            </h2>

            <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Join thousands of families, independent professionals, and healthcare organisations who trust Heems for quality-verified care across the UK.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="w-4 h-4 text-[#1a9e8c]" />
                <span>No commitment</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="w-4 h-4 text-[#1a9e8c]" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="w-4 h-4 text-[#1a9e8c]" />
                <span>Fully Verified</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-gradient-to-r from-[#1a9e8c] to-[#15806c] text-white font-black text-lg hover:shadow-2xl hover:shadow-[#1a9e8c]/30 transition-all group" asChild>
                <Link to="/signup">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl font-black text-lg text-white border-2 border-white/20 hover:bg-white/10 transition-all" asChild>
                <Link to="/marketplace">
                  Find Carers
                </Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10">
              <div>
                <p className="text-3xl font-black text-white mb-1">90,000 hrs</p>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Care delivered</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white mb-1">2000+</p>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Carers</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white mb-1">99.2%</p>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
