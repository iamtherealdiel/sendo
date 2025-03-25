/*
  # Add onboarding flag to profiles table

  1. Changes
    - Add onboarding_completed column to profiles table
    - Set default value to false
*/

-- Add onboarding_completed column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;