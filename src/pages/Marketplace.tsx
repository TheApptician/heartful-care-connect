import { useState, useEffect } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, ShieldCheck, Clock, MapPin, BadgeCheck, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Carer {
    id: string;
    full_name: string;
    avatar_url: string | null;
    carer_details: {
        bio: string;
        hourly_rate: number;
        verification_status: string;
        specializations: string[];
        experience_years: string;
    } | null;
}

const Marketplace = () => {
    const [carers, setCarers] = useState<Carer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCarers();
    }, []);

    const fetchCarers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    avatar_url,
                    carer_details(
                        bio,
                        hourly_rate,
                        verification_status,
                        specializations,
                        experience_years
                    )
                `)
                .eq('role', 'carer')
                .limit(12);

            if (error) throw error;
            setCarers(data || []);
        } catch (error) {
            console.error('Error fetching carers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCarers = carers.filter(carer =>
        !searchQuery ||
        carer.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Header />
            <main className="pt-28 lg:pt-36 pb-20">
                <div className="container mx-auto px-6 lg:px-12">
                    {/* Header Section */}
                    <div className="max-w-4xl mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 text-[#1a9e8c] text-[10px] font-black uppercase tracking-widest mb-6">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            UK CQC Compliant Introductory Agency
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-[#111827] mb-8 tracking-tighter leading-[0.95]">
                            Discover Elite <br />
                            <span className="text-[#1a9e8c]">Independent Care.</span>
                        </h1>
                        <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-2xl">
                            Heems connects you directly with the UK's most rigorously vetted,
                            self-employed carers. High-value families deserve high-performance care.
                        </p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-16 p-3 bg-white rounded-3xl border border-black/[0.05] shadow-2xl shadow-black/5">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search carers by name..."
                                className="pl-14 h-16 bg-transparent border-none rounded-2xl text-base font-semibold focus-visible:ring-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-px bg-black/5 hidden lg:block my-2" />
                        <div className="relative lg:w-72">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="UK Postcode"
                                className="pl-14 h-16 bg-transparent border-none rounded-2xl text-base font-semibold focus-visible:ring-0"
                            />
                        </div>
                        <Button className="h-16 px-10 rounded-2xl bg-[#111827] text-white font-black text-sm hover:bg-[#1a9e8c] transition-all gap-3 shadow-xl shadow-black/10">
                            <Filter className="w-4 h-4" />
                            Apply Filters
                        </Button>
                    </div>

                    {/* Carer Grid */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-96 w-full rounded-[2.5rem] bg-muted/30 animate-pulse border border-black/5" />
                            ))}
                        </div>
                    ) : filteredCarers.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">No carers found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredCarers.map((carer) => (
                                <div key={carer.id} className="group relative bg-white rounded-[2.5rem] border border-black/[0.05] hover:border-[#1a9e8c]/30 transition-all duration-700 hover:-translate-y-2 overflow-hidden shadow-sm hover:shadow-2xl">
                                    {/* Badge Overlay */}
                                    <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                                        {carer.carer_details?.verification_status === 'verified' && (
                                            <div className="px-3 py-1 rounded-full bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                                <Star className="w-3 h-3 text-[#1a9e8c] fill-[#1a9e8c]" />
                                                Verified Carer
                                            </div>
                                        )}
                                    </div>

                                    <div className="aspect-[5/4] bg-slate-100 relative overflow-hidden">
                                        <img
                                            src={carer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${carer.full_name}`}
                                            alt={carer.full_name || 'Carer'}
                                            className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white tracking-tight mb-0.5">
                                                        {carer.full_name || 'Carer'}
                                                    </h3>
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                                                        {carer.carer_details?.specializations?.[0] || 'Care Professional'}
                                                    </p>
                                                </div>
                                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/20">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3.5 h-3.5 text-[#1a9e8c] fill-[#1a9e8c]" />
                                                        <span className="text-sm font-black text-white">4.9</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {/* Verification Vault Section */}
                                        <div className="mb-8">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vetting Status</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-black/[0.02]">
                                                    <BadgeCheck className="w-4 h-4 text-[#1a9e8c]" />
                                                    <span className="text-[11px] font-bold text-[#111827]">Fully Vetted</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-black/[0.02]">
                                                    <FileCheck className="w-4 h-4 text-[#1a9e8c]" />
                                                    <span className="text-[11px] font-bold text-[#111827]">DBS Enhanced</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Market Rate</p>
                                                <p className="text-3xl font-black text-[#111827] mt-1.5 tracking-tighter">
                                                    £{carer.carer_details?.hourly_rate || 25}
                                                    <span className="text-sm font-bold text-slate-300">/hr</span>
                                                </p>
                                            </div>
                                            <Button
                                                asChild
                                                className="h-14 rounded-2xl bg-[#111827] text-white font-black text-xs hover:bg-[#1a9e8c] transition-all px-8 border-none shadow-xl shadow-black/5"
                                            >
                                                <Link to={`/client/book/${carer.id}`}>
                                                    Secure Profile
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Infrastructure Note */}
                    <div className="mt-24 p-12 rounded-[3.5rem] bg-[#111827] relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 tracking-tight">
                                    Rigorous Compliance as Standard.
                                </h2>
                                <p className="text-white/60 font-medium leading-relaxed mb-8">
                                    Heems operates strictly as an introductory agency. We verify credentials
                                    so you can focus on building a direct relationship with your care professional.
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c]" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">2-Referral rule</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c]" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Compliance Expiry Alerts</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c]" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">RTW Verification</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button asChild className="h-16 px-12 rounded-2xl bg-white text-[#111827] font-black hover:bg-[#1a9e8c] hover:text-white transition-all text-sm">
                                    <Link to="/register?role=organisation">
                                        Apply as a Care Organisation
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Marketplace;
