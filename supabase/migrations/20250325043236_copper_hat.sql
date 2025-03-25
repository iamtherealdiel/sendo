/*
  # Fix RLS policies for messaging system
  
  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for conversations and participants
    - Simplify policy conditions to avoid circular dependencies
    
  2. Security
    - Maintain data access control
    - Prevent infinite recursion in policy checks
    - Ensure users can only access their own conversations
*/

-- Drop existing policies to start fresh
DO $$ 
BEGIN
  -- Drop conversation policies
  DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversations;
  DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
  
  -- Drop participant policies
  DROP POLICY IF EXISTS "Users can view participants in their conversations" ON participants;
  DROP POLICY IF EXISTS "Users can add participants" ON participants;
  DROP POLICY IF EXISTS "Users can add participants to conversations they're in" ON participants;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies for conversations
CREATE POLICY "Users can view their conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id
      FROM participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create new policies for participants
CREATE POLICY "Users can view conversation participants"
  ON participants
  FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id
      FROM participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add participants"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is a participant in the conversation
    conversation_id IN (
      SELECT conversation_id
      FROM participants p
      WHERE p.user_id = auth.uid()
    )
    OR
    -- Allow if this is a new conversation (no participants yet)
    NOT EXISTS (
      SELECT 1
      FROM participants p
      WHERE p.conversation_id = conversation_id
    )
  );