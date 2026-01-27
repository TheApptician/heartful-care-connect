
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Bell,
    Shield,
    Database,
    Mail,
    Key,
    Globe,
    Save
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Settings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        platform_name: "Heems Care",
        support_email: "support@heemscare.com",
        platform_url: "https://heemscare.com",
        email_notifications: true,
        verification_alerts: true,
        booking_notifications: true,
        maintenance_mode: false,
        two_factor_auth: true,
        auto_logout: true,
        auto_backup: true,
        backup_retention_days: 30,
        stripe_secret_key: "",
        supabase_service_key: "",
        sendgrid_api_key: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('platform_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            if (data) {
                setSettings(data);
            }
        } catch (error: any) {
            console.error("Error fetching settings:", error);
            toast({
                title: "Error",
                description: "Failed to load platform settings.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('platform_settings')
                .update({
                    ...settings,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (error) throw error;

            toast({
                title: "Settings Saved",
                description: "Your platform settings have been updated successfully.",
            });
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast({
                title: "Error",
                description: "Failed to save settings: " + error.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-[#1a9e8c]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        System Configuration
                    </span>
                </div>
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">
                    Platform Settings
                </h1>
                <p className="text-slate-500 font-medium">
                    Configure global platform settings and preferences
                </p>
            </div>

            {/* General Settings */}
            <Card className="rounded-3xl border-black/[0.05]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-[#1a9e8c]" />
                        General Settings
                    </CardTitle>
                    <CardDescription>Basic platform configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input
                            id="platform-name"
                            value={settings.platform_name}
                            onChange={(e) => handleChange('platform_name', e.target.value)}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input
                            id="support-email"
                            type="email"
                            value={settings.support_email}
                            onChange={(e) => handleChange('support_email', e.target.value)}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="platform-url">Platform URL</Label>
                        <Input
                            id="platform-url"
                            value={settings.platform_url}
                            onChange={(e) => handleChange('platform_url', e.target.value)}
                            className="rounded-xl"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="rounded-3xl border-black/[0.05]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-[#1a9e8c]" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Manage notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive email alerts for important events
                            </p>
                        </div>
                        <Switch
                            checked={settings.email_notifications}
                            onCheckedChange={(val) => handleChange('email_notifications', val)}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Verification Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when new verifications are submitted
                            </p>
                        </div>
                        <Switch
                            checked={settings.verification_alerts}
                            onCheckedChange={(val) => handleChange('verification_alerts', val)}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Booking Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive alerts for new bookings
                            </p>
                        </div>
                        <Switch
                            checked={settings.booking_notifications}
                            onCheckedChange={(val) => handleChange('booking_notifications', val)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="rounded-3xl border-black/[0.05]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#1a9e8c]" />
                        Security
                    </CardTitle>
                    <CardDescription>Platform security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Temporarily disable platform access
                            </p>
                        </div>
                        <Switch
                            checked={settings.maintenance_mode}
                            onCheckedChange={(val) => handleChange('maintenance_mode', val)}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Require 2FA for admin accounts
                            </p>
                        </div>
                        <Switch
                            checked={settings.two_factor_auth}
                            onCheckedChange={(val) => handleChange('two_factor_auth', val)}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto Logout</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically log out inactive users after 30 minutes
                            </p>
                        </div>
                        <Switch
                            checked={settings.auto_logout}
                            onCheckedChange={(val) => handleChange('auto_logout', val)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Database */}
            <Card className="rounded-3xl border-black/[0.05]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-[#1a9e8c]" />
                        Database & Backups
                    </CardTitle>
                    <CardDescription>Data management settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Automatic Backups</Label>
                            <p className="text-sm text-muted-foreground">
                                Daily automated database backups
                            </p>
                        </div>
                        <Switch
                            checked={settings.auto_backup}
                            onCheckedChange={(val) => handleChange('auto_backup', val)}
                        />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label>Backup Retention</Label>
                        <Input
                            type="number"
                            value={settings.backup_retention_days}
                            onChange={(e) => handleChange('backup_retention_days', parseInt(e.target.value))}
                            className="rounded-xl"
                        />
                        <p className="text-sm text-muted-foreground">
                            Number of days to retain backups
                        </p>
                    </div>
                    <Separator />
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl">
                            <Database className="h-4 w-4 mr-2" />
                            Backup Now
                        </Button>
                        <Button variant="outline" className="rounded-xl">
                            <Database className="h-4 w-4 mr-2" />
                            Restore Backup
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="rounded-3xl border-black/[0.05]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-[#1a9e8c]" />
                        API Keys
                    </CardTitle>
                    <CardDescription>Manage third-party integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="stripe-key">Stripe Secret Key</Label>
                        <Input
                            id="stripe-key"
                            type="password"
                            value={settings.stripe_secret_key}
                            onChange={(e) => handleChange('stripe_secret_key', e.target.value)}
                            placeholder="sk_test_••••••••••••••••"
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supabase-key">Supabase Service Key</Label>
                        <Input
                            id="supabase-key"
                            type="password"
                            value={settings.supabase_service_key}
                            onChange={(e) => handleChange('supabase_service_key', e.target.value)}
                            placeholder="eyJ••••••••••••••••"
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
                        <Input
                            id="sendgrid-key"
                            type="password"
                            value={settings.sendgrid_api_key}
                            onChange={(e) => handleChange('sendgrid_api_key', e.target.value)}
                            placeholder="SG.••••••••••••••••"
                            className="rounded-xl"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" className="rounded-xl">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-[#1a9e8c] hover:bg-[#15806c] min-w-[140px]"
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
};

export default Settings;
