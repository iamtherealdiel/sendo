import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface MessageInputProps {
  conversationId?: string;
  onMessageSent?: () => void;
}

export default function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuthStore();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending || !user) return;
    
    setIsSending(true);
    
    try {
      let activeConversationId = conversationId;
      
      // If no conversationId is provided, create a new support conversation
      if (!activeConversationId) {
        // Check if a support conversation already exists
        const { data: existingConvo } = await supabase
          .from('conversations')
          .select('id')
          .eq('status', 'active')
          .single();
          
        if (existingConvo) {
          activeConversationId = existingConvo.id;
        } else {
          // Create a new conversation
          const { data: newConvo, error: convoError } = await supabase
            .from('conversations')
            .insert({
              title: 'Support Chat',
              status: 'active'
            })
            .select()
            .single();
            
          if (convoError) throw convoError;
          
          // Add the user and support team as participants
          const { error: participantError } = await supabase
            .from('participants')
            .insert([
              { conversation_id: newConvo.id, user_id: user.id }
            ]);
            
          if (participantError) throw participantError;
          
          activeConversationId = newConvo.id;
        }
      }
      
      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversationId,
          sender_id: user.id,
          content: message
        });
        
      if (messageError) throw messageError;
      
      // Clear input and notify parent
      setMessage('');
      onMessageSent?.();
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button 
        type="submit" 
        disabled={isSending || !message.trim()}
        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
          isSending || !message.trim() 
            ? 'bg-primary/50 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary-hover'
        }`}
      >
        <Send className="h-5 w-5 text-white" />
      </button>
    </form>
  );
}