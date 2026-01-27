// Enhanced Carer Documents Page (PRD v2.3.2 Compliant)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUpload } from "@/components/verification/DocumentUpload";
import { ReferralForm } from "@/components/verification/ReferralForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    FileText,
    Shield,
    CreditCard,
    FileCheck,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Clock,
    Users,
    Zap,
    Calendar,
} from "lucide-react";
import { getVerificationBadges, isDocumentExpired, isDocumentExpiringSoon } from "@/lib/compliance";

export default function CarerDocuments() {
    const [loading, setLoading] = useState(true);
    const [verification, setVerification] = useState<any>(null);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            setUserId(user.id);

            // Fetch verification status
            const { data: verificationData, error: verificationError } = await supabase
                .from('carer_verification')
                .select('*')
                .eq('id', user.id)
                .single();

            if (verificationError && verificationError.code !== 'PGRST116') {
                console.error('Verification fetch error:', verificationError);
            } else {
                setVerification(verificationData);
            }

            // Fetch referrals
            const { data: referralsData, error: referralsError } = await supabase
                .from('carer_referrals')
                .select('*')
                .eq('carer_id', user.id)
                .order('created_at', { ascending: true });

            if (referralsError) {
                console.error('Referrals fetch error:', referralsError);
            } else {
                setReferrals(referralsData || []);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load verification data',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-[#1a9e8c] hover:bg-[#1a9e8c] text-[10px] font-black uppercase tracking-widest"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
            case "pending":
                return <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case "rejected":
                return <Badge variant="destructive" className="text-[10px] font-black uppercase tracking-widest"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">Not Uploaded</Badge>;
        }
    };

    const getReferralStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-[#1a9e8c]"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
            case "notified":
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Awaiting Response</Badge>;
            case "pending":
                return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case "rejected":
                return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const calculateCompletionPercentage = () => {
        if (!verification) return 0;

        const checks = [
            verification.dbs_status === 'verified',
            verification.id_status === 'verified',
            verification.rtw_status === 'verified',
            verification.insurance_status === 'verified',
            referrals.filter(r => r.status === 'verified').length >= 2,
        ];

        const completed = checks.filter(Boolean).length;
        return Math.round((completed / checks.length) * 100);
    };

    const isFullyVerified = () => {
        if (!verification) return false;
        return verification.overall_status === 'verified' &&
            referrals.filter(r => r.status === 'verified').length >= 2;
    };

    const getOverallStatusMessage = () => {
        if (!verification) {
            return {
                status: 'Not Started',
                message: 'Upload your documents to begin verification',
                color: 'text-slate-500',
            };
        }

        if (verification.overall_status === 'verified') {
            return {
                status: 'Verified & Visible',
                message: 'Your profile is visible in the marketplace',
                color: 'text-[#1a9e8c]',
            };
        }

        if (verification.overall_status === 'expired') {
            return {
                status: 'Expired',
                message: 'One or more documents have expired. Please renew.',
                color: 'text-red-500',
            };
        }

        if (verification.overall_status === 'pending') {
            return {
                status: 'Pending Review',
                message: 'Your documents are being reviewed by our team',
                color: 'text-amber-500',
            };
        }

        return {
            status: 'Incomplete',
            message: 'Complete all verification steps to appear in marketplace',
            color: 'text-slate-500',
        };
    };

    const completionPercentage = calculateCompletionPercentage();
    const statusInfo = getOverallStatusMessage();
    const badges = verification ? getVerificationBadges(verification) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading verification data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Infrastructure</span>
                </div>
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">Verification Center</h1>
                <p className="text-slate-500 font-medium">Manage your credentials and work referrals (PRD v2.3.2 Compliant)</p>
            </div>

            {/* Verification Status Card */}
            <div className="relative group p-10 rounded-[2.5rem] bg-[#111827] text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a9e8c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-3xl bg-[#1a9e8c] flex items-center justify-center shadow-2xl shadow-[#1a9e8c]/20">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight mb-2">Verification Status</h3>
                            <p className="text-slate-400 font-medium">
                                Your profile is currently <span className={`${statusInfo.color} font-black underline`}>{statusInfo.status}</span>.
                            </p>
                            <p className="text-sm text-slate-500 mt-1">{statusInfo.message}</p>
                        </div>
                    </div>

                    <div className="flex-1 max-w-sm">
                        <div className="flex items-end justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Completion Progress</span>
                            <span className="text-2xl font-black text-[#1a9e8c]">{completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#1a9e8c]/40 to-[#1a9e8c] transition-all duration-1000" style={{ width: `${completionPercentage}%` }} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Marketplace</p>
                            <p className="text-sm font-black text-white">{isFullyVerified() ? 'Visible' : 'Hidden'}</p>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                {badges.length > 0 && (
                    <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                        {badges.map((badge) => (
                            <Badge key={badge} className="bg-white/10 border-white/20 text-white">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {badge}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Compliance Warning */}
            <Alert className="border-amber-500 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900 font-medium">
                    <strong>PRD v2.3.2 Compliance:</strong> If Insurance, DBS, or Right to Work documents expire, your profile will be automatically hidden from the marketplace until renewed.
                </AlertDescription>
            </Alert>

            {/* Main Content Tabs */}
            <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="referrals">Work Referrals</TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* DBS Certificate */}
                        <div>
                            <DocumentUpload
                                carerId={userId!}
                                documentType="dbs"
                                requiresExpiry={true}
                                onUploadComplete={fetchUserData}
                            />
                            {verification?.dbs_document_url && (
                                <Card className="mt-4">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold">Current Status</p>
                                                {getStatusBadge(verification.dbs_status)}
                                                {verification.dbs_expiry && (
                                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Expires: {new Date(verification.dbs_expiry).toLocaleDateString()}
                                                        {isDocumentExpired(verification.dbs_expiry) && (
                                                            <Badge variant="destructive" className="ml-2">EXPIRED</Badge>
                                                        )}
                                                        {isDocumentExpiringSoon(verification.dbs_expiry) && !isDocumentExpired(verification.dbs_expiry) && (
                                                            <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600">Expiring Soon</Badge>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* ID/Passport */}
                        <div>
                            <DocumentUpload
                                carerId={userId!}
                                documentType="id"
                                requiresExpiry={false}
                                onUploadComplete={fetchUserData}
                            />
                            {verification?.id_document_url && (
                                <Card className="mt-4">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold">Current Status</p>
                                                {getStatusBadge(verification.id_status)}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right to Work */}
                        <div>
                            <DocumentUpload
                                carerId={userId!}
                                documentType="rtw"
                                requiresExpiry={true}
                                onUploadComplete={fetchUserData}
                            />
                            {verification?.rtw_document_url && (
                                <Card className="mt-4">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold">Current Status</p>
                                                {getStatusBadge(verification.rtw_status)}
                                                {verification.rtw_expiry && (
                                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Expires: {new Date(verification.rtw_expiry).toLocaleDateString()}
                                                        {isDocumentExpired(verification.rtw_expiry) && (
                                                            <Badge variant="destructive" className="ml-2">EXPIRED</Badge>
                                                        )}
                                                        {isDocumentExpiringSoon(verification.rtw_expiry) && !isDocumentExpired(verification.rtw_expiry) && (
                                                            <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600">Expiring Soon</Badge>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Public Liability Insurance */}
                        <div>
                            <DocumentUpload
                                carerId={userId!}
                                documentType="insurance"
                                requiresExpiry={true}
                                onUploadComplete={fetchUserData}
                            />
                            {verification?.insurance_document_url && (
                                <Card className="mt-4">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold">Current Status</p>
                                                {getStatusBadge(verification.insurance_status)}
                                                {verification.insurance_expiry && (
                                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Expires: {new Date(verification.insurance_expiry).toLocaleDateString()}
                                                        {isDocumentExpired(verification.insurance_expiry) && (
                                                            <Badge variant="destructive" className="ml-2">EXPIRED</Badge>
                                                        )}
                                                        {isDocumentExpiringSoon(verification.insurance_expiry) && !isDocumentExpired(verification.insurance_expiry) && (
                                                            <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600">Expiring Soon</Badge>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="referrals" className="space-y-6 mt-6">
                    <Alert>
                        <Users className="h-4 w-4" />
                        <AlertDescription>
                            <strong>2 Work Referrals Required:</strong> Provide contact details for two previous employers or supervisors who can verify your work history.
                        </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Referral 1 */}
                        {referrals.length < 1 ? (
                            <ReferralForm
                                carerId={userId!}
                                referralNumber={1}
                                onSubmitComplete={fetchUserData}
                            />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Work Referral 1
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Referee Name</p>
                                        <p className="text-base font-bold">{referrals[0].referee_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Email</p>
                                        <p className="text-base">{referrals[0].referee_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Relationship</p>
                                        <p className="text-base">{referrals[0].relationship}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Status</p>
                                        {getReferralStatusBadge(referrals[0].status)}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Referral 2 */}
                        {referrals.length < 2 ? (
                            <ReferralForm
                                carerId={userId!}
                                referralNumber={2}
                                onSubmitComplete={fetchUserData}
                            />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Work Referral 2
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Referee Name</p>
                                        <p className="text-base font-bold">{referrals[1].referee_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Email</p>
                                        <p className="text-base">{referrals[1].referee_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Relationship</p>
                                        <p className="text-base">{referrals[1].relationship}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Status</p>
                                        {getReferralStatusBadge(referrals[1].status)}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {referrals.length >= 2 && (
                        <Alert className="border-green-500 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                <strong>Referrals Complete:</strong> You have submitted 2 work referrals.
                                {referrals.filter(r => r.status === 'verified').length >= 2
                                    ? ' Both have been verified!'
                                    : ' Awaiting verification from your referees.'}
                            </AlertDescription>
                        </Alert>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
