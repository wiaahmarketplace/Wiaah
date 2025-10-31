/*
  # Create Services Management Schema

  1. New Tables
    - `user_service_type`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service_category` (text, chosen service type)
      - `business_name` (text)
      - `created_at` (timestamptz)
    
    - `service_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service_category` (text, category type)
      - `name` (text, item name)
      - `description` (text)
      - `seo_meta` (jsonb, SEO metadata)
      - `photos` (jsonb, array of photo URLs)
      - `videos` (jsonb, array of video URLs)
      - `pricing` (jsonb, pricing details)
      - `specifications` (jsonb, category-specific details)
      - `amenities` (jsonb, available amenities)
      - `availability` (jsonb, availability settings)
      - `cancellation_policy` (jsonb, cancellation terms)
      - `status` (text, active/inactive/draft)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own services
*/

-- Create user service type table
CREATE TABLE IF NOT EXISTS user_service_type (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  service_category text NOT NULL,
  business_name text,
  created_at timestamptz DEFAULT now()
);

-- Create service items table
CREATE TABLE IF NOT EXISTS service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  service_category text NOT NULL,
  name text NOT NULL,
  description text,
  seo_meta jsonb DEFAULT '{}'::jsonb,
  photos jsonb DEFAULT '[]'::jsonb,
  videos jsonb DEFAULT '[]'::jsonb,
  pricing jsonb DEFAULT '{}'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  amenities jsonb DEFAULT '[]'::jsonb,
  availability jsonb DEFAULT '{}'::jsonb,
  cancellation_policy jsonb DEFAULT '{}'::jsonb,
  add_ons jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_service_type_user ON user_service_type(user_id);
CREATE INDEX IF NOT EXISTS idx_service_items_user ON service_items(user_id);
CREATE INDEX IF NOT EXISTS idx_service_items_category ON service_items(service_category);
CREATE INDEX IF NOT EXISTS idx_service_items_status ON service_items(status);

-- Enable Row Level Security
ALTER TABLE user_service_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;

-- Policies for user_service_type
CREATE POLICY "Users can view their own service type"
  ON user_service_type FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their service type"
  ON user_service_type FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their service type"
  ON user_service_type FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for service_items
CREATE POLICY "Users can view their own service items"
  ON service_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create service items"
  ON service_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their service items"
  ON service_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their service items"
  ON service_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
