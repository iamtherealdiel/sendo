/*
  # Remove user settings system
  
  1. Changes
    - Drop user_settings table
    - Drop user_sessions table
    - Drop connected_accounts table
    - Drop login_history table
    - Drop associated triggers and functions
    
  2. Security
    - Remove all associated RLS policies
*/

-- Drop triggers first
DROP TRIGGER IF EXISTS handle_user_settings_updated_at ON user_settings;
DROP TRIGGER IF EXISTS handle_connected_accounts_updated_at ON connected_accounts;

-- Drop policies
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can view own connected accounts" ON connected_accounts;
DROP POLICY IF EXISTS "Users can manage own connected accounts" ON connected_accounts;
DROP POLICY IF EXISTS "Users can view own login history" ON login_history;

-- Drop tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS connected_accounts;
DROP TABLE IF EXISTS login_history;

-- Drop functions
DROP FUNCTION IF EXISTS handle_updated_at();