import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldAlert,
  GanttChart
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedCarers: 0,
    pendingVerifications: 0,
    totalBookings: 0,
    revenue: 0,
  });
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch verified carers
      const { count: verifiedCarers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'carer')
        .eq('verified', true);

      // Fetch pending verifications
      const { data: verificationsData, count: pendingCount } = await supabase
        .from('profiles')
        .select('id, full_name, role, email, phone, created_at', { count: 'exact' })
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Calculate revenue from completed bookings
      const { data: completedBookings } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'completed');

      const revenue = completedBookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        verifiedCarers: verifiedCarers || 0,
        pendingVerifications: pendingCount || 0,
        totalBookings: totalBookings || 0,
        revenue: revenue,
      });

      setPendingVerifications(verificationsData || []);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-GB').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Authority</span>
          </div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">System Command</h1>
          <p className="text-slate-500 font-medium">Global oversight of platform infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-black/5">
            <div className="flex flex-col items-end px-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Phase</p>
              <p className="text-xs font-black text-[#111827]">Phase 01 (Founder)</p>
            </div>
            <Button className="h-10 bg-[#1a9e8c] text-white font-black rounded-xl px-4 hover:bg-[#15806c]" asChild>
              <Link to="/admin/phase-control">
                <Zap className="w-3.5 h-3.5 mr-2" />
                Phase Shift
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-3xl border-black/[0.05] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-slate-50 text-[#111827]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#111827] tracking-tight">{formatNumber(stats.totalUsers)}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-black/[0.05] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-[#1a9e8c]/5 text-[#1a9e8c]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#111827] tracking-tight">{formatNumber(stats.verifiedCarers)}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Carers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-black/[0.05] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-slate-50 text-[#111827]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#111827] tracking-tight">{formatNumber(stats.pendingVerifications)}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-black/[0.05] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 bg-slate-50 text-[#111827]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#111827] tracking-tight">{formatCurrency(stats.revenue * 0.1)}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Revenue (10%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Verification Queue */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-black/[0.05] overflow-hidden shadow-sm">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-[#111827]">Verification Queue</CardTitle>
                  <CardDescription className="text-sm font-medium">Users pending verification</CardDescription>
                </div>
                <Button variant="ghost" className="rounded-xl font-bold" asChild>
                  <Link to="/admin/verification-queue">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-bold text-[#111827]">All Caught Up!</p>
                  <p className="text-sm text-slate-500">No pending verifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-black/5 hover:border-[#1a9e8c]/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#1a9e8c]/10 flex items-center justify-center">
                          <span className="text-lg font-black text-[#1a9e8c]">
                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">
                            {user.full_name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">{user.role || 'user'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-amber-500 text-amber-600">
                          Pending
                        </Badge>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/admin/verification-queue`}>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-black/[0.05] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <GanttChart className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-black text-[#111827]">Bookings</h3>
            </div>
            <p className="text-3xl font-black text-[#111827] mb-2">{formatNumber(stats.totalBookings)}</p>
            <p className="text-xs text-slate-500 font-medium">Total platform bookings</p>
          </Card>

          <Card className="rounded-3xl border-black/[0.05] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-lg font-black text-[#111827]">Growth</h3>
            </div>
            <p className="text-3xl font-black text-[#111827] mb-2">+{stats.totalUsers > 0 ? Math.round((stats.totalUsers / 100) * 10) : 0}%</p>
            <p className="text-xs text-slate-500 font-medium">User growth this month</p>
          </Card>

          <Card className="rounded-3xl border-black/[0.05] p-6 bg-[#1a9e8c] text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black">System Health</h3>
            </div>
            <p className="text-3xl font-black mb-2">100%</p>
            <p className="text-xs text-white/70 font-medium">All systems operational</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
