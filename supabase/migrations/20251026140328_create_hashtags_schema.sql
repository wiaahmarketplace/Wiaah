/*
  # Create Hashtags Schema

  1. New Tables
    - `hashtags`
      - `id` (uuid, primary key)
      - `name` (text, hashtag name without #)
      - `post_count` (text, number of posts as formatted string)
      - `follower_count` (integer, number of followers)
      - `created_at` (timestamptz)
    
    - `hashtag_posts`
      - `id` (uuid, primary key)
      - `hashtag_id` (uuid, reference to hashtags)
      - `image_url` (text, post image)
      - `title` (text, post title)
      - `description` (text, post description)
      - `views` (integer, number of views)
      - `likes` (integer, number of likes)
      - `comments` (integer, number of comments)
      - `created_at` (timestamptz)

    - `hashtag_followers`
      - `id` (uuid, primary key)
      - `hashtag_id` (uuid, reference to hashtags)
      - `user_id` (uuid, user following the hashtag)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to follow/unfollow

  3. Indexes
    - Index on hashtag name for search
    - Index on hashtag_id for posts lookup
    - Composite index on hashtag_followers for quick follow checks
*/

CREATE TABLE IF NOT EXISTS hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  post_count text DEFAULT '0',
  follower_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hashtag_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag_id uuid NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hashtag_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag_id uuid NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hashtag_id, user_id)
);

ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hashtags are viewable by everyone"
  ON hashtags
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create hashtags"
  ON hashtags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Hashtag posts are viewable by everyone"
  ON hashtag_posts
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create hashtag posts"
  ON hashtag_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Hashtag followers are viewable by everyone"
  ON hashtag_followers
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can follow hashtags"
  ON hashtag_followers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can unfollow hashtags"
  ON hashtag_followers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS hashtags_name_idx ON hashtags(name);
CREATE INDEX IF NOT EXISTS hashtag_posts_hashtag_id_idx ON hashtag_posts(hashtag_id);
CREATE INDEX IF NOT EXISTS hashtag_posts_likes_idx ON hashtag_posts(likes DESC);
CREATE INDEX IF NOT EXISTS hashtag_posts_comments_idx ON hashtag_posts(comments DESC);
CREATE INDEX IF NOT EXISTS hashtag_posts_views_idx ON hashtag_posts(views DESC);
CREATE INDEX IF NOT EXISTS hashtag_followers_lookup_idx ON hashtag_followers(hashtag_id, user_id);
