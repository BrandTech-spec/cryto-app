import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  admin_id: string | null;
  status: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimeChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const { toast } = useToast();

  // Load existing messages
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [conversationId, toast]);

  // Load conversation details
  const loadConversation = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      setConversation(data);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }, [conversationId]);

  // Create a new conversation
  const createConversation = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      setConversation(data);
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Send a message
  const sendMessage = useCallback(async (content: string, isAdmin = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let currentConversationId = conversationId;
      
      // Create conversation if it doesn't exist
      if (!currentConversationId) {
        currentConversationId = await createConversation();
        if (!currentConversationId) return false;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversationId,
          sender_id: user.id,
          content,
          is_admin: isAdmin,
          message_type: 'text'
        });

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentConversationId);

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return false;
    }
  }, [conversationId, createConversation, toast]);

  // Set up real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Show typing indicator briefly for admin messages
          if (newMessage.is_admin) {
            setTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Load data on mount
  useEffect(() => {
    if (conversationId) {
      loadMessages();
      loadConversation();
    } else {
      setLoading(false);
    }
  }, [conversationId, loadMessages, loadConversation]);

  return {
    messages,
    conversation,
    loading,
    typing,
    sendMessage,
    createConversation,
    setTyping
  };
};