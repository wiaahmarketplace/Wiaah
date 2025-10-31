/*
  # Create Places Schema

  1. New Tables
    - `places`
      - `id` (uuid, primary key)
      - `name` (text, place name)
      - `address` (text, place address)
      - `type` (text, type of place: bar, shop, hospital, etc.)
      - `owner_id` (uuid, reference to users)
      - `owner_name` (text, owner/business name)
      - `owner_avatar` (text, owner profile image URL)
      - `description` (text, place description)
      - `created_at` (timestamptz)
    
    - `place_posts`
      - `id` (uuid, primary key)
      - `place_id` (uuid, reference to places)
      - `image_url` (text, post image)
      - `caption` (text, post caption)
      - `likes_count` (integer, number of likes)
      - `comments_count` (integer, number of comments)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to create/update their places
*/

CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  type text NOT NULL,
  owner_id uuid,
  owner_name text NOT NULL,
  owner_avatar text,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS place_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text DEFAULT '',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Places are viewable by everyone"
  ON places
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create places"
  ON places
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own places"
  ON places
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Place posts are viewable by everyone"
  ON place_posts
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create place posts"
  ON place_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS places_type_idx ON places(type);
CREATE INDEX IF NOT EXISTS places_name_idx ON places(name);
CREATE INDEX IF NOT EXISTS place_posts_place_id_idx ON place_posts(place_id);
