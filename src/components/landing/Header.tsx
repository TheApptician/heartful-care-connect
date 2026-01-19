import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Heart, User, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for logged-in user
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user profile to get role
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile?.role) return '/client/dashboard';
    return `/${profile.role}/dashboard`;
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.full_name) {
      return profile.full_name;
    }
    return user?.email || 'User';
  };

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "For Carers", href: "/carers" },
    { name: "Solutions", href: "/solutions" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white border-b border-black/5 py-2' : 'bg-white border-b border-black/[0.03] py-4'}`}>
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/heems-logo.png"
              alt="Heems"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-bold text-[#4B5563] hover:text-[#1a9e8c] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / User Account */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-[#1a9e8c] text-white text-sm font-bold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#111827] leading-none">
                        {getUserName().split(' ')[0]}
                      </p>
                      <p className="text-xs text-[#4B5563] capitalize leading-none mt-0.5">
                        {profile?.role || 'User'}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#4B5563]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/${profile?.role || 'client'}/profile`}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/${profile?.role || 'client'}/settings`}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="font-bold text-xs h-10 px-5 rounded-xl text-[#4B5563]" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="font-bold text-xs h-10 px-6 rounded-xl bg-[#1a9e8c] hover:bg-[#15806c] text-white shadow-sm" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl bg-slate-50 border border-black/5 text-[#111827]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-1 bg-white rounded-2xl p-2 border border-black/5 shadow-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-bold text-[#111827] hover:bg-slate-50 px-4 py-3 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="border-t border-black/5 my-2" />
                  <Link
                    to={getDashboardLink()}
                    className="text-sm font-bold text-[#111827] hover:bg-slate-50 px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to={`/${profile?.role || 'client'}/profile`}
                    className="text-sm font-bold text-[#111827] hover:bg-slate-50 px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to={`/${profile?.role || 'client'}/settings`}
                    className="text-sm font-bold text-[#111827] hover:bg-slate-50 px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-bold text-destructive hover:bg-red-50 px-4 py-3 rounded-xl transition-colors flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2 p-2 pt-3 border-t border-black/5">
                  <Button variant="outline" className="h-11 rounded-xl font-bold text-xs border-black/5" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="h-11 rounded-xl font-bold text-xs bg-[#1a9e8c] hover:bg-[#15806c] text-white" asChild>
                    <Link to="/signup">Start Free</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
