import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Shield, 
  Filter,
  Heart,
  MessageSquare,
  Calendar,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";

const careTypes = [
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
];

const carers = [
  {
    id: 1,
    name: "Sarah Khan",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 127,
    location: "Manchester, M1",
    distance: "2.3 miles",
    hourlyRate: 25,
    experience: "5 years",
    specialisms: ["Personal Care", "Elderly Care", "Dementia Care"],
    languages: ["English", "Urdu"],
    verified: true,
    instantBook: true,
    availability: "Available today",
    bio: "Compassionate carer with extensive experience in elderly and dementia care."
  },
  {
    id: 2,
    name: "James O'Brien",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviews: 89,
    location: "Manchester, M4",
    distance: "3.1 miles",
    hourlyRate: 22,
    experience: "3 years",
    specialisms: ["Companionship", "Mobility Assistance", "Medication Support"],
    languages: ["English"],
    verified: true,
    instantBook: false,
    availability: "Available tomorrow",
    bio: "Friendly and patient carer specialising in companionship and mobility support."
  },
  {
    id: 3,
    name: "Priya Patel",
    avatar: "/placeholder.svg",
    rating: 5.0,
    reviews: 156,
    location: "Salford, M5",
    distance: "4.2 miles",
    hourlyRate: 28,
    experience: "8 years",
    specialisms: ["Palliative Care", "Personal Care", "Mental Health Support"],
    languages: ["English", "Hindi", "Gujarati"],
    verified: true,
    instantBook: true,
    availability: "Available today",
    bio: "Experienced palliative care specialist with a gentle and caring approach."
  },
  {
    id: 4,
    name: "Michael Johnson",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviews: 64,
    location: "Manchester, M3",
    distance: "1.8 miles",
    hourlyRate: 24,
    experience: "4 years",
    specialisms: ["Physical Disabilities", "Learning Disabilities", "Personal Care"],
    languages: ["English"],
    verified: true,
    instantBook: true,
    availability: "Available this week",
    bio: "Dedicated carer with experience supporting clients with physical and learning disabilities."
  },
  {
    id: 5,
    name: "Emma Williams",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 112,
    location: "Trafford, M16",
    distance: "5.5 miles",
    hourlyRate: 26,
    experience: "6 years",
    specialisms: ["Elderly Care", "Dementia Care", "Companionship"],
    languages: ["English", "Welsh"],
    verified: true,
    instantBook: false,
    availability: "Available tomorrow",
    bio: "Warm and empathetic carer with a passion for providing quality elderly care."
  },
];

export default function SearchCarers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([15, 35]);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
  const [savedCarers, setSavedCarers] = useState<number[]>([]);

  const toggleCareType = (type: string) => {
    setSelectedCareTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSaved = (carerId: number) => {
    setSavedCarers(prev =>
      prev.includes(carerId) ? prev.filter(id => id !== carerId) : [...prev, carerId]
    );
  };

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find a Carer</h1>
          <p className="text-muted-foreground">Search and connect with verified carers in your area</p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, specialism, or keyword..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1 md:w-[200px]">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Postcode" className="pl-10" defaultValue="M1 1AA" />
                </div>
                <Select defaultValue="10">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="15">15 miles</SelectItem>
                    <SelectItem value="20">20 miles</SelectItem>
                  </SelectContent>
                </Select>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Carers</SheetTitle>
                      <SheetDescription>Refine your search with these filters</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6 mt-6">
                      <div className="space-y-3">
                        <Label>Price Range (£/hour)</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          min={10}
                          max={50}
                          step={1}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>£{priceRange[0]}</span>
                          <span>£{priceRange[1]}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Care Type</Label>
                        <div className="space-y-2">
                          {careTypes.map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox 
                                id={type}
                                checked={selectedCareTypes.includes(type)}
                                onCheckedChange={() => toggleCareType(type)}
                              />
                              <Label htmlFor={type} className="text-sm">{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Availability</Label>
                        <Select defaultValue="any">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any time</SelectItem>
                            <SelectItem value="today">Available today</SelectItem>
                            <SelectItem value="tomorrow">Available tomorrow</SelectItem>
                            <SelectItem value="week">This week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Other Options</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="instant" />
                            <Label htmlFor="instant" className="text-sm">Instant booking only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="verified" defaultChecked />
                            <Label htmlFor="verified" className="text-sm">Verified only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="emergency" />
                            <Label htmlFor="emergency" className="text-sm">Emergency available</Label>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{carers.length}</span> carers found near you
          </p>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="distance">Closest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Carer Cards */}
        <div className="space-y-4">
          {carers.map((carer) => (
            <Card key={carer.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={carer.avatar} />
                        <AvatarFallback>{carer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {carer.verified && (
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{carer.name}</h3>
                        {carer.instantBook && (
                          <Badge variant="secondary" className="text-xs">Instant Book</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          {carer.rating} ({carer.reviews})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {carer.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {carer.experience}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {carer.bio}
                      </p>
                    </div>
                  </div>

                  {/* Specialisms */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {carer.specialisms.map(spec => (
                        <Badge key={spec} variant="outline">{spec}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <span>Languages: {carer.languages.join(", ")}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 ${carer.availability.includes('today') ? 'border-emerald-500 text-emerald-600' : ''}`}
                    >
                      {carer.availability}
                    </Badge>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">£{carer.hourlyRate}</p>
                      <p className="text-sm text-muted-foreground">per hour</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleSaved(carer.id)}
                      >
                        <Heart className={`h-5 w-5 ${savedCarers.includes(carer.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Load More Carers
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
