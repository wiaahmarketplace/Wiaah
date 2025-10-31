/*
  # Create Affiliations Schema

  1. New Tables
    - `affiliations`
      - `id` (uuid, primary key)
      - `name` (text) - Product/service name
      - `description` (text) - Short description
      - `price` (decimal) - Price in dollars
      - `cashback_percentage` (decimal) - Cashback percentage
      - `affiliate_link` (text) - Affiliate URL
      - `image_url` (text) - Main image URL
      - `provider_name` (text) - Shop or service provider name
      - `provider_type` (text) - 'shop' or 'service'
      - `provider_logo` (text) - Provider logo URL
      - `category` (text) - Product category
      - `features` (jsonb) - Array of product features
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `affiliations` table
    - Add policies for public read access (affiliations are public)
    - Add policies for authenticated users to manage their affiliations
*/

CREATE TABLE IF NOT EXISTS affiliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  cashback_percentage decimal(5, 2) NOT NULL,
  affiliate_link text NOT NULL,
  image_url text NOT NULL,
  provider_name text NOT NULL,
  provider_type text NOT NULL CHECK (provider_type IN ('shop', 'service')),
  provider_logo text,
  category text,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE affiliations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view affiliations"
  ON affiliations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert affiliations"
  ON affiliations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update affiliations"
  ON affiliations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete affiliations"
  ON affiliations
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_affiliations_provider_type ON affiliations(provider_type);
CREATE INDEX IF NOT EXISTS idx_affiliations_category ON affiliations(category);
