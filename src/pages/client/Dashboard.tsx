import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Search,
  Calendar,
  MessageSquare,
  CreditCard,
  FileText,
  Users,
  Settings,
  Clock,
  Star,
  MapPin,
  ArrowRight,
  Plus,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "Find Carers", href: "/client/search", icon: Search },
  { name: "Bookings", href: "/client/bookings", icon: Calendar, badge: 2 },
  { name: "Messages", href: "/client/messages", icon: MessageSquare, badge: 3 },
  { name: "Care Plans", href: "/client/care-plans", icon: FileText },
  { name: "Care Recipients", href: "/client/recipients", icon: Users },
  { name: "Payments", href: "/client/payments", icon: CreditCard },
  { name: "Settings", href: "/client/settings", icon: Settings },
];

const upcomingBookings = [
  {
    id: 1,
    carer: "Sarah Johnson",
    date: "Today, 2:00 PM",
    duration: "3 hours",
    type: "Personal Care",
    status: "confirmed",
    avatar: "SJ",
  },
  {
    id: 2,
    carer: "Michael Chen",
    date: "Tomorrow, 10:00 AM",
    duration: "4 hours",
    type: "Companionship",
    status: "confirmed",
    avatar: "MC",
  },
  {
    id: 3,
    carer: "Emma Williams",
    date: "Fri, 9:00 AM",
    duration: "2 hours",
    type: "Medication Support",
    status: "pending",
    avatar: "EW",
  },
];

const recentCarers = [
  { id: 1, name: "Sarah Johnson", rating: 4.9, reviews: 127, speciality: "Dementia Care", avatar: "SJ" },
  { id: 2, name: "Michael Chen", rating: 4.8, reviews: 89, speciality: "Personal Care", avatar: "MC" },
  { id: 3, name: "Emma Williams", rating: 5.0, reviews: 56, speciality: "Palliative Care", avatar: "EW" },
];

const ClientDashboard = () => {
  return (
    <DashboardLayout
      navItems={navItems}
      userRole="client"
      userName="John Doe"
      userEmail="john.doe@example.com"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, John</h1>
            <p className="text-muted-foreground">Here's what's happening with your care today</p>
          </div>
          <Button asChild>
            <Link to="/client/search">
              <Search className="w-4 h-4 mr-2" />
              Find a Carer
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Upcoming bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <p className="text-sm text-muted-foreground">Hours this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <p className="text-sm text-muted-foreground">Favourite carers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Unread messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <CardDescription>Your scheduled care visits</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/client/bookings">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                        {booking.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{booking.carer}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} • {booking.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={booking.status === "confirmed" ? "success" : "pending"}>
                          {booking.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{booking.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Carers */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Carers</CardTitle>
                  <CardDescription>Recently booked</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCarers.map((carer) => (
                    <div
                      key={carer.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-semibold">
                        {carer.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{carer.name}</p>
                        <p className="text-xs text-muted-foreground">{carer.speciality}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span className="font-medium">{carer.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/client/search">
                    <Search className="w-4 h-4 mr-2" />
                    Find new carer
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/client/bookings/new">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a visit
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/client/care-plans">
                    <FileText className="w-4 h-4 mr-2" />
                    Update care plan
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

export default ClientDashboard;
