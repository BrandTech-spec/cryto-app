import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Paperclip, Phone, Video } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const conversationId = searchParams.get('conversation') || undefined;
  const { 
    messages, 
    conversation, 
    loading, 
    typing, 
    sendMessage, 
    createConversation 
  } = useRealtimeChat(conversationId);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const success = await sendMessage(message.trim());
      if (success) {
        setMessage("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Customer Support</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Online • Avg response: 2 min</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender_id === user?.id;
              const isAdmin = msg.is_admin;
              
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{isAdmin ? "CS" : "U"}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Typing Indicator */}
      {typing && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs">CS</AvatarFallback>
            </Avatar>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm">Support is typing...</span>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-12"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              className="absolute right-1 top-1 h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            🔒 Encrypted
          </Badge>
          <span className="text-xs text-muted-foreground">
            Our support team is available 24/7
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;