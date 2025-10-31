/*
  # Create blocked users schema

  1. New Tables
    - `blocked_users`
      - `id` (uuid, primary key) - Unique identifier for the block record
      - `user_id` (uuid, not null) - ID of the user who is blocking
      - `blocked_user_id` (uuid, not null) - ID of the user being blocked
      - `blocked_username` (text, not null) - Username of the blocked user for easy reference
      - `created_at` (timestamptz) - When the block was created
      - `updated_at` (timestamptz) - When the block was last updated
  
  2. Security
    - Enable RLS on `blocked_users` table
    - Add policy for users to view their own block list
    - Add policy for users to add blocks
    - Add policy for users to remove blocks
    - Add unique constraint to prevent duplicate blocks

  3. Important Notes
    - Users can only manage their own block list
    - Blocked users cannot see that they are blocked
    - Block records are used to filter content across the application
*/

CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  blocked_user_id uuid NOT NULL,
  blocked_username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_block UNIQUE (user_id, blocked_user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blocked_users_user_id ON blocked_users(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked_user_id ON blocked_users(blocked_user_id);

-- Enable RLS
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own block list
CREATE POLICY "Users can view own block list"
  ON blocked_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can add to their block list
CREATE POLICY "Users can add to block list"
  ON blocked_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove from their block list
CREATE POLICY "Users can remove from block list"
  ON blocked_users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blocked_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blocked_users_updated_at
  BEFORE UPDATE ON blocked_users
  FOR EACH ROW
  EXECUTE FUNCTION update_blocked_users_updated_at();
