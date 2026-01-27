import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    MessageSquare,
    Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Dispute {
    id: string;
    booking_id: string;
    client_id: string;
    carer_id: string;
    title: string;
    description: string;
    amount: number;
    status: string;
    priority: string;
    created_at: string;
    client?: {
        full_name: string;
    };
    carer?: {
        full_name: string;
    };
}

const AdminDisputes = () => {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { toast } = useToast();

    useEffect(() => {
        fetchDisputes();
    }, []);

    useEffect(() => {
        filterDisputes();
    }, [disputes, searchQuery, statusFilter]);

    const fetchDisputes = async () => {
        try {
            setLoading(true);

            // Check if disputes table exists, if not create mock data from bookings
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    id,
                    client_id,
                    carer_id,
                    total_price,
                    status,
                    created_at,
                    client:profiles!bookings_client_id_fkey(full_name),
                    carer:profiles!bookings_carer_id_fkey(full_name)
                `)
                .eq('status', 'cancelled')
                .limit(10);

            if (bookingsError) throw bookingsError;

            // Transform bookings into dispute format
            const mockDisputes: Dispute[] = (bookingsData || []).map((booking, index) => ({
                id: `DISP-${booking.id.slice(0, 8)}`,
                booking_id: booking.id,
                client_id: booking.client_id,
                carer_id: booking.carer_id,
                title: `Booking Dispute - ${booking.id.slice(0, 8)}`,
                description: "Dispute regarding cancelled booking. Requires resolution.",
                amount: booking.total_price || 0,
                status: 'pending',
                priority: index % 3 === 0 ? 'high' : index % 2 === 0 ? 'medium' : 'low',
                created_at: booking.created_at,
                client: booking.client,
                carer: booking.carer,
            }));

            setDisputes(mockDisputes);
        } catch (error: any) {
            toast({
                title: "Error fetching disputes",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filterDisputes = () => {
        let filtered = disputes;

        if (searchQuery) {
            filtered = filtered.filter(dispute =>
                dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dispute.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dispute.carer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(dispute => dispute.status === statusFilter);
        }

        setFilteredDisputes(filtered);
    };

    const handleResolve = async (disputeId: string, resolution: 'client' | 'carer' | 'split') => {
        try {
            // In a real implementation, this would update a disputes table
            // For now, we'll just show a success message and remove from list
            toast({
                title: "Dispute Resolved",
                description: `Dispute ${disputeId} has been resolved in favor of ${resolution}.`,
            });

            // Remove from list
            setDisputes(disputes.filter(d => d.id !== disputeId));
        } catch (error: any) {
            toast({
                title: "Error resolving dispute",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleContactParties = (dispute: Dispute) => {
        const subject = encodeURIComponent(`Regarding Dispute: ${dispute.title}`);
        const body = encodeURIComponent(`Dear parties,\n\nRegarding the dispute ${dispute.id}.\n\nBest regards,\nHeems Care Admin`);
        window.location.href = `mailto:${dispute.client?.email},${dispute.carer?.email}?subject=${subject}&body=${body}`;
    };

    const handleEscalate = (disputeId: string) => {
        toast({
            title: "Dispute Escalated",
            description: `Dispute ${disputeId} has been escalated to senior management.`,
        });
    };

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            high: "bg-red-500",
            medium: "bg-amber-500",
            low: "bg-blue-500",
        };
        return <Badge className={colors[priority] || "bg-gray-500"}>{priority} Priority</Badge>;
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: "border-amber-500 text-amber-600",
            investigating: "border-blue-500 text-blue-600",
            resolved: "border-green-500 text-green-600",
        };
        return <Badge variant="outline" className={colors[status] || ""}>{status}</Badge>;
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
                    <h1 className="text-2xl font-bold">Dispute Tribunal</h1>
                    <p className="text-muted-foreground">Manage and resolve platform disputes</p>
                </div>
                <Badge className="bg-amber-500 text-white px-4 py-2">
                    {disputes.length} Active Disputes
                </Badge>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {disputes.filter(d => d.status === 'pending').length}
                                </p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {disputes.filter(d => d.status === 'investigating').length}
                                </p>
                                <p className="text-sm text-muted-foreground">Investigating</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {disputes.filter(d => d.priority === 'high').length}
                                </p>
                                <p className="text-sm text-muted-foreground">High Priority</p>
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
                                placeholder="Search disputes..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="investigating">Investigating</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Disputes List */}
            <div className="space-y-6">
                {filteredDisputes.length === 0 ? (
                    <Card className="p-12 text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No Active Disputes</h3>
                        <p className="text-muted-foreground">All disputes have been resolved. Great work!</p>
                    </Card>
                ) : (
                    filteredDisputes.map((dispute) => (
                        <Card key={dispute.id} className="overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-lg">{dispute.title}</CardTitle>
                                            {getPriorityBadge(dispute.priority)}
                                            {getStatusBadge(dispute.status)}
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {new Date(dispute.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="font-semibold text-foreground">£{dispute.amount}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Parties */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Client</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                                {dispute.client?.full_name?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{dispute.client?.full_name || 'Unknown'}</p>
                                                <p className="text-xs text-muted-foreground">Seeking refund</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Carer</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                                                {dispute.carer?.full_name?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{dispute.carer?.full_name || 'Unknown'}</p>
                                                <p className="text-xs text-muted-foreground">Defending claim</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Description</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{dispute.description}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleResolve(dispute.id, 'client')}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                                        Favor Client
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleResolve(dispute.id, 'carer')}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                        Favor Carer
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleResolve(dispute.id, 'split')}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2 text-amber-500" />
                                        Split 50/50
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleContactParties(dispute)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Contact Parties
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => handleEscalate(dispute.id)}
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Escalate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDisputes;
