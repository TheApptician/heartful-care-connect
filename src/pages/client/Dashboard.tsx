import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Search,
  Calendar,
  MessageSquare,
  CreditCard,
  FileText,
  Users,
  Settings,
  Clock,
  Star,
  MapPin,
  ArrowRight,
  Plus,
  Heart,
  Sparkles,
  ShieldCheck,
  Activity,
  ChevronRight,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Overview", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "Marketplace", href: "/client/search", icon: Search },
  { name: "My Bookings", href: "/client/bookings", icon: Calendar },
  { name: "Care Plans", href: "/client/care-plans", icon: FileText },
  { name: "Messages", href: "/client/messages", icon: MessageSquare },
  { name: "Payments", href: "/client/payments", icon: CreditCard },
  { name: "Settings", href: "/client/settings", icon: Settings },
];

const ClientDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch Upcoming Bookings
      const { data: bookingData } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          status,
          total_price,
          carer:profiles!bookings_carer_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('client_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      setBookings(bookingData || []);

    } catch (error: any) {
      toast({
        title: "Dashboard Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="client" navItems={navItems}>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="client"
      navItems={navItems}
      userName={profile?.full_name || "Client"}
      userEmail={profile?.email}
    >
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 w-fit">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Premium Member</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Hello, {profile?.full_name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Your care ecosystem is running smoothly.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-5 rounded-xl border-black/5 bg-white font-bold text-xs" asChild>
              <Link to="/client/care-plans">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                Plan
              </Link>
            </Button>
            <Button className="h-11 px-6 rounded-xl font-bold text-xs shadow-md shadow-primary/10 bg-[#111827] text-white hover:bg-[#1f2937]" asChild>
              <Link to="/client/post-job">
                <FileText className="w-4 h-4 mr-2" />
                Post a Job
              </Link>
            </Button>
            <Button className="h-11 px-6 rounded-xl font-bold text-xs shadow-md shadow-primary/10" asChild>
              <Link to="/client/search">
                <Plus className="w-4 h-4 mr-2" />
                Book Care
              </Link>
            </Button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-5 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{bookings.length}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Bookings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden group hover:border-accent/20 transition-all duration-300">
            <CardContent className="p-5 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-500 text-accent">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">98%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Care Quality</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden group hover:border-emerald-200 transition-all duration-300">
            <CardContent className="p-5 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">12</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vetted Checks</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden group hover:border-slate-300 transition-all duration-300">
            <CardContent className="p-5 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500 text-slate-900">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">~12m</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Response Avg</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content: Upcoming Visits */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-black/5 shadow-sm bg-white/50 backdrop-blur-xl">
              <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-black/5">
                <div>
                  <CardTitle className="text-lg font-bold">Upcoming Visits</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground">Keep track of scheduled professional care.</CardDescription>
                </div>
                <Button variant="ghost" className="h-8 px-3 rounded-lg text-xs font-bold text-primary" asChild>
                  <Link to="/client/bookings">
                    See All
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {bookings.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-sm text-muted-foreground font-medium">No upcoming visits.</p>
                      <Button variant="link" asChild className="text-primary font-bold text-xs mt-1">
                        <Link to="/client/search">Browse Marketplace</Link>
                      </Button>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white border border-black/5 hover:border-primary/20 hover:shadow-sm transition-all duration-300 group cursor-pointer"
                      >
                        <Avatar className="h-12 w-12 rounded-xl shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
                          <AvatarImage src={booking.carer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.carer?.full_name}`} />
                          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">{booking.carer?.full_name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-sm tracking-tight">{booking.carer?.full_name}</h4>
                            <Badge variant="secondary" className="rounded-md font-bold uppercase text-[8px] tracking-wider px-1.5 py-0 bg-slate-100 text-slate-500 border-none">
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground font-medium text-[11px]">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-primary opacity-70" />
                              {format(new Date(booking.start_time), "EEE, MMM do")}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-primary opacity-70" />
                              {format(new Date(booking.start_time), "HH:mm")}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-primary tracking-tight">£{booking.total_price}</p>
                          <ArrowRight className="w-4 h-4 ml-auto mt-1 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Care recipient context or secondary info */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Card className="rounded-2xl border-none bg-slate-900 text-white p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Recipients</h3>
                </div>
                <p className="text-xs text-white/50 mb-6 font-medium leading-relaxed">Manage documentation for members receiving care.</p>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-10 rounded-lg text-xs" asChild>
                  <Link to="/client/profile">Manage Contacts</Link>
                </Button>
              </Card>

              <Card className="rounded-2xl border-black/5 bg-accent/5 p-6 border-2 border-dashed border-accent/10">
                <div className="flex items-center gap-3 mb-4 text-accent">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Vetting</h3>
                </div>
                <p className="text-xs text-accent/70 mb-4 font-medium leading-relaxed">Your account is fully verified. book care immediately.</p>
                <div className="flex items-center gap-1.5 text-accent font-bold text-[10px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar: Quick Actions & Intelligence */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-black/5 shadow-sm bg-white p-6">
              <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between">
                <h3 className="text-lg font-bold">Tools</h3>
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              </CardHeader>
              <div className="space-y-2">
                {[
                  { label: 'Instant Book', icon: Zap, color: 'text-amber-500', link: '/client/search' },
                  { label: 'Messages', icon: MessageSquare, color: 'text-primary', link: '/client/messages' },
                  { label: 'Payments', icon: CreditCard, color: 'text-emerald-500', link: '/client/payments' },
                  { label: 'Recipients', icon: Users, color: 'text-slate-900', link: '/client/recipients' },
                ].map((tool, i) => (
                  <Link key={i} to={tool.link} className="flex items-center justify-between p-3 rounded-xl border border-black/5 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <tool.icon className={`w-4 h-4 ${tool.color}`} />
                      <span className="text-sm font-bold text-foreground/70">{tool.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border-black/5 shadow-sm bg-slate-50/50 p-6 border-2 border-white">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                Saved
              </h3>
              <p className="text-xs font-medium text-muted-foreground mb-4">Professionals who delivered excellence.</p>
              <div className="space-y-3">
                <div className="flex items-center justify-center py-6 border-2 border-dashed border-black/5 rounded-xl">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">Empty Favorites</p>
                </div>
                <Button variant="outline" className="w-full h-10 rounded-lg font-bold bg-white text-xs border-black/5" asChild>
                  <Link to="/client/search">Explore</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default ClientDashboard;
