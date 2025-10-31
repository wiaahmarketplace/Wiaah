/*
  # Create saved items schema

  1. New Tables
    - `saved_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category` (text) - hotels, restaurants, villas, vehicles, clothing, memes
      - `item_type` (text) - place, product, post, etc.
      - `item_id` (uuid) - references the actual item
      - `title` (text)
      - `image_url` (text)
      - `metadata` (jsonb) - additional data about the saved item
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `saved_items` table
    - Add policies for authenticated users to manage their own saved items
*/

CREATE TABLE IF NOT EXISTS saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('hotels', 'restaurants', 'villas', 'vehicles', 'clothing', 'memes')),
  item_type text NOT NULL,
  item_id uuid,
  title text NOT NULL,
  image_url text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved items"
  ON saved_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved items"
  ON saved_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved items"
  ON saved_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved items"
  ON saved_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_category ON saved_items(category);
CREATE INDEX IF NOT EXISTS idx_saved_items_created_at ON saved_items(created_at DESC);
