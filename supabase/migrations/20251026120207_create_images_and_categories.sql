/*
  # Create Images and Categories Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `icon_url` (text, nullable)
      - `created_at` (timestamptz)
    
    - `images`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `description` (text, nullable)
      - `category_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users)
      - `views` (integer, default 0)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read all content
    - Add policies for authenticated users to manage their own content
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view images"
  ON images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create images"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
  ON images FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_images_category ON images(category_id);
CREATE INDEX IF NOT EXISTS idx_images_user ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_created ON images(created_at DESC);