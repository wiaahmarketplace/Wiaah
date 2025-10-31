/*
  # Create Followers Schema

  1. New Tables
    - `followers`
      - `id` (uuid, primary key) - Unique identifier for the follow relationship
      - `follower_id` (uuid, foreign key) - User who is following
      - `following_id` (uuid, foreign key) - User being followed
      - `created_at` (timestamptz) - When the follow relationship was created
      - Unique constraint on (follower_id, following_id) to prevent duplicate follows

  2. Security
    - Enable RLS on `followers` table
    - Add policy for users to view followers/following lists
    - Add policy for users to follow other users
    - Add policy for users to unfollow (delete their own follows)

  3. Indexes
    - Index on follower_id for efficient "who am I following" queries
    - Index on following_id for efficient "who is following me" queries
*/

CREATE TABLE IF NOT EXISTS followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON followers(following_id);

-- Policy: Anyone can view follow relationships
CREATE POLICY "Anyone can view followers"
  ON followers FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can follow other users
CREATE POLICY "Users can follow others"
  ON followers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

-- Policy: Users can unfollow (delete their own follows)
CREATE POLICY "Users can unfollow"
  ON followers FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);