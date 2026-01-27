// Phase Management Interface for Admins (PRD v2.3.2)
import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    TrendingUp,
    Users,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Info,
    Settings,
    BarChart3,
} from "lucide-react";
import { formatCurrency, PHASE_1_CLIENT_FEE, PHASE_1_CARER_FEE, PHASE_2_CLIENT_FEE, PHASE_2_CARER_FEE } from "@/lib/fees";
import type { PricingPhase } from "@/types/database";

export default function PhaseControl() {
    const [loading, setLoading] = useState(true);
    const [currentPhase, setCurrentPhase] = useState<PricingPhase>('1');
    const [verifiedCarers, setVerifiedCarers] = useState(0);
    const [verifiedClients, setVerifiedClients] = useState(0);
    const [updating, setUpdating] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch current phase
            const { data: phaseData, error: phaseError } = await supabase
                .from('system_config')
                .select('value')
                .eq('id', 'active_phase')
                .single();

            if (phaseError) throw phaseError;
            setCurrentPhase((phaseData?.value || '1') as PricingPhase);

            // Count verified carers
            const { count: carerCount, error: carerError } = await supabase
                .from('carer_verification')
                .select('*', { count: 'exact', head: true })
                .eq('overall_status', 'verified');

            if (carerError) throw carerError;
            setVerifiedCarers(carerCount || 0);

            // Count verified clients (all clients are considered verified)
            const { count: clientCount, error: clientError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'client');

            if (clientError) throw clientError;
            setVerifiedClients(clientCount || 0);

        } catch (error: any) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load phase data',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePhaseToggle = async (newPhase: PricingPhase) => {
        try {
            setUpdating(true);

            const { error } = await supabase
                .from('system_config')
                .update({ value: newPhase, updated_at: new Date().toISOString() })
                .eq('id', 'active_phase');

            if (error) throw error;

            setCurrentPhase(newPhase);

            toast({
                title: 'Phase Updated',
                description: `Successfully switched to Phase ${newPhase}`,
            });

            // Log the change (optional - could create an audit log table)
            console.log(`Phase changed from ${currentPhase} to ${newPhase} at ${new Date().toISOString()}`);

        } catch (error: any) {
            console.error('Error updating phase:', error);
            toast({
                title: 'Update Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setUpdating(false);
        }
    };

    const shouldAutoSwitchToPhase2 = verifiedCarers >= 30;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading phase data...</p>
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
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Configuration</span>
                </div>
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">Pricing Phase Control</h1>
                <p className="text-slate-500 font-medium">Manage platform pricing phases (PRD v2.3.2)</p>
            </div>

            {/* Current Phase Card */}
            <div className="relative group p-10 rounded-[2.5rem] bg-[#111827] text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a9e8c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-white/60 mb-2">Current Active Phase</p>
                            <h2 className="text-5xl font-black">Phase {currentPhase}</h2>
                        </div>
                        <Badge className={`text-lg px-4 py-2 ${currentPhase === '1' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                            <Settings className="h-5 w-5 mr-2" />
                            Active
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-sm text-white/60 mb-1">Client Fee</p>
                            <p className="text-3xl font-black text-[#1a9e8c]">
                                {currentPhase === '1' ? (PHASE_1_CLIENT_FEE * 100).toFixed(0) : (PHASE_2_CLIENT_FEE * 100).toFixed(0)}%
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-sm text-white/60 mb-1">Carer Fee</p>
                            <p className="text-3xl font-black text-[#1a9e8c]">
                                {currentPhase === '1' ? (PHASE_1_CARER_FEE * 100).toFixed(0) : (PHASE_2_CARER_FEE * 100).toFixed(0)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Verified Carers
                        </CardDescription>
                        <CardTitle className="text-4xl font-black">{verifiedCarers}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {verifiedCarers >= 30 ? '✅ Phase 2 threshold reached' : `${30 - verifiedCarers} more needed for Phase 2`}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total Clients
                        </CardDescription>
                        <CardTitle className="text-4xl font-black">{verifiedClients}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Active platform users</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Platform Ratio
                        </CardDescription>
                        <CardTitle className="text-4xl font-black">
                            {verifiedClients > 0 ? (verifiedClients / Math.max(verifiedCarers, 1)).toFixed(1) : '0'}:1
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Clients per carer</p>
                    </CardContent>
                </Card>
            </div>

            {/* Auto-Switch Recommendation */}
            {shouldAutoSwitchToPhase2 && currentPhase === '1' && (
                <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900">
                        <strong>Recommendation:</strong> You have {verifiedCarers} verified carers (threshold: 30). Consider switching to Phase 2 to increase platform revenue.
                    </AlertDescription>
                </Alert>
            )}

            {/* Phase Toggle */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Phase Management
                    </CardTitle>
                    <CardDescription>Switch between pricing phases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-primary/20 bg-slate-50">
                        <div>
                            <Label htmlFor="phase-toggle" className="text-lg font-bold">Enable Phase 2 Pricing</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                Switch to Phase 2 (12% client fee / 5% carer fee)
                            </p>
                        </div>
                        <Switch
                            id="phase-toggle"
                            checked={currentPhase === '2'}
                            onCheckedChange={(checked) => handlePhaseToggle(checked ? '2' : '1')}
                            disabled={updating}
                        />
                    </div>

                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Phase 1:</strong> Client pays +10%, Carer receives 100% of their rate<br />
                            <strong>Phase 2:</strong> Client pays +12%, Carer receives 95% of their rate (5% platform fee)
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Fee Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Fee Comparison
                    </CardTitle>
                    <CardDescription>Example booking at £20/hour for 2 hours</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Phase 1 */}
                        <div className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-200">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Badge className="bg-blue-500">Phase 1</Badge>
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Base (£20 × 2hrs)</span>
                                    <span className="font-bold">£40.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Client Fee (10%)</span>
                                    <span className="font-bold">+£4.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Carer Fee (0%)</span>
                                    <span className="font-bold">£0.00</span>
                                </div>
                                <div className="h-px bg-blue-200 my-2" />
                                <div className="flex justify-between text-base">
                                    <span className="font-bold">Client Pays</span>
                                    <span className="font-black text-blue-600">£44.00</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="font-bold">Carer Receives</span>
                                    <span className="font-black text-green-600">£40.00</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="font-bold">Platform Revenue</span>
                                    <span className="font-black text-purple-600">£4.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="p-6 rounded-2xl bg-purple-50 border-2 border-purple-200">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Badge className="bg-purple-500">Phase 2</Badge>
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Base (£20 × 2hrs)</span>
                                    <span className="font-bold">£40.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Client Fee (12%)</span>
                                    <span className="font-bold">+£4.80</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Carer Fee (5%)</span>
                                    <span className="font-bold">-£2.00</span>
                                </div>
                                <div className="h-px bg-purple-200 my-2" />
                                <div className="flex justify-between text-base">
                                    <span className="font-bold">Client Pays</span>
                                    <span className="font-black text-blue-600">£44.80</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="font-bold">Carer Receives</span>
                                    <span className="font-black text-green-600">£38.00</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="font-bold">Platform Revenue</span>
                                    <span className="font-black text-purple-600">£6.80</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Warning */}
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Warning:</strong> Changing the pricing phase affects all new bookings immediately. Existing bookings retain their original fee structure. Communicate phase changes to carers and clients in advance.
                </AlertDescription>
            </Alert>
        </div>
    );
}
