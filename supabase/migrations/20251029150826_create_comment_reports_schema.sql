/*
  # Create Comment Reports Schema

  1. New Tables
    - `video_comments`
      - `id` (uuid, primary key)
      - `video_id` (text) - Reference to the video
      - `user_id` (uuid) - Foreign key to auth.users
      - `content` (text) - Comment text
      - `parent_comment_id` (uuid, nullable) - For replies
      - `likes_count` (integer) - Number of likes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz, nullable) - Soft delete
    
    - `comment_likes`
      - `id` (uuid, primary key)
      - `comment_id` (uuid) - Foreign key to video_comments
      - `user_id` (uuid) - Foreign key to auth.users
      - `created_at` (timestamptz)
    
    - `comment_reports`
      - `id` (uuid, primary key)
      - `comment_id` (uuid) - Foreign key to video_comments
      - `reporter_user_id` (uuid) - Foreign key to auth.users (who reported)
      - `reason` (text) - Report reason
      - `additional_info` (text, nullable) - Additional details
      - `status` (text) - Status: pending, reviewed, action_taken, dismissed
      - `created_at` (timestamptz)
      - `reviewed_at` (timestamptz, nullable)
      - `reviewed_by` (uuid, nullable) - Admin who reviewed
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create video_comments table
CREATE TABLE IF NOT EXISTS video_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_comment_id uuid REFERENCES video_comments(id) ON DELETE CASCADE,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES video_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Create comment_reports table
CREATE TABLE IF NOT EXISTS comment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES video_comments(id) ON DELETE CASCADE,
  reporter_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  additional_info text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_comments_video_id ON video_comments(video_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_parent_comment_id ON video_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_user_id ON video_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_deleted_at ON video_comments(deleted_at);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_comment_id ON comment_reports(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_status ON comment_reports(status);

-- Enable RLS
ALTER TABLE video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_comments
CREATE POLICY "Users can view non-deleted comments"
  ON video_comments FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Users can insert own comments"
  ON video_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON video_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can soft delete own comments"
  ON video_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for comment_likes
CREATE POLICY "Users can view all comment likes"
  ON comment_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON comment_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for comment_reports
CREATE POLICY "Users can view own reports"
  ON comment_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_user_id);

CREATE POLICY "Users can create reports"
  ON comment_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_user_id);

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE video_comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE video_comments
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for likes count
DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_likes_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_video_comments_updated_at ON video_comments;
CREATE TRIGGER trigger_update_video_comments_updated_at
  BEFORE UPDATE ON video_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();
