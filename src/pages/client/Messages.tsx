import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Image,
  File,
  Smile
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Sarah Khan",
    avatar: "/placeholder.svg",
    role: "Carer",
    lastMessage: "I'll be there at 9am tomorrow as usual. See you then!",
    time: "10:32 AM",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "James O'Brien",
    avatar: "/placeholder.svg",
    role: "Carer",
    lastMessage: "Thank you for the booking confirmation.",
    time: "Yesterday",
    unread: 0,
    online: false
  },
  {
    id: 3,
    name: "Priya Patel",
    avatar: "/placeholder.svg",
    role: "Carer",
    lastMessage: "Margaret was in great spirits today!",
    time: "Yesterday",
    unread: 0,
    online: true
  },
  {
    id: 4,
    name: "Heems Support",
    avatar: "/placeholder.svg",
    role: "Support",
    lastMessage: "Your booking has been confirmed. Is there anything else we can help with?",
    time: "2 days ago",
    unread: 1,
    online: true
  },
];

const messages = [
  {
    id: 1,
    senderId: 1,
    content: "Good morning! Just confirming our visit tomorrow at 9am.",
    time: "9:15 AM",
    status: "read"
  },
  {
    id: 2,
    senderId: "me",
    content: "Good morning Sarah! Yes, that works perfectly. Margaret is looking forward to seeing you.",
    time: "9:20 AM",
    status: "read"
  },
  {
    id: 3,
    senderId: 1,
    content: "Wonderful! Is there anything specific you'd like me to focus on during the visit?",
    time: "9:25 AM",
    status: "read"
  },
  {
    id: 4,
    senderId: "me",
    content: "Could you please help her with the physiotherapy exercises the doctor recommended? I've left the instructions on the kitchen table.",
    time: "9:30 AM",
    status: "read"
  },
  {
    id: 5,
    senderId: 1,
    content: "Of course! I'll make sure to go through those with her. Also, do you need me to pick up any groceries on the way?",
    time: "10:15 AM",
    status: "read"
  },
  {
    id: 6,
    senderId: "me",
    content: "That would be so helpful! Could you pick up some milk and bread? I'll add the money to tomorrow's payment.",
    time: "10:25 AM",
    status: "read"
  },
  {
    id: 7,
    senderId: 1,
    content: "No problem at all. I'll be there at 9am tomorrow as usual. See you then!",
    time: "10:32 AM",
    status: "delivered"
  },
];

export default function ClientMessages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="h-[calc(100vh-8rem)] min-h-[500px] max-w-6xl mx-auto animate-fade-in">
      <Card className="h-full rounded-2xl border-black/5 shadow-sm overflow-hidden flex bg-white">
        {/* Conversations List */}
        <div className="w-72 md:w-80 border-r border-black/5 flex flex-col bg-slate-50/30">
          <div className="p-4 border-b border-black/5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg tracking-tight">Messages</h2>
              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 h-5 bg-white">4 active</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder="Search chats..."
                className="pl-9 h-9 text-xs rounded-xl border-black/5 bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedConversation.id === conversation.id
                    ? 'bg-white shadow-sm border border-black/5'
                    : 'hover:bg-white/50 border border-transparent'
                    }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 rounded-xl border border-white shadow-sm">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="text-xs font-bold">
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-xs font-bold truncate ${selectedConversation.id === conversation.id ? 'text-primary' : 'text-foreground'}`}>
                        {conversation.name}
                      </p>
                      <span className="text-[10px] font-medium text-muted-foreground/60">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-muted-foreground truncate leading-snug">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge className="h-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-bold bg-primary ml-2">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9 rounded-xl border border-black/5">
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback className="text-xs font-bold">
                    {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {selectedConversation.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">{selectedConversation.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedConversation.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {selectedConversation.online ? 'Online' : 'Offline'} • {selectedConversation.role}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-slate-50">
                <Phone className="h-4 w-4 text-slate-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-slate-50">
                <Video className="h-4 w-4 text-slate-600" />
              </Button>
              <div className="w-px h-4 bg-black/5 mx-1" />
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-slate-50">
                <MoreVertical className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today</span>
              </div>
              {messages.map((message) => {
                const isMe = message.senderId === "me";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1 duration-300`}
                  >
                    <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && (
                        <Avatar className="h-7 w-7 rounded-lg border border-black/5">
                          <AvatarImage src={selectedConversation.avatar} />
                          <AvatarFallback className="text-[10px] font-bold">
                            {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${isMe
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}
                        >
                          {message.content}
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? 'justify-end' : ''}`}>
                          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">{message.time}</span>
                          {isMe && (
                            message.status === 'read'
                              ? <CheckCheck className="h-3 w-3 text-primary" />
                              : <Check className="h-3 w-3 text-muted-foreground/40" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-black/5">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <div className="flex items-center">
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 relative group">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="h-10 pr-10 text-[13px] rounded-xl border-black/5 bg-slate-50 group-focus-within:bg-white group-focus-within:border-primary/20 transition-all font-medium"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg text-slate-400">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button size="icon" className="h-10 w-10 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
