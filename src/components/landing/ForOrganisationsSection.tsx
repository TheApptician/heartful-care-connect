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
    <section className="py-20 lg:py-32 bg-gradient-hero text-primary-foreground" id="for-organisations">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
            <Building2 className="w-3 h-3 mr-1" />
            For Organisations
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Workforce Solutions for{" "}
            <span className="text-secondary">Modern Care</span>
          </h2>
          
          <p className="text-lg text-primary-foreground/80">
            Whether you're an NHS trust, local council, care agency, or care home — Heems provides 
            the platform, talent, and compliance tools you need to deliver exceptional care.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {orgBenefits.map((benefit, index) => (
            <Card 
              key={benefit.title}
              variant="glass"
              className="bg-primary-foreground/5 border-primary-foreground/10 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-primary-foreground/70">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/org-signup">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/demo">
                Book a Demo
              </Link>
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/60 mt-4">
            14-day free trial • No credit card required • Setup in minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForOrganisationsSection;
