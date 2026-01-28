// Main Messages Page
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useMessaging, type Conversation } from '@/hooks/useMessaging';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessagesPageProps {
    role: 'client' | 'carer' | 'organisation' | 'admin';
}

export default function MessagesPage({ role }: MessagesPageProps) {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [showChatOnMobile, setShowChatOnMobile] = useState(false);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const { conversations } = useMessaging();

    const handleSelectConversation = (conv: Conversation) => {
        setSelectedConversation(conv);
        setShowChatOnMobile(true);
    };

    useEffect(() => {
        const initSelection = async () => {
            if (userId) {
                // Check if we have an existing conversation with this user
                const existingConv = conversations.find(
                    c => c.participant_1_id === userId || c.participant_2_id === userId
                );

                if (existingConv) {
                    setSelectedConversation(existingConv);
                } else {
                    // Fetch user details for a new conversation jump-start
                    const { data: userData } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url, role')
                        .eq('id', userId)
                        .single();

                    if (userData) {
                        setSelectedConversation({
                            id: 'new', // Virtual ID
                            participant_1_id: '', // Will be filled on send
                            participant_2_id: userId,
                            last_message_at: new Date().toISOString(),
                            other_user: userData
                        });
                    }
                }
            }
        };

        if (conversations.length > 0 || userId) {
            initSelection();
        }
    }, [userId, conversations]);

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 max-w-7xl mx-auto py-4">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Communication
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-[#111827] tracking-tight">Messages</h1>
                    <p className="text-slate-500 font-medium">
                        Communicate securely with {role === 'carer' ? 'clients' : 'carers'}
                    </p>
                </div>

                {/* Messages Interface */}
                <div className="grid lg:grid-cols-3 gap-6 relative">
                    {/* Conversation List */}
                    <div className={`lg:col-span-1 ${showChatOnMobile ? 'hidden lg:block' : 'block'}`}>
                        <ConversationList
                            onSelectConversation={handleSelectConversation}
                            selectedConversationId={selectedConversation?.id}
                        />
                    </div>

                    {/* Message Thread */}
                    <div className={`lg:col-span-2 ${!showChatOnMobile ? 'hidden lg:block' : 'block'}`}>
                        {selectedConversation ? (
                            <div className="flex flex-col h-full">
                                {showChatOnMobile && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="lg:hidden self-start mb-2 text-[#1a9e8c]"
                                        onClick={() => setShowChatOnMobile(false)}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to matches
                                    </Button>
                                )}
                                <MessageThread
                                    otherUserId={selectedConversation.other_user?.id || ''}
                                    otherUserName={selectedConversation.other_user?.full_name || 'Unknown'}
                                    otherUserAvatar={selectedConversation.other_user?.avatar_url}
                                    otherUserRole={selectedConversation.other_user?.role}
                                />
                            </div>
                        ) : (
                            <Card className="h-[600px] flex items-center justify-center bg-slate-50/50 border-dashed">
                                <CardContent className="text-center">
                                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                                        <MessageCircle className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                                        Your Conversations
                                    </h3>
                                    <p className="text-slate-500 max-w-xs mx-auto">
                                        Select a carer or client from the sidebar to view your message history
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* CQC Compliance Notice */}
                <Card className="border-2 border-amber-500/20 bg-amber-50/50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900 mb-1">Compliance Notice</h3>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    As an <strong>Introductory Agency</strong>, Heems facilitates introductions only.
                                    Messages containing prohibited words (employ, hire, staff, contract, etc.) will be
                                    automatically modified to maintain compliance. All conversations may be monitored
                                    for quality and compliance purposes.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
