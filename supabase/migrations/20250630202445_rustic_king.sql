/*
  # Add is_edited column to messages table

  1. Changes
    - Add `is_edited` boolean column to `messages` table
    - Set default value to `false` for existing and new records
    - Column tracks whether a message has been edited after creation

  2. Notes
    - This resolves the runtime error where the application expects this column
    - All existing messages will have `is_edited` set to `false` by default
*/

ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;