/*
  # Create Service Items Schema

  1. New Tables
    - `service_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service_category` (text, category type)
      - `name` (text, service name)
      - `description` (text)
      - `seo_meta` (jsonb, SEO metadata)
      - `photos` (jsonb, array of photo URLs)
      - `videos` (jsonb, array of video URLs)
      - `pricing` (jsonb, pricing details)
      - `specifications` (jsonb, category-specific details)
      - `amenities` (jsonb, available amenities)
      - `availability` (jsonb, availability settings)
      - `cancellation_policy` (jsonb, cancellation terms)
      - `add_ons` (jsonb, additional services)
      - `rating` (decimal) - Average service rating
      - `review_count` (integer) - Number of reviews
      - `location` (text) - Service location
      - `latitude` (decimal) - Location latitude
      - `longitude` (decimal) - Location longitude
      - `status` (text, active/inactive/draft)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on service_items table
    - Add policies for users to manage their own services
    - Add public policy for viewing active services
*/

CREATE TABLE IF NOT EXISTS service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_category text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  seo_meta jsonb DEFAULT '{}'::jsonb,
  photos jsonb DEFAULT '[]'::jsonb,
  videos jsonb DEFAULT '[]'::jsonb,
  pricing jsonb DEFAULT '{}'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  amenities jsonb DEFAULT '[]'::jsonb,
  availability jsonb DEFAULT '{}'::jsonb,
  cancellation_policy jsonb DEFAULT '{}'::jsonb,
  add_ons jsonb DEFAULT '[]'::jsonb,
  rating decimal(3, 2) DEFAULT 0,
  review_count integer DEFAULT 0,
  location text DEFAULT '',
  latitude decimal(10, 8) DEFAULT 0,
  longitude decimal(11, 8) DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_items_user ON service_items(user_id);
CREATE INDEX IF NOT EXISTS idx_service_items_category ON service_items(service_category);
CREATE INDEX IF NOT EXISTS idx_service_items_status ON service_items(status);

ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own service items"
  ON service_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active service items"
  ON service_items
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can create service items"
  ON service_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their service items"
  ON service_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their service items"
  ON service_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_service_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_items_updated_at
  BEFORE UPDATE ON service_items
  FOR EACH ROW
  EXECUTE FUNCTION update_service_items_updated_at();