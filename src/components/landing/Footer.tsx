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
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
    { name: "Safeguarding", href: "/safeguarding" },
  ],
  support: [
    { name: "Help Centre", href: "/help" },
    { name: "FAQs", href: "/faq" },
    { name: "Safety Resources", href: "/safety" },
    { name: "Accessibility", href: "/accessibility" },
    { name: "Report an Issue", href: "/report" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-sidebar-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-sidebar-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-sidebar-foreground/70">
                Get the latest care insights and platform updates delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto max-w-md">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
              />
              <Button className="shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-sidebar-foreground">Heems</span>
            </Link>
            <p className="text-sidebar-foreground/70 mb-6 max-w-xs">
              The UK's trusted care marketplace. Connecting families with verified carers, 
              and empowering organisations with workforce solutions.
            </p>
            <div className="space-y-2 text-sm text-sidebar-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@heemscare.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0800 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>London, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sidebar-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/60">
            <p>© {new Date().getFullYear()} Heems Care Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>CQC Registered</span>
              <span>•</span>
              <span>ICO Registered</span>
              <span>•</span>
              <span>Cyber Essentials Plus</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
