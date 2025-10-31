/*
  # Create Locations Schema

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `city` (text, city name)
      - `country` (text, country name)
      - `image_url` (text, location image)
      - `post_count` (integer, number of posts)
      - `created_at` (timestamptz)
    
    - `location_posts`
      - `id` (uuid, primary key)
      - `location_id` (uuid, reference to locations)
      - `image_url` (text, post image)
      - `title` (text, post title)
      - `description` (text, post description)
      - `views` (integer, number of views)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to create/update
*/

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  country text NOT NULL,
  image_url text NOT NULL,
  post_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS location_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are viewable by everyone"
  ON locations
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update locations"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Location posts are viewable by everyone"
  ON location_posts
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create location posts"
  ON location_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS locations_city_idx ON locations(city);
CREATE INDEX IF NOT EXISTS locations_country_idx ON locations(country);
CREATE INDEX IF NOT EXISTS location_posts_location_id_idx ON location_posts(location_id);
