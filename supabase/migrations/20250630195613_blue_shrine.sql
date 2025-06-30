/*
  # Create messages table for group communication

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key to study_groups)
      - `user_id` (uuid, foreign key to user_profiles)
      - `content` (text)
      - `message_type` (text, default 'text')
      - `reply_to` (uuid, optional foreign key to messages)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_edited` (boolean, default false)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for group members to view, send, edit, and delete messages
    - Users can only edit/delete their own messages

  3. Performance
    - Add indexes for group_id, user_id, created_at, and reply_to
    - Add trigger to update updated_at and is_edited fields
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Group members can view messages" ON messages;
  DROP POLICY IF EXISTS "Group members can send messages" ON messages;
  DROP POLICY IF EXISTS "Users can edit their own messages" ON messages;
  DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
  DROP POLICY IF EXISTS "Message senders and group admins can update messages" ON messages;
  DROP POLICY IF EXISTS "Message senders and group admins can delete messages" ON messages;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist yet, continue
    NULL;
END $$;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  reply_to uuid REFERENCES messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_edited boolean DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON messages(reply_to);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Group members can view messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = messages.group_id 
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = messages.group_id 
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit their own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to update updated_at and set is_edited flag
CREATE OR REPLACE FUNCTION update_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  -- Set is_edited to true if content was changed (but not on insert)
  IF TG_OP = 'UPDATE' AND OLD.content != NEW.content THEN
    NEW.is_edited = true;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for messages
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_updated_at();