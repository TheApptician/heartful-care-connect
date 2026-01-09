import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
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
    <DashboardLayout role="client">
      <div className="h-[calc(100vh-8rem)]">
        <Card className="h-full">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-80 border-r flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg mb-3">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation.id === conversation.id 
                          ? 'bg-primary/10' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>
                            {conversation.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conversation.name}</p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
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
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback>
                        {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedConversation.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.online ? 'Online' : 'Offline'} • {selectedConversation.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isMe = message.senderId === "me";
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                          {!isMe && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={selectedConversation.avatar} />
                              <AvatarFallback>
                                {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isMe 
                                  ? 'bg-primary text-primary-foreground rounded-br-md' 
                                  : 'bg-muted rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                              {isMe && (
                                message.status === 'read' 
                                  ? <CheckCheck className="h-3 w-3 text-primary" />
                                  : <Check className="h-3 w-3 text-muted-foreground" />
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
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Image className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="pr-10"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
