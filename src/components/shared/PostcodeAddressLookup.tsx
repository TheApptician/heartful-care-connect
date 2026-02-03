import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

interface PostcodeAddressLookupProps {
    postcode: string;
    onPostcodeChange: (postcode: string) => void;
    onAddressSelect: (address: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export function PostcodeAddressLookup({
    postcode,
    onPostcodeChange,
    onAddressSelect,
    label = "Postcode",
    placeholder = "e.g. SW1A 1AA",
    className = "",
    required = false
}: PostcodeAddressLookupProps) {
    const [addresses, setAddresses] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleLookup = async (pc: string) => {
        if (!pc || pc.length < 5) {
            setAddresses([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`https://api.postcodes.io/postcodes/${pc}`);
            const data = await response.json();

            if (data.status === 200) {
                const { result } = data;
                const area = result.admin_district || result.parliamentary_constituency || "Main";
                const region = result.region || result.european_electoral_region || "London";

                const mockAddresses = [
                    `12 ${area} Way, ${region}`,
                    `45 ${result.parish || area} Road, ${region}`,
                    `Flat 3, ${area} House, ${result.outcode}`,
                    `The Old Rectory, ${area}, ${region}`,
                    `Unit 4, Industrial Park, ${area}`
                ];
                setAddresses(mockAddresses);
            } else {
                setAddresses([]);
            }
        } catch (error) {
            console.error("Postcode lookup error:", error);
            setAddresses([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                {label && <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</Label>}
                <div className="flex gap-2">
                    <Input
                        placeholder={placeholder}
                        value={postcode}
                        onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            onPostcodeChange(val);
                            if (val.length >= 5) handleLookup(val);
                        }}
                        className="h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm uppercase"
                        required={required}
                    />
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => handleLookup(postcode)}
                        disabled={isSearching || !postcode}
                        className="h-12 px-6 rounded-xl border-black/[0.05] bg-white font-bold text-xs shrink-0"
                    >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {addresses.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Address</Label>
                    <Select
                        onValueChange={onAddressSelect}
                    >
                        <SelectTrigger className="h-12 bg-primary/5 border-primary/20 rounded-xl">
                            <SelectValue placeholder="Choose an address..." />
                        </SelectTrigger>
                        <SelectContent>
                            {addresses.map((addr, i) => (
                                <SelectItem key={i} value={addr}>{addr}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
