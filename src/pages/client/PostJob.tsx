import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const STEPS = 5;

export default function PostJob() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Q1
        care_type: "", // 'hourly', 'overnight', 'live_in'
        care_subtype: "", // 'hourly', 'sleeping', 'waking', 'part_time', 'full_time'
        live_in_confirmed: false,

        // Q2
        start_timeline: "", // 'immediate', 'few_weeks', 'specific_date'
        specific_start_date: "",

        // Q3
        recipient_relationship: "", // 'myself', 'family', 'friend'

        // Q5 (Funding)
        funding_source: "", // 'self', 'local_authority', 'nhs'

        // Q6 (Preferences)
        driver_required: "dont_mind", // 'yes', 'no', 'dont_mind'
        non_smoker_required: "dont_mind",
        has_pets: "no", // 'yes', 'no'

        // Q7
        gender_preference: "dont_mind",

        // Q8
        postcode: "",
        address: "",

        // Q9
        additional_info: ""
    });

    const handleNext = () => {
        // Validation
        if (step === 1) {
            if (!formData.care_type) return toast({ title: "Please select a care type", variant: "destructive" });
            if (!formData.care_subtype) return toast({ title: "Please select the specific care needed", variant: "destructive" });
            if (formData.care_type === 'live_in' && !formData.live_in_confirmed) {
                return toast({ title: "Confirmation Required", description: "You must acknowledge the requirements for live-in care.", variant: "destructive" });
            }
        }
        if (step === 2) {
            if (!formData.start_timeline) return toast({ title: "Please select when you need care", variant: "destructive" });
            if (formData.start_timeline === 'specific_date' && !formData.specific_start_date) return toast({ title: "Please select a start date", variant: "destructive" });
            if (!formData.recipient_relationship) return toast({ title: "Please select who needs care", variant: "destructive" });
        }
        if (step === 3) {
            if (!formData.funding_source) return toast({ title: "Please select funding source", variant: "destructive" });
            if (!formData.postcode) return toast({ title: "Postcode is required", variant: "destructive" });
        }

        if (step < STEPS) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Save to database
            // Note: Assuming 'jobs' table exists as per previous migration request
            const { error } = await supabase
                .from('jobs')
                .insert({
                    client_id: user.id,
                    ...formData,
                    has_pets: formData.has_pets === 'yes' // Convert string to boolean for DB if needed, but schema said boolean. Let's adjust state or conversion.
                });

            if (error) throw error;

            toast({
                title: "Job Posted Successfully",
                description: "Carers will be able to see your requirement and apply.",
            });
            navigate("/client/dashboard");

        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error posting job",
                description: error.message || "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Post a Job</h1>
                    <p className="text-muted-foreground">Tell us about your care needs</p>
                </div>
            </div>

            <Progress value={(step / STEPS) * 100} className="h-2" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Type of Care"}
                        {step === 2 && "Timing & Recipient"}
                        {step === 3 && "Details & Funding"}
                        {step === 4 && "Preferences"}
                        {step === 5 && "Review & Submit"}
                    </CardTitle>
                    <CardDescription>
                        Step {step} of {STEPS}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* STEP 1: Care Type */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">What type of care do you need?</Label>
                                <RadioGroup value={formData.care_type} onValueChange={(val) => updateField('care_type', val)}>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <RadioGroupItem value="hourly" id="r1" />
                                            <Label htmlFor="r1" className="flex-1 cursor-pointer font-medium">Hourly Care</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <RadioGroupItem value="overnight" id="r2" />
                                            <Label htmlFor="r2" className="flex-1 cursor-pointer font-medium">Overnight Care</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <RadioGroupItem value="live_in" id="r3" />
                                            <Label htmlFor="r3" className="flex-1 cursor-pointer font-medium">Live-in Care</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            {formData.care_type === 'hourly' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <Label>Schedule Type</Label>
                                    <Select value={formData.care_subtype} onValueChange={(val) => updateField('care_subtype', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Standard Hourly</SelectItem>
                                            <SelectItem value="respite">Respite Care</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {formData.care_type === 'overnight' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <Label>Overnight Type</Label>
                                    <RadioGroup value={formData.care_subtype} onValueChange={(val) => updateField('care_subtype', val)} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="sleeping" id="sleep" />
                                            <Label htmlFor="sleep">Sleeping Night</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="waking" id="wake" />
                                            <Label htmlFor="wake">Waking Night</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}

                            {formData.care_type === 'live_in' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-3">
                                        <Label>Live-in Type</Label>
                                        <RadioGroup value={formData.care_subtype} onValueChange={(val) => updateField('care_subtype', val)} className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="part_time" id="pt" />
                                                <Label htmlFor="pt">Part Time</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="full_time" id="ft" />
                                                <Label htmlFor="ft">Full Time</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <Alert variant="warning" className="bg-amber-50 border-amber-200">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <AlertTitle className="text-amber-800">Important Requirement</AlertTitle>
                                        <AlertDescription className="text-amber-700 mt-2">
                                            <div className="flex items-start space-x-2">
                                                <Checkbox
                                                    id="confirm_live_in"
                                                    checked={formData.live_in_confirmed}
                                                    onCheckedChange={(checked) => updateField('live_in_confirmed', !!checked)}
                                                />
                                                <label htmlFor="confirm_live_in" className="text-sm leading-tight cursor-pointer">
                                                    Please confirm your awareness that live-in care means a Care professional will stay in your home and will require their own bedroom for rest and privacy.
                                                </label>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: Timing & Recipient */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">When do you need care?</Label>
                                <RadioGroup value={formData.start_timeline} onValueChange={(val) => updateField('start_timeline', val)}>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <RadioGroupItem value="immediate" id="t1" />
                                            <Label htmlFor="t1" className="flex-1 cursor-pointer">Immediate start</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <RadioGroupItem value="few_weeks" id="t2" />
                                            <Label htmlFor="t2" className="flex-1 cursor-pointer">Within next few weeks</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <RadioGroupItem value="specific_date" id="t3" />
                                            <Label htmlFor="t3" className="flex-1 cursor-pointer">Specific start date</Label>
                                        </div>
                                    </div>
                                </RadioGroup>

                                {formData.start_timeline === 'specific_date' && (
                                    <div className="pt-2 animate-in fade-in">
                                        <Label>Select Date</Label>
                                        <Input
                                            type="date"
                                            className="mt-1"
                                            value={formData.specific_start_date}
                                            onChange={(e) => updateField('specific_start_date', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-base">Who needs care?</Label>
                                <RadioGroup value={formData.recipient_relationship} onValueChange={(val) => updateField('recipient_relationship', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer min-w-[120px]">
                                        <RadioGroupItem value="myself" id="who1" />
                                        <Label htmlFor="who1" className="cursor-pointer">Myself</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer min-w-[120px]">
                                        <RadioGroupItem value="family" id="who2" />
                                        <Label htmlFor="who2" className="cursor-pointer">Family Member</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer min-w-[120px]">
                                        <RadioGroupItem value="friend" id="who3" />
                                        <Label htmlFor="who3" className="cursor-pointer">Friend</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Details & Funding */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">How are you funding your care?</Label>
                                <Select value={formData.funding_source} onValueChange={(val) => updateField('funding_source', val)}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select funding source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="self">Self-funding</SelectItem>
                                        <SelectItem value="local_authority">Local Authority</SelectItem>
                                        <SelectItem value="nhs">NHS / CHC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-base">Location</Label>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Postcode</Label>
                                        <Input
                                            placeholder="e.g. SW1A 1AA"
                                            value={formData.postcode}
                                            onChange={(e) => updateField('postcode', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address (Optional for now)</Label>
                                        <Input
                                            placeholder="Street address..."
                                            value={formData.address}
                                            onChange={(e) => updateField('address', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Preferences */}
                    {step === 4 && (
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-base">Is a driver necessary?</Label>
                                <RadioGroup value={formData.driver_required} onValueChange={(val) => updateField('driver_required', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="d_y" /><Label htmlFor="d_y">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="d_n" /><Label htmlFor="d_n">No</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="dont_mind" id="d_dm" /><Label htmlFor="d_dm">I Don't mind</Label></div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <Label className="text-base">Are you looking for a non-smoker?</Label>
                                <RadioGroup value={formData.non_smoker_required} onValueChange={(val) => updateField('non_smoker_required', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="s_y" /><Label htmlFor="s_y">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="s_n" /><Label htmlFor="s_n">No</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="dont_mind" id="s_dm" /><Label htmlFor="s_dm">I Don't mind</Label></div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <Label className="text-base">Do you have a pet in your home?</Label>
                                <RadioGroup value={formData.has_pets} onValueChange={(val) => updateField('has_pets', val)} className="flex gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="p_y" /><Label htmlFor="p_y">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="p_n" /><Label htmlFor="p_n">No</Label></div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <Label className="text-base">Do you have a preference for your Care professional?</Label>
                                <RadioGroup value={formData.gender_preference} onValueChange={(val) => updateField('gender_preference', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="g_m" /><Label htmlFor="g_m">Male</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="g_f" /><Label htmlFor="g_f">Female</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="dont_mind" id="g_dm" /><Label htmlFor="g_dm">I don't mind</Label></div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Final Review */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-base">Additional Information</Label>
                                <Textarea
                                    className="min-h-[150px]"
                                    placeholder="Please provide any other details that might help us find the perfect carer for you..."
                                    value={formData.additional_info}
                                    onChange={(e) => updateField('additional_info', e.target.value)}
                                />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg space-y-4 text-sm">
                                <h3 className="font-bold">Summary</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{formData.care_type.replace('_', ' ')}</span></div>
                                    <div><span className="text-muted-foreground">Subtype:</span> <span className="font-medium capitalize">{formData.care_subtype.replace('_', ' ')}</span></div>
                                    <div><span className="text-muted-foreground">Timeline:</span> <span className="font-medium capitalize">{formData.start_timeline.replace('_', ' ')}</span></div>
                                    <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{formData.postcode}</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-6 border-t mt-6">
                        {step > 1 ? (
                            <Button variant="outline" onClick={handleBack}>Back</Button>
                        ) : (
                            <div />
                        )}

                        <Button onClick={handleNext} disabled={loading} className="px-8">
                            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                            {step === STEPS ? "Post Job" : "Next"}
                            {step !== STEPS && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
