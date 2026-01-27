import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  Filter,
  Heart,
  MessageSquare,
  Calendar,
  ChevronRight,
  SlidersHorizontal,
  Zap,
  Sparkles,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface CarerProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  carer_details: {
    bio: string;
    experience_years: string;
    specializations: string[];
    hourly_rate: number;
    verification_status: string;
    availability_status: string;
  };
  distance?: string; // Mocked for now
  rating?: number; // Mocked for now
  reviews?: number; // Mocked for now
}

export default function SearchCarers() {
  const navigate = useNavigate();
  const [carers, setCarers] = useState<CarerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([15, 50]);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
  const [savedCarers, setSavedCarers] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCarers();
  }, [searchQuery, priceRange, selectedCareTypes]);

  const fetchCarers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          carer_details!inner (
            bio,
            experience_years,
            specializations,
            hourly_rate,
            verification_status,
            availability_status
          )
        `)
        .eq('role', 'carer');

      if (searchQuery) {
        query = query.ilike('full_name', `%${searchQuery}%`);
      }

      if (selectedCareTypes.length > 0) {
        query = query.contains('carer_details.skills', selectedCareTypes);
      }

      // Supabase inner join filtering for range
      query = query.gte('carer_details.hourly_rate', priceRange[0]);
      query = query.lte('carer_details.hourly_rate', priceRange[1]);

      const { data, error } = await query;

      if (error) throw error;

      // Transform and mock missing data for UI excellence
      const transformedData = (data as any[] || []).map(carer => ({
        ...carer,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 200),
        distance: `${(Math.random() * 10).toFixed(1)} miles`
      }));

      setCarers(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching carers",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCareType = (type: string) => {
    setSelectedCareTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSaved = (carerId: string) => {
    setSavedCarers(prev =>
      prev.includes(carerId) ? prev.filter(id => id !== carerId) : [...prev, carerId]
    );
    toast({
      title: savedCarers.includes(carerId) ? "Removed from favorites" : "Saved to favorites",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find elite vetted carers specialized in premium home care.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Top 1% Vetted Talent</span>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <Card className="border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-xl">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name, expertise, or location..."
                className="pl-11 h-11 rounded-xl border-black/5 bg-white/50 focus:bg-white transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative w-full md:w-[150px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Postcode" className="pl-11 h-11 rounded-xl border-black/5 bg-white/50 text-sm" defaultValue="M1 1AA" />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 px-5 rounded-xl border-black/5 bg-white/50 font-bold text-sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Refine Search</SheetTitle>
                    <SheetDescription>Tailor your results to your specific care needs.</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 mt-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Budget Range</Label>
                        <span className="text-sm font-bold text-primary">£{priceRange[0]} — £{priceRange[1]}</span>
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={15}
                        max={100}
                        step={1}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Care Expertise</Label>
                      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                        {careTypes.map(type => (
                          <div key={type}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${selectedCareTypes.includes(type) ? 'border-primary bg-primary/5' : 'border-black/5 bg-muted/30 hover:bg-muted/50'}`}
                            onClick={() => toggleCareType(type)}
                          >
                            <Label className="text-sm font-medium cursor-pointer">{type}</Label>
                            <Checkbox
                              checked={selectedCareTypes.includes(type)}
                              onCheckedChange={() => toggleCareType(type)}
                              className="h-4 w-4 rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/10" onClick={() => fetchCarers()}>
                      Show Results
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Results Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[12px] font-bold text-muted-foreground">
            <span className="text-foreground">{carers.length} Carers</span> in your area
          </p>
        </div>
        <Select defaultValue="recommended">
          <SelectTrigger className="w-[180px] h-9 rounded-lg border-black/5 bg-white text-[12px] font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="price-low">Price: Low-High</SelectItem>
            <SelectItem value="price-high">Price: High-Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Grid / Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 w-full rounded-2xl bg-muted/30 animate-pulse border border-black/5" />
          ))}
        </div>
      ) : carers.length === 0 ? (
        <Card className="p-16 text-center rounded-2xl border-dashed border-2">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-1">No matches found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
          <Button variant="outline" className="mt-4 rounded-lg h-9 text-xs font-bold" onClick={() => {
            setSearchQuery("");
            setPriceRange([15, 50]);
            setSelectedCareTypes([]);
          }}>Clear All Filters</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {carers.map((carer) => (
            <Card key={carer.id} className="group hover:border-primary/20 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md bg-white border-black/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Main Content */}
                  <div className="flex-1 p-5 md:p-6">
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="relative shrink-0">
                        <Avatar className="h-20 w-20 rounded-2xl shadow-md border-2 border-white">
                          <AvatarImage src={carer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${carer.full_name}`} />
                          <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                            {carer.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {carer.carer_details.verification_status === 'verified' && (
                          <div className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-md border-2 border-white">
                            <ShieldCheck className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-foreground tracking-tight">{carer.full_name}</h3>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 font-bold rounded-md border-emerald-100 uppercase text-[9px] tracking-wider px-1.5 py-0">
                              Active
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-colors"
                            onClick={() => toggleSaved(carer.id)}
                          >
                            <Heart className={`h-4.5 w-4.5 ${savedCarers.includes(carer.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground opacity-30'}`} />
                              ))}
                            </div>
                            <span className="text-[12px] font-bold text-foreground">{carer.rating?.toFixed(1) || '4.9'}</span>
                            <span className="text-[11px] font-medium text-muted-foreground">({carer.reviews || '45'})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                            <MapPin className="h-3 w-3 text-primary opacity-70" />
                            {carer.distance || '2.4 miles'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                            <Award className="h-3 w-3 text-accent opacity-70" />
                            {carer.carer_details.experience_years}
                          </div>
                        </div>

                        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                          {carer.carer_details.bio || 'Professional caregiver dedicated to providing compassionate and high-quality care support at home.'}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {carer.carer_details.specializations?.slice(0, 3).map(spec => (
                            <span key={spec} className="px-2 py-0.5 rounded-md bg-slate-50 border border-black/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Panel */}
                  <div className="lg:w-[220px] p-5 md:p-6 bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-black/5 flex flex-col justify-center">
                    <div className="flex items-center justify-between lg:flex-col lg:items-start lg:gap-1 mb-4 lg:mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary tracking-tight">£{carer.carer_details.hourly_rate}</span>
                        <span className="text-xs font-medium text-muted-foreground">/ hr</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Fast Reply</span>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-9 rounded-lg font-bold text-xs border-black/5 bg-white"
                        onClick={() => navigate(`/client/messages?userId=${carer.id}`)}
                      >
                        Message
                      </Button>
                      <Button className="flex-1 h-9 rounded-lg font-bold text-xs shadow-sm bg-primary" onClick={() => navigate(`/client/book/${carer.id}`)}>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Refined */}
      {!loading && carers.length > 0 && (
        <div className="flex justify-center pt-4 pb-8">
          <Button variant="ghost" className="h-10 px-6 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary transition-all">
            Load More Results
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
