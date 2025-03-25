import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import UserSearch from './UserSearch';

interface MessageComposerProps {
  onClose: () => void;
}

interface User {
  id: string;
  username: string;
  full_name?: string;
}

export default function MessageComposer({ onClose }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!selectedUser) {
      setError('Please select a recipient');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert([{ 
          title: `Admin Support - ${selectedUser.username}`,
          user_id: selectedUser.id
        }])
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('participants')
        .insert([
          { conversation_id: conversation.id, user_id: selectedUser.id },
          { conversation_id: conversation.id, user_id: (await supabase.auth.getUser()).data.user?.id }
        ]);

      if (participantsError) throw participantsError;

      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversation.id,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          content: message
        }]);

      if (messageError) throw messageError;

      onClose();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-lg w-full max-w-lg mx-4 shadow-2xl border border-white/10">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">New Message</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/50 rounded-lg p-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Recipient
            </label>
            <UserSearch 
              onSelectUser={setSelectedUser}
              selectedUser={selectedUser}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/50 resize-none"
              placeholder="Type your message..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white/80 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="apple-button-primary inline-flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}