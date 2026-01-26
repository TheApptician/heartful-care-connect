// Enhanced Admin Verifications Page (PRD v2.3.2 Compliant)
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Shield,
    CreditCard,
    FileCheck,
    ShieldCheck,
    AlertCircle,
    Eye,
    Users,
    Mail,
    Phone,
    Briefcase,
    Calendar,
} from "lucide-react";
import { isDocumentExpired, isDocumentExpiringSoon } from "@/lib/compliance";

interface VerificationQueueItem {
    carer_id: string;
    carer_name: string;
    carer_email: string;
    user_role: string;
    verification: any;
    referrals: any[];
    submitted_at: string;
}

export default function AdminVerificationsEnhanced() {
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState<VerificationQueueItem[]>([]);
    const [selectedCarer, setSelectedCarer] = useState<VerificationQueueItem | null>(null);
    const [reviewDialog, setReviewDialog] = useState(false);
    const [reviewType, setReviewType] = useState<'dbs' | 'id' | 'rtw' | 'insurance' | null>(null);
    const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchVerificationQueue();
    }, []);

    const fetchVerificationQueue = async () => {
        try {
            setLoading(true);

            // Fetch all unverified users (not just carers with carer_verification records)
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, role, verified, created_at')
                .eq('verified', false)
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            const queueItems: VerificationQueueItem[] = [];

            for (const profile of profiles || []) {
                // Try to fetch verification data if exists (for carers)
                let verification = null;
                let referrals: any[] = [];

                if (profile.role === 'carer') {
                    const { data: verificationData } = await supabase
                        .from('carer_verification')
                        .select('*')
                        .eq('id', profile.id)
                        .single();
                    verification = verificationData;

                    // Fetch referrals for carers
                    const { data: referralsData } = await supabase
                        .from('carer_referrals')
                        .select('*')
                        .eq('carer_id', profile.id);
                    referrals = referralsData || [];
                }

                // Add all unverified users to the queue
                queueItems.push({
                    carer_id: profile.id,
                    carer_name: profile.full_name || 'Unknown User',
                    carer_email: '',
                    user_role: profile.role || 'user',
                    verification: verification || {
                        dbs_status: 'pending',
                        id_status: 'pending',
                        rtw_status: 'pending',
                        insurance_status: 'pending',
                    },
                    referrals,
                    submitted_at: profile.created_at || new Date().toISOString(),
                });
            }

            setQueue(queueItems);
        } catch (error: any) {
            console.error('Error fetching verification queue:', error);
            toast({
                title: 'Error',
                description: 'Failed to load verification queue',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReviewDocument = (carer: VerificationQueueItem, docType: 'dbs' | 'id' | 'rtw' | 'insurance', action: 'approve' | 'reject') => {
        setSelectedCarer(carer);
        setReviewType(docType);
        setReviewAction(action);
        setReviewDialog(true);
    };

    const submitReview = async () => {
        if (!selectedCarer || !reviewType || !reviewAction) return;

        setProcessing(true);

        try {
            const newStatus = reviewAction === 'approve' ? 'verified' : 'rejected';

            // Update document status
            const updateData: any = {
                [`${reviewType}_status`]: newStatus,
            };

            // If approving, check if all documents are now verified
            if (reviewAction === 'approve') {
                const verification = selectedCarer.verification;
                const allVerified =
                    (reviewType === 'dbs' ? true : verification.dbs_status === 'verified') &&
                    (reviewType === 'id' ? true : verification.id_status === 'verified') &&
                    (reviewType === 'rtw' ? true : verification.rtw_status === 'verified') &&
                    (reviewType === 'insurance' ? true : verification.insurance_status === 'verified');

                if (allVerified) {
                    updateData.overall_status = 'verified';
                    updateData.last_vetted_at = new Date().toISOString();
                }
            }

            const { error } = await supabase
                .from('carer_verification')
                .update(updateData)
                .eq('id', selectedCarer.carer_id);

            if (error) throw error;

            toast({
                title: reviewAction === 'approve' ? 'Document Approved' : 'Document Rejected',
                description: `${reviewType.toUpperCase()} document has been ${reviewAction}d`,
            });

            // Refresh queue
            await fetchVerificationQueue();

            // Close dialog
            setReviewDialog(false);
            setReviewNotes('');
            setSelectedCarer(null);
            setReviewType(null);
            setReviewAction(null);
        } catch (error: any) {
            console.error('Error submitting review:', error);
            toast({
                title: 'Error',
                description: 'Failed to submit review',
                variant: 'destructive',
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleReferralReview = async (referralId: string, action: 'approve' | 'reject') => {
        try {
            const newStatus = action === 'approve' ? 'verified' : 'rejected';

            const { error } = await supabase
                .from('carer_referrals')
                .update({
                    status: newStatus,
                    verification_date: new Date().toISOString(),
                })
                .eq('id', referralId);

            if (error) throw error;

            toast({
                title: action === 'approve' ? 'Referral Approved' : 'Referral Rejected',
                description: `Referral has been ${action}d`,
            });

            await fetchVerificationQueue();
        } catch (error: any) {
            console.error('Error reviewing referral:', error);
            toast({
                title: 'Error',
                description: 'Failed to review referral',
                variant: 'destructive',
            });
        }
    };

    // Direct user verification - sets profiles.verified = true
    const handleVerifyUser = async (userId: string, userName: string) => {
        try {
            setProcessing(true);

            const { error } = await supabase
                .from('profiles')
                .update({ verified: true })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: 'User Verified',
                description: `${userName} has been verified successfully.`,
            });

            await fetchVerificationQueue();
        } catch (error: any) {
            console.error('Error verifying user:', error);
            toast({
                title: 'Error',
                description: 'Failed to verify user',
                variant: 'destructive',
            });
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-[#1a9e8c]"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
            case "pending":
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case "rejected":
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="outline">Not Uploaded</Badge>;
        }
    };

    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'dbs': return Shield;
            case 'id': return CreditCard;
            case 'rtw': return FileCheck;
            case 'insurance': return ShieldCheck;
            default: return FileText;
        }
    };

    const getDocumentLabel = (type: string) => {
        switch (type) {
            case 'dbs': return 'Enhanced DBS';
            case 'id': return 'ID/Passport';
            case 'rtw': return 'Right to Work';
            case 'insurance': return 'Public Liability Insurance';
            default: return type;
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading verification queue...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8 max-w-7xl mx-auto py-4">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Control Center</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#111827] tracking-tight">Verification Queue</h1>
                    <p className="text-slate-500 font-medium">Review and approve carer documents and referrals (PRD v2.3.2)</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Pending Reviews</CardDescription>
                            <CardTitle className="text-3xl font-black">{queue.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Documents Pending</CardDescription>
                            <CardTitle className="text-3xl font-black">
                                {queue.reduce((acc, item) => {
                                    return acc +
                                        (item.verification.dbs_status === 'pending' ? 1 : 0) +
                                        (item.verification.id_status === 'pending' ? 1 : 0) +
                                        (item.verification.rtw_status === 'pending' ? 1 : 0) +
                                        (item.verification.insurance_status === 'pending' ? 1 : 0);
                                }, 0)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Referrals Pending</CardDescription>
                            <CardTitle className="text-3xl font-black">
                                {queue.reduce((acc, item) => {
                                    return acc + item.referrals.filter(r => r.status === 'pending').length;
                                }, 0)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Expiring Soon</CardDescription>
                            <CardTitle className="text-3xl font-black text-amber-600">
                                {queue.reduce((acc, item) => {
                                    const v = item.verification;
                                    return acc +
                                        (isDocumentExpiringSoon(v.dbs_expiry) ? 1 : 0) +
                                        (isDocumentExpiringSoon(v.rtw_expiry) ? 1 : 0) +
                                        (isDocumentExpiringSoon(v.insurance_expiry) ? 1 : 0);
                                }, 0)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Queue */}
                {queue.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CheckCircle className="h-12 w-12 text-[#1a9e8c] mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
                            <p className="text-slate-500">No pending verifications at the moment.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {queue.map((item) => (
                            <Card key={item.carer_id} className="overflow-hidden">
                                <CardHeader className="bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{item.carer_name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="capitalize">{item.user_role}</Badge>
                                                <Badge variant="outline">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Joined {new Date(item.submitted_at).toLocaleDateString()}
                                                </Badge>
                                            </CardDescription>
                                        </div>
                                        <Button
                                            className="bg-[#1a9e8c] hover:bg-[#158a7a]"
                                            onClick={() => handleVerifyUser(item.carer_id, item.carer_name)}
                                            disabled={processing}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {processing ? 'Verifying...' : 'Verify User'}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <Tabs defaultValue="documents">
                                        <TabsList>
                                            <TabsTrigger value="documents">Documents</TabsTrigger>
                                            <TabsTrigger value="referrals">
                                                Referrals
                                                {item.referrals.filter(r => r.status === 'pending').length > 0 && (
                                                    <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                                        {item.referrals.filter(r => r.status === 'pending').length}
                                                    </Badge>
                                                )}
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="documents" className="space-y-4 mt-4">
                                            {(['dbs', 'id', 'rtw', 'insurance'] as const).map((docType) => {
                                                const Icon = getDocumentIcon(docType);
                                                const status = item.verification[`${docType}_status`];
                                                const documentUrl = item.verification[`${docType}_document_url`];
                                                const expiryDate = item.verification[`${docType}_expiry`];

                                                if (!documentUrl) return null;

                                                return (
                                                    <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                                <Icon className="h-6 w-6 text-slate-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">{getDocumentLabel(docType)}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {getStatusBadge(status)}
                                                                    {expiryDate && (
                                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            Expires: {new Date(expiryDate).toLocaleDateString()}
                                                                            {isDocumentExpired(expiryDate) && (
                                                                                <Badge variant="destructive" className="ml-1">EXPIRED</Badge>
                                                                            )}
                                                                            {isDocumentExpiringSoon(expiryDate) && !isDocumentExpired(expiryDate) && (
                                                                                <Badge variant="outline" className="ml-1 border-amber-500 text-amber-600">Soon</Badge>
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => window.open(documentUrl, '_blank')}
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                            {status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-[#1a9e8c]"
                                                                        onClick={() => handleReviewDocument(item, docType, 'approve')}
                                                                    >
                                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleReviewDocument(item, docType, 'reject')}
                                                                    >
                                                                        <XCircle className="h-4 w-4 mr-1" />
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </TabsContent>

                                        <TabsContent value="referrals" className="space-y-4 mt-4">
                                            {item.referrals.length === 0 ? (
                                                <Alert>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>No referrals submitted yet</AlertDescription>
                                                </Alert>
                                            ) : (
                                                item.referrals.map((referral, index) => (
                                                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                                <Users className="h-6 w-6 text-slate-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">Referral {index + 1}: {referral.referee_name}</p>
                                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <Mail className="h-3 w-3" />
                                                                        {referral.referee_email}
                                                                    </span>
                                                                    {referral.referee_phone && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Phone className="h-3 w-3" />
                                                                            {referral.referee_phone}
                                                                        </span>
                                                                    )}
                                                                    <span className="flex items-center gap-1">
                                                                        <Briefcase className="h-3 w-3" />
                                                                        {referral.relationship}
                                                                    </span>
                                                                </div>
                                                                <div className="mt-2">
                                                                    {getStatusBadge(referral.status)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {referral.status === 'pending' && (
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-[#1a9e8c]"
                                                                    onClick={() => handleReferralReview(referral.id, 'approve')}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleReferralReview(referral.id, 'reject')}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Review Dialog */}
                <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {reviewAction === 'approve' ? 'Approve' : 'Reject'} {reviewType?.toUpperCase()} Document
                            </DialogTitle>
                            <DialogDescription>
                                {reviewAction === 'approve'
                                    ? 'Confirm that this document meets all verification requirements.'
                                    : 'Please provide a reason for rejection.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder={reviewAction === 'reject' ? 'Reason for rejection...' : 'Any additional notes...'}
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setReviewDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={submitReview}
                                disabled={processing}
                                className={reviewAction === 'approve' ? 'bg-[#1a9e8c]' : ''}
                                variant={reviewAction === 'reject' ? 'destructive' : 'default'}
                            >
                                {processing ? 'Processing...' : `Confirm ${reviewAction === 'approve' ? 'Approval' : 'Rejection'}`}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
