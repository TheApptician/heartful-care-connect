import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Wallet,
  FileText,
  Clock,
  Settings,
  User,
  Star,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const navItems = [
  { name: "Dashboard", href: "/carer/dashboard", icon: LayoutDashboard },
  { name: "Availability", href: "/carer/availability", icon: Calendar },
  { name: "Bookings", href: "/carer/bookings", icon: Clock },
  { name: "Messages", href: "/carer/messages", icon: MessageSquare },
  { name: "Earnings", href: "/carer/earnings", icon: Wallet },
  { name: "Documents", href: "/carer/documents", icon: FileText },
  { name: "Profile", href: "/carer/profile", icon: User },
  { name: "Settings", href: "/carer/settings", icon: Settings },
];

interface Booking {
  id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  total_price: number;
  status: string;
  service_type: string;
  client?: {
    full_name: string;
  };
}

const CarerDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    weeklyEarnings: 0,
    weeklyHours: 0,
    totalClients: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [missingRequirements, setMissingRequirements] = useState<string[]>([]);
  const [processingBookings, setProcessingBookings] = useState<Set<string>>(new Set());
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

      // Fetch upcoming confirmed bookings
      const today = new Date().toISOString().split('T')[0];
      const { data: confirmedBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name)
        `)
        .eq('carer_id', user.id)
        .in('status', ['confirmed', 'completed'])
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      setUpcomingBookings(confirmedBookings || []);

      // Fetch pending bookings
      const { data: pendingData } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name)
        `)
        .eq('carer_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      setPendingBookings(pendingData || []);

      // Calculate stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: weeklyBookings } = await supabase
        .from('bookings')
        .select('total_price, duration_hours, client_id')
        .eq('carer_id', user.id)
        .eq('status', 'completed')
        .gte('start_time', weekAgo.toISOString());

      const weeklyEarnings = weeklyBookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;
      const weeklyHours = weeklyBookings?.reduce((sum, b) => sum + (b.duration_hours || 0), 0) || 0;

      // Count unique clients
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('client_id')
        .eq('carer_id', user.id);

      const uniqueClients = new Set(allBookings?.map(b => b.client_id)).size;

      // Fetch detailed carer info
      const { data: carerDetails } = await supabase
        .from('carer_details')
        .select('*')
        .eq('id', user.id)
        .single();

      const missing: string[] = [];
      if (!profileData?.phone) missing.push("Phone Number");
      if (!profileData?.first_name) missing.push("First Name");
      if (!carerDetails?.has_dbs) missing.push("DBS Certificate");
      if (!carerDetails?.has_insurance) missing.push("Liability Insurance");
      if (!carerDetails?.has_right_to_work) missing.push("Right to Work");
      // Optional: if (!carerDetails?.has_transportation) missing.push("Transportation Staus"); 

      setMissingRequirements(missing);

      // Check for video
      if (carerDetails?.video_url) {
        setProfile(prev => ({ ...prev, video_url: carerDetails.video_url }));
      }

      setStats({
        weeklyEarnings,
        weeklyHours,
        totalClients: uniqueClients,
        rating: 4.8, // TODO: Implement ratings table
      });

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

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      setProcessingBookings(prev => new Set(prev).add(bookingId));
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking accepted",
        description: "The booking has been confirmed.",
      });

      await fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingBookings(prev => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      setProcessingBookings(prev => new Set(prev).add(bookingId));
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking declined",
        description: "The booking has been declined.",
      });

      await fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingBookings(prev => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {profile?.full_name?.split(' ')[0] || "Carer"}
          </h1>
          <p className="text-muted-foreground">
            You have {upcomingBookings.length} upcoming visit{upcomingBookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/carer/availability">
              <Calendar className="w-4 h-4 mr-2" />
              Manage Availability
            </Link>
          </Button>
        </div>
      </div>

      {/* Welcome Video Section */}
      {profile?.video_url && (
        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative mb-6">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Your Intro Video
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to your dashboard</h2>
              <p className="text-slate-300 mb-6">This video is currently being shown to potential clients on your profile.</p>
              <Button variant="outline" className="bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
                <Link to="/carer/profile">Update Video</Link>
              </Button>
            </div>
            <div className="aspect-video bg-black/50 rounded-xl overflow-hidden shadow-2xl border border-white/10">
              {profile.video_url.includes('youtube') || profile.video_url.includes('youtu.be') ? (
                <iframe
                  src={profile.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title="Welcome Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={profile.video_url} controls className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Missing Requirements Alert */}
      {missingRequirements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-2">Pending Verification</h3>
            <p className="text-amber-700 text-sm mb-4">
              Your profile is not yet fully verified. To appear in search results and receive bookings, please complete the following:
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
              <Link to="/carer/profile">Complete Profile</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">£{stats.weeklyEarnings.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">This week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.weeklyHours}</p>
                <p className="text-sm text-muted-foreground">Hours this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.rating}</p>
                <p className="text-sm text-muted-foreground">Average rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalClients}</p>
                <p className="text-sm text-muted-foreground">Total clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Visits */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Visits</CardTitle>
                <CardDescription>Your confirmed bookings</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/carer/bookings">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming visits scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">
                              {booking.client?.full_name || 'Client'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.service_type || 'Care Service'}
                            </p>
                          </div>
                          <Badge variant="secondary">£{booking.total_price}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{booking.start_time ? format(new Date(booking.start_time), 'MMM dd, yyyy') : 'N/A'}</span>
                          <span>•</span>
                          <span>{booking.start_time ? format(new Date(booking.start_time), 'HH:mm') : 'TBD'}</span>
                          <span>•</span>
                          <span>{booking.duration_hours}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>Awaiting your response</CardDescription>
              </div>
              {pendingBookings.length > 0 && (
                <Badge variant="warning">{pendingBookings.length} pending</Badge>
              )}
            </CardHeader>
            <CardContent>
              {pendingBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {booking.client?.full_name || 'New Client'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.start_time ? format(new Date(booking.start_time), 'EEE, MMM dd') : 'N/A'} • {booking.duration_hours}h • {booking.service_type || 'Care'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground mr-2">
                          £{booking.total_price}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineBooking(booking.id)}
                          disabled={processingBookings.has(booking.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptBooking(booking.id)}
                          disabled={processingBookings.has(booking.id)}
                        >
                          {processingBookings.has(booking.id) ? "Accepting..." : "Accept"}
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
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Verification</span>
                  <Badge variant={profile?.verified ? "success" : "warning"}>
                    {profile?.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/carer/profile">
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/carer/availability">
                    <Calendar className="w-4 h-4 mr-2" />
                    Update Availability
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/carer/documents">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/carer/earnings">
                    <Wallet className="w-4 h-4 mr-2" />
                    View Earnings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Platform Benefits */}
          <Card className="bg-gradient-to-br from-[#1a9e8c]/10 to-transparent border-[#1a9e8c]/20">
            <CardHeader>
              <CardTitle className="text-base text-[#1a9e8c]">Your Skills. Your Terms.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Join thousands of self-employed carers who've taken control of their careers.
              </p>
              <ul className="space-y-2">
                {[
                  "Set your own rates — earn £15-40/hour",
                  "Complete flexibility — work when you want",
                  "Insurance & liability coverage included",
                  "Meaningful work with ongoing clients"
                ].map((benefit, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-[#1a9e8c] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarerDashboard;
