/*
  # Create Messages System Schema

  ## Description
  Creates a comprehensive messaging system with support for text, voice, image, emoji messages,
  message reactions (like Instagram), and shared posts/stories.

  ## 1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `conversation_participants`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users)
      - `joined_at` (timestamptz)
      - `last_read_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `sender_id` (uuid, foreign key to auth.users)
      - `message_type` (text) - 'text', 'voice', 'image', 'emoji', 'shared_post', 'shared_story'
      - `content` (text) - text content or emoji
      - `media_url` (text) - URL for voice/image messages
      - `media_duration` (integer) - duration in seconds for voice messages
      - `shared_content_id` (uuid) - ID of shared post/story
      - `shared_content_type` (text) - 'post' or 'story'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)
    
    - `message_reactions`
      - `id` (uuid, primary key)
      - `message_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users)
      - `emoji` (text) - reaction emoji (❤️, 😂, 😮, 😢, 🔥, 👍, etc.)
      - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to:
      - View conversations they participate in
      - Send messages in their conversations
      - React to messages in their conversations
      - View message reactions
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type text NOT NULL DEFAULT 'text',
  content text,
  media_url text,
  media_duration integer,
  shared_content_id uuid,
  shared_content_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'voice', 'image', 'emoji', 'shared_post', 'shared_story'))
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they participate in"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
      AND conversation_participants.user_id = auth.uid()
    )
  );

-- RLS Policies for conversation_participants
CREATE POLICY "Users can view participants in their conversations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their conversations"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id
      WHERE messages.id = message_reactions.message_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions to messages in their conversations"
  ON message_reactions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM messages
      JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id
      WHERE messages.id = message_reactions.message_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove their own reactions"
  ON message_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);