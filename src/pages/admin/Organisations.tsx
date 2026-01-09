import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  MoreVertical,
  Mail,
  Phone,
  Building2,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Star,
  PoundSterling,
  Calendar,
  TrendingUp
} from "lucide-react";

const organisations = [
  {
    id: 1,
    name: "ABC Care Services",
    email: "admin@abccare.co.uk",
    phone: "+44 161 123 4567",
    logo: "/placeholder.svg",
    type: "Care Agency",
    location: "Manchester, M1",
    status: "active",
    verified: true,
    subscription: "Professional",
    staffCount: 45,
    activeBookings: 128,
    monthlyRevenue: 52000,
    joinedDate: "2024-01-10",
    complianceScore: 98
  },
  {
    id: 2,
    name: "Manchester City Council",
    email: "care@manchester.gov.uk",
    phone: "+44 161 234 5678",
    logo: "/placeholder.svg",
    type: "Council",
    location: "Manchester, M2",
    status: "active",
    verified: true,
    subscription: "Enterprise",
    staffCount: 120,
    activeBookings: 350,
    monthlyRevenue: 156000,
    joinedDate: "2023-06-15",
    complianceScore: 100
  },
  {
    id: 3,
    name: "Sunrise Care Home",
    email: "info@sunrisecare.co.uk",
    phone: "+44 161 345 6789",
    logo: "/placeholder.svg",
    type: "Care Home",
    location: "Salford, M5",
    status: "active",
    verified: true,
    subscription: "Starter",
    staffCount: 18,
    activeBookings: 45,
    monthlyRevenue: 18500,
    joinedDate: "2025-03-20",
    complianceScore: 85
  },
  {
    id: 4,
    name: "HealthFirst Clinic",
    email: "admin@healthfirst.co.uk",
    phone: "+44 161 456 7890",
    logo: "/placeholder.svg",
    type: "Clinic",
    location: "Stockport, SK1",
    status: "pending",
    verified: false,
    subscription: "Starter",
    staffCount: 8,
    activeBookings: 0,
    monthlyRevenue: 0,
    joinedDate: "2026-01-05",
    complianceScore: 0
  },
  {
    id: 5,
    name: "Golden Years Agency",
    email: "contact@goldenyears.co.uk",
    phone: "+44 161 567 8901",
    logo: "/placeholder.svg",
    type: "Care Agency",
    location: "Trafford, M16",
    status: "suspended",
    verified: true,
    subscription: "Professional",
    staffCount: 32,
    activeBookings: 0,
    monthlyRevenue: 0,
    joinedDate: "2024-08-10",
    complianceScore: 45
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case "suspended":
      return <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" />Suspended</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getSubscriptionBadge = (plan: string) => {
  switch (plan) {
    case "Enterprise":
      return <Badge className="bg-purple-500">Enterprise</Badge>;
    case "Professional":
      return <Badge className="bg-blue-500">Professional</Badge>;
    case "Starter":
      return <Badge variant="outline">Starter</Badge>;
    default:
      return <Badge variant="outline">{plan}</Badge>;
  }
};

export default function AdminOrganisations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState<typeof organisations[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredOrgs = organisations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || org.type === typeFilter;
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: organisations.length,
    active: organisations.filter(o => o.status === 'active').length,
    totalStaff: organisations.reduce((sum, o) => sum + o.staffCount, 0),
    totalRevenue: organisations.reduce((sum, o) => sum + o.monthlyRevenue, 0),
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Organisation Management</h1>
            <p className="text-muted-foreground">Manage B2B partners and their subscriptions</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Organisations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalStaff}</p>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <PoundSterling className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">£{(stats.totalRevenue / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search organisations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Care Agency">Care Agency</SelectItem>
                  <SelectItem value="Council">Council</SelectItem>
                  <SelectItem value="Care Home">Care Home</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Organisations Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={org.logo} />
                          <AvatarFallback>{org.name.split(' ').map(n => n[0]).join('').slice(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {org.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{org.type}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(org.status)}</TableCell>
                    <TableCell>{getSubscriptionBadge(org.subscription)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {org.staffCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={org.complianceScore} 
                          className={`w-16 h-2 ${
                            org.complianceScore >= 90 ? '[&>div]:bg-emerald-500' :
                            org.complianceScore >= 70 ? '[&>div]:bg-amber-500' :
                            '[&>div]:bg-red-500'
                          }`}
                        />
                        <span className="text-sm">{org.complianceScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">£{org.monthlyRevenue.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => {
                          setSelectedOrg(org);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Organisation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              View Staff
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {org.status === 'active' ? (
                              <DropdownMenuItem className="text-amber-600">
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            ) : org.status === 'suspended' ? (
                              <DropdownMenuItem className="text-emerald-600">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Reactivate
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Organisation Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Organisation Details</DialogTitle>
              <DialogDescription>View and manage organisation information</DialogDescription>
            </DialogHeader>
            {selectedOrg && (
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedOrg.logo} />
                    <AvatarFallback className="text-2xl">{selectedOrg.name.split(' ').map(n => n[0]).join('').slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{selectedOrg.name}</h3>
                      {getStatusBadge(selectedOrg.status)}
                      {getSubscriptionBadge(selectedOrg.subscription)}
                    </div>
                    <p className="text-muted-foreground mt-1">{selectedOrg.type}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {selectedOrg.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {selectedOrg.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {selectedOrg.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Joined {new Date(selectedOrg.joinedDate).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-bold">{selectedOrg.staffCount}</p>
                      <p className="text-sm text-muted-foreground">Staff Members</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-bold">{selectedOrg.activeBookings}</p>
                      <p className="text-sm text-muted-foreground">Active Bookings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-bold">£{selectedOrg.monthlyRevenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-bold">{selectedOrg.complianceScore}%</p>
                      <p className="text-sm text-muted-foreground">Compliance Score</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              <Button>Edit Organisation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
