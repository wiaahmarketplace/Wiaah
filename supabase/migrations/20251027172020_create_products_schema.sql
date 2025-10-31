/*
  # Create products schema for shop management

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `product_id` (text, unique) - Auto-generated product ID like #PROD-1000
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `category` (text) - Product category
      - `price` (decimal) - Product price
      - `currency` (text) - Currency symbol
      - `stock` (integer) - Stock quantity
      - `status` (text) - Product status: active, inactive, draft, out_of_stock
      - `image_url` (text) - Product image URL
      - `images` (jsonb) - Array of product images
      - `user_id` (uuid, references auth.users) - Product owner
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `products` table
    - Add policies for authenticated users to manage their own products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL,
  price decimal(10, 2) NOT NULL DEFAULT 0,
  currency text DEFAULT '€',
  stock integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft', 'out_of_stock')),
  image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
