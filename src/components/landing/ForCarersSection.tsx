import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Star, Clock, Shield, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const carerBenefits = [
  { icon: TrendingUp, text: "Set your own rates — earn £15-40/hour" },
  { icon: Clock, text: "Complete flexibility — work when you want" },

  { icon: Heart, text: "Meaningful work with ongoing clients" },
];

const ForCarersSection = () => {
  return (
    <section className="py-20 lg:pt-32 lg:pb-16 bg-background" id="for-carers">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              For Carers
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your Skills.{" "}
              <span className="text-gradient">Your Terms.</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of self-employed carers who've taken control of their careers.
              Set your own rates, choose your clients, and build lasting relationships — all while
              we handle the admin, payments, and compliance.
            </p>

            <div className="space-y-4 mb-8">
              {carerBenefits.map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Apply to Join
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-3xl blur-3xl opacity-50"></div>

              {/* Dashboard Mockup Image */}
              <div className="relative">
                <img
                  src="/carer-dashboard-mockup.png"
                  alt="Heems Carer Dashboard App"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(26, 158, 140, 0.25))',
                  }}
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-success text-success-foreground rounded-2xl p-3 shadow-lg animate-bounce-subtle">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Weekly payouts</span>
                </div>
              </div>

              {/* Additional floating element */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-slate-900">Top Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForCarersSection;
