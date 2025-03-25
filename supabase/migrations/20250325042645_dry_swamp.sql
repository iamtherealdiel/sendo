/*
  # Add username column to profiles table

  1. Changes
    - Add username column to profiles table
    - Add unique constraint on username
    - Update RLS policies to include username access

  2. Security
    - Maintain existing RLS policies
    - Add username to readable fields
*/

-- Add username column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username text;
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own username" ON profiles;
  DROP POLICY IF EXISTS "Users can update own username" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies
CREATE POLICY "Users can read own username" 
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own username" 
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add index for username searches
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);