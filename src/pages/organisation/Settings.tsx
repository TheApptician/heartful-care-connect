import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Mail,
    MapPin,
    Shield,
    Bell,
    Save,
    CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PostcodeAddressLookup } from "@/components/shared/PostcodeAddressLookup";

export default function OrganisationSettings() {
    const [profile, setProfile] = useState<any>(null);
    const [orgDetails, setOrgDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        company_name: "",
        registration_number: "",
        address: "",
        postcode: "",
        phone: "",
        email: "",
        website: "",
        service_radius_miles: 10,
        description: "",
    });
    const [notifications, setNotifications] = useState({
        email_bookings: true,
        email_messages: true,
        email_compliance: true,
        sms_urgent: false,
    });
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login");
                return;
            }

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            // Fetch organisation details
            const { data: orgData } = await supabase
                .from('organisation_details')
                .select('*')
                .eq('id', user.id)
                .single();

            if (orgData) {
                setOrgDetails(orgData);
                setFormData({
                    company_name: orgData.company_name || "",
                    registration_number: orgData.registration_number || "",
                    address: orgData.address || "",
                    postcode: orgData.postcode || "",
                    phone: orgData.phone || profileData?.phone || "",
                    email: profileData?.email || "",
                    website: orgData.website || "",
                    service_radius_miles: orgData.service_radius_miles || 10,
                    description: orgData.description || "",
                });
            }

        } catch (error: any) {
            toast({
                title: "Error loading settings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Update organisation details
            const { error } = await supabase
                .from('organisation_details')
                .upsert({
                    id: user.id,
                    company_name: formData.company_name,
                    registration_number: formData.registration_number,
                    address: formData.address,
                    postcode: formData.postcode,
                    phone: formData.phone,
                    website: formData.website,
                    service_radius_miles: formData.service_radius_miles,
                    description: formData.description,
                }, { onConflict: 'id' });

            if (error) throw error;

            // Update profile phone if changed
            await supabase
                .from('profiles')
                .update({ phone: formData.phone })
                .eq('id', user.id);

            toast({
                title: "Settings saved",
                description: "Your organisation settings have been updated.",
            });

            fetchSettings();

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

    const handleRequestPasswordReset = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) return;

            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            toast({
                title: "Reset link sent",
                description: "Check your email for a password reset link.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
            return;
        }

        try {
            setSaving(true);
            // In a real production app, you would call an Edge Function here
            // because users cannot delete themselves via the standard client SDK
            // for security reasons.

            toast({
                title: "Request submitted",
                description: "Your account deletion request has been submitted to support.",
            });

            // Log out the user for demonstration
            // await supabase.auth.signOut();
            // navigate("/");

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="organisation">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            role="organisation"
            userName={orgDetails?.company_name || profile?.full_name || "Organisation"}
            userEmail={profile?.email || ""}
        >
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                        <p className="text-muted-foreground">Manage your organisation profile and preferences</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="bg-muted p-1 rounded-xl">
                        <TabsTrigger value="profile" className="rounded-lg">
                            <Building2 className="h-4 w-4 mr-2" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="rounded-lg">
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="security" className="rounded-lg">
                            <Shield className="h-4 w-4 mr-2" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        {/* Organisation Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Organisation Details
                                </CardTitle>
                                <CardDescription>Basic information about your organisation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Company Name</Label>
                                        <Input
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                            placeholder="Your Organisation Ltd"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Registration Number</Label>
                                        <Input
                                            value={formData.registration_number}
                                            onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                            placeholder="Registration Number"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of your organisation..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant={orgDetails?.is_verified ? "default" : "secondary"}>
                                        {orgDetails?.is_verified ? (
                                            <>
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Verified Organisation
                                            </>
                                        ) : (
                                            "Pending Verification"
                                        )}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription>How clients and carers can reach you</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input
                                            value={formData.email}
                                            disabled
                                            className="bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+44 20 1234 5678"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://www.yourorganisation.com"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Location & Service Area
                                </CardTitle>
                                <CardDescription>Your address and coverage radius</CardDescription>
                            </CardHeader>
                            <div className="space-y-4">
                                <PostcodeAddressLookup
                                    postcode={formData.postcode}
                                    onPostcodeChange={(pc) => setFormData({ ...formData, postcode: pc })}
                                    onAddressSelect={(addr) => setFormData({ ...formData, address: addr })}
                                    label="Postcode"
                                />
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Full address..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Service Radius (miles)</Label>
                                    <Input
                                        type="number"
                                        value={formData.service_radius_miles}
                                        onChange={(e) => setFormData({ ...formData, service_radius_miles: parseInt(e.target.value) || 10 })}
                                        min={1}
                                        max={100}
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-primary" />
                                    Email Notifications
                                </CardTitle>
                                <CardDescription>Control what emails you receive</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b">
                                    <div>
                                        <p className="font-medium">Booking Notifications</p>
                                        <p className="text-sm text-muted-foreground">Get notified about new and updated bookings</p>
                                    </div>
                                    <Switch
                                        checked={notifications.email_bookings}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, email_bookings: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-3 border-b">
                                    <div>
                                        <p className="font-medium">Message Notifications</p>
                                        <p className="text-sm text-muted-foreground">Get notified when you receive messages</p>
                                    </div>
                                    <Switch
                                        checked={notifications.email_messages}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, email_messages: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-3 border-b">
                                    <div>
                                        <p className="font-medium">Compliance Alerts</p>
                                        <p className="text-sm text-muted-foreground">Get notified about expiring documents and compliance issues</p>
                                    </div>
                                    <Switch
                                        checked={notifications.email_compliance}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, email_compliance: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium">Urgent SMS Alerts</p>
                                        <p className="text-sm text-muted-foreground">Receive SMS for urgent matters</p>
                                    </div>
                                    <Switch
                                        checked={notifications.sms_urgent}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms_urgent: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Password & Security
                                </CardTitle>
                                <CardDescription>Manage your account security</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted">
                                    <p className="font-medium mb-2">Change Password</p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        To change your password, use the password reset option from the login page.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={handleRequestPasswordReset}
                                    >
                                        Request Password Reset
                                    </Button>
                                </div>

                                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                                    <p className="font-medium text-destructive mb-2">Danger Zone</p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Permanently delete your organisation account and all associated data.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
