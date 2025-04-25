
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { chats } from "@/lib/constants";
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
import { getRelativeTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    chats[0]?.id || null
  );
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [messageText, setMessageText] = useState("");
  const { toast } = useToast();

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
      setMessageText("");
    }
  };

  const handleStartNewChat = () => {
    if (recipient) {
      toast({
        title: "New conversation created!",
        description: `You can now message ${recipient}.`,
      });
      setNewChatOpen(false);
      setRecipient("");
    }
  };

  return (
    <Layout showFAB onFABClick={() => setNewChatOpen(true)}>
      <div className="animate-fade-in">
        <div className="flex h-[70vh] border rounded-lg overflow-hidden bg-white">
          {/* Sidebar */}
          <div className="w-72 border-r flex flex-col">
            <div className="p-3 border-b">
              <Input placeholder="Search conversations..." />
            </div>
            <div className="overflow-y-auto flex-1">
              {chats.map((chat) => (
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
                      {chat.lastMessage.content}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <Badge className="bg-primary ml-2">{chat.unread}</Badge>
                  )}
                </div>
              ))}
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
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                        <p className="text-sm">
                          Hi there! How's your project coming along?
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          10:23 AM
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-gradient-primary text-white rounded-lg p-3 max-w-xs md:max-w-md">
                        <p className="text-sm">
                          It's going well! I just need to finish the last part.
                          Should be done by tomorrow.
                        </p>
                        <span className="text-xs text-white/80 mt-1 block">
                          10:25 AM
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs md:max-w-md">
                        <p className="text-sm">
                          Great! Let's meet up tomorrow to review it. How about
                          2pm at the library?
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          10:26 AM
                        </span>
                      </div>
                    </div>
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
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-primary hover:opacity-90"
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Initial Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Type your first message"
                rows={3}
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
            >
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
