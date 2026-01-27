import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, CreditCard, Shield, Save, Eye, EyeOff, Loader2, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const ClientSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addingCard, setAddingCard] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false); // New state for modal
    const [settings, setSettings] = useState<any>(null);
    const { toast } = useToast();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        if (paymentStatus === 'success') {
            toast({
                title: "Success",
                description: "Payment method added successfully!",
            });
        } else if (paymentStatus === 'cancelled') {
            toast({
                title: "Cancelled",
                description: "Payment method setup was cancelled.",
                variant: "destructive"
            });
        }
    }, [searchParams, toast]);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [notifications, setNotifications] = useState({
        emailBookings: true,
        emailMessages: true,
        emailReminders: true,
        smsBookings: false,
        smsReminders: true,
    });

    const [security, setSecuritySettings] = useState({
        twoFactor: false,
        loginAlerts: true,
    });

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("client_details")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error && error.code !== "PGRST116") throw error;

            if (data) {
                setNotifications({
                    emailBookings: data.email_bookings ?? true,
                    emailMessages: data.email_messages ?? true,
                    emailReminders: data.email_reminders ?? true,
                    smsBookings: data.sms_bookings ?? false,
                    smsReminders: data.sms_reminders ?? true,
                });
                setSecuritySettings({
                    twoFactor: data.two_factor ?? false,
                    loginAlerts: data.login_alerts ?? true,
                });
                // Initialize settings state with fetched data
                setSettings({
                    email_bookings: data.email_bookings ?? true,
                    email_messages: data.email_messages ?? true,
                    email_reminders: data.email_reminders ?? true,
                    sms_bookings: data.sms_bookings ?? false,
                    sms_reminders: data.sms_reminders ?? true,
                    two_factor: data.two_factor ?? false,
                    login_alerts: data.login_alerts ?? true,
                    emergency_contact_name: data.emergency_contact_name ?? "",
                    emergency_contact_phone: data.emergency_contact_phone ?? "",
                    medical_notes: data.medical_notes ?? "",
                });
            }
        } catch (error: any) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('client_details')
                .upsert({ // Changed from update to upsert to match original logic, but using settings state
                    id: user.id, // Added id for upsert
                    email_bookings: settings.email_bookings,
                    email_messages: settings.email_messages,
                    email_reminders: settings.email_reminders,
                    sms_bookings: settings.sms_bookings,
                    sms_reminders: settings.sms_reminders,
                    two_factor: settings.two_factor,
                    login_alerts: settings.login_alerts,
                    emergency_contact_name: settings.emergency_contact_name,
                    emergency_contact_phone: settings.emergency_contact_phone,
                    medical_notes: settings.medical_notes,
                    updated_at: new Date().toISOString(), // Keep updated_at
                }, { onConflict: 'id' }); // Specify onConflict for upsert

            if (error) throw error;

            toast({
                title: "Settings saved",
                description: "Your preferences have been updated successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error saving settings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAddPaymentMethod = async () => {
        try {
            setAddingCard(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please log in to add a payment method");

            const { data, error } = await supabase.functions.invoke('stripe-checkout-session', {
                body: {
                    clientId: user.id,
                    mode: 'setup',
                    successUrl: `${window.location.origin}/client/settings?payment=success`,
                    cancelUrl: `${window.location.origin}/client/settings?payment=cancelled`,
                }
            });

            if (error) throw error;

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No setup URL received");
            }
        } catch (error: any) {
            console.error('Stripe setup error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to initiate payment method setup",
                variant: "destructive"
            });
        } finally {
            setAddingCard(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwords.new || passwords.new !== passwords.confirm) {
            toast({
                title: "Invalid Input",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;

            toast({
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences</p>
                </div>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Choose how you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email - Booking Confirmations</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive emails when bookings are confirmed
                                </p>
                            </div>
                            <Switch
                                checked={notifications.emailBookings}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, emailBookings: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email - New Messages</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when you receive messages
                                </p>
                            </div>
                            <Switch
                                checked={notifications.emailMessages}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, emailMessages: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email - Appointment Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Reminders 24 hours before appointments
                                </p>
                            </div>
                            <Switch
                                checked={notifications.emailReminders}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, emailReminders: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>SMS - Booking Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Text messages for booking changes
                                </p>
                            </div>
                            <Switch
                                checked={notifications.smsBookings}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, smsBookings: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>SMS - Appointment Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Text reminders before appointments
                                </p>
                            </div>
                            <Switch
                                checked={notifications.smsReminders}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, smsReminders: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Security
                        </CardTitle>
                        <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                            <Switch
                                checked={security.twoFactor}
                                onCheckedChange={(checked) =>
                                    setSecuritySettings({ ...security, twoFactor: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Login Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified of new login attempts
                                </p>
                            </div>
                            <Switch
                                checked={security.loginAlerts}
                                onCheckedChange={(checked) =>
                                    setSecuritySettings({ ...security, loginAlerts: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Change Password
                        </CardTitle>
                        <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                        <Button onClick={handlePasswordUpdate}>Update Password</Button>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Payment Methods
                        </CardTitle>
                        <CardDescription>Manage your payment options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-primary/5 border-primary/20">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertTitle>Secure Payments</AlertTitle>
                            <AlertDescription>
                                We use Stripe for secure payment processing. Add a payment method to easily book and pay for care services.
                            </AlertDescription>
                        </Alert>

                        <div className="flex items-center justify-center p-8 border border-dashed rounded-lg bg-slate-50">
                            <div className="text-center">
                                <CreditCard className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 mb-4">No payment methods saved yet.</p>
                                <Button
                                    disabled={addingCard}
                                    onClick={() => setShowCardModal(true)}
                                >
                                    {addingCard ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4 mr-2" />
                                    )}
                                    {addingCard ? "Redirecting..." : "Add your first card"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => fetchSettings()}>Reset</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Add Card Modal */}
            <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-[#1a9e8c]" />
                            Add Payment Method
                        </DialogTitle>
                        <DialogDescription>
                            We use Stripe to securely process your payments. You will be redirected to a secure Stripe-hosted page to enter your card details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                            <div className="flex items-start gap-3">
                                <Shield className="h-4 w-4 text-[#1a9e8c] mt-1 shrink-0" />
                                <p className="text-xs text-slate-600 font-medium">Your card details are never stored on our servers. They are encrypted and held by Stripe.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-4 w-4 text-[#1a9e8c] mt-1 shrink-0" />
                                <p className="text-xs text-slate-600 font-medium">By adding a card, you authorize Heems to save this method for future care bookings.</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] text-center italic">Professional • Secure • Trusted</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCardModal(false)} disabled={addingCard}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#111827] hover:bg-[#1a9e8c] text-white"
                            onClick={handleAddPaymentMethod}
                            disabled={addingCard}
                        >
                            {addingCard && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Proceed to Stripe
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClientSettings;
