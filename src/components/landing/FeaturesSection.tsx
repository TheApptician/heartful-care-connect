import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  ShieldCheck,
  Clock,
  MapPin,
  CreditCard,
  MessageSquare,
  Calendar,
  FileCheck,
  Activity,
  UserCheck,
  Sparkles,
  Zap,
  Heart
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Smart Matching",
    description: "Our neural matching engine predicts the best carer-client compatibility based on personality, skills, and specialized needs.",
  },
  {
    icon: ShieldCheck,
    title: "Vetting 2.0",
    description: "Continuous monitoring of DBS status, right-to-work, and real-time reference validation for total peace of mind.",
  },
  {
    icon: Activity,
    title: "Health Insights",
    description: "Monitor vitals and care outcomes with real-time health data visualization for families and healthcare professionals.",
  },
  {
    icon: MapPin,
    title: "Geo-Safe Arrival",
    description: "Precision location services ensure carers are on-site and active, providing transparent accountability.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-white border-b border-black/[0.03] relative overflow-hidden" id="features">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a9e8c]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#111827]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Enhanced Section Header with Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Left - Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1a9e8c]/10 to-[#111827]/10 border border-[#1a9e8c]/20 text-[#111827] text-xs font-black uppercase tracking-[0.25em] mb-8">
              <Zap className="w-3.5 h-3.5 text-[#1a9e8c]" />
              High-Performance Infrastructure
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-[#111827] leading-[0.95] tracking-tighter mb-8">
              Care Engineered <br />
              <span className="bg-gradient-to-r from-[#1a9e8c] to-[#111827] bg-clip-text text-transparent">for Total Trust.</span>
            </h2>
            <p className="text-lg text-[#4B5563] font-medium leading-relaxed max-w-xl">
              Beyond a marketplace, Heems is a sophisticated ecosystem designed for safety, operational transparency, and high-value care outcomes.
            </p>
          </div>

          {/* Right - Care Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/carer_client_home.png"
                alt="Professional carer providing compassionate care"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a9e8c]/20 to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1a9e8c] rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#111827]">2,000+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Carers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Features Grid with Single Color Icons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white p-8 rounded-3xl border border-black/[0.05] hover:border-[#1a9e8c]/30 hover:shadow-2xl transition-all duration-700 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a9e8c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Single Color Icon Container */}
              <div className="relative mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#1a9e8c]/10 flex items-center justify-center group-hover:bg-[#1a9e8c] transition-all duration-700">
                  <feature.icon className="w-7 h-7 text-[#1a9e8c] group-hover:text-white transition-colors duration-700" />
                </div>
              </div>

              <h3 className="text-xl font-black text-[#111827] mb-3 tracking-tight group-hover:text-[#1a9e8c] transition-colors duration-500">
                {feature.title}
              </h3>
              <p className="text-[#4B5563] font-medium leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-black/[0.03] hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1a9e8c]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#1a9e8c]" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#111827]">9am - 5pm</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lines Open</p>
              </div>
            </div>
            <p className="text-sm text-[#4B5563] font-medium">Dedicated support team available during business hours.</p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-black/[0.03] hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1a9e8c]/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#1a9e8c]" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#111827]">Instant</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Messaging</p>
              </div>
            </div>
            <p className="text-sm text-[#4B5563] font-medium">Secure, HIPAA-compliant communication platform.</p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-black/[0.03] hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1a9e8c]/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#1a9e8c]" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#111827]">Safe</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payments</p>
              </div>
            </div>
            <p className="text-sm text-[#4B5563] font-medium">Bank-grade encryption for all transactions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
