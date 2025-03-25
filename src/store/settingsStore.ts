import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserSettings {
  appearance: {
    theme: 'light' | 'dark' | 'system';
    layout: 'compact' | 'standard';
    accent_color: string;
    font_size: 'small' | 'medium' | 'large';
    high_contrast: boolean;
    reduced_motion: boolean;
  };
  notifications: {
    email: {
      marketing: boolean;
      security: boolean;
      updates: boolean;
    };
    in_app: {
      messages: boolean;
      mentions: boolean;
      updates: boolean;
    };
    digest: 'never' | 'daily' | 'weekly';
    quiet_hours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy: {
    data_sharing: boolean;
    read_receipts: boolean;
    activity_status: boolean;
  };
  communication: {
    language: string;
    timezone: string;
    auto_reply: {
      enabled: boolean;
      message: string;
    };
  };
  accessibility: {
    screen_reader: boolean;
    keyboard_nav: boolean;
  };
  backup: {
    auto_backup: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    last_backup: string | null;
  };
}

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (section: keyof UserSettings, values: any) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (error) throw error;
      set({ settings: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (section: keyof UserSettings, values: any) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ [section]: values })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      const currentSettings = get().settings;
      set({
        settings: {
          ...currentSettings!,
          [section]: values
        }
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  resetSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      set({ settings: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));