import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  PoundSterling,
  Building2,
  Shield,
  Clock,
  Star,
  Activity,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const platformGrowth = [
  { month: "Jul", users: 850, carers: 120, bookings: 450 },
  { month: "Aug", users: 1020, carers: 145, bookings: 580 },
  { month: "Sep", users: 1250, carers: 175, bookings: 720 },
  { month: "Oct", users: 1480, carers: 210, bookings: 890 },
  { month: "Nov", users: 1750, carers: 248, bookings: 1050 },
  { month: "Dec", users: 2100, carers: 295, bookings: 1280 },
  { month: "Jan", users: 2350, carers: 320, bookings: 1420 },
];

const revenueData = [
  { month: "Jul", b2c: 45000, b2b: 28000, total: 73000 },
  { month: "Aug", b2c: 52000, b2b: 32000, total: 84000 },
  { month: "Sep", b2c: 58000, b2b: 38000, total: 96000 },
  { month: "Oct", b2c: 65000, b2b: 42000, total: 107000 },
  { month: "Nov", b2c: 72000, b2b: 48000, total: 120000 },
  { month: "Dec", b2c: 85000, b2b: 55000, total: 140000 },
  { month: "Jan", b2c: 78000, b2b: 52000, total: 130000 },
];

const bookingsByRegion = [
  { name: "Manchester", value: 35 },
  { name: "London", value: 28 },
  { name: "Birmingham", value: 18 },
  { name: "Leeds", value: 12 },
  { name: "Other", value: 7 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(173, 58%, 39%)', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const careTypeDistribution = [
  { type: "Personal Care", bookings: 520, revenue: 42000 },
  { type: "Companionship", bookings: 380, revenue: 28000 },
  { type: "Dementia Care", bookings: 245, revenue: 32000 },
  { type: "Palliative Care", bookings: 120, revenue: 18000 },
  { type: "Other", bookings: 155, revenue: 10000 },
];

const kpis = [
  { 
    label: "Total Revenue (MTD)", 
    value: "£130,000", 
    change: "+12.5%", 
    trend: "up",
    icon: PoundSterling
  },
  { 
    label: "Active Users", 
    value: "2,350", 
    change: "+8.2%", 
    trend: "up",
    icon: Users
  },
  { 
    label: "Verified Carers", 
    value: "320", 
    change: "+15.1%", 
    trend: "up",
    icon: Shield
  },
  { 
    label: "Bookings (MTD)", 
    value: "1,420", 
    change: "+10.9%", 
    trend: "up",
    icon: Calendar
  },
  { 
    label: "Avg. Booking Value", 
    value: "£92", 
    change: "+3.4%", 
    trend: "up",
    icon: TrendingUp
  },
  { 
    label: "Avg. Response Time", 
    value: "2.3 hrs", 
    change: "-15.2%", 
    trend: "up",
    icon: Clock
  },
  { 
    label: "Client Satisfaction", 
    value: "4.8/5", 
    change: "+0.1", 
    trend: "up",
    icon: Star
  },
  { 
    label: "Platform Uptime", 
    value: "99.9%", 
    change: "0%", 
    trend: "neutral",
    icon: Activity
  },
];

const systemAlerts = [
  { id: 1, type: "warning", message: "3 carers have documents expiring this week", time: "2 hours ago" },
  { id: 2, type: "info", message: "New organisation registration pending approval", time: "5 hours ago" },
  { id: 3, type: "error", message: "Failed payment for booking #12847", time: "1 day ago" },
  { id: 4, type: "warning", message: "High dispute rate detected in Manchester region", time: "2 days ago" },
];

export default function AdminReports() {
  const [period, setPeriod] = useState("6months");

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Reports</h1>
            <p className="text-muted-foreground">Platform analytics and performance metrics</p>
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
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.slice(0, 4).map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        ) : kpi.trend === 'down' ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : null}
                        <span className={`text-sm ${
                          kpi.trend === 'up' ? 'text-emerald-500' : 
                          kpi.trend === 'down' ? 'text-red-500' : 
                          'text-muted-foreground'
                        }`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.slice(4).map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        ) : null}
                        <span className="text-sm text-emerald-500">{kpi.change}</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="growth">
          <TabsList>
            <TabsTrigger value="growth">Platform Growth</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Platform Growth Trends
                </CardTitle>
                <CardDescription>User registrations, verified carers, and bookings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={platformGrowth}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Users" />
                      <Line type="monotone" dataKey="carers" stroke="hsl(var(--secondary))" strokeWidth={2} name="Verified Carers" />
                      <Line type="monotone" dataKey="bookings" stroke="hsl(173, 58%, 39%)" strokeWidth={2} name="Bookings" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PoundSterling className="h-5 w-5 text-primary" />
                    Revenue Breakdown
                  </CardTitle>
                  <CardDescription>B2C vs B2B revenue streams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="b2cGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="b2bGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => `£${value / 1000}k`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="b2c" 
                          stackId="1"
                          stroke="hsl(var(--primary))" 
                          fill="url(#b2cGradient)" 
                          name="B2C Revenue"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="b2b" 
                          stackId="1"
                          stroke="hsl(var(--secondary))" 
                          fill="url(#b2bGradient)" 
                          name="B2B Revenue"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Bookings by Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bookingsByRegion}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {bookingsByRegion.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {bookingsByRegion.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Care Type</CardTitle>
                <CardDescription>Distribution of bookings and revenue by care type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={careTypeDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="type" type="category" className="text-xs" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  System Alerts
                </CardTitle>
                <CardDescription>Recent system notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        alert.type === 'error' ? 'border-red-500/50 bg-red-500/5' :
                        alert.type === 'warning' ? 'border-amber-500/50 bg-amber-500/5' :
                        'border-blue-500/50 bg-blue-500/5'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        alert.type === 'error' ? 'bg-red-500/10' :
                        alert.type === 'warning' ? 'bg-amber-500/10' :
                        'bg-blue-500/10'
                      }`}>
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.type === 'error' ? 'text-red-500' :
                          alert.type === 'warning' ? 'text-amber-500' :
                          'text-blue-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.time}</p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Reports */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Financial Report</p>
                      <p className="text-sm text-muted-foreground">Monthly P&L statement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold">Compliance Report</p>
                      <p className="text-sm text-muted-foreground">Carer verification status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Audit Log</p>
                      <p className="text-sm text-muted-foreground">System activity log</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
