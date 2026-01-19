import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  Heart,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
  HelpCircle,
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  PoundSterling,
  MessageSquare,
  Shield,
  Briefcase,
  BarChart3,
  Clock,
  MapPin,
  ClipboardList,
  Building2,
  UserCheck,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/landing/Header";
import { ChatWidget } from "@/components/shared/ChatWidget";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "client" | "carer" | "organisation" | "admin";
  navItems?: NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

// Default navigation items for each role
const getDefaultNavItems = (role: string): NavItem[] => {
  switch (role) {
    case "client":
      return [
        { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
        { name: "Find Carers", href: "/client/search", icon: Search },
        { name: "Bookings", href: "/client/bookings", icon: Calendar },
        { name: "Care Plans", href: "/client/care-plans", icon: ClipboardList },
        { name: "Messages", href: "/client/messages", icon: MessageSquare },
        { name: "Payments", href: "/client/payments", icon: CreditCard },
        { name: "Settings", href: "/client/settings", icon: Settings },
      ];
    case "carer":
      return [
        { name: "Dashboard", href: "/carer/dashboard", icon: LayoutDashboard },
        { name: "Availability", href: "/carer/availability", icon: Calendar },
        { name: "Bookings", href: "/carer/bookings", icon: Clock },
        { name: "Earnings", href: "/carer/earnings", icon: PoundSterling },
        { name: "Documents", href: "/carer/documents", icon: FileText },
        { name: "Messages", href: "/carer/messages", icon: MessageSquare },
        { name: "Profile", href: "/carer/profile", icon: User },
      ];
    case "organisation":
      return [
        { name: "Dashboard", href: "/organisation/dashboard", icon: LayoutDashboard },
        { name: "Staff", href: "/organisation/staff", icon: Users },
        { name: "Job Postings", href: "/organisation/jobs", icon: Briefcase },
        { name: "Bookings", href: "/organisation/bookings", icon: Calendar },
        { name: "Compliance", href: "/organisation/compliance", icon: Shield },
        { name: "Analytics", href: "/organisation/analytics", icon: BarChart3 },
        { name: "Messages", href: "/organisation/messages", icon: MessageSquare },
        { name: "Settings", href: "/organisation/settings", icon: Settings },
      ];
    case "admin":
      return [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Carers", href: "/admin/carers", icon: UserCheck },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
        { name: "Organisations", href: "/admin/organisations", icon: Building2 },
        { name: "Verifications", href: "/admin/verification-queue", icon: Shield },
        { name: "Disputes", href: "/admin/disputes", icon: Shield },
        { name: "Phase Control", href: "/admin/phase-control", icon: BarChart3 },
        { name: "Reports", href: "/admin/reports", icon: BarChart3 },
        { name: "Blog", href: "/admin/blog", icon: FileText },
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "System Logs", href: "/admin/system-logs", icon: FileText },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ];
    default:
      return [];
  }
};

const DashboardLayout = ({
  children,
  role,
  navItems,
  userName = "User",
  userEmail = "user@example.com",
  userAvatar,
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newCounts: { [key: string]: number } = {};

      // 1. Unread Messages (All roles)
      const { count: unreadMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      newCounts['messages'] = unreadMessages || 0;

      // 2. Active Bookings (Client, Carer, Organisation)
      if (role !== 'admin') {
        let query = supabase.from('bookings').select('*', { count: 'exact', head: true });

        if (role === 'client') query = query.eq('client_id', user.id);
        else if (role === 'carer') query = query.eq('carer_id', user.id);
        else if (role === 'organisation') query = query.eq('client_id', user.id); // Assuming orgs act as clients for bookings

        const { count: activeBookings } = await query
          .in('status', ['pending', 'confirmed', 'in_progress']);

        newCounts['bookings'] = activeBookings || 0;
      }

      // 3. Admin specific counts
      if (role === 'admin') {
        const { count: pendingVerifications } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'carer')
          .eq('verified', false);
        newCounts['verifications'] = pendingVerifications || 0;
      }

      setCounts(newCounts);
    };

    fetchCounts();

    // Subscribe to changes (Optional but good for real real-time)
    const channel = supabase
      .channel('dashboard-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchCounts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchCounts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchCounts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  // Use provided navItems or get defaults based on role, then inject counts
  const rawNavigationItems = navItems || getDefaultNavItems(role);
  const navigationItems = rawNavigationItems.map(item => {
    if (item.name === 'Messages') return { ...item, badge: counts['messages'] || 0 };
    if (item.name === 'Bookings') return { ...item, badge: counts['bookings'] || 0 };
    if (item.name === 'Verifications') return { ...item, badge: counts['verifications'] || 0 };
    return item;
  });

  const roleColors = {
    client: "from-primary to-primary-dark",
    carer: "from-secondary to-secondary",
    organisation: "from-accent to-accent",
    admin: "from-destructive to-destructive",
  };

  const roleLabels = {
    client: "Client",
    carer: "Carer",
    organisation: "Organisation",
    admin: "Admin",
  };

  return (
    <>
      {/* Public Header Navigation */}
      <Header />

      <div className="min-h-screen bg-background pt-20">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center">
              <img
                src="/heems-logo.png"
                alt="Heems"
                className="h-8 w-auto"
              />
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-foreground/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
              <Link to="/" className="flex items-center">
                <img
                  src="/heems-logo.png"
                  alt="Heems"
                  className="h-9 w-auto"
                />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-sidebar-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-sidebar-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-sidebar-foreground truncate">
                        {userName}
                      </p>
                      <p className="text-xs text-sidebar-foreground/60 truncate">
                        {roleLabels[role]}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/${role}/profile`}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/${role}/settings`}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {role !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/help">
                        <HelpCircle className="w-4 w-4 mr-2" />
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/login")}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between h-16 px-6 border-b border-border bg-card">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
      <ChatWidget />
    </>
  );
};

export default DashboardLayout;
