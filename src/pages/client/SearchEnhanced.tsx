// Enhanced Client Search Page with Advanced Filters
import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    MapPin,
    Star,
    Shield,
    Clock,
    Heart,
    Filter,
    X,
    ChevronRight,
    AlertCircle,
    MessageSquare,
} from 'lucide-react';
import { formatCurrency, MINIMUM_HOURLY_RATE } from '@/lib/fees';
import { getVerificationBadge } from '@/lib/compliance';

const SPECIALIZATIONS = [
    'Personal Care',
    'Dementia Care',
    'Palliative Care',
    'Mental Health Support',
    'Learning Disabilities',
    'Physical Disabilities',
    'Elderly Care',
    'Companionship',
    'Medication Support',
    'Mobility Assistance',
];

const EXPERIENCE_LEVELS = [
    { value: '1', label: '1-2 years' },
    { value: '3', label: '3-5 years' },
    { value: '5', label: '5-10 years' },
    { value: '10', label: '10+ years' },
];

interface Carer {
    id: string;
    full_name: string;
    avatar_url: string | null;
    carer_details: {
        hourly_rate: number;
        years_experience: number;
        bio: string;
        specializations: string[];
        postcode: string;
    };
    carer_verification: {
        overall_status: string;
    } | null;
}

export default function ClientSearchEnhanced() {
    const [carers, setCarers] = useState<Carer[]>([]);
    const [filteredCarers, setFilteredCarers] = useState<Carer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [postcodeFilter, setPostcodeFilter] = useState('');
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
    const [minExperience, setMinExperience] = useState('');
    const [maxRate, setMaxRate] = useState('');
    const [verifiedOnly, setVerifiedOnly] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCarers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [carers, searchQuery, postcodeFilter, selectedSpecializations, minExperience, maxRate, verifiedOnly]);

    const fetchCarers = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('profiles')
                .select(`
          id,
          full_name,
          avatar_url,
          carer_details (
            hourly_rate,
            years_experience,
            bio,
            specializations,
            postcode
          ),
          carer_verification (
            overall_status
          )
        `)
                .eq('role', 'carer')
                .not('carer_details', 'is', null);

            if (error) throw error;

            setCarers(data || []);
        } catch (error: any) {
            console.error('Error fetching carers:', error);
            toast({
                title: 'Error',
                description: 'Failed to load carers',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...carers];

        // Verified only filter
        if (verifiedOnly) {
            filtered = filtered.filter(
                carer => carer.carer_verification?.overall_status === 'verified'
            );
        }

        // Search query (name or bio)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                carer =>
                    carer.full_name.toLowerCase().includes(query) ||
                    carer.carer_details?.bio?.toLowerCase().includes(query)
            );
        }

        // Postcode filter (starts with)
        if (postcodeFilter) {
            const postcode = postcodeFilter.toUpperCase().replace(/\s/g, '');
            filtered = filtered.filter(carer =>
                carer.carer_details?.postcode?.toUpperCase().replace(/\s/g, '').startsWith(postcode)
            );
        }

        // Specializations filter
        if (selectedSpecializations.length > 0) {
            filtered = filtered.filter(carer =>
                selectedSpecializations.some(spec =>
                    carer.carer_details?.specializations?.includes(spec)
                )
            );
        }

        // Minimum experience filter
        if (minExperience) {
            const minYears = parseInt(minExperience);
            filtered = filtered.filter(
                carer => (carer.carer_details?.years_experience || 0) >= minYears
            );
        }

        // Maximum rate filter
        if (maxRate) {
            const maxRateNum = parseFloat(maxRate);
            filtered = filtered.filter(
                carer => (carer.carer_details?.hourly_rate || 0) <= maxRateNum
            );
        }

        // Sort by rate (ascending)
        filtered.sort((a, b) => {
            const rateA = a.carer_details?.hourly_rate || 0;
            const rateB = b.carer_details?.hourly_rate || 0;
            return rateA - rateB;
        });

        setFilteredCarers(filtered);
    };

    const toggleSpecialization = (spec: string) => {
        setSelectedSpecializations(prev =>
            prev.includes(spec)
                ? prev.filter(s => s !== spec)
                : [...prev, spec]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setPostcodeFilter('');
        setSelectedSpecializations([]);
        setMinExperience('');
        setMaxRate('');
        setVerifiedOnly(true);
    };

    const activeFiltersCount = [
        searchQuery,
        postcodeFilter,
        selectedSpecializations.length > 0,
        minExperience,
        maxRate,
    ].filter(Boolean).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading carers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto py-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Find Care
                    </span>
                </div>
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">Search Carers</h1>
                <p className="text-slate-500 font-medium">
                    Find verified, experienced carers in your area
                </p>
            </div>

            {/* Search & Filters */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    {/* Main Search */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Search by name or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base"
                            />
                        </div>
                        <div className="relative w-64">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Postcode (e.g., M1)"
                                value={postcodeFilter}
                                onChange={(e) => setPostcodeFilter(e.target.value)}
                                className="pl-10 h-12 text-base"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="h-12 px-6"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge className="ml-2 bg-[#1a9e8c]">{activeFiltersCount}</Badge>
                            )}
                        </Button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="p-6 rounded-2xl bg-slate-50 border space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">Advanced Filters</h3>
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="h-4 w-4 mr-1" />
                                    Clear All
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Verified Only */}
                                <div className="flex items-center space-x-3 p-4 rounded-lg border bg-white">
                                    <Checkbox
                                        id="verified-only"
                                        checked={verifiedOnly}
                                        onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="verified-only" className="font-bold cursor-pointer">
                                            Verified Carers Only
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Show only carers with completed verification
                                        </p>
                                    </div>
                                    <Shield className="h-5 w-5 text-green-500" />
                                </div>

                                {/* Experience Level */}
                                <div className="space-y-2">
                                    <Label>Minimum Experience</Label>
                                    <Select value={minExperience} onValueChange={setMinExperience}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any experience level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Any experience level</SelectItem>
                                            {EXPERIENCE_LEVELS.map(level => (
                                                <SelectItem key={level.value} value={level.value}>
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Maximum Rate */}
                                <div className="space-y-2">
                                    <Label>Maximum Hourly Rate</Label>
                                    <Input
                                        type="number"
                                        min={MINIMUM_HOURLY_RATE}
                                        step="0.50"
                                        placeholder={`£${MINIMUM_HOURLY_RATE}+`}
                                        value={maxRate}
                                        onChange={(e) => setMaxRate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Specializations */}
                            <div className="space-y-3">
                                <Label>Specializations</Label>
                                <div className="flex flex-wrap gap-2">
                                    {SPECIALIZATIONS.map(spec => (
                                        <Badge
                                            key={spec}
                                            variant={selectedSpecializations.includes(spec) ? 'default' : 'outline'}
                                            className="cursor-pointer hover:bg-primary/80 transition-colors"
                                            onClick={() => toggleSpecialization(spec)}
                                        >
                                            {spec}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            {filteredCarers.length} {filteredCarers.length === 1 ? 'carer' : 'carers'} found
                            {verifiedOnly && ' (verified only)'}
                        </span>
                        {!verifiedOnly && (
                            <div className="flex items-center gap-2 text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>Showing unverified carers</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {filteredCarers.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No carers found</h3>
                        <p className="text-slate-500 mb-4">
                            Try adjusting your filters or search criteria
                        </p>
                        <Button onClick={clearFilters} variant="outline">
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCarers.map(carer => {
                        const verificationBadge = getVerificationBadge(
                            carer.carer_verification?.overall_status || 'pending'
                        );

                        return (
                            <Card
                                key={carer.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => navigate(`/client/book/${carer.id}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage
                                                src={carer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${carer.full_name}`}
                                            />
                                            <AvatarFallback className="text-xl">
                                                {carer.full_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg mb-1 truncate">
                                                {carer.full_name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={verificationBadge.color}>
                                                    <Shield className="h-3 w-3 mr-1" />
                                                    {verificationBadge.label}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {carer.carer_details?.years_experience || 0} yrs
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {carer.carer_details?.postcode || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <CardDescription className="line-clamp-2 min-h-[40px]">
                                        {carer.carer_details?.bio || 'No bio available'}
                                    </CardDescription>

                                    {/* Specializations */}
                                    {carer.carer_details?.specializations && carer.carer_details.specializations.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {carer.carer_details.specializations.slice(0, 3).map(spec => (
                                                <Badge key={spec} variant="outline" className="text-xs">
                                                    <Heart className="h-2 w-2 mr-1" />
                                                    {spec}
                                                </Badge>
                                            ))}
                                            {carer.carer_details.specializations.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{carer.carer_details.specializations.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Rate & Book Button */}
                                    <div className="flex items-center justify-between pt-4 border-t gap-2">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Hourly Rate</p>
                                            <p className="text-2xl font-black text-[#1a9e8c]">
                                                {formatCurrency(carer.carer_details?.hourly_rate || 0)}
                                                <span className="text-sm font-normal text-slate-500">/hr</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-xl border-black/5"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/client/messages?userId=${carer.id}`);
                                                }}
                                            >
                                                <MessageSquare className="h-4 w-4 text-[#1a9e8c]" />
                                            </Button>
                                            <Button
                                                className="group-hover:bg-[#1a9e8c]/90 rounded-xl"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/client/book/${carer.id}`);
                                                }}
                                            >
                                                Book Now
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
