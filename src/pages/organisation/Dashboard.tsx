import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  BarChart3,
  CreditCard,
  Settings,
  Building2,
  UserPlus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Dashboard", href: "/organisation/dashboard", icon: LayoutDashboard },
  { name: "Staff", href: "/organisation/staff", icon: Users },
  { name: "Jobs", href: "/organisation/jobs", icon: Briefcase, badge: 3 },
  { name: "Compliance", href: "/organisation/compliance", icon: FileCheck },
  { name: "Reports", href: "/organisation/reports", icon: BarChart3 },
  { name: "Billing", href: "/organisation/billing", icon: CreditCard },
  { name: "Organisation", href: "/organisation/profile", icon: Building2 },
  { name: "Settings", href: "/organisation/settings", icon: Settings },
];

const recentActivity = [
  {
    id: 1,
    type: "new_staff",
    message: "Emma Williams accepted job invitation",
    time: "2 hours ago",
    icon: UserPlus,
    color: "success",
  },
  {
    id: 2,
    type: "compliance",
    message: "3 staff members have expiring DBS certificates",
    time: "5 hours ago",
    icon: AlertTriangle,
    color: "warning",
  },
  {
    id: 3,
    type: "shift",
    message: "All shifts for tomorrow have been filled",
    time: "1 day ago",
    icon: CheckCircle2,
    color: "success",
  },
  {
    id: 4,
    type: "billing",
    message: "Monthly invoice generated: £2,847.00",
    time: "2 days ago",
    icon: CreditCard,
    color: "primary",
  },
];

const openShifts = [
  {
    id: 1,
    role: "Healthcare Assistant",
    location: "Ward 4, St Mary's",
    date: "Tomorrow, 7:00 AM",
    duration: "12 hours",
    rate: "£18/hr",
    applicants: 3,
  },
  {
    id: 2,
    role: "Registered Nurse",
    location: "ICU, Royal Hospital",
    date: "Sat, 8:00 PM",
    duration: "8 hours",
    rate: "£28/hr",
    applicants: 1,
  },
  {
    id: 3,
    role: "Care Assistant",
    location: "Sunrise Care Home",
    date: "Sun, 6:00 AM",
    duration: "10 hours",
    rate: "£15/hr",
    applicants: 0,
  },
];

const OrganisationDashboard = () => {
  return (
    <DashboardLayout
      navItems={navItems}
      userRole="organisation"
      userName="ABC Care Services"
      userEmail="admin@abccare.co.uk"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Organisation Dashboard</h1>
            <p className="text-muted-foreground">Manage your workforce and compliance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/organisation/staff/invite">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Staff
              </Link>
            </Button>
            <Button asChild>
              <Link to="/organisation/jobs/new">
                <Briefcase className="w-4 h-4 mr-2" />
                Post Job
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
                  <p className="text-2xl font-bold text-foreground">47</p>
                  <p className="text-sm text-muted-foreground">Active Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">94%</p>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Open Shifts</p>
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
                  <p className="text-2xl font-bold text-foreground">£24.5k</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Open Shifts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Open Shifts</CardTitle>
                  <CardDescription>Shifts needing coverage</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/organisation/jobs">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {openShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{shift.role}</p>
                          <p className="text-sm text-muted-foreground">{shift.location}</p>
                          <p className="text-sm text-muted-foreground">
                            {shift.date} • {shift.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{shift.rate}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {shift.applicants} applicants
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>Staff document status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-sm">Valid Documents</span>
                    </div>
                    <span className="font-semibold">44 staff</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 rounded-lg bg-success/10">
                      <p className="text-lg font-bold text-success">44</p>
                      <p className="text-xs text-muted-foreground">Compliant</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-warning/10">
                      <p className="text-lg font-bold text-warning">2</p>
                      <p className="text-xs text-muted-foreground">Expiring Soon</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-destructive/10">
                      <p className="text-lg font-bold text-destructive">1</p>
                      <p className="text-xs text-muted-foreground">Expired</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/organisation/compliance">
                    View Compliance Vault
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription */}
            <Card className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
              <CardContent className="p-6">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 mb-4">
                  Professional Plan
                </Badge>
                <p className="text-3xl font-bold mb-1">£108</p>
                <p className="text-primary-foreground/70 text-sm mb-4">/month</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>50 staff profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Unlimited job posting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Full compliance vault</span>
                  </div>
                </div>
                <Button variant="hero" size="sm" className="w-full mt-4" asChild>
                  <Link to="/organisation/billing">
                    Manage Subscription
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-${activity.color}/10 flex items-center justify-center shrink-0`}>
                        <activity.icon className={`w-4 h-4 text-${activity.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/organisation/jobs/new">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Post new shift
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/organisation/staff/invite">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite staff member
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/organisation/reports">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate report
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
