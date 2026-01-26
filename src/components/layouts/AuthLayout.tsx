import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Panel - Branding & Image */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-[#111827]">
        {/* Background Image with Hover Zoom effect */}
        <div
          className="absolute inset-0 opacity-60 bg-cover bg-center transition-transform duration-[20000ms] hover:scale-110"
          style={{ backgroundImage: 'url("/auth_side.png")' }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/40 via-[#111827]/80 to-[#111827]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/heems-logo.png"
              alt="Heems"
              className="h-12 w-auto brightness-0 invert"
            />
          </Link>

          {/* Content */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c]" />
              <span className="text-xs font-black text-white/40 uppercase tracking-[0.25em]">
                Care Infrastructure
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
              Quality care, <br />
              <span className="text-[#1a9e8c]">delivered smarter.</span>
            </h2>
            <p className="text-lg text-white/50 font-medium leading-relaxed mb-8">
              Connect with the UK's most elite care professionals through our proprietary matching engine.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-black text-white mb-1">1.2%</p>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Acceptance Rate</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white mb-1">9-5</p>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Support Team</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            <span>© {new Date().getFullYear()} Heems Care Ltd.</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 border-b border-black/[0.03]">
          <Link to="/" className="flex items-center">
            <img
              src="/heems-logo.png"
              alt="Heems"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md animate-in-up">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-[#111827] mb-3 tracking-tight">
                {title}
              </h1>
              <p className="text-base text-[#4B5563] font-medium leading-relaxed">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
