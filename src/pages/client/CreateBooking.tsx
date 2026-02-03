import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    ShieldCheck,
    CreditCard,
    CheckCircle2,
    ChevronRight,
    Info,
    AlertCircle,
    TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { calculateFees, formatCurrency, MINIMUM_HOURLY_RATE, validateMinimumRate } from "@/lib/fees";
import type { FeeCalculation, PricingPhase } from "@/types/database";

export default function CreateBooking() {
    const { carerId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [carer, setCarer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPhase, setCurrentPhase] = useState<PricingPhase>('1');
    const [feeBreakdown, setFeeBreakdown] = useState<FeeCalculation | null>(null);

    // Selection State
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState("09:00");
    const [duration, setDuration] = useState(2); // hours

    useEffect(() => {
        fetchCarer();
        fetchCurrentPhase();
    }, [carerId]);

    useEffect(() => {
        if (carer) {
            calculateFeeBreakdown();
        }
    }, [carer, duration, currentPhase]);

    const fetchCarer = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
          id,
          full_name,
          avatar_url,
          carer_details (
            bio,
            hourly_rate,
            verification_status
          )
        `)
                .eq('id', carerId)
                .single();

            if (error) throw error;

            // Normalize carer data (handle case where 1:1 relation returns array)
            const normalizedCarer = {
                ...data,
                carer_details: Array.isArray(data.carer_details)
                    ? data.carer_details[0]
                    : data.carer_details
            };

            setCarer(normalizedCarer);
        } catch (error: any) {
            toast({
                title: "Error fetching carer",
                description: error.message,
                variant: "destructive",
            });
            navigate("/client/search");
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentPhase = async () => {
        try {
            const { data, error } = await supabase
                .from('system_config')
                .select('value')
                .eq('id', 'active_phase')
                .single();

            if (error) throw error;
            setCurrentPhase((data?.value || '1') as PricingPhase);
        } catch (error) {
            console.error('Error fetching phase:', error);
            setCurrentPhase('1'); // Default to Phase 1
        }
    };

    const calculateFeeBreakdown = () => {
        try {
            const rate = carer?.carer_details?.hourly_rate || 25;
            const fees = calculateFees(rate, duration, currentPhase);
            setFeeBreakdown(fees);
        } catch (error: any) {
            console.error('Fee calculation error:', error);
            toast({
                title: 'Rate Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleBooking = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please log in to book");

            // Validate minimum rate
            const rate = carer?.carer_details?.hourly_rate || 25;
            if (!validateMinimumRate(rate)) {
                throw new Error(`Rate must be at least £${MINIMUM_HOURLY_RATE}/hour`);
            }

            if (!feeBreakdown) {
                throw new Error('Fee calculation failed');
            }

            const startTime = new Date(selectedDate!);
            const [hours, minutes] = selectedTime.split(':');
            startTime.setHours(parseInt(hours), parseInt(minutes));

            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + duration);

            const { error } = await supabase
                .from('bookings')
                .insert({
                    client_id: user.id,
                    carer_id: carerId,
                    start_time: startTime.toISOString(),
                    end_time: endTime.toISOString(),
                    total_price: feeBreakdown.clientTotal,
                    rate_per_hour: rate,
                    client_fee: feeBreakdown.clientFee,
                    carer_fee: feeBreakdown.carerFee,
                    status: 'pending'
                });

            if (error) throw error;

            setStep(3); // Success step
        } catch (error: any) {
            toast({
                title: "Booking Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && step === 1) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* Navigation */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="h-9 px-4 rounded-lg group hover:bg-primary/5 text-xs font-bold">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Search
            </Button>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Booking Content */}
                <div className="lg:col-span-2 space-y-6">
                    {step < 3 && (
                        <Card className="rounded-2xl border-black/5 shadow-sm overflow-hidden bg-white">
                            <CardContent className="p-0">
                                {/* Progress Header */}
                                <div className="bg-slate-50 border-b border-black/5 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= 1 ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground'}`}>1</div>
                                        <div className="h-px w-6 bg-black/5" />
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= 2 ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground'}`}>2</div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Step {step} of 2
                                    </span>
                                </div>

                                {step === 1 ? (
                                    <div className="p-6 space-y-6">
                                        <h2 className="text-xl font-bold tracking-tight">Schedule your visit</h2>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Date</Label>
                                                <div className="p-2 border border-black/5 rounded-2xl bg-slate-50/50">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={setSelectedDate}
                                                        className="rounded-md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Arrival Window</Label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(t => (
                                                            <Button
                                                                key={t}
                                                                variant={selectedTime === t ? "default" : "outline"}
                                                                className={`rounded-lg font-bold h-10 text-xs transition-all ${selectedTime === t ? 'shadow-md shadow-primary/10' : 'border-black/5'}`}
                                                                onClick={() => setSelectedTime(t)}
                                                            >
                                                                {t}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration (Hours)</Label>
                                                    <div className="flex items-center gap-3 p-3 border border-black/5 rounded-xl bg-slate-50/50">
                                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setDuration(Math.max(1, duration - 1))}>-</Button>
                                                        <span className="flex-1 text-center text-lg font-bold">{duration} <span className="text-xs font-semibold text-muted-foreground">hrs</span></span>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setDuration(duration + 1)}>+</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button className="w-full h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/10" onClick={() => setStep(2)}>
                                            Review Summary
                                            <ChevronRight className="w-4 h-4 ml-1.5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-6">
                                        <h2 className="text-xl font-bold tracking-tight">Review & Confirm</h2>

                                        <div className="space-y-4">
                                            {/* Booking Details */}
                                            <div className="p-5 rounded-2xl bg-slate-50/50 border border-black/5 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-semibold text-muted-foreground">Appointment</span>
                                                    <span className="font-bold text-foreground">{format(selectedDate!, "EEE, MMM do")} at {selectedTime}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-semibold text-muted-foreground">Duration</span>
                                                    <span className="font-bold text-foreground">{duration} Hours</span>
                                                </div>
                                            </div>

                                            {/* Fee Breakdown */}
                                            {feeBreakdown && (
                                                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white space-y-3">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TrendingUp className="h-4 w-4" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">Fee Breakdown (Phase {currentPhase})</span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-white/70">Base Rate ({duration} hrs × {formatCurrency(feeBreakdown.baseRate)}/hr)</span>
                                                        <span className="font-bold">{formatCurrency(feeBreakdown.subtotal)}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-white/70">Platform Fee ({(feeBreakdown.clientFeePercentage * 100).toFixed(0)}%)</span>
                                                        <span className="font-bold">+{formatCurrency(feeBreakdown.clientFee)}</span>
                                                    </div>

                                                    <div className="h-px bg-white/10" />

                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold">Total to Pay</span>
                                                        <span className="text-2xl font-black tracking-tight">{formatCurrency(feeBreakdown.clientTotal)}</span>
                                                    </div>

                                                    <div className="text-xs text-white/60 mt-2">
                                                        Carer receives: {formatCurrency(feeBreakdown.carerEarnings)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rate Compliance Alert */}


                                            {(carer?.carer_details?.hourly_rate || 25) < MINIMUM_HOURLY_RATE && (
                                                <Alert variant="destructive">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        <strong>Rate Error:</strong> This carer's rate (£{carer?.carer_details?.hourly_rate || 25}/hr) is below the minimum of £{MINIMUM_HOURLY_RATE}/hr. Booking cannot proceed.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100 italic font-medium text-[11px] text-amber-900 leading-relaxed">
                                                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                Payment is processed only after the carer completes the visit. All fees comply with PRD v2.3.2.
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/10"
                                            onClick={handleBooking}
                                            disabled={loading || ((carer?.carer_details?.hourly_rate || 25) < MINIMUM_HOURLY_RATE)}
                                        >
                                            {loading ? "Processing..." : "Confirm Booking"}
                                            {!loading && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                        </Button>

                                        <Button variant="ghost" className="w-full h-10 rounded-lg font-bold text-xs text-muted-foreground" onClick={() => setStep(1)} disabled={loading}>
                                            Back to Reschedule
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {step === 3 && (
                        <Card className="rounded-2xl border-black/5 shadow-md overflow-hidden text-center p-10 space-y-6 bg-white">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-float">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="text-2xl font-bold tracking-tight">Booking Requested!</h2>
                                <p className="text-muted-foreground text-sm">We've sent your request to {carer.full_name}.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-11 rounded-xl font-bold text-xs" onClick={() => navigate("/client/bookings")}>
                                    View Bookings
                                </Button>
                                <Button className="h-11 rounded-xl font-bold text-xs" onClick={() => navigate("/client/search")}>
                                    Find Another
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar: Carer Summary */}
                <div className="space-y-6">
                    <Card className="rounded-2xl border-none bg-slate-900 text-white overflow-hidden sticky top-8 shadow-xl">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border border-white/10 rounded-xl">
                                    <AvatarImage src={carer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${carer?.full_name}`} />
                                    <AvatarFallback className="text-xs font-bold bg-white/10">{carer?.full_name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-base font-bold tracking-tight">{carer?.full_name}</h3>
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <ShieldCheck className="w-3.5 h-3.5 fill-primary text-slate-900" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Elite Member</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-5 border-t border-white/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-white/40">Hourly Rate</span>
                                    <span className="font-bold tracking-tight">£{carer?.carer_details?.hourly_rate || '25.00'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-semibold text-white/40 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Response
                                    </span>
                                    <span className="font-bold text-emerald-400">~15 mins</span>
                                </div>
                            </div>

                            <div className="pt-5 space-y-3">
                                <Label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Payment Protection</Label>
                                <div className="flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 opacity-60" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-white/70">Escrow Secured</p>
                                        <p className="text-[9px] text-white/30 leading-tight">Funds held safely until care is confirmed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    );
}
