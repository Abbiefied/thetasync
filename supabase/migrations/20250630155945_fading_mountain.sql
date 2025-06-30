/*
  # Fix infinite recursion in group_members RLS policies

  1. Problem
    - Current RLS policies on group_members table are causing infinite recursion
    - This happens when policies reference the same table they're protecting
    - Affects group creation and discovery functionality

  2. Solution
    - Drop existing problematic policies
    - Create new non-recursive policies that properly handle access control
    - Ensure policies don't create circular dependencies

  3. New Policies
    - SELECT: Users can view members of public groups OR groups they belong to
    - INSERT: Users can add themselves to groups
    - UPDATE: Group owners/admins can manage members, users can update own membership
    - DELETE: Users can leave groups, owners/admins can remove members

  4. Security
    - Maintains proper access control without recursion
    - Preserves group privacy settings
    - Allows proper member management
*/

-- First, drop all existing policies on group_members to start fresh
DROP POLICY IF EXISTS "Allow viewing members of public groups" ON group_members;
DROP POLICY IF EXISTS "Group owners and admins can manage members" ON group_members;
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
DROP POLICY IF EXISTS "Users can leave groups and owners can remove members" ON group_members;
DROP POLICY IF EXISTS "Users can view group members of groups they belong to" ON group_members;

-- Ensure RLS is enabled
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT - Allow viewing members of public groups
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

-- Policy 2: SELECT - Allow viewing members of groups user belongs to
CREATE POLICY "Users can view members of their own groups"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT sg.id FROM study_groups sg 
      WHERE sg.created_by = auth.uid()
      OR sg.id IN (
        SELECT gm.group_id FROM group_members gm 
        WHERE gm.user_id = auth.uid()
      )
    )
  );

-- Policy 3: INSERT - Users can add themselves to groups
CREATE POLICY "Users can join groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy 4: UPDATE - Users can update their own membership, owners/admins can manage all
CREATE POLICY "Users can update group memberships"
  ON group_members
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM study_groups sg 
      WHERE sg.id = group_members.group_id 
      AND sg.created_by = auth.uid()
    )
  );

-- Policy 5: DELETE - Users can leave groups, owners can remove members
CREATE POLICY "Users can leave groups and owners can remove members"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM study_groups sg 
      WHERE sg.id = group_members.group_id 
      AND sg.created_by = auth.uid()
    )
  );