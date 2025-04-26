
import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { chats as initialChats, dummyUsers, Chat } from "@/lib/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRelativeTime, formatDateTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Interface for chat messages
interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  isCurrentUser: boolean;
}

// Interface for chat with messages
interface ChatWithMessages extends Chat {
  messages: ChatMessage[];
}

// Current user info (in a real app, this would come from authentication)
const currentUser = {
  id: "current-user",
  name: "You",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

export default function Messages() {
  // State for chats and messages
  const [chats, setChats] = useState<ChatWithMessages[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Ref for message container to auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("campus-sync-chats");
    
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats) as ChatWithMessages[];
      setChats(parsedChats);
      // Select the first chat if available
      if (parsedChats.length > 0 && !selectedChatId) {
        setSelectedChatId(parsedChats[0].id);
      }
    } else {
      // Initialize with default chats if none exist
      const chatsWithMessages = initialChats.map(chat => ({
        ...chat,
        messages: [
          {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content: chat.lastMessage.content,
            timestamp: chat.lastMessage.timestamp,
            senderId: chat.lastMessage.senderId,
            isCurrentUser: false
          }
        ]
      }));
      
      setChats(chatsWithMessages);
      localStorage.setItem("campus-sync-chats", JSON.stringify(chatsWithMessages));
      
      // Select the first chat if available
      if (chatsWithMessages.length > 0) {
        setSelectedChatId(chatsWithMessages[0].id);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("campus-sync-chats", JSON.stringify(chats));
    }
  }, [chats]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatId, chats]);

  // Get the selected chat
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Search in participant names
    const participantMatch = chat.participants.some(p => 
      p.name.toLowerCase().includes(query)
    );
    
    // Search in last message
    const messageMatch = chat.lastMessage.content.toLowerCase().includes(query);
    
    return participantMatch || messageMatch;
  });

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      senderId: currentUser.id,
      isCurrentUser: true
    };
    
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          // Add message to this chat
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: {
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              senderId: newMessage.senderId
            },
            unread: 0 // Reset unread count for current chat
          };
          return updatedChat;
        }
        return chat;
      })
    );
    
    toast({
      title: "Message sent!",
      description: "Your message has been delivered.",
    });
    
    setMessageText("");
  };

  // Handle starting a new chat
  const handleStartNewChat = () => {
    if (!recipient.trim()) return;
    
    // Create a new chat
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Find a dummy user that matches the recipient name (in a real app, this would be a user search)
    const recipientUser = dummyUsers.find(user => 
      user.name.toLowerCase().includes(recipient.toLowerCase())
    ) || {
      id: `user-${Date.now()}`,
      name: recipient,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient)}&background=random`,
    };
    
    const timestamp = new Date().toISOString();
    
    const newChat: ChatWithMessages = {
      id: newChatId,
      participants: [
        {
          id: recipientUser.id,
          name: recipientUser.name,
          avatar: recipientUser.avatar,
        }
      ],
      lastMessage: {
        content: initialMessage.trim() || "Started a new conversation",
        timestamp: timestamp,
        senderId: currentUser.id,
      },
      unread: 0,
      messages: []
    };
    
    // Add initial message if provided
    if (initialMessage.trim()) {
      newChat.messages.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: initialMessage.trim(),
        timestamp: timestamp,
        senderId: currentUser.id,
        isCurrentUser: true
      });
    }
    
    setChats(prevChats => [newChat, ...prevChats]);
    setSelectedChatId(newChatId);
    
    toast({
      title: "New conversation created!",
      description: `You can now message ${recipientUser.name}.`,
    });
    
    setNewChatOpen(false);
    setRecipient("");
    setInitialMessage("");
  };

  // Mark chat as read when selected
  useEffect(() => {
    if (selectedChatId) {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChatId 
            ? { ...chat, unread: 0 } 
            : chat
        )
      );
    }
  }, [selectedChatId]);

  // Format time for display in messages
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout showFAB onFABClick={() => setNewChatOpen(true)}>
      <div className="animate-fade-in">
        <div className="flex h-[70vh] border rounded-lg overflow-hidden bg-white">
          {/* Sidebar */}
          <div className="w-72 border-r flex flex-col">
            <div className="p-3 border-b">
              <Input 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredChats.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 border-b ${
                      chat.id === selectedChatId ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedChatId(chat.id)}
                  >
                    {chat.participants.length === 1 ? (
                      <Avatar>
                        <AvatarImage
                          src={chat.participants[0].avatar}
                          alt={chat.participants[0].name}
                        />
                        <AvatarFallback>
                          {chat.participants[0].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate">
                          {chat.participants.length === 1
                            ? chat.participants[0].name
                            : `${chat.participants[0].name} + ${
                                chat.participants.length - 1
                              }`}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {getRelativeTime(chat.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.senderId === currentUser.id ? "You: " : ""}
                        {chat.lastMessage.content}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="bg-primary ml-2">{chat.unread}</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-3 border-b">
                  <div className="flex items-center gap-3">
                    {selectedChat.participants.length === 1 ? (
                      <Avatar>
                        <AvatarImage
                          src={selectedChat.participants[0].avatar}
                          alt={selectedChat.participants[0].name}
                        />
                        <AvatarFallback>
                          {selectedChat.participants[0].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">
                        {selectedChat.participants.length === 1
                          ? selectedChat.participants[0].name
                          : `Group (${selectedChat.participants.length})`}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedChat.participants.length === 1
                          ? "Online"
                          : selectedChat.participants
                              .map((p) => p.name)
                              .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex flex-col gap-3">
                    {selectedChat.messages.length === 0 ? (
                      <div className="text-center text-gray-500 my-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      selectedChat.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                        >
                          <div 
                            className={`rounded-lg p-3 max-w-xs md:max-w-md ${
                              message.senderId === currentUser.id 
                                ? "bg-gradient-primary text-white" 
                                : "bg-gray-100"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <span 
                              className={`text-xs mt-1 block ${
                                message.senderId === currentUser.id 
                                  ? "text-white/80" 
                                  : "text-gray-500"
                              }`}
                            >
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message input */}
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-primary hover:opacity-90"
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">
                    Select a conversation to start chatting
                  </p>
                  <Button
                    onClick={() => setNewChatOpen(true)}
                    className="mt-4 bg-gradient-primary hover:opacity-90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Start a new conversation with a student or teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="Search by name or email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              {recipient && (
                <div className="text-xs text-gray-500 mt-1">
                  Tip: Try names like "Sarah Williams", "Dr. Michael Chen", etc.
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Initial Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Type your first message"
                rows={3}
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChatOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleStartNewChat}
              disabled={!recipient.trim()}
            >
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
