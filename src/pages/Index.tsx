import { Helmet } from "react-helmet-async";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ForOrganisationsSection from "@/components/landing/ForOrganisationsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import ParallaxSection from "@/components/landing/ParallaxSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      {/* ... previous Helmet code remains same ... */}
      <Helmet>
        <title>Heems | UK's Trusted On-Demand Care Marketplace</title>
        <meta
          name="description"
          content="Connect with verified carers in minutes. Heems is the UK's leading care marketplace for families, self-employed carers, and healthcare organisations. DBS checked, Introductory Agency standards matched."
        />
        <meta name="keywords" content="care marketplace, home care, carers, UK healthcare, domiciliary care, care agency software" />
        <link rel="canonical" href="https://heemscare.com" />

        {/* Open Graph */}
        <meta property="og:title" content="Heems | UK's Trusted On-Demand Care Marketplace" />
        <meta property="og:description" content="Connect with verified carers in minutes. The UK's leading platform for quality home care." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://heemscare.com" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Heems | UK's Trusted On-Demand Care Marketplace" />
        <meta name="twitter:description" content="Connect with verified carers in minutes." />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Heems",
            "url": "https://heemscare.com",
            "description": "UK's trusted on-demand care marketplace connecting families with verified carers",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "GB"
            },
            "sameAs": []
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        <main className="animate-fade-in transition-all duration-1000">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <ParallaxSection />
          <ForOrganisationsSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
