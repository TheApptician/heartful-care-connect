import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "For Carers", href: "#for-carers" },
    { name: "For Organisations", href: "#for-organisations" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Safeguarding", href: "/safety-guidelines" },
  ],
  support: [
    { name: "Help Centre", href: "/help" },
    { name: "User Guide", href: "/user-guide" },
    { name: "Safety Resources", href: "/safety-guidelines" },
    { name: "Contact Support", href: "/contact" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Top Grid */}
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-4 max-w-sm">
            <Link to="/" className="flex items-center mb-8 group">
              <img
                src="/heems-logo.png"
                alt="Heems"
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/60 font-medium leading-relaxed mb-10">
              Technological infrastructure for the future of private care. Connecting families, carers, and organisations through clinical-grade vetting and matching.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                <Mail className="w-4 h-4 text-white/40" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                <Phone className="w-4 h-4 text-white/40" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                <MapPin className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-8">
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                <li><Link to="/marketplace" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link to="/carers" className="text-sm font-bold text-white/60 hover:text-white transition-colors">For Carers</Link></li>
                <li><Link to="/solutions" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link to="/pricing" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/help" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/security" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-sm font-bold text-white/60 hover:text-white transition-colors">About Heems</Link></li>
                <li><Link to="/blog" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Insights</Link></li>
                <li><Link to="/contact" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Status</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-bold text-white/80">All Systems Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mb-16 pt-12 border-t border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white mb-2">Download Our Mobile App</h3>
            <p className="text-white/60 font-medium">Get the Heems experience on your mobile device</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
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
                <div className="text-xs text-white/60">Download on the</div>
                <div className="text-sm font-bold text-white">App Store</div>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              href="#"
              className="group flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-white/60">GET IT ON</div>
                <div className="text-sm font-bold text-white">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.1em]">© {new Date().getFullYear()} Heems Care Ltd. Registered in England & Wales.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-[0.1em] transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-[0.1em] transition-colors">Terms</Link>
            <Link to="/cookies" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-[0.1em] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
