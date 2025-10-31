/*
  # Create Affiliations Schema with Product/Service Links

  1. New Tables
    - `affiliations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - Owner of the affiliation
      - `product_id` (uuid, references products) - Linked product (nullable)
      - `service_id` (uuid, references service_items) - Linked service (nullable)
      - `name` (text) - Product/service name
      - `description` (text) - Short description
      - `price` (decimal) - Price
      - `cashback_percentage` (decimal) - Cashback percentage
      - `affiliate_link` (text) - Affiliate URL
      - `image_url` (text) - Main image URL
      - `provider_name` (text) - Shop or service provider name
      - `provider_type` (text) - 'shop' or 'service'
      - `provider_logo` (text) - Provider logo URL
      - `category` (text) - Product category
      - `features` (jsonb) - Array of product features
      - `username` (text) - Username of the affiliation owner
      - `user_avatar` (text) - Avatar URL of the owner
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `affiliations` table
    - Add policies for public read access
    - Add policies for users to manage their own affiliations
*/

CREATE TABLE IF NOT EXISTS affiliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  service_id uuid REFERENCES service_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10, 2) NOT NULL,
  cashback_percentage decimal(5, 2) NOT NULL DEFAULT 0,
  affiliate_link text NOT NULL,
  image_url text NOT NULL,
  provider_name text NOT NULL,
  provider_type text NOT NULL CHECK (provider_type IN ('shop', 'service')),
  provider_logo text DEFAULT '',
  category text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  username text DEFAULT '',
  user_avatar text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliations_user ON affiliations(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliations_product ON affiliations(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliations_service ON affiliations(service_id);
CREATE INDEX IF NOT EXISTS idx_affiliations_provider_type ON affiliations(provider_type);
CREATE INDEX IF NOT EXISTS idx_affiliations_category ON affiliations(category);

ALTER TABLE affiliations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view affiliations"
  ON affiliations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own affiliations"
  ON affiliations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliations"
  ON affiliations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own affiliations"
  ON affiliations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_affiliations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliations_updated_at
  BEFORE UPDATE ON affiliations
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliations_updated_at();