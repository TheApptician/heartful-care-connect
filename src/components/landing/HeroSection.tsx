import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { value: "10,000+", label: "Verified Carers" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" },
    { value: "50+", label: "NHS Partners" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 animate-fade-in">
              <Shield className="w-3 h-3 mr-1" />
              DBS Verified & CQC Compliant
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6 animate-fade-in-up">
              Quality Care,{" "}
              <span className="relative">
                <span className="relative z-10">Instantly</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-secondary/40 -z-0 rounded" />
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Connect with trusted, verified carers in minutes. Whether you need home care, respite support, or specialist nursing — Heems matches you with the perfect carer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Find a Carer
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/carer-signup">
                  Become a Carer
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start text-primary-foreground/70 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Free to search</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>No booking fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="glass rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="text-center p-4"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Featured testimonial */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                    SM
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground">
                      "Found an amazing carer for my mum within 24 hours. The verification process gave us complete peace of mind."
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Sarah M. — Manchester
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-success text-success-foreground rounded-2xl p-3 shadow-lg animate-float">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-semibold">Book in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
