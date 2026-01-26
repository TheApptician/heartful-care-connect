import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, FileCheck, Users, BarChart3, Zap, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const orgBenefits = [
  {
    icon: Users,
    title: "Verified Talent Pool",
    description: "Access thousands of pre-verified carers with full DBS, qualifications, and references on file."
  },
  {
    icon: FileCheck,
    title: "Compliance Vault",
    description: "Automated compliance tracking ensures all documentation stays current and audit-ready."
  },
  {
    icon: Zap,
    title: "Rapid Staffing",
    description: "Fill shifts in minutes, not days. Our AI matching finds the right carer instantly."
  },
  {
    icon: BarChart3,
    title: "Complete Visibility",
    description: "Real-time dashboards, custom reports, and full audit trails for your organisation."
  },
  {
    icon: Lock,
    title: "GDPR Compliant",
    description: "Enterprise-grade security with full GDPR compliance and ICO registration."
  },
];

const ForOrganisationsSection = () => {
  return (
    <section className="py-16 lg:pt-20 lg:pb-32 bg-slate-50 border-y border-black/[0.03]" id="for-organisations">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-24 lg:mb-32 text-center">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c]" />
            <span className="text-xs font-black text-[#111827] uppercase tracking-[0.25em]">
              Enterprise Care Infrastructure
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-[#111827] leading-[0.95] tracking-tighter mb-10">
            Workforce Solutions <br />
            <span className="text-[#1a9e8c]">for Modern Care.</span>
          </h2>
          <p className="text-lg text-[#4B5563] font-medium leading-relaxed max-w-2xl mx-auto">
            Whether you're a local authority, private agency, or care home — Heems provides the vetting, talent pool, and compliance tools you need.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {orgBenefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group bg-white p-10 rounded-[2.5rem] border border-black/[0.05] hover:border-[#1a9e8c]/30 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-black/5 flex items-center justify-center mb-8 group-hover:bg-[#1a9e8c] transition-colors duration-500">
                <benefit.icon className="w-5 h-5 text-[#1a9e8c] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-[#111827] mb-4 tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-sm text-[#4B5563] font-medium leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Button size="lg" className="h-16 px-12 rounded-2xl bg-[#111827] text-white font-black text-lg hover:bg-[#1a9e8c] shadow-2xl shadow-black/10 transition-all" asChild>
            <Link to="/signup/organisation">
              Partner with Heems
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl font-black text-lg text-[#111827] border-black/10 hover:bg-slate-50 transition-all" asChild>
            <Link to="/solutions">
              View Solutions
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ForOrganisationsSection;
