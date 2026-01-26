import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent', text: string }[]>([
        { role: 'agent', text: 'Hello! How can we help you today?' }
    ]);

    const getSmartResponse = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes('price') || lower.includes('cost') || lower.includes('rate')) {
            return "Our carers set their own rates, typically between £15-£35/hour depending on experience and care type.";
        }
        if (lower.includes('join') || lower.includes('job') || lower.includes('work')) {
            return "We're always looking for great carers! You can apply directly through the 'For Carers' section.";
        }
        if (lower.includes('book') || lower.includes('schedule')) {
            return "You can book a carer directly from their profile page. Just click 'Secure Profile' to get started.";
        }
        if (lower.includes('hello') || lower.includes('hi')) {
            return "Hello! I'm the Heems AI assistant. How can I help you today?";
        }
        return "Thanks for reaching out! One of our Agents will be with you shortly to assist you further.";
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setChatHistory([...chatHistory, { role: 'user', text: message }]);
        const currentMessage = message;
        setMessage("");

        // Simulated intelligent response
        setTimeout(() => {
            setChatHistory(prev => [...prev, { role: 'agent', text: getSmartResponse(currentMessage) }]);
        }, 1500);
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                data-chat-widget-trigger="true"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#1a9e8c] hover:bg-[#15806c] shadow-2xl shadow-[#1a9e8c]/40 animate-bounce group z-50 p-0"
            >
                <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </Button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] animate-in slide-in-from-bottom-5">
            <Card className="shadow-2xl border-black/5 overflow-hidden ring-1 ring-black/5">
                <CardHeader className="bg-[#111827] text-white p-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                <HeartIcon className="h-5 w-5 text-[#1a9e8c]" />
                            </div>
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#111827]"></span>
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold">Heems Support</CardTitle>
                            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-400/30 font-bold px-1.5 h-4">Online</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10" onClick={() => setIsMinimized(!isMinimized)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <>
                        <CardContent className="h-[380px] overflow-y-auto p-4 bg-slate-50 space-y-4">
                            {chatHistory.map((chat, i) => (
                                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm ${chat.role === 'user'
                                        ? 'bg-[#1a9e8c] text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        {chat.text}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="p-4 bg-white border-t">
                            <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="h-11 bg-slate-50 border-slate-100 focus-visible:ring-[#1a9e8c] focus-visible:ring-offset-0 rounded-xl"
                                />
                                <Button type="submit" size="icon" className="h-11 w-11 rounded-xl bg-[#111827] hover:bg-[#1a9e8c] shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
};

const HeartIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);
