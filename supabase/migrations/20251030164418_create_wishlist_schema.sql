/*
  # Create Wishlist Schema

  1. New Tables
    - `wishlist_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (text)
      - `product_name` (text)
      - `product_price` (decimal)
      - `product_image` (text)
      - `expires_at` (timestamptz) - 24 hours from creation
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `wishlist_items` table
    - Add policy for authenticated users to manage their own wishlist items
    
  3. Indexes
    - Add index on user_id for faster queries
    - Add index on expires_at for cleanup queries
*/

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_price decimal(10,2) NOT NULL,
  product_image text NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '24 hours') NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users to manage their own wishlist
CREATE POLICY "Users can view their own wishlist items"
  ON wishlist_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to their own wishlist"
  ON wishlist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist items"
  ON wishlist_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete items from their own wishlist"
  ON wishlist_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_expires_at ON wishlist_items(expires_at);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_product ON wishlist_items(user_id, product_id);

-- Function to clean up expired wishlist items
CREATE OR REPLACE FUNCTION cleanup_expired_wishlist_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM wishlist_items WHERE expires_at < now();
END;
$$;