import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PoundSterling,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format, subDays, subMonths } from "date-fns";

interface Booking {
  id: string;
  start_time: string;
  service_type: string;
  duration_hours: number;
  total_price: number;
  status: string;
  carer?: {
    full_name: string;
  };
}

export default function ClientPayments() {
  const [period, setPeriod] = useState("30days");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    pendingAmount: 0,
    totalHours: 0,
    avgPerVisit: 0,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentData();
  }, [period]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Calculate date range
      let startDate = new Date();
      if (period === "30days") {
        startDate = subDays(new Date(), 30);
      } else if (period === "6months") {
        startDate = subMonths(new Date(), 6);
      } else if (period === "year") {
        startDate = subMonths(new Date(), 12);
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          carer:profiles!bookings_carer_id_fkey(full_name)
        `)
        .eq('client_id', user.id)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: false });

      if (error) throw error;

      const allBookings = data || [];
      setBookings(allBookings);

      // Calculate stats
      const completedBookings = allBookings.filter(b => b.status === 'completed');
      const pendingBookings = allBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

      const totalSpent = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const pendingAmount = pendingBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const totalHours = allBookings.reduce((sum, b) => sum + (b.duration_hours || 0), 0);
      const avgPerVisit = allBookings.length > 0 ? totalSpent / completedBookings.length : 0;

      setStats({
        totalSpent,
        pendingAmount,
        totalHours,
        avgPerVisit: isNaN(avgPerVisit) ? 0 : avgPerVisit,
      });

    } catch (error: any) {
      toast({
        title: "Error loading payments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Service', 'Carer', 'Hours', 'Amount', 'Status'].join(','),
      ...bookings.map(b => [
        b.start_date,
        b.service_type || 'Care Service',
        b.carer?.full_name || 'N/A',
        b.duration_hours,
        b.total_price,
        b.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();

    toast({
      title: "Export successful",
      description: `Exported ${bookings.length} transactions.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>;
      case "pending":
      case "confirmed":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Payments & Billing</h1>
          <p className="text-sm text-muted-foreground font-medium">View your payment history and transaction details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl border-black/5 bg-white shadow-sm text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30days" className="text-xs">Last 30 days</SelectItem>
              <SelectItem value="6months" className="text-xs">Last 6 months</SelectItem>
              <SelectItem value="year" className="text-xs">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-10 px-4 rounded-xl border-black/5 bg-white shadow-sm text-xs font-bold"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2 text-muted-foreground" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-black/5 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Spent</p>
              <p className="text-xl font-bold tracking-tight">£{stats.totalSpent.toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <PoundSterling className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-black/5 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending</p>
              <p className="text-xl font-bold tracking-tight">£{stats.pendingAmount.toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-black/5 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Care Hours</p>
              <p className="text-xl font-bold tracking-tight">{stats.totalHours} hrs</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-black/5 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg. Visit</p>
              <p className="text-xl font-bold tracking-tight">£{stats.avgPerVisit.toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold tracking-tight">Transaction History</h3>
          <TabsList className="bg-slate-100/80 p-1 rounded-xl h-10 border border-black/5">
            <TabsTrigger value="all" className="h-8 px-4 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
              All ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="h-8 px-4 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="h-8 px-4 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
              Paid ({completedBookings.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-2">
          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              {bookings.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions found</p>
                  <p className="text-sm">Your payment history will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center shadow-sm">
                          <PoundSterling className={`h-4 w-4 ${booking.status === 'completed' ? 'text-primary' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground leading-snug">
                            Care visit - {booking.carer?.full_name || 'Carer'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                              {booking.service_type || 'Care Service'}
                            </span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                              {booking.duration_hours}h
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right min-w-[80px]">
                          <p className="text-[14px] font-bold text-foreground">£{booking.total_price?.toFixed(2)}</p>
                          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter leading-none">
                            {booking.start_time ? format(new Date(booking.start_time), 'dd MMM') : 'N/A'}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-2">
          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              {pendingBookings.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending payments</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground leading-snug">
                            Care visit - {booking.carer?.full_name || 'Carer'}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                            {booking.start_time ? format(new Date(booking.start_time), 'dd MMM yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-foreground">£{booking.total_price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-2">
          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              {completedBookings.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed payments</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {completedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground leading-snug">
                            Care visit - {booking.carer?.full_name || 'Carer'}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                            {booking.start_time ? format(new Date(booking.start_time), 'dd MMM yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-emerald-600">£{booking.total_price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
