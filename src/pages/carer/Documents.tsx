import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Shield,
  GraduationCap,
  CreditCard,
  FileCheck,
  Calendar,
  RefreshCw
} from "lucide-react";

const documentCategories = [
  { id: "identity", name: "Identity Documents", icon: CreditCard, required: true },
  { id: "dbs", name: "DBS Certificate", icon: Shield, required: true },
  { id: "right-to-work", name: "Right to Work", icon: FileCheck, required: true },
  { id: "qualifications", name: "Qualifications & Training", icon: GraduationCap, required: false },
  { id: "references", name: "References", icon: FileText, required: true },
  { id: "insurance", name: "Insurance", icon: Shield, required: false },
];

const documents = [
  { 
    id: 1, 
    name: "Passport", 
    category: "identity", 
    status: "verified", 
    uploadedAt: "2025-06-15", 
    expiresAt: "2030-06-15",
    fileName: "passport_scan.pdf"
  },
  { 
    id: 2, 
    name: "Enhanced DBS Certificate", 
    category: "dbs", 
    status: "verified", 
    uploadedAt: "2025-08-20", 
    expiresAt: "2028-08-20",
    fileName: "dbs_certificate.pdf"
  },
  { 
    id: 3, 
    name: "UK Visa", 
    category: "right-to-work", 
    status: "pending", 
    uploadedAt: "2026-01-05", 
    expiresAt: "2027-01-05",
    fileName: "visa_document.pdf"
  },
  { 
    id: 4, 
    name: "NVQ Level 3 Certificate", 
    category: "qualifications", 
    status: "verified", 
    uploadedAt: "2024-03-10", 
    expiresAt: null,
    fileName: "nvq_certificate.pdf"
  },
  { 
    id: 5, 
    name: "First Aid Training", 
    category: "qualifications", 
    status: "expiring", 
    uploadedAt: "2024-02-15", 
    expiresAt: "2026-02-15",
    fileName: "first_aid_cert.pdf"
  },
  { 
    id: 6, 
    name: "Professional Reference - ABC Care", 
    category: "references", 
    status: "verified", 
    uploadedAt: "2025-05-20", 
    expiresAt: null,
    fileName: "reference_abc.pdf"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
    case "expiring":
      return <Badge variant="outline" className="border-amber-500 text-amber-500"><AlertCircle className="h-3 w-3 mr-1" />Expiring Soon</Badge>;
    case "expired":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Expired</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function CarerDocuments() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const verifiedCount = documents.filter(d => d.status === "verified").length;
  const totalRequired = documentCategories.filter(c => c.required).length;
  const completionPercentage = Math.round((verifiedCount / documents.length) * 100);

  return (
    <DashboardLayout role="carer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents & Compliance</h1>
            <p className="text-muted-foreground">Manage your verification documents</p>
          </div>
          <Dialog open={isUploading} onOpenChange={setIsUploading}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document for verification
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Document Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Document Name</Label>
                  <Input placeholder="e.g., Passport, DBS Certificate" />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (if applicable)</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploading(false)}>Cancel</Button>
                <Button onClick={() => setIsUploading(false)}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Verification Status Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Verification Status</h3>
                  <p className="text-muted-foreground">
                    {verifiedCount} of {documents.length} documents verified
                  </p>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Compliance Progress</span>
                  <span className="text-sm font-bold">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
              <Badge className="bg-emerald-500 text-lg py-2 px-4">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Active Carer
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Document Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentCategories.map((category) => {
            const categoryDocs = documents.filter(d => d.category === category.id);
            const hasVerified = categoryDocs.some(d => d.status === "verified");
            const Icon = category.icon;
            
            return (
              <Card key={category.id} className={hasVerified ? "border-emerald-500/50" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        hasVerified ? "bg-emerald-500/10" : "bg-muted"
                      }`}>
                        <Icon className={`h-5 w-5 ${hasVerified ? "text-emerald-500" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <CardDescription>
                          {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                    </div>
                    {category.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {categoryDocs.length > 0 ? (
                    <div className="space-y-2">
                      {categoryDocs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between text-sm">
                          <span className="truncate">{doc.name}</span>
                          {getStatusBadge(doc.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                      setSelectedCategory(category.id);
                      setIsUploading(true);
                    }}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* All Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>Complete list of your uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                    </div>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-sm text-muted-foreground">Uploaded</p>
                    <p className="text-sm font-medium">
                      {new Date(doc.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="text-sm font-medium">
                      {doc.expiresAt ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(doc.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    {doc.status === "expiring" && (
                      <Button size="icon" variant="ghost" className="text-amber-500">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Documents Alert */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Documents Expiring Soon
            </CardTitle>
            <CardDescription>Please renew these documents before they expire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.filter(d => d.status === "expiring").map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires on {new Date(doc.expiresAt!).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
