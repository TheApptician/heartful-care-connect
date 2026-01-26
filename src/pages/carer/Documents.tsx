import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  GraduationCap,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const documentTypes = [
  { id: "passport", name: "ID & Passport", icon: CreditCard, required: true },
  { id: "dbs", name: "Enhanced DBS", icon: Shield, required: true },
  { id: "right_to_work", name: "Right to Work", icon: FileCheck, required: true },
  { id: "insurance", name: "Public Liability Insurance", icon: ShieldCheck, required: true },
  { id: "references", name: "Work References", icon: Users, required: true },
  { id: "qualifications", name: "Care Training", icon: GraduationCap, required: false },
];

interface VerificationDoc {
  id: string;
  dbs_certificate_url: string | null;
  dbs_status: string;
  dbs_verified_at: string | null;
  identity_verified: boolean;
  right_to_work_verified: boolean;
  address_verified: boolean;
  reference_1_email: string | null;
  reference_1_status: string;
  reference_2_email: string | null;
  reference_2_status: string;
}

export default function CarerDocuments() {
  const [verification, setVerification] = useState<VerificationDoc | null>(null);
  const [carerDetails, setCarerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch carer verification data
      const { data: verificationData } = await supabase
        .from('carer_verification')
        .select('*')
        .eq('id', user.id)
        .single();

      setVerification(verificationData);

      // Fetch carer details
      const { data: carerData } = await supabase
        .from('carer_details')
        .select('*')
        .eq('id', user.id)
        .single();

      setCarerDetails(carerData);

    } catch (error: any) {
      toast({
        title: "Error loading documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      toast({
        title: "Missing information",
        description: "Please select both a document type and a file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${selectedType}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage - Correct Bucket is 'verification-documents'
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);

      // Update verification record based on document type
      if (selectedType === 'dbs') {
        await supabase
          .from('carer_verification')
          .upsert({
            id: user.id,
            dbs_certificate_url: publicUrl,
            dbs_status: 'pending',
          }, { onConflict: 'id' });
      }

      toast({
        title: "Document uploaded",
        description: "Your document has been submitted for review.",
      });

      setUploadDialogOpen(false);
      setSelectedFile(null);
      fetchDocuments();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getDocumentStatus = (type: string) => {
    if (!verification && !carerDetails) return 'missing';

    switch (type) {
      case 'passport':
        return verification?.identity_verified ? 'verified' : 'pending';
      case 'dbs':
        return verification?.dbs_status || 'missing';
      case 'right_to_work':
        return verification?.right_to_work_verified ? 'verified' :
          carerDetails?.has_right_to_work ? 'pending' : 'missing';
      case 'insurance':
        return carerDetails?.has_insurance ? 'verified' : 'missing';
      case 'references':
        if (verification?.reference_1_status === 'verified' && verification?.reference_2_status === 'verified') {
          return 'verified';
        } else if (verification?.reference_1_email || verification?.reference_2_email) {
          return 'pending';
        }
        return 'missing';
      default:
        return 'missing';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-[#1a9e8c]"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "missing":
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Required</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateProgress = () => {
    let verified = 0;
    let total = documentTypes.filter(d => d.required).length;

    documentTypes.filter(d => d.required).forEach(doc => {
      if (getDocumentStatus(doc.id) === 'verified') verified++;
    });

    return Math.round((verified / total) * 100);
  };

  if (loading) {
    return (
      <DashboardLayout role="carer">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const progress = calculateProgress();

  return (
    <DashboardLayout role="carer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents & Verification</h1>
            <p className="text-muted-foreground">Upload and manage your compliance documents</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
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
                  Select the document type and upload your file.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">Select type...</option>
                    {documentTypes.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>File</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadDialogOpen(false);
                    setSelectedFile(null);
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedType || !selectedFile || uploading}
                  className="bg-[#1a9e8c] hover:bg-[#1a9e8c]/90"
                >
                  {uploading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Save & Upload
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Verification Progress</h2>
                <p className="text-sm text-muted-foreground">
                  {progress === 100 ? 'All required documents verified!' : 'Complete your document verification to start working'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{progress}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Document Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.map((doc) => {
            const status = getDocumentStatus(doc.id);
            const Icon = doc.icon;

            return (
              <Card key={doc.id} className={`${status === 'verified' ? 'border-[#1a9e8c]/50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {getStatusBadge(status)}
                  </div>
                  <h3 className="font-semibold mb-1">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {doc.required ? 'Required document' : 'Optional document'}
                  </p>
                  {status === 'verified' && verification && (
                    <p className="text-xs text-muted-foreground">
                      Verified on {verification.dbs_verified_at ? format(new Date(verification.dbs_verified_at), 'dd MMM yyyy') : 'N/A'}
                    </p>
                  )}
                  {status === 'missing' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedType(doc.id);
                        setUploadDialogOpen(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                  {status === 'pending' && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Under review
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* DBS Details */}
        {verification?.dbs_certificate_url && (
          <Card>
            <CardHeader>
              <CardTitle>DBS Certificate</CardTitle>
              <CardDescription>Your enhanced DBS check details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enhanced DBS Certificate</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {verification.dbs_status || 'Pending'}
                  </p>
                </div>
                <a
                  href={verification.dbs_certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reference Status */}
        {(verification?.reference_1_email || verification?.reference_2_email) && (
          <Card>
            <CardHeader>
              <CardTitle>References</CardTitle>
              <CardDescription>Status of your work references</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verification?.reference_1_email && (
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Reference 1</p>
                      <p className="text-sm text-muted-foreground">{verification.reference_1_email}</p>
                    </div>
                    {getStatusBadge(verification.reference_1_status || 'pending')}
                  </div>
                )}
                {verification?.reference_2_email && (
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Reference 2</p>
                      <p className="text-sm text-muted-foreground">{verification.reference_2_email}</p>
                    </div>
                    {getStatusBadge(verification.reference_2_status || 'pending')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
