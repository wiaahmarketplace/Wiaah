/*
  # Create Wallet and Transactions Schema

  1. New Tables
    - `wallet`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `current_balance` (decimal)
      - `available_earnings` (decimal)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `transaction_number` (text, unique)
      - `wallet_id` (uuid, references wallet)
      - `description` (text)
      - `date` (timestamptz)
      - `payment_method` (text)
      - `amount` (decimal)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own wallet data
*/

-- Create wallet table
CREATE TABLE IF NOT EXISTS wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  current_balance decimal(10, 2) DEFAULT 0.00,
  available_earnings decimal(10, 2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number text UNIQUE NOT NULL,
  wallet_id uuid REFERENCES wallet(id) ON DELETE CASCADE,
  description text NOT NULL,
  date timestamptz DEFAULT now(),
  payment_method text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  status text DEFAULT 'Completed',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Wallet policies
CREATE POLICY "Users can view own wallet"
  ON wallet FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallet FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
  ON wallet FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Transaction policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM wallet
      WHERE wallet.id = transactions.wallet_id
      AND wallet.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallet
      WHERE wallet.id = transactions.wallet_id
      AND wallet.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallet_user_id ON wallet(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_number ON transactions(transaction_number);
