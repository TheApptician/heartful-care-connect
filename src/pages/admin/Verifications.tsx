import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Search,
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Sparkles
} from "lucide-react";

const verificationQueue = [
  {
    id: 1,
    carer: {
      name: "Michael Johnson",
      email: "michael.j@email.com",
      phone: "+44 7700 900321",
      avatar: "/placeholder.svg",
      location: "Manchester, M3",
      experience: "4 years",
      appliedDate: "2026-01-05"
    },
    documents: [
      { type: "DBS Certificate", status: "pending", uploadedAt: "2026-01-05", fileName: "dbs_cert.pdf" },
      { type: "Passport", status: "approved", uploadedAt: "2026-01-05", fileName: "passport.pdf" },
      { type: "Right to Work", status: "pending", uploadedAt: "2026-01-05", fileName: "visa.pdf" },
      { type: "First Aid Certificate", status: "pending", uploadedAt: "2026-01-06", fileName: "first_aid.pdf" },
      { type: "NVQ Certificate", status: "pending", uploadedAt: "2026-01-06", fileName: "nvq.pdf" },
    ],
    specialisms: ["Physical Disabilities", "Learning Disabilities"],
    status: "pending",
    priority: "normal"
  },
  {
    id: 2,
    carer: {
      name: "Lisa Chen",
      email: "lisa.chen@email.com",
      phone: "+44 7700 900555",
      avatar: "/placeholder.svg",
      location: "London, E1",
      experience: "6 years",
      appliedDate: "2026-01-03"
    },
    documents: [
      { type: "DBS Certificate", status: "approved", uploadedAt: "2026-01-03", fileName: "dbs_cert.pdf" },
      { type: "Passport", status: "approved", uploadedAt: "2026-01-03", fileName: "passport.pdf" },
      { type: "Right to Work", status: "approved", uploadedAt: "2026-01-03", fileName: "rtw.pdf" },
      { type: "First Aid Certificate", status: "pending", uploadedAt: "2026-01-04", fileName: "first_aid.pdf" },
      { type: "References", status: "pending", uploadedAt: "2026-01-04", fileName: "references.pdf" },
    ],
    specialisms: ["Dementia Care", "Palliative Care", "Elderly Care"],
    status: "in_review",
    priority: "high"
  },
  {
    id: 3,
    carer: {
      name: "Ahmed Hassan",
      email: "ahmed.h@email.com",
      phone: "+44 7700 900777",
      avatar: "/placeholder.svg",
      location: "Birmingham, B1",
      experience: "2 years",
      appliedDate: "2026-01-07"
    },
    documents: [
      { type: "DBS Certificate", status: "pending", uploadedAt: "2026-01-07", fileName: "dbs_cert.pdf" },
      { type: "Passport", status: "pending", uploadedAt: "2026-01-07", fileName: "passport.pdf" },
      { type: "Right to Work", status: "pending", uploadedAt: "2026-01-07", fileName: "visa.pdf" },
    ],
    specialisms: ["Personal Care", "Companionship"],
    status: "pending",
    priority: "normal"
  },
];

const recentlyProcessed = [
  {
    id: 4,
    carer: { name: "Sarah Khan", avatar: "/placeholder.svg" },
    status: "approved",
    processedAt: "2026-01-08",
    processedBy: "Admin"
  },
  {
    id: 5,
    carer: { name: "James O'Brien", avatar: "/placeholder.svg" },
    status: "approved",
    processedAt: "2026-01-07",
    processedBy: "Admin"
  },
  {
    id: 6,
    carer: { name: "David Lee", avatar: "/placeholder.svg" },
    status: "rejected",
    processedAt: "2026-01-06",
    processedBy: "Admin",
    reason: "Invalid DBS certificate"
  },
];

const getDocStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case "rejected":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function AdminVerifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<typeof verificationQueue[0] | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingCount = verificationQueue.filter(v => v.status === 'pending').length;
  const inReviewCount = verificationQueue.filter(v => v.status === 'in_review').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carer Verifications</h1>
          <p className="text-muted-foreground">Review and approve carer applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
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
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inReviewCount}</p>
                <p className="text-sm text-muted-foreground">In Review</p>
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
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Approved (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Rejected (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Verification Queue ({verificationQueue.length})</TabsTrigger>
          <TabsTrigger value="processed">Recently Processed</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4 mt-6">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Queue */}
          <div className="space-y-4">
            {verificationQueue.map((application) => (
              <Card key={application.id} className={application.priority === 'high' ? 'border-amber-500' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Carer Info */}
                    <div className="flex items-center gap-4 min-w-[250px]">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={application.carer.avatar} />
                        <AvatarFallback>{application.carer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{application.carer.name}</p>
                          {application.priority === 'high' && (
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Priority
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {application.carer.location}
                          <span>•</span>
                          {application.carer.experience} exp
                        </div>
                      </div>
                    </div>

                    {/* Documents Summary */}
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {application.documents.map((doc, i) => (
                          <Badge
                            key={i}
                            variant={doc.status === 'approved' ? 'default' : 'secondary'}
                            className={doc.status === 'approved' ? 'bg-emerald-500' : ''}
                          >
                            {doc.status === 'approved' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {doc.type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Applied Date & Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Applied</p>
                        <p className="font-medium">
                          {new Date(application.carer.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <Badge variant={application.status === 'in_review' ? 'default' : 'secondary'}>
                        {application.status === 'in_review' ? 'In Review' : 'Pending'}
                      </Badge>
                      <Button onClick={() => {
                        setSelectedApplication(application);
                        setIsReviewDialogOpen(true);
                      }}>
                        Review
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="processed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Processed Applications</CardTitle>
              <CardDescription>Applications processed in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyProcessed.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={item.carer.avatar} />
                        <AvatarFallback>{item.carer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{item.carer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Processed by {item.processedBy} on {new Date(item.processedAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                    <Badge className={item.status === 'approved' ? 'bg-emerald-500' : 'bg-destructive'}>
                      {item.status === 'approved' ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" />Approved</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" />Rejected</>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>Review documents and approve or reject this carer application</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Carer Profile */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={selectedApplication.carer.avatar} />
                      <AvatarFallback className="text-2xl">
                        {selectedApplication.carer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{selectedApplication.carer.name}</h3>
                        <div className="space-y-2 mt-3">
                          <p className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {selectedApplication.carer.email}
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {selectedApplication.carer.phone}
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {selectedApplication.carer.location}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Specialisms</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.specialisms.map(spec => (
                            <Badge key={spec} variant="outline">{spec}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">Experience</p>
                        <p className="font-medium">{selectedApplication.carer.experience}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis Section */}
              <Card className="border-indigo-100 bg-indigo-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <Sparkles className="h-5 w-5" />
                    AI Vetting Analysis
                  </CardTitle>
                  <CardDescription>Automated risk assessment and document validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-indigo-100">
                      <p className="text-sm font-medium text-slate-500 mb-1">DBS Check</p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        Clear
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Enhanced Disclosure verified. No warnings found.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-indigo-100">
                      <p className="text-sm font-medium text-slate-500 mb-1">Identity Match</p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        99.8% Match
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Passport photo matches selfie video.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-indigo-100">
                      <p className="text-sm font-medium text-slate-500 mb-1">Right to Work</p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Share code validated with Home Office API.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
                    <Shield className="h-4 w-4" />
                    <strong>AI Recommendation:</strong> Low Risk. Recommended for approval pending manual specific-document review.
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedApplication.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{doc.type}</p>
                              {doc.status === 'approved' && <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200"><Sparkles className="w-2 h-2 mr-1" /> AI Verified</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getDocStatusBadge(doc.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          {doc.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rejection Reason (if rejecting) */}
              <div className="space-y-2">
                <Label>Rejection Reason (if applicable)</Label>
                <Textarea
                  placeholder="Provide a reason if rejecting this application..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Carer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
