import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { MINIMUM_HOURLY_RATE, validateMinimumRate } from "@/lib/fees";

const careSpecialisms = [
  "Personal Care",
  "Dementia Care",
  "Palliative Care",
  "Mental Health Support",
  "Learning Disabilities",
  "Physical Disabilities",
  "Elderly Care",
  "Companionship",
  "Medication Support",
  "Mobility Assistance",
  "Meal Preparation",
  "Light Housekeeping",
];

const languages = [
  "English",
  "Welsh",
  "Polish",
  "Urdu",
  "Hindi",
  "Punjabi",
  "Bengali",
  "Gujarati",
  "Arabic",
  "French",
  "Spanish",
  "Mandarin",
];

export default function CarerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Profile State
  const [profile, setProfile] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    postcode: "",
    country: "UK",
    avatar_url: ""
  });

  // Carer Details State
  const [carerDetails, setCarerDetails] = useState<any>({
    experience_years: "1",
    hourly_rate: 25,
    bio: "",
    specializations: [],
    languages: ["English"],
    travel_radius: 10,
    min_booking_duration: 1,
    instant_booking: true,
    emergency_availability: false,
    night_shifts: false,
    live_in_care: false,
    visiting_care: false,
    show_on_search: true,
    video_url: "",
    hobbies: "",
    has_transportation: false
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (profileData) setProfile(profileData);

      // Fetch Carer Details
      const { data: carerData, error: carerError } = await supabase
        .from("carer_details")
        .select("*")
        .eq("id", user.id)
        .single();

      if (carerError && carerError.code !== "PGRST116") throw carerError;
      if (carerData) setCarerDetails(carerData);

    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
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

      // Validate minimum hourly rate
      if (!validateMinimumRate(carerDetails.hourly_rate)) {
        toast({
          title: "Rate Below Minimum",
          description: `Your hourly rate must be at least £${MINIMUM_HOURLY_RATE}/hour as per platform policy.`,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Update Profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          full_name: `${profile.first_name} ${profile.last_name}`,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          postcode: profile.postcode,
          country: profile.country,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          avatar_url: profile.avatar_url
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Upsert Carer Details
      const { error: carerError } = await supabase
        .from("carer_details")
        .upsert({
          id: user.id,
          ...carerDetails
        });

      if (carerError) throw carerError;

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSpecialism = (specialism: string) => {
    setCarerDetails((prev: any) => ({
      ...prev,
      specializations: prev.specializations.includes(specialism)
        ? prev.specializations.filter((s: string) => s !== specialism)
        : [...prev.specializations, specialism]
    }));
  };

  const toggleLanguage = (language: string) => {
    setCarerDetails((prev: any) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l: string) => l !== language)
        : [...prev.languages, language]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#1a9e8c]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your carer profile and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Profile
          </Button>
          <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isEditing ? (
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
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                <Badge className="bg-emerald-500">
                  <Shield className="h-3 w-3 mr-1" />
                  {profile.verified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.city || 'Location not set'}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  4.9 (Demo)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {carerDetails.experience_years} years experience
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Hourly Rate</p>
              <p className="text-2xl font-bold text-primary">£{carerDetails.hourly_rate}/hr</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic contact and personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={profile.first_name || ""}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((p: any) => ({ ...p, first_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={profile.last_name || ""}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((p: any) => ({ ...p, last_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={profile.email || ""}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((p: any) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    value={profile.phone || ""}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((p: any) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profile.date_of_birth || ""}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((p: any) => ({ ...p, date_of_birth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={profile.gender || ""}
                    disabled={!isEditing}
                    onValueChange={(val) => setProfile((p: any) => ({ ...p, gender: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  value={profile.address || ""}
                  disabled={!isEditing}
                  onChange={(e) => setProfile((p: any) => ({ ...p, address: e.target.value }))}
                />
                <div className="grid md:grid-cols-3 gap-4 mt-2">
                  <Input
                    value={profile.city || ""}
                    disabled={!isEditing}
                    placeholder="City"
                    onChange={(e) => setProfile((p: any) => ({ ...p, city: e.target.value }))}
                  />
                  <Input
                    value={profile.postcode || ""}
                    disabled={!isEditing}
                    placeholder="Postcode"
                    onChange={(e) => setProfile((p: any) => ({ ...p, postcode: e.target.value }))}
                  />
                  <Select
                    value={profile.country || "UK"}
                    disabled={!isEditing}
                    onValueChange={(val) => setProfile((p: any) => ({ ...p, country: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="england">England</SelectItem>
                      <SelectItem value="wales">Wales</SelectItem>
                      <SelectItem value="scotland">Scotland</SelectItem>
                      <SelectItem value="ni">Northern Ireland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages Spoken</Label>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <Badge
                      key={lang}
                      variant={carerDetails.languages.includes(lang) ? "default" : "outline"}
                      className={`cursor-pointer ${isEditing ? 'hover:bg-primary/80' : ''}`}
                      onClick={() => isEditing && toggleLanguage(lang)}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional">
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
                  <Select
                    value={carerDetails.experience_years?.toString() || "1"}
                    disabled={!isEditing}
                    onValueChange={(val) => setCarerDetails((c: any) => ({ ...c, experience_years: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">6 Months - 1 Year</SelectItem>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="2">2 years</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hourly Rate (£)</Label>
                  <Input
                    type="number"
                    min={MINIMUM_HOURLY_RATE}
                    value={carerDetails.hourly_rate || 25}
                    disabled={!isEditing}
                    onChange={(e) => setCarerDetails((c: any) => ({ ...c, hourly_rate: parseFloat(e.target.value) }))}
                    className={carerDetails.hourly_rate < MINIMUM_HOURLY_RATE ? "border-red-500" : ""}
                  />
                  {carerDetails.hourly_rate < MINIMUM_HOURLY_RATE && (
                    <p className="text-xs text-red-500">Minimum rate is £{MINIMUM_HOURLY_RATE}/hour</p>
                  )}
                  <p className="text-xs text-muted-foreground">Platform minimum: £{MINIMUM_HOURLY_RATE}/hr</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Professional Bio</Label>
                <Textarea
                  className="min-h-[150px]"
                  disabled={!isEditing}
                  value={carerDetails.bio || ""}
                  onChange={(e) => setCarerDetails((c: any) => ({ ...c, bio: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Driving Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{carerDetails.has_transportation ? "I can drive / have a car" : "Non-driver"}</span>
                    <Switch
                      disabled={!isEditing}
                      checked={carerDetails.has_transportation}
                      onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, has_transportation: val }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hobbies & Interests</Label>
                <Textarea
                  placeholder="E.g., Reading, Gardening, Cooking, Walking..."
                  disabled={!isEditing}
                  value={carerDetails.hobbies || ""}
                  onChange={(e) => setCarerDetails((c: any) => ({ ...c, hobbies: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Welcome Video (URL)
                </Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  disabled={!isEditing}
                  value={carerDetails.video_url || ""}
                  onChange={(e) => setCarerDetails((c: any) => ({ ...c, video_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Link to a short video introducing yourself to clients (YouTube, Loom, etc.)</p>
              </div>

              <div className="space-y-4">
                <Label>Qualifications & Training</Label>
                <div className="space-y-3">
                  {[
                    { name: "NVQ Level 3 Health & Social Care", year: "2020" },
                    { name: "Enhanced DBS Certificate", year: "2023" },
                    { name: "First Aid Certified", year: "2024" },
                    { name: "Moving & Handling Training", year: "2024" },
                    { name: "Medication Administration", year: "2023" },
                  ].map((qual, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <span>{qual.name}</span>
                      </div>
                      <Badge variant="outline">{qual.year}</Badge>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" className="w-full">
                    + Add Qualification
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specialties Tab */}
        <TabsContent value="specialties">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Care Specialties
              </CardTitle>
              <CardDescription>Select the types of care you can provide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {careSpecialisms.map(specialism => (
                  <div
                    key={specialism}
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${carerDetails.specializations.includes(specialism)
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent/50"
                      } ${!isEditing && 'cursor-default'}`}
                    onClick={() => isEditing && toggleSpecialism(specialism)}
                  >
                    <Checkbox
                      checked={carerDetails.specializations.includes(specialism)}
                      disabled={!isEditing}
                    />
                    <Label className="cursor-pointer">{specialism}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Work Preferences
              </CardTitle>
              <CardDescription>Configure your availability and work preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Instant Booking</p>
                    <p className="text-sm text-muted-foreground">Allow clients to book without approval</p>
                  </div>
                  <Switch
                    disabled={!isEditing}
                    checked={carerDetails.instant_booking}
                    onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, instant_booking: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Emergency Availability</p>
                    <p className="text-sm text-muted-foreground">Accept short-notice bookings (within 24 hours)</p>
                  </div>
                  <Switch
                    disabled={!isEditing}
                    checked={carerDetails.emergency_availability}
                    onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, emergency_availability: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Night Shifts</p>
                    <p className="text-sm text-muted-foreground">Available for overnight care (10pm - 6am)</p>
                  </div>
                  <Switch
                    disabled={!isEditing}
                    checked={carerDetails.night_shifts}
                    onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, night_shifts: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Visiting Care</p>
                    <p className="text-sm text-muted-foreground">Available for home visits (hourly)</p>
                  </div>
                  <Switch
                    disabled={!isEditing}
                    checked={carerDetails.visiting_care}
                    onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, visiting_care: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Live-in Care</p>
                    <p className="text-sm text-muted-foreground">Available for live-in care arrangements</p>
                  </div>
                  <Switch
                    disabled={!isEditing}
                    checked={carerDetails.live_in_care}
                    onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, live_in_care: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Show on Search</p>
                    <p className="text-sm text-muted-foreground">Appear in carer search results</p>
                  </div>
                  <Switch
                    disabled={!isEditing}
                    checked={carerDetails.show_on_search}
                    onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, show_on_search: val }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Travel Radius</Label>
                  <Select
                    value={carerDetails.travel_radius?.toString() || "10"}
                    disabled={!isEditing}
                    onValueChange={(val) => setCarerDetails((c: any) => ({ ...c, travel_radius: parseInt(val) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="15">15 miles</SelectItem>
                      <SelectItem value="20">20 miles</SelectItem>
                      <SelectItem value="30">30 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Booking Duration</Label>
                  <Select
                    value={carerDetails.min_booking_duration?.toString() || "2"}
                    disabled={!isEditing}
                    onValueChange={(val) => setCarerDetails((c: any) => ({ ...c, min_booking_duration: parseInt(val) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
