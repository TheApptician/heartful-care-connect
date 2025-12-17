import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">Heems</span>
          </Link>

          {/* Content */}
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Quality Care at Your Fingertips
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of families and carers who trust Heems for reliable, 
              verified care across the UK.
            </p>
            
            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold text-primary-foreground">10K+</p>
                <p className="text-sm text-primary-foreground/70">Verified Carers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-foreground">98%</p>
                <p className="text-sm text-primary-foreground/70">Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-foreground">50+</p>
                <p className="text-sm text-primary-foreground/70">NHS Partners</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Heems Care Ltd. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Heems</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {title}
              </h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
