// Custom Hook for Messaging with Real-time Updates
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkMessageCompliance, sanitizeMessage } from '@/lib/compliance';

export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    is_read: boolean;
    is_flagged: boolean;
    flagged_keywords: string[] | null;
    file_url?: string | null;
    file_name?: string | null;
    file_type?: string | null;
    created_at: string;
    sender?: {
        full_name: string;
        avatar_url: string | null;
    };
}

export interface Conversation {
    id: string;
    participant_1_id: string;
    participant_2_id: string;
    last_message_at: string;
    other_user?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
        role: string;
    };
    unread_count?: number;
    last_message?: string;
}

export function useMessaging(conversationId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { toast } = useToast();

    // Fetch conversations - optimized to reduce N+1 queries
    const fetchConversations = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const isAdmin = profile?.role === 'admin';
            setUserRole(profile?.role || 'client');

            // 1. Fetch conversations
            let query = supabase.from('conversations').select('*');
            if (!isAdmin) {
                query = query.or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`);
            }

            const { data: convs, error: convError } = await query.order('last_message_at', { ascending: false });
            if (convError) throw convError;

            if (!convs || convs.length === 0) {
                setConversations([]);
                setUnreadCount(0);
                return;
            }

            // 2. Collect all unique user IDs to fetch in one batch
            const userIds = new Set<string>();
            convs.forEach((conv: any) => {
                userIds.add(conv.participant_1_id);
                userIds.add(conv.participant_2_id);
            });

            // 3. Batch fetch all user profiles in a single query
            const { data: usersData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, role')
                .in('id', Array.from(userIds));

            const usersMap = new Map(usersData?.map(u => [u.id, u]) || []);

            // 4. Fetch all unread counts for current user in one query (if not admin)
            let unreadMap = new Map<string, number>();
            if (!isAdmin) {
                const { data: unreadData } = await supabase
                    .from('messages')
                    .select('sender_id')
                    .eq('receiver_id', user.id)
                    .eq('is_read', false);

                if (unreadData) {
                    unreadData.forEach((msg: any) => {
                        unreadMap.set(msg.sender_id, (unreadMap.get(msg.sender_id) || 0) + 1);
                    });
                }
            }

            // 5. Fetch last messages for all conversations in one query
            const conversationPairs = convs.map((conv: any) =>
                `(sender_id.eq.${conv.participant_1_id}.and.receiver_id.eq.${conv.participant_2_id})`
            ).concat(convs.map((conv: any) =>
                `(sender_id.eq.${conv.participant_2_id}.and.receiver_id.eq.${conv.participant_1_id})`
            ));

            const { data: lastMessages } = await supabase
                .from('messages')
                .select('sender_id, receiver_id, content, created_at')
                .or(conversationPairs.join(','))
                .order('created_at', { ascending: false });

            // Group last messages by conversation
            const lastMessageMap = new Map<string, string>();
            if (lastMessages) {
                lastMessages.forEach((msg: any) => {
                    const key1 = `${msg.sender_id}-${msg.receiver_id}`;
                    const key2 = `${msg.receiver_id}-${msg.sender_id}`;
                    if (!lastMessageMap.has(key1) && !lastMessageMap.has(key2)) {
                        lastMessageMap.set(key1, msg.content);
                        lastMessageMap.set(key2, msg.content);
                    }
                });
            }

            // 6. Enrich conversations with the data we've already fetched
            const enriched = convs.map((conv: any) => {
                let otherUserId;
                if (isAdmin) {
                    otherUserId = conv.participant_2_id;
                } else {
                    otherUserId = conv.participant_1_id === user.id
                        ? conv.participant_2_id
                        : conv.participant_1_id;
                }

                const key = `${conv.participant_1_id}-${conv.participant_2_id}`;
                const keyAlt = `${conv.participant_2_id}-${conv.participant_1_id}`;

                return {
                    ...conv,
                    other_user: usersMap.get(otherUserId),
                    unread_count: unreadMap.get(otherUserId) || 0,
                    last_message: lastMessageMap.get(key) || lastMessageMap.get(keyAlt) || '',
                };
            });

            setConversations(enriched);
            setUnreadCount(enriched.reduce((sum, c) => sum + (c.unread_count || 0), 0));

        } catch (error: any) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch messages for a conversation
    const fetchMessages = useCallback(async (otherUserId: string) => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const isAdmin = profile?.role === 'admin';

            let query = supabase
                .from('messages')
                .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
        `);

            if (isAdmin) {
                // If admin, they are viewing a conversation identified by conversationId
                // We need to fetch messages where (sender=p1 AND receiver=p2) OR (sender=p2 AND receiver=p1)
                // But we only have otherUserId. We should ideally have the whole conversation object.
                // For now, let's assume otherUserId is one of the participants.
                // To show EVERYTHING, an admin needs to see the pair. 
                // Let's fetch the conversation first to get both participant IDs if we only have otherUserId.
                const { data: conv } = await supabase
                    .from('conversations')
                    .select('participant_1_id, participant_2_id')
                    .or(`participant_1_id.eq.${otherUserId},participant_2_id.eq.${otherUserId}`)
                    .limit(1)
                    .single();

                if (conv) {
                    query = query.or(`and(sender_id.eq.${conv.participant_1_id},receiver_id.eq.${conv.participant_2_id}),and(sender_id.eq.${conv.participant_2_id},receiver_id.eq.${conv.participant_1_id})`);
                } else {
                    query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`);
                }
            } else {
                query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`);
            }

            const { data, error } = await query
                .order('created_at', { ascending: true });

            if (error) throw error;

            setMessages(data || []);

            // Mark messages as read
            await markAsRead(otherUserId);

        } catch (error: any) {
            console.error('Error fetching messages:', error);
            toast({
                title: 'Error',
                description: 'Failed to load messages',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Send a message with compliance checking
    const sendMessage = useCallback(async (receiverId: string, content: string, fileData?: { url: string, name: string, type: string }) => {
        try {
            setSending(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Check for compliance if there's content
            let complianceCheck = { passed: true, detectedKeywords: [] as string[] };
            let sanitizedContent = content;

            if (content) {
                complianceCheck = checkMessageCompliance(content);
                if (!complianceCheck.passed) {
                    toast({
                        title: 'Message Modified',
                        description: `Prohibited words detected and replaced: ${complianceCheck.detectedKeywords.join(', ')}`,
                        variant: 'default',
                    });
                }
                sanitizedContent = sanitizeMessage(content);
            }

            // Insert message
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    sender_id: user.id,
                    receiver_id: receiverId,
                    content: sanitizedContent || (fileData ? `Sent a file: ${fileData.name}` : ''),
                    is_flagged: !complianceCheck.passed,
                    flagged_keywords: complianceCheck.detectedKeywords.length > 0
                        ? complianceCheck.detectedKeywords
                        : null,
                    file_url: fileData?.url,
                    file_name: fileData?.name,
                    file_type: fileData?.type
                })
                .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
        `)
                .single();

            if (error) throw error;

            // Add to local state
            setMessages(prev => [...prev, data]);

            // Refresh conversations to update last message
            await fetchConversations();

            return data;

        } catch (error: any) {
            console.error('Error sending message:', error);
            toast({
                title: 'Failed to Send',
                description: error.message,
                variant: 'destructive',
            });
            throw error;
        } finally {
            setSending(false);
        }
    }, [toast, fetchConversations]);

    // Mark messages as read
    const uploadAttachment = useCallback(async (file: File) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('message-attachments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('message-attachments')
                .getPublicUrl(filePath);

            return {
                url: publicUrl,
                name: file.name,
                type: file.type
            };
        } catch (error: any) {
            console.error('Error uploading attachment:', error);
            toast({
                title: 'Upload Failed',
                description: error.message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [toast]);

    const markAsRead = useCallback(async (senderId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('sender_id', senderId)
                .eq('receiver_id', user.id)
                .eq('is_read', false);

            // Update local state
            setMessages(prev =>
                prev.map(msg =>
                    msg.sender_id === senderId && msg.receiver_id === user.id
                        ? { ...msg, is_read: true }
                        : msg
                )
            );

            // Refresh conversations to update unread count
            await fetchConversations();

        } catch (error: any) {
            console.error('Error marking as read:', error);
        }
    }, [fetchConversations]);

    // Subscribe to real-time messages
    useEffect(() => {
        let subscription: any;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            subscription = supabase
                .channel('messages-realtime')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `receiver_id=eq.${user.id}`,
                    },
                    async (payload) => {
                        const { data: senderData } = await supabase
                            .from('profiles')
                            .select('full_name, avatar_url')
                            .eq('id', payload.new.sender_id)
                            .single();

                        const newMessage = {
                            ...payload.new,
                            sender: senderData,
                        } as Message;

                        setMessages(prev => {
                            const isRelevant = prev.some(
                                m => m.sender_id === newMessage.sender_id || m.receiver_id === newMessage.sender_id
                            );
                            return isRelevant ? [...prev, newMessage] : prev;
                        });

                        fetchConversations();

                        toast({
                            title: 'New Message',
                            description: `From ${senderData?.full_name || 'Unknown'}`,
                        });
                    }
                )
                .subscribe();
        };

        setupRealtime();

        return () => {
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        };
    }, [toast, fetchConversations]);

    // Initial fetch
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        messages,
        conversations,
        loading,
        sending,
        unreadCount,
        sendMessage,
        fetchMessages,
        markAsRead,
        uploadAttachment,
        refreshConversations: fetchConversations,
    };
}
