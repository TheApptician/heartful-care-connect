import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Globe,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  FileCheck,
  BarChart3,
  MessageSquare,
  Search
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OrganisationDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [orgDetails, setOrgDetails] = useState<any>(null);
  const [stats, setStats] = useState({
    totalCarers: 0,
    activeBookings: 0,
    pendingBookings: 0,
    totalSpend: 0,
    complianceRate: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [missingRequirements, setMissingRequirements] = useState<string[]>([]);
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch organisation details
      const { data: orgData } = await supabase
        .from('organisation_details')
        .select('*')
        .eq('id', user.id)
        .single();

      setOrgDetails(orgData);

      // Fetch bookings where org is involved (as client)
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          carer:profiles!bookings_carer_id_fkey(full_name, avatar_url)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      const bookings = bookingsData || [];

      // Calculate stats
      const activeBookings = bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const totalSpend = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_price || 0), 0);

      // Get unique carers from bookings
      const uniqueCarers = new Set(bookings.map(b => b.carer_id)).size;

      setStats({
        totalCarers: uniqueCarers,
        activeBookings,
        pendingBookings,
        totalSpend,
        complianceRate: orgData?.is_verified ? 100 : 50,
      });

      setRecentBookings(bookings.slice(0, 5));

      const missing: string[] = [];
      if (!orgData?.company_name) missing.push("Company Name");
      if (!orgData?.registration_number) missing.push("Registration Number");
      if (!orgData?.postcode) missing.push("Postcode");

      setMissingRequirements(missing);

    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="organisation">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="organisation"
      userName={orgDetails?.company_name || profile?.full_name || "Organisation"}
      userEmail={profile?.email || ""}
    >
      <div className="space-y-8 max-w-7xl mx-auto py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organisation Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">
              Welcome, {orgDetails?.company_name || profile?.full_name?.split(' ')[0] || "Organisation"}
            </h1>
            <p className="text-slate-500 font-medium">Manage your care services and staff.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-black/5 rounded-xl font-bold px-6 hover:bg-slate-50" asChild>
              <Link to="/organisation/staff">
                <Users className="w-4 h-4 mr-2" />
                Staff Bank
              </Link>
            </Button>
            <Button className="h-12 bg-[#111827] text-white font-black rounded-xl px-6 hover:bg-[#1a9e8c] transition-all shadow-xl shadow-black/10" asChild>
              <Link to="/organisation/jobs">
                <Zap className="w-4 h-4 mr-2" />
                Post Need
              </Link>
            </Button>
          </div>
        </div>

        {/* Missing Requirements Alert */}
        {missingRequirements.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">Complete Your Profile</h3>
              <p className="text-amber-700 text-sm mb-4">
                To become a verified organization and unlock full platform features, please provide:
              </p>
              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                {missingRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-amber-800 text-sm font-medium bg-amber-100/50 px-3 py-1.5 rounded-lg border border-amber-200/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {req}
                  </div>
                ))}
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold border-none" asChild>
                <Link to="/organisation/profile">Update Profile</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-3xl border-black/[0.05] shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-slate-50 text-[#111827]">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#111827] tracking-tight">{stats.totalCarers}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Carers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-black/[0.05] shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-[#1a9e8c]/5 text-[#1a9e8c]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#111827] tracking-tight">{stats.complianceRate}%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-black/[0.05] shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-amber-50 text-amber-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#111827] tracking-tight">{stats.pendingBookings}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-black/[0.05] shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-green-50 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#111827] tracking-tight">£{stats.totalSpend.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spend</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Organisation Info */}
            <Card className="rounded-[2.5rem] border-black/[0.05] overflow-hidden shadow-sm">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black text-[#111827]">Organisation Details</CardTitle>
                    <CardDescription className="text-sm font-medium">Your service area and registration.</CardDescription>
                  </div>
                  <Button variant="ghost" className="rounded-xl font-bold" asChild>
                    <Link to="/organisation/profile">
                      <MapPin className="w-4 h-4 mr-2 text-[#1a9e8c]" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.02]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company</p>
                    <p className="text-sm font-black text-[#111827]">{orgDetails?.company_name || 'Not set'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.02]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration</p>
                    <p className="text-sm font-black text-[#111827]">{orgDetails?.registration_number || 'Not set'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.02]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Postcode</p>
                    <p className="text-sm font-black text-[#111827]">{orgDetails?.postcode || 'Not set'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.02]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Radius</p>
                    <p className="text-sm font-black text-[#111827]">{orgDetails?.service_radius_miles ? `${orgDetails.service_radius_miles} miles` : 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={orgDetails?.is_verified ? "default" : "secondary"} className={orgDetails?.is_verified ? "bg-[#1a9e8c]" : ""}>
                    {orgDetails?.is_verified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Verification
                      </>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="rounded-[2.5rem] border-black/[0.05] shadow-sm overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black text-[#111827]">Recent Bookings</CardTitle>
                    <CardDescription className="text-sm font-medium">Your latest care bookings.</CardDescription>
                  </div>
                  <Button variant="ghost" className="rounded-xl font-bold" asChild>
                    <Link to="/organisation/jobs">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No bookings yet</p>
                    <Button className="mt-4" asChild>
                      <Link to="/organisation/jobs">Create First Booking</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-black/[0.02] hover:bg-slate-100 transition-colors group">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={booking.carer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.carer?.full_name}`} />
                            <AvatarFallback>{booking.carer?.full_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-[#111827]">{booking.carer?.full_name || 'Carer'}</p>
                            <p className="text-sm text-slate-500">{booking.service_type || 'Care Service'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="font-bold text-[#1a9e8c]">£{booking.total_price}</p>
                            <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-[#1a9e8c] hover:bg-[#1a9e8c]/10"
                            onClick={() => navigate(`/organisation/messages?userId=${booking.carer_id}`)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="rounded-[2.5rem] border-black/[0.05] shadow-sm overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-lg font-black text-[#111827]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl" asChild>
                    <Link to="/organisation/staff">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Staff
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl" asChild>
                    <Link to="/organisation/jobs">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Post Job
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl" asChild>
                    <Link to="/organisation/compliance">
                      <FileCheck className="w-4 h-4 mr-2" />
                      View Compliance
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl" asChild>
                    <Link to="/organisation/analytics">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="rounded-[2.5rem] bg-[#111827] text-white border-none overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <CardContent className="p-8 relative z-10">
                <Badge variant="secondary" className="bg-[#1a9e8c] text-white border-0 mb-6 font-black uppercase tracking-widest px-3 py-1 text-[10px]">
                  Status
                </Badge>
                <div className="mb-8">
                  <p className="text-3xl font-black text-white mb-1">
                    {orgDetails?.is_verified ? 'Verified' : 'Pending'}
                  </p>
                  <p className="text-[10px] font-black text-[#1a9e8c] uppercase tracking-[0.2em]">
                    Organisation Status
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className={`w-5 h-5 ${orgDetails?.is_verified ? 'text-[#1a9e8c]' : 'text-slate-500'}`} />
                    <span>Account Created</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className={`w-5 h-5 ${orgDetails?.company_name ? 'text-[#1a9e8c]' : 'text-slate-500'}`} />
                    <span>Details Submitted</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className={`w-5 h-5 ${orgDetails?.is_verified ? 'text-[#1a9e8c]' : 'text-slate-500'}`} />
                    <span>Admin Verified</span>
                  </li>
                </ul>
                <Button className="w-full h-14 bg-[#1a9e8c] text-white font-black rounded-2xl hover:bg-[#15806c] shadow-xl shadow-[#1a9e8c]/20" asChild>
                  <Link to="/organisation/profile">
                    Complete Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganisationDashboard;
