import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles?: {
    username: string;
  };
}

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchMessages = async () => {
      try {
        // Get the user's active support conversation
        const { data: conversation } = await supabase
          .from('conversations')
          .select('id')
          .eq('status', 'active')
          .single();
          
        if (!conversation) {
          setLoading(false);
          return;
        }
        
        // Get messages for this conversation
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            profiles (
              username
            )
          `)
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        No messages yet. Start a conversation!
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto p-4">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`p-4 rounded-lg max-w-[80%] ${
            message.sender_id === user?.id
              ? 'ml-auto bg-primary/20 border border-primary/20'
              : 'mr-auto bg-white/10 border border-white/10'
          }`}
        >
          <div className="text-sm font-medium text-white/80">
            {message.sender_id === user?.id ? 'You' : message.profiles?.username || 'Support Team'}
          </div>
          <div className="mt-1 text-white">{message.content}</div>
          <div className="text-xs text-white/60 mt-1">
            {new Date(message.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}