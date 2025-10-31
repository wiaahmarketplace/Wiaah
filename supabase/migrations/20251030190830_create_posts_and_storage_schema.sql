-- Create Posts and Media Storage System
-- Summary: This migration creates a comprehensive system for storing and managing user posts (images and videos).

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url text NOT NULL,
  thumbnail_url text,
  caption text,
  hashtags jsonb DEFAULT '[]'::jsonb,
  location text,
  tagged_users jsonb DEFAULT '[]'::jsonb,
  filter text,
  video_start numeric,
  video_end numeric,
  allow_comments boolean DEFAULT true,
  allow_high_quality boolean DEFAULT false,
  visibility text DEFAULT 'public',
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts

-- Users can view their own posts
CREATE POLICY "Users can view own posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view public posts from others
CREATE POLICY "Users can view public posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (visibility = 'public');

-- Users can insert their own posts
CREATE POLICY "Users can create own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_media_type ON posts(media_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts-media', 'posts-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('posts-thumbnails', 'posts-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for posts-media bucket

-- Allow authenticated users to upload their own media
CREATE POLICY "Users can upload own media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'posts-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow anyone to view media
CREATE POLICY "Anyone can view media"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'posts-media');

-- Allow users to delete their own media
CREATE POLICY "Users can delete own media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'posts-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for posts-thumbnails bucket

-- Allow authenticated users to upload their own thumbnails
CREATE POLICY "Users can upload own thumbnails"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'posts-thumbnails' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow anyone to view thumbnails
CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'posts-thumbnails');

-- Allow users to delete their own thumbnails
CREATE POLICY "Users can delete own thumbnails"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'posts-thumbnails' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
