import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Search,
    UserCheck,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreVertical,
    Star,
    Download,
    Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Carer {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    verified: boolean;
    created_at: string;
    location: string | null;
    hourly_rate: number | null;
}

const AdminCarers = () => {
    const [carers, setCarers] = useState<Carer[]>([]);
    const [filteredCarers, setFilteredCarers] = useState<Carer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const { toast } = useToast();

    useEffect(() => {
        fetchCarers();
    }, []);

    useEffect(() => {
        filterCarers();
    }, [carers, searchQuery, statusFilter, verificationFilter]);

    const fetchCarers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'carer')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCarers(data || []);
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

    const filterCarers = () => {
        let filtered = carers;

        if (searchQuery) {
            filtered = filtered.filter(carer =>
                carer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                carer.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                carer.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                carer.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (verificationFilter !== "all") {
            if (verificationFilter === "verified") {
                filtered = filtered.filter(carer => carer.verified);
            } else if (verificationFilter === "unverified") {
                filtered = filtered.filter(carer => !carer.verified);
            }
        }

        setFilteredCarers(filtered);
    };

    const handleToggleVerification = async (carer: Carer) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ verified: !carer.verified })
                .eq('id', carer.id);

            if (error) throw error;

            toast({
                title: carer.verified ? "Carer unverified" : "Carer verified",
                description: `${carer.email} has been ${carer.verified ? "unverified" : "verified"}.`,
            });

            fetchCarers();
        } catch (error: any) {
            toast({
                title: "Error updating verification",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleExport = () => {
        const csv = [
            ['Name', 'Email', 'Phone', 'Location', 'Hourly Rate', 'Verified'].join(','),
            ...filteredCarers.map(carer => [
                `${carer.first_name || ''} ${carer.last_name || ''}`.trim() || carer.full_name || '',
                carer.email,
                carer.phone || 'N/A',
                carer.location || 'N/A',
                carer.hourly_rate ? `£${carer.hourly_rate}` : 'N/A',
                carer.verified ? 'Yes' : 'No'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast({
            title: "Export successful",
            description: `Exported ${filteredCarers.length} carers to CSV.`,
        });
    };

    const getCarerName = (carer: Carer) => {
        if (carer.first_name && carer.last_name) {
            return `${carer.first_name} ${carer.last_name}`;
        }
        if (carer.full_name) {
            return carer.full_name;
        }
        return carer.email;
    };

    const getCarerInitials = (carer: Carer) => {
        if (carer.first_name && carer.last_name && carer.first_name.length > 0 && carer.last_name.length > 0) {
            return `${carer.first_name[0]}${carer.last_name[0]}`.toUpperCase();
        }
        if (carer.full_name && carer.full_name.length > 0) {
            const parts = carer.full_name.split(' ').filter(n => n.length > 0);
            if (parts.length > 0) {
                return parts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
            }
        }
        if (carer.email && carer.email.length > 0) {
            return carer.email[0].toUpperCase();
        }
        return 'C';
    };

    const stats = {
        total: carers.length,
        verified: carers.filter(c => c.verified).length,
        pending: carers.filter(c => !c.verified).length,
        avgRate: carers.filter(c => c.hourly_rate).length > 0
            ? Math.round(carers.filter(c => c.hourly_rate).reduce((sum, c) => sum + (c.hourly_rate || 0), 0) / carers.filter(c => c.hourly_rate).length)
            : 0,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Carer Management</h1>
                    <p className="text-muted-foreground">Manage all platform carers</p>
                </div>
                <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-sm text-muted-foreground">Total Carers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.verified}</p>
                                <p className="text-sm text-muted-foreground">Verified</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Star className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">£{stats.avgRate}</p>
                                <p className="text-sm text-muted-foreground">Avg. Rate/hr</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search carers..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Carers Table */}
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Carer</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Hourly Rate</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCarers.map((carer) => (
                                <TableRow key={carer.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={carer.avatar_url || undefined} />
                                                <AvatarFallback>{getCarerInitials(carer)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{getCarerName(carer)}</p>
                                                <p className="text-sm text-muted-foreground">{carer.phone || 'No phone'}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{carer.email}</TableCell>
                                    <TableCell>{carer.location || 'Not set'}</TableCell>
                                    <TableCell>
                                        {carer.hourly_rate ? `£${carer.hourly_rate}/hr` : 'Not set'}
                                    </TableCell>
                                    <TableCell>
                                        {carer.verified ? (
                                            <Badge className="bg-green-500">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Pending
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleToggleVerification(carer)}>
                                                    {carer.verified ? (
                                                        <>
                                                            <AlertCircle className="h-4 w-4 mr-2" />
                                                            Unverify
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Verify
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredCarers.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-semibold">No carers found</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminCarers;
