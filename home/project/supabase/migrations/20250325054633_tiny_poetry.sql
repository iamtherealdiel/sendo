/*
  # Create user settings system
  
  1. New Tables
    - user_settings: Store user preferences and settings
    - user_sessions: Track user login sessions
    - connected_accounts: Manage external account connections
    - login_history: Record login attempts and activity
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Ensure proper data isolation
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can view own connected accounts" ON connected_accounts;
DROP POLICY IF EXISTS "Users can manage own connected accounts" ON connected_accounts;
DROP POLICY IF EXISTS "Users can view own login history" ON login_history;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  appearance jsonb DEFAULT '{
    "theme": "system",
    "layout": "standard",
    "accent_color": "#0071e3",
    "font_size": "medium",
    "high_contrast": false,
    "reduced_motion": false
  }'::jsonb,
  notifications jsonb DEFAULT '{
    "email": {
      "marketing": true,
      "security": true,
      "updates": true
    },
    "in_app": {
      "messages": true,
      "mentions": true,
      "updates": true
    },
    "digest": "never",
    "quiet_hours": {
      "enabled": false,
      "start": "22:00",
      "end": "07:00"
    }
  }'::jsonb,
  privacy jsonb DEFAULT '{
    "data_sharing": false,
    "read_receipts": true,
    "activity_status": true
  }'::jsonb,
  communication jsonb DEFAULT '{
    "language": "en",
    "timezone": "UTC",
    "auto_reply": {
      "enabled": false,
      "message": ""
    }
  }'::jsonb,
  accessibility jsonb DEFAULT '{
    "screen_reader": false,
    "keyboard_nav": true
  }'::jsonb,
  backup jsonb DEFAULT '{
    "auto_backup": false,
    "frequency": "weekly",
    "last_backup": null
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  device_info jsonb NOT NULL,
  ip_address text,
  location jsonb,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create connected_accounts table
CREATE TABLE IF NOT EXISTS connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Create login_history table
CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text,
  device_info jsonb,
  location jsonb,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON user_sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own connected accounts"
  ON connected_accounts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own connected accounts"
  ON connected_accounts FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own login history"
  ON login_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at trigger
DROP FUNCTION IF EXISTS handle_updated_at CASCADE;
CREATE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER handle_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_connected_accounts_updated_at
  BEFORE UPDATE ON connected_accounts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();