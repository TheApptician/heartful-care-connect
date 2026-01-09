import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
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
  Eye
} from "lucide-react";

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
  const [selectedSpecialisms, setSelectedSpecialisms] = useState([
    "Personal Care",
    "Elderly Care",
    "Medication Support",
    "Companionship"
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState(["English", "Urdu"]);

  const toggleSpecialism = (specialism: string) => {
    setSelectedSpecialisms(prev =>
      prev.includes(specialism)
        ? prev.filter(s => s !== specialism)
        : [...prev, specialism]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  return (
    <DashboardLayout role="carer">
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
            <Button onClick={() => setIsEditing(!isEditing)}>
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
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="text-2xl font-bold text-primary">£25/hr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="specialisms">Specialisms</TabsTrigger>
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
                    <Input defaultValue="Sarah" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Khan" disabled={!isEditing} />
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
                    <Label>Date of Birth</Label>
                    <Input type="date" defaultValue="1988-05-15" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select defaultValue="female" disabled={!isEditing}>
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
                  <Input defaultValue="123 High Street" disabled={!isEditing} />
                  <div className="grid md:grid-cols-3 gap-4 mt-2">
                    <Input defaultValue="Manchester" disabled={!isEditing} placeholder="City" />
                    <Input defaultValue="M1 1AB" disabled={!isEditing} placeholder="Postcode" />
                    <Select defaultValue="england" disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
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
                        variant={selectedLanguages.includes(lang) ? "default" : "outline"}
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
                    <Select defaultValue="5" disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Input type="number" defaultValue="25" disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea 
                    className="min-h-[150px]"
                    disabled={!isEditing}
                    defaultValue="I am a dedicated and compassionate carer with over 5 years of experience in providing high-quality personal care and support. I specialise in elderly care and have extensive experience working with clients who have dementia. I am patient, reliable, and committed to maintaining the dignity and independence of those I care for. I hold an NVQ Level 3 in Health and Social Care and am trained in medication administration, first aid, and moving and handling."
                  />
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

          {/* Specialisms Tab */}
          <TabsContent value="specialisms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Care Specialisms
                </CardTitle>
                <CardDescription>Select the types of care you can provide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {careSpecialisms.map(specialism => (
                    <div
                      key={specialism}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedSpecialisms.includes(specialism) 
                          ? "border-primary bg-primary/5" 
                          : "hover:bg-accent/50"
                      } ${!isEditing && 'cursor-default'}`}
                      onClick={() => isEditing && toggleSpecialism(specialism)}
                    >
                      <Checkbox 
                        checked={selectedSpecialisms.includes(specialism)}
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
                    <Switch disabled={!isEditing} defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Emergency Availability</p>
                      <p className="text-sm text-muted-foreground">Accept short-notice bookings (within 24 hours)</p>
                    </div>
                    <Switch disabled={!isEditing} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Night Shifts</p>
                      <p className="text-sm text-muted-foreground">Available for overnight care (10pm - 6am)</p>
                    </div>
                    <Switch disabled={!isEditing} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Live-in Care</p>
                      <p className="text-sm text-muted-foreground">Available for live-in care arrangements</p>
                    </div>
                    <Switch disabled={!isEditing} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Show on Search</p>
                      <p className="text-sm text-muted-foreground">Appear in carer search results</p>
                    </div>
                    <Switch disabled={!isEditing} defaultChecked />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Travel Radius</Label>
                    <Select defaultValue="10" disabled={!isEditing}>
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
                    <Select defaultValue="2" disabled={!isEditing}>
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
    </DashboardLayout>
  );
}
