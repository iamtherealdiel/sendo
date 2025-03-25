/*
  # Fix RLS policies with simplified access control
  
  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for conversations and participants
    - Add user_id column to conversations table
    - Implement direct user-based access control
    
  2. Security
    - Maintain data access control through simplified policies
    - Prevent infinite recursion
    - Ensure users can only access their own conversations
*/

-- Drop existing policies to start fresh
DO $$ 
BEGIN
  -- Drop conversation policies
  DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversations;
  DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
  DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
  
  -- Drop participant policies
  DROP POLICY IF EXISTS "Users can view participants in their conversations" ON participants;
  DROP POLICY IF EXISTS "Users can add participants" ON participants;
  DROP POLICY IF EXISTS "Users can add participants to conversations they're in" ON participants;
  DROP POLICY IF EXISTS "Users can view conversation participants" ON participants;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add user_id column to conversations if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'conversations' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE conversations ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create simplified policies for conversations
CREATE POLICY "Users can view conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create simplified policies for participants
CREATE POLICY "Users can view participants"
  ON participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add participants"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());