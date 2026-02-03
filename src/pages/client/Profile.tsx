import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Save, Upload, Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { PostcodeAddressLookup } from "@/components/shared/PostcodeAddressLookup";

const ClientProfile = () => {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postcode: "",
        emergencyContact: "",
        emergencyPhone: "",
        medicalNotes: "",
        avatarUrl: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            const { data: details } = await supabase
                .from("client_details")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setFormData(prev => ({
                    ...prev,
                    firstName: profile.first_name || "",
                    lastName: profile.last_name || "",
                    email: user.email || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                    city: profile.city || "",
                    postcode: profile.postcode || "",
                    avatarUrl: profile.avatar_url || "",
                }));
            }

            if (details) {
                setFormData(prev => ({
                    ...prev,
                    emergencyContact: details.emergency_contact_name || "",
                    emergencyPhone: details.emergency_contact_phone || "",
                    medicalNotes: details.medical_notes || "",
                }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Update profiles
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postcode: formData.postcode,
                })
                .eq("id", user.id);

            if (profileError) throw profileError;

            // Update client_details
            const { error: detailsError } = await supabase
                .from("client_details")
                .upsert({
                    id: user.id,
                    emergency_contact_name: formData.emergencyContact,
                    emergency_contact_phone: formData.emergencyPhone,
                    medical_notes: formData.medicalNotes,
                });

            if (detailsError) throw detailsError;

            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });
            setIsEditing(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Picture */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                <AvatarImage src={formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                    {formData.firstName?.[0]}{formData.lastName?.[0]}
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
                            <p className="text-sm text-muted-foreground">{formData.email}</p>
                            {isEditing && (
                                <Button variant="link" className="px-0 h-auto mt-2">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload New Photo
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your basic contact details</CardDescription>
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
                                disabled={!isEditing}
                                className="pl-10"
                            />
                        </div>
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
                </CardContent>
            </Card>

            {/* Address */}
            <Card>
                <CardHeader>
                    <CardTitle>Address</CardTitle>
                    <CardDescription>Your residential address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <div className="space-y-4">
                            <PostcodeAddressLookup
                                postcode={formData.postcode}
                                onPostcodeChange={(pc) => setFormData(prev => ({ ...prev, postcode: pc }))}
                                onAddressSelect={(addr) => setFormData(prev => ({ ...prev, address: addr }))}
                                label="Postcode"
                            />
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="h-12 border-black/[0.05] rounded-xl text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="h-12 border-black/[0.05] rounded-xl text-sm"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        disabled
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postcode">Postcode</Label>
                                    <Input
                                        id="postcode"
                                        name="postcode"
                                        value={formData.postcode}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
                <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                    <CardDescription>Person to contact in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContact">Contact Name</Label>
                            <Input
                                id="emergencyContact"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyPhone">Contact Phone</Label>
                            <Input
                                id="emergencyPhone"
                                name="emergencyPhone"
                                type="tel"
                                value={formData.emergencyPhone}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medical Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Medical Notes</CardTitle>
                    <CardDescription>Important medical information for carers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="medicalNotes">Notes</Label>
                        <Textarea
                            id="medicalNotes"
                            name="medicalNotes"
                            value={formData.medicalNotes}
                            onChange={handleChange}
                            disabled={!isEditing}
                            rows={4}
                            placeholder="Allergies, medications, special requirements..."
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientProfile;
