import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation,
  ChevronRight,
  ShieldCheck,
  Search,
  ArrowRight
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-emerald-500 rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest"><CheckCircle2 className="h-3 w-3 mr-1" />Confirmed</Badge>;
    case "pending":
      return <Badge variant="secondary" className="rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest bg-amber-50 text-amber-600 border-amber-100"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-500 rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest"><Navigation className="h-3 w-3 mr-1" />In Progress</Badge>;
    case "completed":
      return <Badge variant="outline" className="rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest border-emerald-200 text-emerald-600 bg-emerald-50"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive" className="rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
    default:
      return <Badge variant="outline" className="rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest">Unknown</Badge>;
  }
};

export default function ClientBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          status,
          total_price,
          carer:profiles!bookings_carer_id_fkey (
            id,
            full_name,
            avatar_url,
            carer_details (
              hourly_rate,
              verification_status
            )
          )
        `)
        .eq('client_id', user.id)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === "pending" || b.status === "confirmed" || b.status === "in_progress");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Care Appointments</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage your professional care schedule.</p>
        </div>
        <Button className="h-11 px-6 rounded-xl font-bold shadow-md shadow-primary/10" asChild>
          <Link to="/client/search">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold">{upcomingBookings.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold">{pastBookings.filter(b => b.status === 'completed').length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Total Spent</p>
          <p className="text-2xl font-bold tracking-tight">£{bookings.reduce((acc, b) => acc + (b.total_price || 0), 0)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-primary text-white shadow-md shadow-primary/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Response Avg</p>
          <p className="text-2xl font-bold">15m</p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-11 w-fit border border-black/5">
          <TabsTrigger value="upcoming" className="h-9 px-6 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="h-9 px-6 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
            History ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card className="rounded-2xl border-2 border-dashed border-black/5 bg-slate-50/50 p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-black/5">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-1">No appointments</h3>
              <p className="text-sm text-muted-foreground font-medium mb-6">Find professional care tailored to your needs.</p>
              <Button className="h-11 px-8 rounded-xl font-bold text-xs" asChild>
                <Link to="/client/search">Explore Marketplace</Link>
              </Button>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <Card key={booking.id} className="rounded-2xl border-black/5 shadow-sm overflow-hidden group hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Carer Identity */}
                    <div className="lg:w-1/4 p-5 md:p-6 bg-slate-50/50 border-r border-black/5 flex flex-col justify-between gap-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 rounded-2xl shadow-sm border-2 border-white">
                          <AvatarImage src={booking.carer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.carer?.full_name}`} />
                          <AvatarFallback className="text-lg font-bold">{booking.carer?.full_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold tracking-tight truncate">{booking.carer?.full_name}</h3>
                          <div className="flex items-center gap-1.5 text-primary mt-0.5">
                            <ShieldCheck className="w-3 h-3 fill-primary text-slate-50" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Vetted Pro</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 h-9 rounded-lg bg-white border-black/5 font-bold text-xs"
                          onClick={() => navigate(`/client/messages?userId=${booking.carer?.id}`)}
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-primary" /> Chat
                        </Button>
                        <Button variant="outline" className="h-9 w-9 p-0 rounded-lg bg-white border-black/5">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        </Button>
                      </div>
                    </div>

                    {/* Right: Booking Details */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Schedule</Label>
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold tracking-tight">{format(new Date(booking.start_time), "EEEE, MMM do")}</p>
                            <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-primary opacity-70" /> {format(new Date(booking.start_time), "HH:mm")} - {format(new Date(booking.end_time), "HH:mm")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Session Value</Label>
                          <div className="space-y-0.5">
                            <p className="text-lg font-bold text-primary tracking-tight">£{booking.total_price}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Escrow Protected</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Status</Label>
                          <div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-black/5 mt-5 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground italic">
                          <AlertCircle className="w-3 h-3" />
                          Policy: 24h cancellation
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 px-3 rounded-lg text-xs font-bold group">
                              Manage
                              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-black/5 shadow-xl">
                            <DropdownMenuItem className="rounded-lg font-bold text-xs p-2.5">Full Details</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg font-bold text-xs p-2.5">Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg font-bold text-xs p-2.5 text-rose-500">Cancel Visit</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-muted-foreground">No past history.</p>
            </div>
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id} className="rounded-2xl border-black/5 shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-all">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6 md:gap-10">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <Avatar className="h-11 w-11 rounded-xl border-2 border-white shadow-sm">
                        <AvatarImage src={booking.carer?.avatar_url} />
                        <AvatarFallback className="text-xs font-bold">{booking.carer?.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold tracking-tight">{booking.carer?.full_name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Service Date</p>
                        <p className="text-xs font-bold text-foreground">{format(new Date(booking.start_time), "MMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Total Paid</p>
                        <p className="font-bold text-foreground text-sm">£{booking.total_price}</p>
                      </div>
                      <div className="hidden lg:block">
                        <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Feedback</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'completed' && (
                        <Button variant="outline" className="h-9 rounded-lg border-black/5 font-bold text-xs">
                          Review
                        </Button>
                      )}
                      <Button className="h-9 rounded-lg font-bold text-xs px-5" asChild>
                        <Link to={`/client/book/${booking.carer?.id}`}>
                          Rebook
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
