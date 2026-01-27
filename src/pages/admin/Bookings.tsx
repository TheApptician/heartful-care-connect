import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Search,
    Calendar,
    Eye,
    Download,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    MoreVertical,
    DollarSign,
    Trash2,
    FileText
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Booking {
    id: string;
    client_id: string;
    carer_id: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total_price: number;
    status: string;
    service_type: string;
    created_at: string;
    client?: {
        full_name: string;
    };
    carer?: {
        full_name: string;
    };
}

const AdminBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [bookings, searchQuery, statusFilter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    client:profiles!bookings_client_id_fkey(full_name),
                    carer:profiles!bookings_carer_id_fkey(full_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error: any) {
            toast({
                title: "Error fetching bookings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = bookings;

        if (searchQuery) {
            filtered = filtered.filter(booking =>
                booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.carer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        setFilteredBookings(filtered);
    };

    const handleDeleteBooking = async () => {
        if (!bookingToDelete) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', bookingToDelete);

            if (error) throw error;

            toast({
                title: "Booking deleted",
                description: "The booking has been removed from the platform.",
            });

            fetchBookings();
        } catch (error: any) {
            toast({
                title: "Error deleting booking",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setBookingToDelete(null);
        }
    };

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: "Status updated",
                description: `Booking status changed to ${newStatus}`,
            });

            fetchBookings();
        } catch (error: any) {
            toast({
                title: "Error updating status",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleExport = () => {
        const csv = [
            ['ID', 'Client', 'Carer', 'Date', 'Time', 'Duration', 'Amount', 'Status', 'Type'].join(','),
            ...filteredBookings.map(booking => [
                booking.id,
                booking.client?.full_name || 'Unknown',
                booking.carer?.full_name || 'Unknown',
                booking.start_time ? format(new Date(booking.start_time), 'yyyy-MM-dd') : 'N/A',
                booking.start_time ? format(new Date(booking.start_time), 'HH:mm') : 'N/A',
                `${booking.duration_hours}h`,
                `£${booking.total_price}`,
                booking.status,
                booking.service_type || 'N/A'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();

        toast({
            title: "Export successful",
            description: `Exported ${filteredBookings.length} bookings to CSV.`,
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; icon: any }> = {
            confirmed: { color: "bg-green-500", icon: CheckCircle },
            pending: { color: "bg-amber-500", icon: Clock },
            completed: { color: "bg-blue-500", icon: CheckCircle },
            cancelled: { color: "bg-red-500", icon: XCircle },
        };

        const config = statusConfig[status] || { color: "bg-gray-500", icon: AlertCircle };
        const Icon = config.icon;

        return (
            <Badge className={config.color}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.total_price || 0), 0),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Bookings Management</h1>
                        <p className="text-muted-foreground">Manage all platform bookings</p>
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-sm text-muted-foreground">Total</p>
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
                                    <p className="text-2xl font-bold">{stats.confirmed}</p>
                                    <p className="text-sm text-muted-foreground">Confirmed</p>
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
                                    <CheckCircle className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.completed}</p>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">£{stats.revenue.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Revenue</p>
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
                                    placeholder="Search bookings..."
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
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings Table */}
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Carer</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-mono text-sm">{booking.id.slice(0, 8)}</TableCell>
                                        <TableCell>
                                            <p className="font-medium">{booking.client?.full_name || 'Unknown'}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{booking.carer?.full_name || 'Unknown'}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{booking.start_time ? format(new Date(booking.start_time), 'MMM dd, yyyy') : 'N/A'}</p>
                                                <p className="text-sm text-muted-foreground">{booking.start_time ? format(new Date(booking.start_time), 'HH:mm') : 'N/A'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{booking.duration_hours}h</TableCell>
                                        <TableCell className="font-semibold">£{booking.total_price}</TableCell>
                                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                        Confirm
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                                                        <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                                                        Mark Complete
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                                                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                                        Cancel
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-700"
                                                        onClick={() => {
                                                            setBookingToDelete(booking.id);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Booking
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredBookings.length === 0 && (
                            <div className="text-center py-12">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg font-semibold">No bookings found</p>
                                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the booking
                            from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteBooking}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminBookings;
