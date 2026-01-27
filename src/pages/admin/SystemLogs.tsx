// Admin System Logs Page
import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    Activity,
    Calendar,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SystemLog {
    id: string;
    event_type: string;
    details: any;
    created_at: string;
}

export default function AdminSystemLogs() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const { toast } = useToast();

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('system_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (filter !== 'all') {
                query = query.eq('event_type', filter);
            }

            const { data, error } = await query;

            if (error) throw error;

            setLogs(data || []);
        } catch (error: any) {
            console.error('Error fetching logs:', error);
            toast({
                title: 'Error',
                description: 'Failed to load system logs',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getEventBadge = (eventType: string) => {
        switch (eventType) {
            case 'document_expiry_check':
                return <Badge className="bg-blue-500">Expiry Check</Badge>;
            case 'payment_processed':
                return <Badge className="bg-green-500">Payment</Badge>;
            case 'verification_approved':
                return <Badge className="bg-emerald-500">Verification</Badge>;
            case 'error':
                return <Badge variant="destructive">Error</Badge>;
            default:
                return <Badge variant="outline">{eventType}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading system logs...</p>
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
                        System Monitoring
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#111827] tracking-tight">System Logs</h1>
                        <p className="text-slate-500 font-medium">
                            Monitor automated tasks and system events
                        </p>
                    </div>
                    <Button onClick={fetchLogs} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            onClick={() => setFilter('all')}
                            size="sm"
                        >
                            All Events
                        </Button>
                        <Button
                            variant={filter === 'document_expiry_check' ? 'default' : 'outline'}
                            onClick={() => setFilter('document_expiry_check')}
                            size="sm"
                        >
                            Expiry Checks
                        </Button>
                        <Button
                            variant={filter === 'payment_processed' ? 'default' : 'outline'}
                            onClick={() => setFilter('payment_processed')}
                            size="sm"
                        >
                            Payments
                        </Button>
                        <Button
                            variant={filter === 'verification_approved' ? 'default' : 'outline'}
                            onClick={() => setFilter('verification_approved')}
                            size="sm"
                        >
                            Verifications
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Logs List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#1a9e8c]" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>
                        {logs.length} {logs.length === 1 ? 'event' : 'events'} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 mb-2">No logs found</h3>
                            <p className="text-slate-500">System logs will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {getEventBadge(log.event_type)}
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    {log.event_type === 'document_expiry_check' && log.details && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Checked</p>
                                                    <p className="font-bold">{log.details.total_checked || 0} carers</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Expired</p>
                                                    <p className="font-bold text-red-600">{log.details.expired_count || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Expiring Soon</p>
                                                    <p className="font-bold text-amber-600">{log.details.expiring_soon_count || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">De-verified</p>
                                                    <p className="font-bold">{log.details.de_verified_carers?.length || 0}</p>
                                                </div>
                                            </div>

                                            {log.details.de_verified_carers && log.details.de_verified_carers.length > 0 && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-xs text-muted-foreground mb-2">De-verified Carers:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {log.details.de_verified_carers.map((carerId: string) => (
                                                            <Badge key={carerId} variant="outline" className="text-xs">
                                                                {carerId.substring(0, 8)}...
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Generic Details */}
                                    {log.event_type !== 'document_expiry_check' && log.details && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                            <pre className="text-xs overflow-x-auto">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-2 border-blue-500/20 bg-blue-50/50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">Automated System Monitoring</h3>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                System logs track automated tasks like daily document expiry checks, payment processing,
                                and verification approvals. The expiry check runs daily at midnight and automatically
                                de-verifies carers with expired documents.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
