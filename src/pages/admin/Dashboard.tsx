import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Settings,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  ArrowRight,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Verifications", href: "/admin/verifications", icon: UserCheck, badge: 12 },
  { name: "Disputes", href: "/admin/disputes", icon: AlertTriangle, badge: 3 },
  { name: "Organisations", href: "/admin/organisations", icon: Building2 },
  { name: "Compliance", href: "/admin/compliance", icon: FileCheck },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const pendingVerifications = [
  {
    id: 1,
    name: "James Wilson",
    email: "james.wilson@email.com",
    type: "carer",
    submitted: "2 hours ago",
    documents: ["DBS", "ID", "Right to Work"],
    status: "pending",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    type: "carer",
    submitted: "5 hours ago",
    documents: ["DBS", "ID", "References"],
    status: "pending",
  },
  {
    id: 3,
    name: "HomeFirst Care Ltd",
    email: "admin@homefirst.co.uk",
    type: "organisation",
    submitted: "1 day ago",
    documents: ["CQC Registration", "Insurance", "Company Docs"],
    status: "pending",
  },
];

const recentDisputes = [
  {
    id: 1,
    title: "Late cancellation dispute",
    client: "Sarah Thompson",
    carer: "Michael Brown",
    amount: "£45.00",
    status: "open",
    created: "3 hours ago",
  },
  {
    id: 2,
    title: "Service quality complaint",
    client: "David Chen",
    carer: "Emma Williams",
    amount: "£120.00",
    status: "investigating",
    created: "1 day ago",
  },
  {
    id: 3,
    title: "Payment not received",
    client: "N/A",
    carer: "Priya Sharma",
    amount: "£280.00",
    status: "resolved",
    created: "3 days ago",
  },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout
      navItems={navItems}
      userRole="admin"
      userName="Super Admin"
      userEmail="admin@heemscare.com"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12,847</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8,234</p>
                  <p className="text-sm text-muted-foreground">Verified Carers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Pending Verifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-sm text-muted-foreground">Organisations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Metrics */}
        <div className="grid lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">£847,234</p>
              <p className="text-xs text-success">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Bookings Today</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">1,247</p>
              <p className="text-xs text-success">+8.3% from yesterday</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Rating</span>
                <span className="text-warning">★</span>
              </div>
              <p className="text-2xl font-bold text-foreground">4.87</p>
              <p className="text-xs text-muted-foreground">Based on 45,230 reviews</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Platform Fee</span>
                <span className="text-sm font-medium">12%</span>
              </div>
              <p className="text-2xl font-bold text-foreground">£101,668</p>
              <p className="text-xs text-muted-foreground">This month's earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending Verifications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Verifications</CardTitle>
                  <CardDescription>Users awaiting document review</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/verifications">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <Badge variant={user.type === "carer" ? "default" : "secondary"}>
                              {user.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Submitted: {user.submitted}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/admin/verifications/${user.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disputes */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Open Disputes</CardTitle>
                  <CardDescription>Requiring attention</CardDescription>
                </div>
                <Badge variant="warning">3</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDisputes.map((dispute) => (
                    <div key={dispute.id} className="p-3 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm text-foreground">{dispute.title}</p>
                        <Badge
                          variant={
                            dispute.status === "open"
                              ? "destructive"
                              : dispute.status === "investigating"
                              ? "warning"
                              : "success"
                          }
                        >
                          {dispute.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dispute.client !== "N/A" && `Client: ${dispute.client} • `}
                        Carer: {dispute.carer}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold">{dispute.amount}</span>
                        <span className="text-xs text-muted-foreground">{dispute.created}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/admin/disputes">
                    View All Disputes
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Uptime</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm font-medium">99.99%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">142ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <span className="text-sm font-medium">3,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium text-success">0.02%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
