import { Button } from "@/components/ui/button";
import { ArrowRight, Search, UserCheck, Calendar, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Define Your Needs",
    description: "Tell us about your requirements. Our system starts matching instantly based on clinical expertise and personality.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Select Your Carer",
    description: "Review elite profiles verified with our 20-point vetting process. Video interview them before you book.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Seamless Booking",
    description: "Schedule one-off visits or complex recurring care plans. Secure and fully managed within the Heems platform.",
  },
  {
    number: "04",
    icon: Heart,
    title: "Expert Care Delivery",
    description: "Receive world-class care at home. Track every visit with real-time logs and secure digital payments.",
  },
];

const carerImages = [
  { src: "/carer_female_1.png", name: "Sarah", role: "Specialist Nurse" },
  { src: "/carer_male_1.png", name: "David", role: "Senior Carer" },
  { src: "/carer_female_2.png", name: "Elizabeth", role: "Companion Care" },
  { src: "/carer_female_1.png", name: "Sophie", role: "Dementia Care" },
  { src: "/carer_male_1.png", name: "Marcus", role: "Night Support" },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 lg:py-40 bg-gradient-to-b from-slate-50 to-white border-b border-black/[0.03] relative overflow-hidden" id="how-it-works">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#1a9e8c]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#111827]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header with Circular Carer Cluster */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 lg:mb-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a9e8c]/10 border border-[#1a9e8c]/20 text-[#1a9e8c] text-xs font-black uppercase tracking-[0.25em] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              The Heems Framework
            </div>
            <h2 className="text-5xl lg:text-8xl font-black text-[#111827] leading-[0.95] tracking-tighter mb-10">
              A Better Path <br />
              <span className="text-[#1a9e8c]">to Quality Care.</span>
            </h2>
            <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-xl">
              We've combined clinical vetting with advanced matching algorithms to create the UK's most efficient care path.
            </p>
          </div>

          {/* Circular Carer Photo Cluster */}
          <div className="relative h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Center Circle - Heems Logo/Badge */}
              <div className="relative z-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#111827] to-[#1a9e8c] flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
                <img
                  src="/heems-logo.png"
                  alt="Heems"
                  className="h-16 w-auto brightness-0 invert"
                />
              </div>

              {/* Orbiting Carer Photos */}
              {carerImages.map((carer, index) => {
                const angle = (index * 360) / carerImages.length;
                const radius = 180;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={index}
                    className="absolute group animate-float"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <img
                          src={carer.src}
                          alt={carer.name}
                          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
                        />
                      </div>
                      {/* Verification Badge */}
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1a9e8c] border-2 border-white flex items-center justify-center shadow-lg">
                        <UserCheck className="w-3.5 h-3.5 text-white" />
                      </div>
                      {/* Tooltip on Hover */}
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111827] text-white px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-xl">
                        {carer.name} - {carer.role}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Connecting Lines (Decorative) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                <circle cx="50%" cy="50%" r="180" fill="none" stroke="#1a9e8c" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Steps with Modern Card Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative bg-white p-10 rounded-[2.5rem] border border-black/[0.05] hover:border-[#1a9e8c]/30 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a9e8c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-black text-slate-100 group-hover:text-[#1a9e8c]/20 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#111827] mb-4 tracking-tight group-hover:text-[#1a9e8c] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-[#4B5563] font-medium leading-relaxed">
                  {step.description}
                </p>

                {/* Progress Indicator */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block">
                    <ArrowRight className="w-6 h-6 text-[#1a9e8c]/30" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA */}
        <div className="mt-24 p-12 rounded-[3rem] bg-gradient-to-r from-[#111827] to-[#1a9e8c] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-white">
              <p className="text-2xl font-black mb-2">Ready to experience the difference?</p>
              <p className="text-white/70 font-medium">Start browsing verified carers in your area today.</p>
            </div>
            <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-[#111827] font-black text-lg hover:bg-[#1a9e8c] hover:text-white shadow-2xl transition-all" asChild>
              <Link to="/marketplace">
                Browse Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
