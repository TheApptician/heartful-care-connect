// Enhanced Carer Earnings Dashboard with Stripe Integration
import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    ExternalLink,
    CheckCircle,
    Clock,
    AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/fees";
import { StripeConnectOnboarding } from "@/components/payments/StripeConnectOnboarding";

interface Earning {
    id: string;
    booking_id: string;
    client_name: string;
    date: string;
    hours: number;
    rate_per_hour: number;
    gross_amount: number;
    carer_fee: number;
    net_earnings: number;
    status: string;
    payment_date: string | null;
}

export default function CarerEarningsEnhanced() {
    const [loading, setLoading] = useState(true);
    const [earnings, setEarnings] = useState<Earning[]>([]);
    const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
    const [stripeOnboardingComplete, setStripeOnboardingComplete] = useState(false);
    const [stripeChargesEnabled, setStripeChargesEnabled] = useState(false);
    const [stripePayoutsEnabled, setStripePayoutsEnabled] = useState(false);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [pendingEarnings, setPendingEarnings] = useState(0);
    const [paidEarnings, setPaidEarnings] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Fetch Stripe account status
            const { data: carerData, error: carerError } = await supabase
                .from('carer_details')
                .select('stripe_account_id, stripe_onboarding_complete, stripe_charges_enabled, stripe_payouts_enabled')
                .eq('id', user.id)
                .single();

            if (carerError) throw carerError;

            setStripeAccountId(carerData?.stripe_account_id || null);
            setStripeOnboardingComplete(carerData?.stripe_onboarding_complete || false);
            setStripeChargesEnabled(carerData?.stripe_charges_enabled || false);
            setStripePayoutsEnabled(carerData?.stripe_payouts_enabled || false);

            // Fetch bookings with payment data
            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
          id,
          start_time,
          end_time,
          rate_per_hour,
          client_fee,
          carer_fee,
          total_price,
          status,
          payment_status,
          profiles!bookings_client_id_fkey(full_name)
        `)
                .eq('carer_id', user.id)
                .in('status', ['confirmed', 'completed'])
                .order('start_time', { ascending: false });

            if (bookingsError) throw bookingsError;

            // Transform bookings into earnings
            const earningsData: Earning[] = (bookings || []).map((booking: any) => {
                const startTime = new Date(booking.start_time);
                const endTime = new Date(booking.end_time);
                const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                const grossAmount = booking.rate_per_hour * hours;
                const netEarnings = grossAmount - (booking.carer_fee || 0);

                return {
                    id: booking.id,
                    booking_id: booking.id,
                    client_name: booking.profiles?.full_name || 'Unknown Client',
                    date: startTime.toISOString(),
                    hours,
                    rate_per_hour: booking.rate_per_hour,
                    gross_amount: grossAmount,
                    carer_fee: booking.carer_fee || 0,
                    net_earnings: netEarnings,
                    status: booking.payment_status || 'pending',
                    payment_date: booking.status === 'completed' ? endTime.toISOString() : null,
                };
            });

            setEarnings(earningsData);

            // Calculate totals
            const total = earningsData.reduce((sum, e) => sum + e.net_earnings, 0);
            const pending = earningsData.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.net_earnings, 0);
            const paid = earningsData.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.net_earnings, 0);

            setTotalEarnings(total);
            setPendingEarnings(pending);
            setPaidEarnings(paid);

        } catch (error: any) {
            console.error('Error fetching earnings:', error);
            toast({
                title: 'Error',
                description: 'Failed to load earnings data',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
            case 'pending':
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case 'failed':
                return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading earnings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Dashboard</span>
                </div>
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">Earnings & Payments</h1>
                <p className="text-slate-500 font-medium">Track your income and manage payouts</p>
            </div>

            {/* Stripe Connect Onboarding */}
            {(!stripeAccountId || !stripeOnboardingComplete || !stripeChargesEnabled || !stripePayoutsEnabled) && (
                <StripeConnectOnboarding
                    carerId={supabase.auth.getUser().then(r => r.data.user?.id || '')}
                    stripeAccountId={stripeAccountId}
                    onboardingComplete={stripeOnboardingComplete}
                    chargesEnabled={stripeChargesEnabled}
                    payoutsEnabled={stripePayoutsEnabled}
                />
            )}

            {/* Earnings Summary */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a9e8c]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="relative pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total Earnings
                        </CardDescription>
                        <CardTitle className="text-4xl font-black text-[#1a9e8c]">
                            {formatCurrency(totalEarnings)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">All-time earnings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Pending
                        </CardDescription>
                        <CardTitle className="text-4xl font-black text-amber-600">
                            {formatCurrency(pendingEarnings)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Awaiting completion</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Paid Out
                        </CardDescription>
                        <CardTitle className="text-4xl font-black text-green-600">
                            {formatCurrency(paidEarnings)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Transferred to bank</p>
                    </CardContent>
                </Card>
            </div>

            {/* Earnings Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Earnings History
                            </CardTitle>
                            <CardDescription>Detailed breakdown of all your bookings</CardDescription>
                        </div>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {earnings.length === 0 ? (
                        <div className="text-center py-12">
                            <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">No Earnings Yet</h3>
                            <p className="text-slate-500">Complete bookings to start earning</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {earnings.map((earning) => (
                                <div
                                    key={earning.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-bold">{earning.client_name}</p>
                                            {getStatusBadge(earning.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(earning.date).toLocaleDateString()}
                                            </span>
                                            <span>{earning.hours} hours @ {formatCurrency(earning.rate_per_hour)}/hr</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-[#1a9e8c]">
                                            {formatCurrency(earning.net_earnings)}
                                        </p>
                                        {earning.carer_fee > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                -{formatCurrency(earning.carer_fee)} platform fee
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stripe Dashboard Link */}
            {stripeAccountId && stripeOnboardingComplete && (
                <Card className="border-2 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold mb-1">Manage Payouts</h3>
                                <p className="text-sm text-muted-foreground">
                                    View detailed payment history and manage your bank account in Stripe
                                </p>
                            </div>
                            <Button onClick={() => window.open('https://dashboard.stripe.com', '_blank')}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Stripe Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
