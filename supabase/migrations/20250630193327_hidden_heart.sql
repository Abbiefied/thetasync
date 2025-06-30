/*
  # Fix messages reply foreign key constraint

  1. Database Changes
    - Add missing foreign key constraint `messages_reply_to_fkey` for self-referencing replies
    - Ensure `reply_to` column exists with proper type
    - Verify RLS policies are in place

  2. Security
    - Maintain existing RLS policies for messages table
    - Ensure proper access control for message operations

  This migration fixes the "Could not find a relationship between 'messages' and 'messages'" error
  by adding the missing named foreign key constraint that the API queries expect.
*/

-- Ensure the reply_to column exists with the correct type
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'reply_to'
    ) THEN
        ALTER TABLE messages ADD COLUMN reply_to uuid;
    END IF;
END $$;

-- Drop existing constraint if it exists (but with wrong name)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'messages_reply_to_fkey'
    ) THEN
        ALTER TABLE messages DROP CONSTRAINT messages_reply_to_fkey;
    END IF;
END $$;

-- Add the properly named foreign key constraint
ALTER TABLE messages
ADD CONSTRAINT messages_reply_to_fkey
FOREIGN KEY (reply_to) REFERENCES messages(id) ON DELETE SET NULL;

-- Ensure RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create index for better performance on reply queries
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON messages(reply_to);

-- Verify the update trigger exists
CREATE OR REPLACE FUNCTION update_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate the trigger to ensure it exists
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_updated_at();