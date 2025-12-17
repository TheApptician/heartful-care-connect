import { Button } from "@/components/ui/button";
import { ArrowRight, Search, UserCheck, Calendar, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Tell Us Your Needs",
    description: "Share your care requirements, preferences, and schedule. Our smart system starts finding matches immediately.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Review Matched Carers",
    description: "Browse profiles of verified carers matched to your needs. Check reviews, qualifications, and availability.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Book & Schedule",
    description: "Select your preferred carer and book visits instantly. Set up one-off or recurring appointments.",
  },
  {
    number: "04",
    icon: Heart,
    title: "Receive Quality Care",
    description: "Your carer arrives on time. Track visits, communicate through the app, and pay securely after each session.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Quality Care in{" "}
            <span className="text-gradient">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting started with Heems is quick and easy. Our streamlined process ensures you find the right care without the hassle.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step card */}
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-lg transition-shadow duration-300">
                  {/* Number badge */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-bold text-lg mb-6 shadow-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector (mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-primary rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="xl" asChild>
            <Link to="/signup">
              Start Your Care Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
