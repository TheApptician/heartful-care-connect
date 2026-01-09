import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  FileText, 
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Eye,
  RefreshCw,
  Filter,
  Users,
  FileCheck,
  AlertCircle
} from "lucide-react";

const staffCompliance = [
  {
    id: 1,
    name: "Sarah Khan",
    avatar: "/placeholder.svg",
    role: "Senior Carer",
    overallStatus: "compliant",
    documents: [
      { type: "DBS Certificate", status: "valid", expiry: "2028-08-20" },
      { type: "Right to Work", status: "valid", expiry: "2027-06-15" },
      { type: "ID Verification", status: "valid", expiry: null },
      { type: "First Aid Certificate", status: "valid", expiry: "2026-08-01" },
      { type: "Training Certificate", status: "valid", expiry: null },
    ]
  },
  {
    id: 2,
    name: "James O'Brien",
    avatar: "/placeholder.svg",
    role: "Carer",
    overallStatus: "compliant",
    documents: [
      { type: "DBS Certificate", status: "valid", expiry: "2027-05-15" },
      { type: "Right to Work", status: "valid", expiry: null },
      { type: "ID Verification", status: "valid", expiry: null },
      { type: "First Aid Certificate", status: "expiring", expiry: "2026-02-28" },
      { type: "Training Certificate", status: "valid", expiry: null },
    ]
  },
  {
    id: 3,
    name: "Priya Patel",
    avatar: "/placeholder.svg",
    role: "Senior Carer",
    overallStatus: "compliant",
    documents: [
      { type: "DBS Certificate", status: "valid", expiry: "2027-11-30" },
      { type: "Right to Work", status: "valid", expiry: "2028-03-20" },
      { type: "ID Verification", status: "valid", expiry: null },
      { type: "First Aid Certificate", status: "valid", expiry: "2027-01-15" },
      { type: "Training Certificate", status: "valid", expiry: null },
    ]
  },
  {
    id: 4,
    name: "Michael Johnson",
    avatar: "/placeholder.svg",
    role: "Carer",
    overallStatus: "pending",
    documents: [
      { type: "DBS Certificate", status: "pending", expiry: null },
      { type: "Right to Work", status: "valid", expiry: null },
      { type: "ID Verification", status: "valid", expiry: null },
      { type: "First Aid Certificate", status: "missing", expiry: null },
      { type: "Training Certificate", status: "pending", expiry: null },
    ]
  },
  {
    id: 5,
    name: "Emma Williams",
    avatar: "/placeholder.svg",
    role: "Carer",
    overallStatus: "action-required",
    documents: [
      { type: "DBS Certificate", status: "expiring", expiry: "2026-03-20" },
      { type: "Right to Work", status: "valid", expiry: null },
      { type: "ID Verification", status: "valid", expiry: null },
      { type: "First Aid Certificate", status: "expired", expiry: "2025-12-15" },
      { type: "Training Certificate", status: "valid", expiry: null },
    ]
  },
];

const documentTypes = [
  "DBS Certificate",
  "Right to Work",
  "ID Verification",
  "First Aid Certificate",
  "Training Certificate",
  "Insurance",
  "References"
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "valid":
      return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Valid</Badge>;
    case "expiring":
      return <Badge variant="outline" className="border-amber-500 text-amber-500"><Clock className="h-3 w-3 mr-1" />Expiring Soon</Badge>;
    case "expired":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Expired</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case "missing":
      return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Missing</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getOverallStatusBadge = (status: string) => {
  switch (status) {
    case "compliant":
      return <Badge className="bg-emerald-500">Compliant</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending Review</Badge>;
    case "action-required":
      return <Badge variant="destructive">Action Required</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function OrganisationCompliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const compliantCount = staffCompliance.filter(s => s.overallStatus === 'compliant').length;
  const pendingCount = staffCompliance.filter(s => s.overallStatus === 'pending').length;
  const actionRequiredCount = staffCompliance.filter(s => s.overallStatus === 'action-required').length;
  const complianceRate = Math.round((compliantCount / staffCompliance.length) * 100);

  const filteredStaff = staffCompliance.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || staff.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="organisation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Compliance Vault</h1>
            <p className="text-muted-foreground">Monitor staff compliance and document status</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Compliance Check
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{complianceRate}%</p>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
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
                  <p className="text-2xl font-bold">{compliantCount}</p>
                  <p className="text-sm text-muted-foreground">Fully Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{actionRequiredCount}</p>
                  <p className="text-sm text-muted-foreground">Action Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Compliance Progress</CardTitle>
            <CardDescription>Team compliance status across all document types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentTypes.slice(0, 5).map((docType) => {
                const total = staffCompliance.length;
                const valid = staffCompliance.filter(s => 
                  s.documents.find(d => d.type === docType && d.status === 'valid')
                ).length;
                const percentage = Math.round((valid / total) * 100);
                
                return (
                  <div key={docType} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{docType}</span>
                      <span className="text-muted-foreground">{valid}/{total} staff ({percentage}%)</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${percentage === 100 ? '[&>div]:bg-emerald-500' : percentage >= 80 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search staff..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="action-required">Action Required</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Compliance Table */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Staff Overview</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="missing">Missing Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {filteredStaff.map((staff) => (
                    <div key={staff.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{staff.name}</p>
                            <p className="text-sm text-muted-foreground">{staff.role}</p>
                          </div>
                        </div>
                        {getOverallStatusBadge(staff.overallStatus)}
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {staff.documents.map((doc, i) => (
                          <div 
                            key={i} 
                            className={`p-3 rounded-lg border ${
                              doc.status === 'expired' || doc.status === 'missing' ? 'border-red-500/50 bg-red-500/5' :
                              doc.status === 'expiring' ? 'border-amber-500/50 bg-amber-500/5' :
                              doc.status === 'pending' ? 'border-muted' :
                              'border-emerald-500/50 bg-emerald-500/5'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium truncate">{doc.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              {getStatusBadge(doc.status)}
                              {doc.expiry && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(doc.expiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Documents
                        </Button>
                        <Button size="sm" variant="outline">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiring" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-5 w-5" />
                  Documents Expiring Soon
                </CardTitle>
                <CardDescription>Documents expiring within the next 60 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffCompliance.flatMap(staff => 
                      staff.documents
                        .filter(d => d.status === 'expiring' && d.expiry)
                        .map(doc => ({
                          staff,
                          doc,
                          daysLeft: Math.ceil((new Date(doc.expiry!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        }))
                    ).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item.staff.avatar} />
                              <AvatarFallback>{item.staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{item.staff.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.doc.type}</TableCell>
                        <TableCell>
                          {new Date(item.doc.expiry!).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            {item.daysLeft} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">Request Renewal</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Missing Documents
                </CardTitle>
                <CardDescription>Staff members with missing or expired documents</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffCompliance.flatMap(staff => 
                      staff.documents
                        .filter(d => d.status === 'missing' || d.status === 'expired')
                        .map(doc => ({ staff, doc }))
                    ).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item.staff.avatar} />
                              <AvatarFallback>{item.staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{item.staff.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.doc.type}</TableCell>
                        <TableCell>{getStatusBadge(item.doc.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive">Request Upload</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
