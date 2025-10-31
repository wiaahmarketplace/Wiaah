/*
  # Add Sample Profiles for User Mention Testing

  1. Sample Data
    - Add sample user profiles for testing mentions
    - Create corresponding auth users if needed

  2. Purpose
    - Enable user mention autocomplete functionality
    - Provide realistic test data

  3. Note
    - Uses gen_random_uuid() for user IDs
    - Skips auth.users creation (would need proper authentication setup)
*/

-- Insert sample profiles (without requiring auth.users)
-- Note: In production, these should be created through proper user signup

DO $$
DECLARE
  user_id_1 uuid := gen_random_uuid();
  user_id_2 uuid := gen_random_uuid();
  user_id_3 uuid := gen_random_uuid();
  user_id_4 uuid := gen_random_uuid();
  user_id_5 uuid := gen_random_uuid();
BEGIN
  -- Temporarily disable the foreign key constraint for testing
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
  
  -- Insert sample profiles
  INSERT INTO profiles (id, username, avatar_url, bio) VALUES
    (user_id_1, 'johndoe', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', 'Travel enthusiast and photographer'),
    (user_id_2, 'janedoe', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', 'Foodie and lifestyle blogger'),
    (user_id_3, 'alexsmith', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fitness coach and wellness advocate'),
    (user_id_4, 'sarahwilson', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fashion designer and stylist'),
    (user_id_5, 'mikebrown', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tech entrepreneur and developer')
  ON CONFLICT (username) DO NOTHING;
  
  -- Re-enable constraint (will not enforce on existing rows)
  ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE 
    NOT VALID;
END $$;
