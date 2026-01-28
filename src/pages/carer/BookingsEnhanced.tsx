// Enhanced Carer Bookings Page
import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    MessageCircle,
    CheckCircle,
    XCircle,
    DollarSign,
    TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/lib/fees';
import { format } from 'date-fns';

interface Booking {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    payment_status: string;
    total_price: number;
    rate_per_hour: number;
    carer_fee: number;
    client: {
        id: string;
        full_name: string;
        avatar_url: string | null;
    };
    created_at: string;
}

export default function CarerBookingsEnhanced() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          client:profiles!bookings_client_id_fkey(id, full_name, avatar_url)
        `)
                .eq('carer_id', user.id)
                .order('start_time', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            toast({
                title: 'Error',
                description: 'Failed to load bookings',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const acceptBooking = async (bookingId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'confirmed' })
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: 'Booking Accepted',
                description: 'You have accepted this booking',
            });

            fetchBookings();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: 'Failed to accept booking',
                variant: 'destructive',
            });
        }
    };

    const completeBooking = async (bookingId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'completed' })
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: 'Booking Completed',
                description: 'This booking has been marked as completed',
            });

            fetchBookings();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: 'Failed to complete booking',
                variant: 'destructive',
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: { color: 'bg-amber-500', icon: Clock, label: 'Pending' },
            confirmed: { color: 'bg-blue-500', icon: CheckCircle, label: 'Confirmed' },
            completed: { color: 'bg-green-500', icon: CheckCircle, label: 'Completed' },
            cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        const Icon = badge.icon;
        return (
            <Badge className={badge.color}>
                <Icon className="h-3 w-3 mr-1" />
                {badge.label}
            </Badge>
        );
    };

    const filterBookings = (status: string) => {
        if (status === 'all') return bookings;
        return bookings.filter(b => b.status === status);
    };

    const calculateDuration = (start: string, end: string) => {
        const hours = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
        return hours;
    };

    const calculateEarnings = (booking: Booking) => {
        const duration = calculateDuration(booking.start_time, booking.end_time);
        const gross = booking.rate_per_hour * duration;
        const net = gross - (booking.carer_fee || 0);
        return { gross, net };
    };

    const filteredBookings = filterBookings(activeTab);

    const totalEarnings = bookings
        .filter(b => b.status === 'completed' && b.payment_status === 'paid')
        .reduce((sum, b) => sum + calculateEarnings(b).net, 0);

    const handleRefundAction = async (bookingId: string, action: 'approve' | 'decline') => {
        try {
            setLoading(true);
            const { error } = await supabase.functions.invoke('approve-refund', {
                body: { bookingId, action }
            });

            if (error) throw error;

            toast({
                title: action === 'approve' ? 'Refund Approved' : 'Refund Declined',
                description: action === 'approve' ? 'Refund has been processed.' : 'Refund request was declined.',
            });

            fetchBookings();
        } catch (error: any) {
            console.error('Refund action error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to process refund action',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading bookings...</p>
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
                        My Bookings
                    </span>
                </div>
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">Bookings</h1>
                <p className="text-slate-500 font-medium">Manage your care bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-black">{bookings.length}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-slate-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-black text-amber-600">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-amber-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-black text-green-600">
                                    {bookings.filter(b => b.status === 'completed').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Earned</p>
                                <p className="text-2xl font-black text-[#1a9e8c]">
                                    {formatCurrency(totalEarnings)}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-[#1a9e8c]/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>View and manage your bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
                            <TabsTrigger value="pending">
                                Pending ({bookings.filter(b => b.status === 'pending').length})
                            </TabsTrigger>
                            <TabsTrigger value="confirmed">
                                Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({bookings.filter(b => b.status === 'completed').length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4">
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-700 mb-2">No bookings found</h3>
                                    <p className="text-slate-500">
                                        {activeTab === 'all'
                                            ? 'You don\'t have any bookings yet'
                                            : `No ${activeTab} bookings`}
                                    </p>
                                </div>
                            ) : (
                                filteredBookings.map(booking => {
                                    const { gross, net } = calculateEarnings(booking);
                                    const duration = calculateDuration(booking.start_time, booking.end_time);

                                    return (
                                        <Card key={booking.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage
                                                                src={booking.client.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.client.full_name}`}
                                                            />
                                                            <AvatarFallback>{booking.client.full_name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="font-bold text-lg">{booking.client.full_name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {getStatusBadge(booking.status)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-[#1a9e8c]">
                                                            {formatCurrency(net)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatCurrency(booking.rate_per_hour)}/hr × {duration}hrs
                                                        </p>
                                                        {booking.carer_fee > 0 && (
                                                            <p className="text-xs text-red-600">
                                                                -{formatCurrency(booking.carer_fee)} fee
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{format(new Date(booking.start_time), 'PPP')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {format(new Date(booking.start_time), 'p')} - {format(new Date(booking.end_time), 'p')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {booking.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => acceptBooking(booking.id)}
                                                            className="bg-[#1a9e8c]"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Accept
                                                        </Button>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => completeBooking(booking.id)}
                                                            className="bg-green-600"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Mark Complete
                                                        </Button>
                                                    )}
                                                    {booking.status === 'cancellation_requested' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleRefundAction(booking.id, 'approve')}
                                                                className="bg-green-600"
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Approve Refund
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleRefundAction(booking.id, 'decline')}
                                                            >
                                                                <XCircle className="h-4 w-4 mr-1" />
                                                                Decline
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/carer/messages?user=${booking.client.id}`)}
                                                    >
                                                        <MessageCircle className="h-4 w-4 mr-1" />
                                                        Message
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

