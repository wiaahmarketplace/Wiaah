/*
  # Create Action Videos Schema

  1. New Tables
    - `action_videos`
      - `id` (uuid, primary key)
      - `video_url` (text, video file URL)
      - `thumbnail_url` (text, video thumbnail)
      - `artist_name` (text, artist/creator name)
      - `song_name` (text, song/music name)
      - `description` (text, video description)
      - `username` (text, creator username)
      - `user_avatar` (text, creator avatar URL)
      - `location_id` (uuid, reference to locations)
      - `location_name` (text, location display name)
      - `likes` (integer, number of likes)
      - `comments_count` (integer, number of comments)
      - `shares` (integer, number of shares)
      - `saves` (integer, number of saves)
      - `views` (integer, number of views)
      - `duration` (integer, video duration in seconds)
      - `created_at` (timestamptz)
    
    - `video_comments`
      - `id` (uuid, primary key)
      - `video_id` (uuid, reference to action_videos)
      - `user_id` (uuid, commenter user id)
      - `username` (text, commenter username)
      - `user_avatar` (text, commenter avatar)
      - `comment_text` (text, comment content)
      - `likes` (integer, comment likes)
      - `created_at` (timestamptz)

    - `video_tagged_users`
      - `id` (uuid, primary key)
      - `video_id` (uuid, reference to action_videos)
      - `user_id` (uuid, tagged user id)
      - `username` (text, tagged username)
      - `user_avatar` (text, tagged user avatar)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to create/update

  3. Indexes
    - Index on video_id for comments and tagged users
    - Index on created_at for video ordering
*/

CREATE TABLE IF NOT EXISTS action_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  artist_name text NOT NULL,
  song_name text NOT NULL,
  description text DEFAULT '',
  username text NOT NULL,
  user_avatar text NOT NULL,
  location_id uuid,
  location_name text DEFAULT '',
  likes integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares integer DEFAULT 0,
  saves integer DEFAULT 0,
  views integer DEFAULT 0,
  duration integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES action_videos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  username text NOT NULL,
  user_avatar text NOT NULL,
  comment_text text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_tagged_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES action_videos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  username text NOT NULL,
  user_avatar text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE action_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_tagged_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Action videos are viewable by everyone"
  ON action_videos
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create videos"
  ON action_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Video comments are viewable by everyone"
  ON video_comments
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON video_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Video tagged users are viewable by everyone"
  ON video_tagged_users
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can tag users"
  ON video_tagged_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS action_videos_created_at_idx ON action_videos(created_at DESC);
CREATE INDEX IF NOT EXISTS video_comments_video_id_idx ON video_comments(video_id);
CREATE INDEX IF NOT EXISTS video_tagged_users_video_id_idx ON video_tagged_users(video_id);
