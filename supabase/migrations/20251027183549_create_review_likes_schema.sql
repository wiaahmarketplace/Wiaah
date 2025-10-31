/*
  # Create review likes schema

  1. New Tables
    - `review_likes`
      - `id` (uuid, primary key)
      - `review_id` (integer, references review)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `review_likes` table
    - Add policy for authenticated users to like reviews
    - Add policy for authenticated users to unlike reviews
    - Add policy for anyone to view likes count

  3. Important Notes
    - Uses a composite unique constraint to prevent duplicate likes
    - Tracks when likes were created
*/

CREATE TABLE IF NOT EXISTS review_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id integer NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate likes
CREATE UNIQUE INDEX IF NOT EXISTS review_likes_review_user_unique 
  ON review_likes(review_id, user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS review_likes_review_id_idx 
  ON review_likes(review_id);

ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view likes
CREATE POLICY "Anyone can view review likes"
  ON review_likes
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can add likes
CREATE POLICY "Authenticated users can like reviews"
  ON review_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove their own likes
CREATE POLICY "Users can unlike reviews"
  ON review_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
