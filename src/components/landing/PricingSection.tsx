import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Building2, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small care agencies getting started",
    price: "58.99",
    period: "month",
    icon: Users,
    features: [
      "Up to 10 staff profiles",
      "Basic compliance tracking",
      "Job posting (5/month)",
      "Client management",
      "Standard support",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing agencies with advanced needs",
    price: "108",
    period: "month",
    icon: Building2,
    features: [
      "Up to 50 staff profiles",
      "Full compliance vault",
      "Unlimited job posting",
      "Advanced scheduling",
      "Priority support",
      "Custom reporting",
      "API access",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For NHS trusts, councils & large organisations",
    price: "307",
    period: "month",
    icon: Sparkles,
    features: [
      "Unlimited staff profiles",
      "Complete compliance suite",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Advanced analytics & BI",
      "White-label options",
      "On-site training",
      "24/7 premium support",
    ],
    cta: "Contact Sales",
    variant: "accent" as const,
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 lg:py-40 bg-white" id="pricing">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-4xl mb-24 lg:mb-32">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c]" />
            <span className="text-xs font-black text-[#111827] uppercase tracking-[0.25em]">
              B2B Infrastructure
            </span>
          </div>
          <h2 className="text-5xl lg:text-8xl font-black text-[#111827] leading-[0.95] tracking-tighter mb-10">
            Enterprise Plans <br />
            <span className="text-[#1a9e8c]">for Organisations.</span>
          </h2>
          <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-xl">
            Scalable workforce management and compliance for modern care providers. All plans include a 14-day premium trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`flex flex-col p-10 rounded-[3rem] border transition-all duration-500 ${plan.popular
                ? "bg-[#111827] border-[#111827] shadow-2xl shadow-black/20"
                : "bg-white border-black/[0.05] hover:border-[#1a9e8c]/30"
                }`}
            >
              <div className="mb-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${plan.popular ? "bg-white/10" : "bg-[#1a9e8c]/10"}`}>
                  <plan.icon className={`w-5 h-5 ${plan.popular ? "text-white" : "text-[#1a9e8c]"}`} />
                </div>
                <h3 className={`text-2xl font-black mb-4 ${plan.popular ? "text-white" : "text-[#111827]"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-5xl font-black ${plan.popular ? "text-[#1a9e8c]" : "text-[#111827]"}`}>
                    £{plan.price}
                  </span>
                  <span className={`font-bold ${plan.popular ? "text-white/30" : "text-slate-400"}`}>/m</span>
                </div>
                <p className={`text-sm font-medium leading-relaxed ${plan.popular ? "text-white/40" : "text-[#4B5563]"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-white/10" : "bg-[#1a9e8c]/10"}`}>
                      <Check className={`h-3 w-3 ${plan.popular ? "text-white" : "text-[#1a9e8c]"}`} />
                    </div>
                    <span className={`text-sm font-medium ${plan.popular ? "text-white/80" : "text-[#111827]"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`h-16 px-8 rounded-2xl font-black text-lg transition-all ${plan.popular
                  ? "bg-[#1a9e8c] text-white hover:bg-[#15806c] shadow-xl shadow-[#1a9e8c]/20"
                  : "bg-[#111827] text-white hover:bg-[#1a9e8c]"
                  }`}
                asChild
              >
                <Link to="/signup">
                  {plan.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-16 pt-10 border-t border-black/[0.03] text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            All prices exclude VAT • HIPAA & GDPR Compliant • Enterprise Grade Security
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
