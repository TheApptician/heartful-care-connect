import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Star, Clock, Shield, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const carerBenefits = [
  { icon: TrendingUp, text: "Set your own rates — earn £15-40/hour" },
  { icon: Clock, text: "Complete flexibility — work when you want" },
  { icon: Shield, text: "Insurance & liability coverage included" },
  { icon: Heart, text: "Meaningful work with ongoing clients" },
];

const ForCarersSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background" id="for-carers">
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
                <Link to="/carer-signup">
                  Apply to Join
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/carer-info">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <Card variant="gradient" className="p-6 lg:p-8">
                <CardContent className="p-0">
                  {/* Earnings preview */}
                  <div className="bg-card rounded-xl p-6 shadow-md mb-6">
                    <p className="text-sm text-muted-foreground mb-2">This month's earnings</p>
                    <p className="text-4xl font-bold text-foreground mb-1">£3,247.50</p>
                    <p className="text-sm text-success flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +12% from last month
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">42</p>
                      <p className="text-xs text-muted-foreground">Hours worked</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">8</p>
                      <p className="text-xs text-muted-foreground">Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">4.9</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  {/* Upcoming */}
                  <div className="bg-primary/5 rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground mb-2">Next appointment</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Mrs. Thompson</p>
                        <p className="text-sm text-muted-foreground">Today, 2:00 PM • 3 hours</p>
                      </div>
                      <Badge variant="success">Confirmed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-success text-success-foreground rounded-2xl p-3 shadow-lg animate-bounce-subtle">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Weekly payouts</span>
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
