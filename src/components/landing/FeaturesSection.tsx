import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Shield, 
  Clock, 
  MapPin, 
  CreditCard, 
  MessageSquare,
  Calendar,
  FileCheck
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Smart Matching",
    description: "Our intelligent algorithm matches you with carers based on skills, availability, location, and care needs.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Fully Verified Carers",
    description: "All carers undergo rigorous DBS checks, identity verification, right-to-work checks, and reference validation.",
    color: "success",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "Book care in minutes, not days. Our platform enables same-day booking for urgent care needs.",
    color: "secondary",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    description: "Know exactly when your carer arrives with real-time location tracking and arrival notifications.",
    color: "info",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Pay securely through the platform. No cash needed. Automatic payments after each visit.",
    color: "accent",
  },
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    description: "Communicate directly with carers through our secure messaging system. Video calls included.",
    color: "primary",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book one-off visits or set up recurring care. Easily manage and modify your care schedule.",
    color: "warning",
  },
  {
    icon: FileCheck,
    title: "Care Documentation",
    description: "Digital care plans, visit logs, and medication records. Full transparency for families.",
    color: "success",
  },
];

const colorStyles: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  secondary: "bg-secondary/10 text-secondary",
  info: "bg-info/10 text-info",
  accent: "bg-accent/10 text-accent",
  warning: "bg-warning/10 text-warning",
};

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Everything You Need for{" "}
            <span className="text-gradient">Quality Care</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From finding the perfect carer to managing ongoing care, Heems provides a complete solution for modern care needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              variant="interactive"
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${colorStyles[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
