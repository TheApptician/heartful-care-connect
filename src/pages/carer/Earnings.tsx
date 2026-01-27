import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PoundSterling,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Download,
  CreditCard,
  Wallet,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface Booking {
  id: string;
  start_time: string;
  duration_hours: number;
  total_price: number;
  status: string;
  service_type: string;
  client?: {
    full_name: string;
  };
}

export default function CarerEarnings() {
  const [period, setPeriod] = useState("30days");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableBalance: 0,
    monthlyEarnings: 0,
    monthlyHours: 0,
    avgHourlyRate: 0,
    totalCompleted: 0,
  });
  const [calcRate, setCalcRate] = useState(25);
  const [calcHours, setCalcHours] = useState(20);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEarningsData();
  }, [period]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Calculate date range based on period
      let startDate = new Date();
      if (period === "7days") {
        startDate = subDays(new Date(), 7);
      } else if (period === "30days") {
        startDate = subDays(new Date(), 30);
      } else if (period === "6months") {
        startDate = subMonths(new Date(), 6);
      } else if (period === "year") {
        startDate = subMonths(new Date(), 12);
      }

      // Fetch completed bookings
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name)
        `)
        .eq('carer_id', user.id)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: false });

      if (error) throw error;

      const allBookings = bookingsData || [];
      const completedBookings = allBookings.filter(b => b.status === 'completed');

      setBookings(allBookings);

      // Calculate this month's stats
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());

      const thisMonthBookings = completedBookings.filter(b => {
        if (!b.start_time) return false;
        const bookingDate = new Date(b.start_time);
        return bookingDate >= monthStart && bookingDate <= monthEnd;
      });

      const monthlyEarnings = thisMonthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const monthlyHours = thisMonthBookings.reduce((sum, b) => sum + (b.duration_hours || 0), 0);

      // Calculate available balance (pending payouts from completed bookings)
      const pendingBookings = allBookings.filter(b => b.status === 'completed');
      const availableBalance = pendingBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

      const avgHourlyRate = monthlyHours > 0 ? monthlyEarnings / monthlyHours : 0;

      setStats({
        availableBalance,
        monthlyEarnings,
        monthlyHours,
        avgHourlyRate,
        totalCompleted: completedBookings.length,
      });

    } catch (error: any) {
      toast({
        title: "Error loading earnings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Client', 'Service', 'Hours', 'Amount', 'Status'].join(','),
      ...bookings.map(b => [
        b.start_date,
        b.client?.full_name || 'N/A',
        b.service_type || 'Care Service',
        b.duration_hours,
        b.total_price,
        b.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();

    toast({
      title: "Export successful",
      description: `Exported ${bookings.length} transactions.`,
    });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground">Track your income and payment history</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">£{stats.availableBalance.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">£{stats.monthlyEarnings.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-500">{completedBookings.length} completed</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours This Month</p>
                <p className="text-2xl font-bold">{stats.monthlyHours}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Hourly Rate</p>
                <p className="text-2xl font-bold">£{stats.avgHourlyRate.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <PoundSterling className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Transactions */}
      <Tabs defaultValue="completed">
        <TabsList>
          <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Upcoming ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Bookings</CardTitle>
              <CardDescription>Earnings from completed care sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {completedBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <PoundSterling className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed bookings yet</p>
                  <p className="text-sm">Complete bookings to start earning</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <PoundSterling className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.client?.full_name || 'Client'}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.service_type || 'Care Service'} • {booking.duration_hours}h
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{booking.total_price?.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.start_time ? format(new Date(booking.start_time), 'dd MMM yyyy') : 'N/A'}
                        </p>
                      </div>
                      <Badge variant="default" className="bg-emerald-500">
                        Paid
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Future earnings from confirmed bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming bookings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.client?.full_name || 'Client'}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.service_type || 'Care Service'} • {booking.duration_hours}h
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{booking.total_price?.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.start_time ? format(new Date(booking.start_time), 'dd MMM yyyy') : 'N/A'}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Calculator</CardTitle>
              <CardDescription>Estimate your potential income based on your rate and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Hourly Rate (£)</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={calcRate}
                        onChange={(e) => setCalcRate(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Hours per Week</Label>
                      <span className="text-muted-foreground font-medium">{calcHours}h</span>
                    </div>
                    <Slider
                      value={[calcHours]}
                      onValueChange={(vals) => setCalcHours(vals[0])}
                      max={80}
                      step={1}
                      className="py-4"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-muted/50 p-6 rounded-xl">
                  <h3 className="font-semibold text-lg">Potential Earnings</h3>

                  <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                    <span className="text-muted-foreground">Weekly</span>
                    <span className="font-bold text-xl">£{(calcRate * calcHours).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                    <span className="text-muted-foreground">Monthly</span>
                    <span className="font-bold text-xl">£{(calcRate * calcHours * 4).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                    <span className="text-muted-foreground">Yearly</span>
                    <span className="font-bold text-xl text-primary">£{(calcRate * calcHours * 52).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
