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
    <section className="py-20 lg:py-32 bg-background" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            B2B Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Plans for{" "}
            <span className="text-gradient">Every Organisation</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a small agency or a large NHS trust, we have a plan that scales with your needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              variant={plan.popular ? "elevated" : "default"}
              className={`relative animate-fade-in-up ${plan.popular ? "border-primary border-2 scale-105" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <Badge variant="premium" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="pb-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">£{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.variant}
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <Link to="/org-signup">
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          All prices exclude VAT. Custom enterprise solutions available.{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          for volume discounts.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
