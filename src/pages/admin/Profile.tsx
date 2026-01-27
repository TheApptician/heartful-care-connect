import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Save, Camera, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminProfile = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "admin",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Not authenticated",
                    description: "Please log in to view your profile.",
                    variant: "destructive",
                });
                return;
            }

            setUserId(user.id);

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            if (profile) {
                setFormData({
                    firstName: profile.first_name || "",
                    lastName: profile.last_name || "",
                    email: profile.email || user.email || "",
                    phone: profile.phone || "",
                    role: profile.role || "admin",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error loading profile",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    full_name: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone,
                })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "Profile Updated",
                description: "Your admin profile has been updated successfully.",
            });
            setIsEditing(false);
            fetchProfile();
        } catch (error: any) {
            toast({
                title: "Error updating profile",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Profile</h1>
                    <p className="text-muted-foreground">Manage your administrator account</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                            setIsEditing(false);
                            fetchProfile();
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Picture */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                    {formData.firstName[0] || 'A'}{formData.lastName[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {formData.firstName} {formData.lastName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield className="h-4 w-4 text-primary" />
                                <p className="text-sm text-muted-foreground capitalize">{formData.role}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your admin account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                className="pl-10 bg-muted"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            name="role"
                            value={formData.role}
                            disabled
                            className="bg-muted capitalize"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Admin Permissions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Administrator Permissions
                    </CardTitle>
                    <CardDescription>Your access level and capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">Full User Management</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">Verification Approval</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">System Configuration</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">Financial Controls</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">Analytics Access</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">Dispute Resolution</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProfile;
