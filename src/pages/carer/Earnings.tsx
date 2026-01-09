import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PoundSterling, 
  TrendingUp, 
  Calendar, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CreditCard,
  Wallet,
  FileText
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const monthlyEarnings = [
  { month: "Aug", earnings: 2100, hours: 84 },
  { month: "Sep", earnings: 2450, hours: 98 },
  { month: "Oct", earnings: 2800, hours: 112 },
  { month: "Nov", earnings: 2650, hours: 106 },
  { month: "Dec", earnings: 3100, hours: 124 },
  { month: "Jan", earnings: 2950, hours: 118 },
];

const weeklyBreakdown = [
  { day: "Mon", hours: 8, earnings: 200 },
  { day: "Tue", hours: 7, earnings: 175 },
  { day: "Wed", hours: 6, earnings: 150 },
  { day: "Thu", hours: 8, earnings: 200 },
  { day: "Fri", hours: 5, earnings: 125 },
  { day: "Sat", hours: 0, earnings: 0 },
  { day: "Sun", hours: 0, earnings: 0 },
];

const earningsByType = [
  { name: "Personal Care", value: 45, color: "hsl(var(--primary))" },
  { name: "Companionship", value: 25, color: "hsl(var(--secondary))" },
  { name: "Medication Support", value: 20, color: "hsl(var(--accent))" },
  { name: "Other", value: 10, color: "hsl(var(--muted))" },
];

const recentTransactions = [
  { id: 1, date: "2026-01-08", client: "Margaret Wilson", type: "Personal Care", hours: 3, amount: 75, status: "completed" },
  { id: 2, date: "2026-01-07", client: "James Thompson", type: "Companionship", hours: 2, amount: 50, status: "completed" },
  { id: 3, date: "2026-01-06", client: "Patricia Brown", type: "Medication Support", hours: 4, amount: 100, status: "pending" },
  { id: 4, date: "2026-01-05", client: "Robert Davis", type: "Personal Care", hours: 3, amount: 75, status: "completed" },
  { id: 5, date: "2026-01-04", client: "Elizabeth Moore", type: "Companionship", hours: 2, amount: 50, status: "completed" },
];

const payouts = [
  { id: 1, date: "2026-01-01", amount: 1250, status: "completed", method: "Bank Transfer" },
  { id: 2, date: "2025-12-15", amount: 1180, status: "completed", method: "Bank Transfer" },
  { id: 3, date: "2025-12-01", amount: 1320, status: "completed", method: "Bank Transfer" },
];

export default function CarerEarnings() {
  const [period, setPeriod] = useState("6months");

  return (
    <DashboardLayout role="carer">
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
            <Button variant="outline">
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
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">£847.50</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Button className="w-full mt-4" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">£2,950</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-emerald-500">+12.5%</span>
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
                  <p className="text-2xl font-bold">118</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-emerald-500">+8 hrs</span>
                  </div>
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
                  <p className="text-2xl font-bold">£25.00</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowDownRight className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-500">-£0.50</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <PoundSterling className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Earnings Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your monthly earnings trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyEarnings}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `£${value}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`£${value}`, 'Earnings']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#earningsGradient)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Earnings by Type */}
          <Card>
            <CardHeader>
              <CardTitle>By Care Type</CardTitle>
              <CardDescription>Earnings distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={earningsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {earningsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {earningsByType.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Breakdown</CardTitle>
            <CardDescription>Hours worked and earnings per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" tickFormatter={(value) => `£${value}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Hours" />
                  <Bar yAxisId="right" dataKey="earnings" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Earnings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Transactions and Payouts */}
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <PoundSterling className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tx.client}</p>
                          <p className="text-sm text-muted-foreground">{tx.type} • {tx.hours} hours</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{tx.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div 
                      key={payout.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium">{payout.method}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payout.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">£{payout.amount.toFixed(2)}</p>
                      </div>
                      <Badge variant="default" className="bg-emerald-500">
                        {payout.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
