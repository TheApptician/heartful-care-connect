// Modern, Sleek Hero Section with App Download
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Shield,
  Sparkles,
  Download,
  Smartphone,
  CheckCircle,
  Play
} from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a4d44]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#1a9e8c] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6TTIgMnYyaDJ2LTJIMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#1a9e8c] rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Shield className="h-4 w-4 text-[#1a9e8c]" />
              <span className="text-sm font-medium">Fully Vetted • Verified Professionals</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold">4.9</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Quality Care,
                <br />
                <span className="bg-gradient-to-r from-[#1a9e8c] via-emerald-400 to-teal-300 bg-clip-text text-transparent animate-gradient">
                  On Demand
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-xl">
                Connect with verified, experienced carers in minutes.
                The UK's most trusted introductory care marketplace.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: CheckCircle, text: "Verified Carers" },
                { icon: Shield, text: "DBS Checked and Insured" },
                { icon: Sparkles, text: "Instant Booking" }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <benefit.icon className="h-4 w-4 text-[#1a9e8c]" />
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/signup/client")}
                className="group relative overflow-hidden bg-gradient-to-r from-[#1a9e8c] to-emerald-500 hover:from-[#158f7e] hover:to-emerald-600 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-2xl shadow-[#1a9e8c]/50 hover:shadow-[#1a9e8c]/70 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Find a Carer Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup/carer")}
                className="group px-8 py-6 text-lg font-bold rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Become a Carer
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Button>
            </div>

            {/* App Download Section */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Download our mobile app
              </p>
              <div className="flex flex-wrap gap-4">
                {/* App Store Button */}
                <a
                  href="#"
                  className="group flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-400">Download on the</div>
                    <div className="text-sm font-bold text-white">App Store</div>
                  </div>
                </a>

                {/* Google Play Button */}
                <a
                  href="#"
                  className="group flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-400">GET IT ON</div>
                    <div className="text-sm font-bold text-white">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-[#1a9e8c] flex items-center justify-center text-white text-xs font-bold">
                  +2K
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  <span className="font-bold text-white">2,000+</span> verified carers
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Visual with Carer & App Mockup */}
          <div className="relative lg:block hidden animate-fade-in-up animation-delay-300">
            {/* 3D Animated Hero Image Container */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a9e8c] to-purple-500 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>

              {/* Main Hero Image with 3D Transform */}
              <div className="relative transform perspective-1000 animate-float3d">
                <img
                  src="/hero-carer-app.png"
                  alt="Professional carer with Heems mobile app"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl border border-white/10 transform hover:scale-105 transition-transform duration-500"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(26, 158, 140, 0.3))',
                  }}
                />

                {/* Animated Ring Effect */}
                <div className="absolute -inset-4 border-2 border-[#1a9e8c]/30 rounded-[2rem] animate-pulse-slow pointer-events-none"></div>
                <div className="absolute -inset-8 border border-[#1a9e8c]/20 rounded-[2.5rem] animate-pulse-slow animation-delay-1000 pointer-events-none"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 animate-float z-20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-bold text-slate-900">DBS Verified</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 animate-float animation-delay-1000 z-20">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-slate-900">4.9 Rating</span>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-[#1a9e8c] to-emerald-500 rounded-2xl p-3 shadow-2xl animate-float animation-delay-2000 z-20">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold">Instant Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-scroll { animation: scroll 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-3:hover { transform: rotateY(3deg) rotateX(2deg); }
        @keyframes float3d {
          0%, 100% { transform: translateY(0) rotateY(0deg) rotateX(0deg); }
          25% { transform: translateY(-10px) rotateY(2deg) rotateX(1deg); }
          50% { transform: translateY(-15px) rotateY(-2deg) rotateX(-1deg); }
          75% { transform: translateY(-5px) rotateY(1deg) rotateX(0.5deg); }
        }
        .animate-float3d { animation: float3d 6s ease-in-out infinite; }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
