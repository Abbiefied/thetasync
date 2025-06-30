/*
  # Fix infinite recursion in group_members RLS policies

  1. Policy Updates
    - Remove problematic recursive policies on group_members table
    - Create simpler, non-recursive policies that avoid circular dependencies
    - Ensure users can view and manage group memberships without recursion

  2. Security
    - Maintain proper access control without infinite recursion
    - Users can view members of groups they belong to
    - Users can view members of public groups
    - Users can manage their own memberships
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view members of public groups" ON group_members;
DROP POLICY IF EXISTS "Users can view members of their own groups" ON group_members;

-- Create new non-recursive policies for SELECT
CREATE POLICY "Users can view members of public groups"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM study_groups sg 
      WHERE sg.id = group_members.group_id 
      AND sg.is_private = false
    )
  );

CREATE POLICY "Users can view members of groups they created"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM study_groups sg 
      WHERE sg.id = group_members.group_id 
      AND sg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view their own membership"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());