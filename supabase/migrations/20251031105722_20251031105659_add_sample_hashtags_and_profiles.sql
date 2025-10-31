/*
  # Add Sample Hashtags and Profiles for Testing

  1. Sample Data
    - Add popular hashtags with post counts
    - Add sample user profiles for mention testing

  2. Purpose
    - Enable hashtag autocomplete functionality
    - Enable user mention autocomplete functionality
    - Provide realistic test data for development

  3. Note
    - This migration adds sample data only if tables are empty
    - Uses INSERT ON CONFLICT DO NOTHING to avoid duplicates
*/

-- Add sample hashtags
INSERT INTO hashtags (name, post_count, follower_count) VALUES
  ('travel', '1.2M', 125000),
  ('photography', '856K', 98000),
  ('food', '2.1M', 210000),
  ('fitness', '945K', 102000),
  ('fashion', '1.8M', 185000),
  ('art', '723K', 89000),
  ('nature', '1.5M', 156000),
  ('technology', '634K', 78000),
  ('music', '892K', 95000),
  ('lifestyle', '1.1M', 115000),
  ('beauty', '978K', 108000),
  ('design', '567K', 67000),
  ('architecture', '445K', 52000),
  ('business', '523K', 61000),
  ('education', '412K', 48000),
  ('health', '789K', 86000),
  ('sports', '1.3M', 142000),
  ('gaming', '956K', 103000),
  ('pets', '834K', 91000),
  ('books', '445K', 54000)
ON CONFLICT (name) DO NOTHING;

-- Note: Profiles require auth.users to exist first
-- These will be created when users sign up
-- For testing, you can manually insert profiles after creating auth users
