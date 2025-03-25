import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  adminSignIn: (username: string, password: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAdmin: false,
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ isAdmin: false });
  },
  signUp: async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    set({ isAdmin: false });
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, isAdmin: false });
  },
  setUser: (user) => set({ user, loading: false }),
  adminSignIn: async (username: string, password: string) => {
    // Case-sensitive comparison for both username and password
    if (username === 'Dee' && password === 'Test123') {
      set({ isAdmin: true });
    } else {
      throw new Error('Invalid admin credentials');
    }
  },
  updateUsername: async (username: string) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    // First update the user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { username }
    });

    if (updateError) throw updateError;

    // Then update the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    if (profileError) {
      // If profile update fails, revert the metadata update
      await supabase.auth.updateUser({
        data: { username: user.user_metadata.username }
      });
      throw profileError;
    }

    // Update local user state with new username
    set({
      user: {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          username,
        },
      },
    });
  },
}));