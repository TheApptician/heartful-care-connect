// Enhanced Carer Profile with Rate Validation (PRD v2.3.2 Compliant)
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    User,
    Camera,
    MapPin,
    Phone,
    Mail,
    Star,
    Shield,
    GraduationCap,
    Heart,
    Clock,
    Save,
    Eye,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    Info
} from "lucide-react";
import { MINIMUM_HOURLY_RATE, validateMinimumRate, calculateFees, formatCurrency } from "@/lib/fees";
import type { PricingPhase } from "@/types/database";

export default function CarerProfileEnhanced() {
    const [isEditing, setIsEditing] = useState(false);
    const [hourlyRate, setHourlyRate] = useState(25);
    const [rateError, setRateError] = useState("");
    const currentPhase: PricingPhase = '1'; // TODO: Fetch from system_config

    const handleRateChange = (value: string) => {
        const rate = parseFloat(value);
        setHourlyRate(rate);

        if (isNaN(rate)) {
            setRateError("Please enter a valid number");
            return;
        }

        if (!validateMinimumRate(rate)) {
            setRateError(`Rate must be at least £${MINIMUM_HOURLY_RATE}/hour (PRD v2.3.2 requirement)`);
        } else {
            setRateError("");
        }
    };

    const getFeePreview = () => {
        if (!hourlyRate || hourlyRate < MINIMUM_HOURLY_RATE) return null;

        try {
            const fees = calculateFees(hourlyRate, 1, currentPhase);
            return fees;
        } catch {
            return null;
        }
    };

    const feePreview = getFeePreview();
    const isRateValid = validateMinimumRate(hourlyRate);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your carer profile and rate settings</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Profile
                    </Button>
                    <Button onClick={() => setIsEditing(!isEditing)} disabled={!isRateValid && isEditing}>
                        {isEditing ? (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        ) : (
                            "Edit Profile"
                        )}
                    </Button>
                </div>
            </div>

            {/* Profile Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="text-2xl">SK</AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold">Sarah Khan</h2>
                                <Badge className="bg-emerald-500">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    Manchester, M1
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-amber-500" />
                                    4.9 (127 reviews)
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    5 years experience
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rate Configuration Card */}
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Hourly Rate Configuration
                    </CardTitle>
                    <CardDescription>Set your hourly rate (minimum £{MINIMUM_HOURLY_RATE}/hour required)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Rate Input */}
                    <div className="space-y-2">
                        <Label htmlFor="hourly-rate">Hourly Rate (£)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground">£</span>
                            <Input
                                id="hourly-rate"
                                type="number"
                                min={MINIMUM_HOURLY_RATE}
                                step="0.50"
                                value={hourlyRate}
                                onChange={(e) => handleRateChange(e.target.value)}
                                disabled={!isEditing}
                                className={`pl-8 text-lg font-bold ${rateError ? 'border-red-500' : isRateValid ? 'border-green-500' : ''}`}
                            />
                            {isRateValid && (
                                <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                            )}
                        </div>
                        {rateError && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {rateError}
                            </p>
                        )}
                    </div>

                    {/* Minimum Rate Alert */}
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            <strong>PRD v2.3.2 Requirement:</strong> All carers must set a minimum rate of £{MINIMUM_HOURLY_RATE}/hour. This ensures fair compensation and platform compliance.
                        </AlertDescription>
                    </Alert>

                    {/* Fee Preview */}
                    {feePreview && (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    Earnings Preview (Phase {currentPhase})
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Your Rate</span>
                                    <span className="font-bold">{formatCurrency(feePreview.baseRate)}/hour</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Platform Fee ({(feePreview.carerFeePercentage * 100).toFixed(0)}%)</span>
                                    <span className="font-bold">-{formatCurrency(feePreview.carerFee)}</span>
                                </div>

                                <div className="h-px bg-white/10" />

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">You Receive (per hour)</span>
                                    <span className="text-xl font-black">{formatCurrency(feePreview.carerEarnings)}</span>
                                </div>
                            </div>

                            <div className="text-xs text-white/60 mt-3 p-3 bg-white/5 rounded-lg">
                                <strong>Example:</strong> For a 2-hour booking, client pays {formatCurrency(feePreview.clientTotal * 2)}, you receive {formatCurrency(feePreview.carerEarnings * 2)}
                            </div>
                        </div>
                    )}

                    {/* Rate Recommendations */}
                    <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                        <p className="text-sm font-bold text-slate-700">Recommended Rates by Experience:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">1-2 years:</span>
                                <span className="font-bold">£15-18/hr</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">3-5 years:</span>
                                <span className="font-bold">£18-25/hr</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">5-10 years:</span>
                                <span className="font-bold">£25-35/hr</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">10+ years:</span>
                                <span className="font-bold">£35-50/hr</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Professional Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Professional Details
                    </CardTitle>
                    <CardDescription>Your experience and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Years of Experience</Label>
                            <Input type="number" defaultValue="5" disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Full Name
                            </Label>
                            <Input defaultValue="Sarah Khan" disabled={!isEditing} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Professional Bio</Label>
                        <Textarea
                            className="min-h-[150px]"
                            disabled={!isEditing}
                            defaultValue="I am a dedicated and compassionate carer with over 5 years of experience in providing high-quality personal care and support. I focus on elderly care and have extensive experience working with clients who have dementia."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                        </Label>
                        <Input type="email" defaultValue="sarah.khan@email.com" disabled={!isEditing} />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                        </Label>
                        <Input type="tel" defaultValue="+44 7700 900123" disabled={!isEditing} />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Address
                        </Label>
                        <Input defaultValue="123 High Street, Manchester, M1 1AB" disabled={!isEditing} />
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Notice */}
            <Alert className="border-amber-500 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                    <strong>Important:</strong> Your profile will only appear in marketplace search results if your rate is at least £{MINIMUM_HOURLY_RATE}/hour and your verification status is "verified". This ensures compliance with PRD v2.3.2 requirements.
                </AlertDescription>
            </Alert>
        </div>
    );
}
