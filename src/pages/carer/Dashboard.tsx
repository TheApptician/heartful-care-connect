import DashboardLayout from "@/components/layouts/DashboardLayout";
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
import { Link } from "react-router-dom";

const navItems = [
  { name: "Dashboard", href: "/carer/dashboard", icon: LayoutDashboard },
  { name: "Availability", href: "/carer/availability", icon: Calendar },
  { name: "Bookings", href: "/carer/bookings", icon: Clock, badge: 2 },
  { name: "Messages", href: "/carer/messages", icon: MessageSquare, badge: 5 },
  { name: "Earnings", href: "/carer/earnings", icon: Wallet },
  { name: "Documents", href: "/carer/documents", icon: FileText },
  { name: "Profile", href: "/carer/profile", icon: User },
  { name: "Settings", href: "/carer/settings", icon: Settings },
];

const upcomingVisits = [
  {
    id: 1,
    client: "Mrs. Thompson",
    address: "23 Oak Street, London",
    date: "Today, 2:00 PM",
    duration: "3 hours",
    type: "Personal Care",
    rate: "£22/hr",
  },
  {
    id: 2,
    client: "Mr. Williams",
    address: "45 Rose Gardens, London",
    date: "Today, 6:00 PM",
    duration: "2 hours",
    type: "Companionship",
    rate: "£18/hr",
  },
  {
    id: 3,
    client: "Mrs. Chen",
    address: "12 Maple Avenue, London",
    date: "Tomorrow, 9:00 AM",
    duration: "4 hours",
    type: "Dementia Care",
    rate: "£25/hr",
  },
];

const pendingRequests = [
  {
    id: 1,
    client: "New Client",
    date: "Sat, 10:00 AM",
    duration: "3 hours",
    type: "Personal Care",
    rate: "£22/hr",
  },
  {
    id: 2,
    client: "Mrs. Roberts",
    date: "Sun, 2:00 PM",
    duration: "2 hours",
    type: "Medication Support",
    rate: "£20/hr",
  },
];

const CarerDashboard = () => {
  const profileCompletion = 85;
  const documentsValid = 4;
  const documentsTotal = 5;

  return (
    <DashboardLayout
      navItems={navItems}
      userRole="carer"
      userName="Sarah Johnson"
      userEmail="sarah.johnson@example.com"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Good afternoon, Sarah</h1>
            <p className="text-muted-foreground">You have 2 visits scheduled today</p>
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

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">£847.50</p>
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
                  <p className="text-2xl font-bold text-foreground">32</p>
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
                  <p className="text-2xl font-bold text-foreground">4.9</p>
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
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Active clients</p>
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
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your upcoming visits</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/carer/bookings">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{visit.client}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {visit.address}
                            </p>
                          </div>
                          <Badge variant="secondary">{visit.rate}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{visit.date}</span>
                          <span>•</span>
                          <span>{visit.duration}</span>
                          <span>•</span>
                          <span>{visit.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Booking Requests</CardTitle>
                  <CardDescription>Awaiting your response</CardDescription>
                </div>
                <Badge variant="warning">{pendingRequests.length} pending</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">{request.client}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.date} • {request.duration} • {request.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground mr-2">
                          {request.rate}
                        </span>
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                        <Button size="sm">Accept</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to appear higher in search results
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/carer/profile">
                      Complete Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Document Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm">DBS Certificate</span>
                    </div>
                    <Badge variant="success">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm">Right to Work</span>
                    </div>
                    <Badge variant="success">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm">ID Verification</span>
                    </div>
                    <Badge variant="success">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <span className="text-sm">Training Certificate</span>
                    </div>
                    <Badge variant="warning">Expiring</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm">References</span>
                    </div>
                    <Badge variant="success">Valid</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/carer/documents">
                    Manage Documents
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Earned</span>
                    <span className="font-semibold">£3,247.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hours Worked</span>
                    <span className="font-semibold">142 hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Visits Completed</span>
                    <span className="font-semibold">47</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/carer/earnings">
                    View Details
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

export default CarerDashboard;
