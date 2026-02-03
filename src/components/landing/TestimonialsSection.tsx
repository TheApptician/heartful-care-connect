import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    content: "Heems transformed how we manage care for our service users. The verified carers are reliable, professional, and truly care about the people they support.",
    author: "James Henderson",
    role: "Care Coordinator",
    company: "Brighton",
    rating: 5,
    avatar: "JH",
  },
  {
    content: "As a self-employed carer, Heems has given me the flexibility I needed. The platform is intuitive, payments are always on time, and I love connecting with families directly.",
    author: "Priya Sharma",
    role: "Dementia Carer",
    company: "Self-Employed",
    rating: 5,
    avatar: "PS",
  },
  {
    content: "Finding reliable overnight care for my father was a nightmare until we found Heems. Within 48 hours we had a wonderful carer who's now like family.",
    author: "Margaret O'Brien",
    role: "Family Caregiver",
    company: "London",
    rating: 5,
    avatar: "MO",
  },
  {
    content: "I was overwhelmed trying to find support for my rehabilitation after surgery. Heems made it simple. I found a lovely carer who helped me get back on my feet.",
    author: "Emily Thompson",
    role: "Service User",
    company: "Oxford",
    rating: 5,
    avatar: "ET",
  },
  {
    content: "Heems is the best platform I've used. I set my own hours and rates, and the clients treat me like a professional. It's refreshing to be in control.",
    author: "Michael Okon",
    role: "Professional Carer",
    company: "Self-Employed",
    rating: 5,
    avatar: "MO",
  },
  {
    content: "My mum needs complex care due to Parkinson's. Heems matched us with a carer who has expert training. The peace of mind is priceless.",
    author: "David Chen",
    role: "Family Member",
    company: "Manchester",
    rating: 5,
    avatar: "DC",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Trusted by{" "}
            <span className="text-gradient">Thousands</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From families to professional carers, hear how Heems is transforming care across the UK.
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.author} className="w-full flex-shrink-0 px-2">
                  <Card variant="interactive">
                    <CardContent className="p-6">
                      {/* Quote icon */}
                      <Quote className="w-8 h-8 text-primary/20 mb-4" />

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-foreground leading-relaxed mb-6">
                        "{testimonial.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {testimonial.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role} • {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Grid (unchanged) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.author}
              variant="interactive"
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by leading organisations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-xl font-bold text-foreground">ICO Certified</div>
            <div className="text-xl font-bold text-foreground">Stripe Verified</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
