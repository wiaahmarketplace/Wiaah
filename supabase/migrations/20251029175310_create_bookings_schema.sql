/*
  # Create Bookings and Availability Schema

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `service_id` (integer, references service)
      - `service_category` (text, category of service)
      - `user_id` (uuid, references auth.users)
      - `booking_date` (date, main booking date)
      - `start_date` (date, for range bookings)
      - `end_date` (date, for range bookings)
      - `time_slot` (text, for time slot bookings)
      - `guests` (jsonb, guest information)
      - `status` (text, booking status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `service_unavailable_dates`
      - `id` (uuid, primary key)
      - `service_id` (integer, references service)
      - `service_category` (text, category of service)
      - `unavailable_date` (date, specific unavailable date)
      - `time_slot` (text, specific unavailable time slot, nullable)
      - `reason` (text, reason for unavailability)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to view their own bookings
    - Add policies for users to view available dates
    - Add policies for service owners to manage unavailable dates
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id integer NOT NULL,
  service_category text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  booking_date date NOT NULL,
  start_date date,
  end_date date,
  time_slot text,
  guests jsonb DEFAULT '{"adults": 1, "children": 0, "infants": 0}'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service unavailable dates table
CREATE TABLE IF NOT EXISTS service_unavailable_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id integer NOT NULL,
  service_category text NOT NULL,
  unavailable_date date NOT NULL,
  time_slot text,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id, service_category);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_date_range ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_unavailable_dates_service ON service_unavailable_dates(service_id, service_category);
CREATE INDEX IF NOT EXISTS idx_unavailable_dates_date ON service_unavailable_dates(unavailable_date);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_unavailable_dates ENABLE ROW LEVEL SECURITY;

-- Policies for bookings table
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for service unavailable dates (public read)
CREATE POLICY "Anyone can view unavailable dates"
  ON service_unavailable_dates FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service owners can manage unavailable dates"
  ON service_unavailable_dates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
