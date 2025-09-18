import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { supabase } from "@/integrations/supabase/client";

const UserMessages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [replyMessage, setReplyMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { 
    messages, 
    conversation, 
    loading, 
    sendMessage 
  } = useRealtimeChat(conversationId);

  // Load conversation for this user
  useEffect(() => {
    const loadUserConversation = async () => {
      if (!userId) return;

      try {
        // Get the user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profile) {
          setCurrentUser(profile);
        }

        // Find existing conversation for this user
        const { data: conversations } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (conversations && conversations.length > 0) {
          setConversationId(conversations[0].id);
        }
      } catch (error) {
        console.error('Error loading user conversation:', error);
      }
    };

    loadUserConversation();
  }, [userId]);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    
    const success = await sendMessage(replyMessage.trim(), true); // true for admin message
    if (success) {
      toast({
        title: "Reply Sent",
        description: `Your message has been sent to ${currentUser?.username || 'the user'}`,
      });
      setReplyMessage("");
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>User not found</p>
            <Button onClick={() => navigate("/admin")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentUser?.username || 'User'}</h1>
            <p className="text-muted-foreground">{userId}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversation with {currentUser?.username || 'User'}
          </CardTitle>
          <CardDescription>Manage your conversation with this user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">No messages yet</div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_admin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.is_admin
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={message.is_admin ? "secondary" : "outline"} className="text-xs">
                        {message.is_admin ? "Admin" : "User"}
                      </Badge>
                      <span className="text-xs opacity-70">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply">Reply to {currentUser?.username || 'User'}</Label>
            <Textarea
              id="reply"
              placeholder="Type your message..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSendReply} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserMessages;