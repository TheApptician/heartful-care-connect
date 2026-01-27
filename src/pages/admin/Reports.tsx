import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Download,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalCarers: 0,
    verifiedCarers: 0,
    completedBookings: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch carers
      const { count: totalCarers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'carer');

      // Fetch verified carers
      const { count: verifiedCarers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'carer')
        .eq('verified', true);

      // Fetch bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Fetch completed bookings
      const { count: completedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Calculate revenue
      const { data: completedBookingsData } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'completed');

      const totalRevenue = completedBookingsData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalBookings: totalBookings || 0,
        totalRevenue,
        totalCarers: totalCarers || 0,
        verifiedCarers: verifiedCarers || 0,
        completedBookings: completedBookings || 0,
      });
    } catch (error: any) {
      toast({
        title: "Error loading report data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      let csv = "";
      let filename = "";

      if (reportType === "overview") {
        csv = [
          ['Metric', 'Value'].join(','),
          ['Total Users', stats.totalUsers].join(','),
          ['Total Carers', stats.totalCarers].join(','),
          ['Verified Carers', stats.verifiedCarers].join(','),
          ['Total Bookings', stats.totalBookings].join(','),
          ['Completed Bookings', stats.completedBookings].join(','),
          ['Total Revenue', `£${stats.totalRevenue}`].join(','),
          ['Platform Revenue (10%)', `£${(stats.totalRevenue * 0.1).toFixed(2)}`].join(','),
        ].join('\n');
        filename = `overview-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      } else if (reportType === "users") {
        const { data: users } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        csv = [
          ['Email', 'Name', 'Role', 'Verified', 'Created At'].join(','),
          ...(users || []).map(user => [
            user.email,
            `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.full_name || '',
            user.role,
            user.verified ? 'Yes' : 'No',
            format(new Date(user.created_at), 'yyyy-MM-dd')
          ].join(','))
        ].join('\n');
        filename = `users-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      } else if (reportType === "bookings") {
        const { data: bookings } = await supabase
          .from('bookings')
          .select(`
                        *,
                        client:profiles!bookings_client_id_fkey(full_name, email),
                        carer:profiles!bookings_carer_id_fkey(full_name, email)
                    `)
          .order('created_at', { ascending: false });

        csv = [
          ['ID', 'Client', 'Carer', 'Date', 'Time', 'Duration', 'Amount', 'Status'].join(','),
          ...(bookings || []).map(booking => [
            booking.id.slice(0, 8),
            booking.client?.full_name || 'Unknown',
            booking.carer?.full_name || 'Unknown',
            booking.start_time ? format(new Date(booking.start_time), 'yyyy-MM-dd') : 'N/A',
            booking.start_time ? format(new Date(booking.start_time), 'HH:mm') : 'N/A',
            `${booking.duration_hours}h`,
            `£${booking.total_price}`,
            booking.status
          ].join(','))
        ].join('\n');
        filename = `bookings-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      } else if (reportType === "revenue") {
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        csv = [
          ['Date', 'Booking ID', 'Amount', 'Platform Fee (10%)'].join(','),
          ...(bookings || []).map(booking => [
            booking.start_time ? format(new Date(booking.start_time), 'yyyy-MM-dd') : 'N/A',
            booking.id.slice(0, 8),
            `£${booking.total_price}`,
            `£${(booking.total_price * 0.1).toFixed(2)}`
          ].join(','))
        ].join('\n');
        filename = `revenue-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      }

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      toast({
        title: "Report exported",
        description: `${reportType} report has been downloaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error exporting report",
        description: error.message,
        variant: "destructive",
      });
    }
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
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="users">Users Report</SelectItem>
              <SelectItem value="bookings">Bookings Report</SelectItem>
              <SelectItem value="revenue">Revenue Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Carers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCarers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.verifiedCarers} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completedBookings} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From completed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Platform Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{(stats.totalRevenue * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">10% commission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-red-500" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalBookings > 0
                ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Booking success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Description */}
      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
          <CardDescription>
            {reportType === "overview" && "Complete platform overview with key metrics"}
            {reportType === "users" && "Detailed user list with registration dates and verification status"}
            {reportType === "bookings" && "Complete booking history with client and carer details"}
            {reportType === "revenue" && "Revenue breakdown from completed bookings"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click "Export Report" to download the selected report as a CSV file.
            The report will include all relevant data based on your selection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
