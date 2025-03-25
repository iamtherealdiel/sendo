import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  full_name?: string;
}

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  selectedUser?: User | null;
}

export default function UserSearch({ onSelectUser, selectedUser }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .or(`username.ilike.%${query}%, full_name.ilike.%${query}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={selectedUser ? `@${selectedUser.username}` : query}
        onChange={(e) => {
          const value = e.target.value.startsWith('@') ? e.target.value.slice(1) : e.target.value;
          setQuery(value);
        }}
        placeholder="Search by username or name..."
        className="block w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/50"
      />

      {loading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
        </div>
      )}

      {results.length > 0 && !selectedUser && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-lg border border-white/10">
          {results.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                onSelectUser(user);
                setQuery('');
                setResults([]);
              }}
              className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors"
            >
              <div className="font-medium">@{user.username}</div>
              {user.full_name && (
                <div className="text-sm text-white/60">{user.full_name}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}