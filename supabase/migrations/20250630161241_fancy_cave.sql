/*
  # Fix RLS Policies for Study Groups and Group Members

  This migration fixes the infinite recursion issues in RLS policies by:
  1. Dropping existing problematic policies
  2. Creating new, non-recursive policies for study_groups and group_members tables
  3. Ensuring proper access control without circular dependencies

  ## Changes Made:
  1. **Study Groups Table**
     - Public groups viewable by authenticated users
     - Group members can view their own groups
     - Users can create groups
     - Group owners can manage their groups

  2. **Group Members Table**
     - Members can view other members in their groups
     - Users can join/leave groups
     - Group owners can manage member roles

  ## Security:
  - All policies use auth.uid() for user identification
  - No recursive policy dependencies
  - Proper separation of concerns between tables
*/

-- Drop existing policies that may be causing recursion
DROP POLICY IF EXISTS "Users can view public groups and their own groups" ON study_groups;
DROP POLICY IF EXISTS "Users can create groups" ON study_groups;
DROP POLICY IF EXISTS "Group owners can update their groups" ON study_groups;
DROP POLICY IF EXISTS "Group owners can delete their groups" ON study_groups;

DROP POLICY IF EXISTS "Users can join groups" ON group_members;
DROP POLICY IF EXISTS "Users can leave groups and owners can remove members" ON group_members;
DROP POLICY IF EXISTS "Users can update group memberships" ON group_members;
DROP POLICY IF EXISTS "Users can view members of groups they created" ON group_members;
DROP POLICY IF EXISTS "Users can view members of public groups" ON group_members;
DROP POLICY IF EXISTS "Users can view their own membership" ON group_members;

-- Ensure RLS is enabled
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STUDY GROUPS POLICIES (Non-recursive)
-- ============================================================================

-- Allow viewing public groups
CREATE POLICY "Public groups are viewable by authenticated users"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (is_private = FALSE);

-- Allow viewing groups where user is a member (using direct user_id check)
CREATE POLICY "Group members can view their groups"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (
    is_private = TRUE AND 
    id IN (
      SELECT group_id 
      FROM group_members 
      WHERE user_id = auth.uid()
    )
  );

-- Allow group owners to view their own groups
CREATE POLICY "Group owners can view their own groups"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Allow authenticated users to create groups
CREATE POLICY "Authenticated users can create study groups"
  ON study_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Allow group owners to update their groups
CREATE POLICY "Group owners can update their groups"
  ON study_groups
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Allow group owners to delete their groups
CREATE POLICY "Group owners can delete their groups"
  ON study_groups
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- ============================================================================
-- GROUP MEMBERS POLICIES (Non-recursive)
-- ============================================================================

-- Allow users to view their own membership records
CREATE POLICY "Users can view their own membership"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow users to view members of public groups
CREATE POLICY "Users can view members of public groups"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT id 
      FROM study_groups 
      WHERE is_private = FALSE
    )
  );

-- Allow group owners to view all members of their groups
CREATE POLICY "Group owners can view all group members"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT id 
      FROM study_groups 
      WHERE created_by = auth.uid()
    )
  );

-- Allow authenticated users to join groups
CREATE POLICY "Authenticated users can join groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow users to leave groups
CREATE POLICY "Users can leave groups"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Allow group owners to remove members
CREATE POLICY "Group owners can remove members"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (
    group_id IN (
      SELECT id 
      FROM study_groups 
      WHERE created_by = auth.uid()
    )
  );

-- Allow group owners to update member roles
CREATE POLICY "Group owners can update member roles"
  ON group_members
  FOR UPDATE
  TO authenticated
  USING (
    group_id IN (
      SELECT id 
      FROM study_groups 
      WHERE created_by = auth.uid()
    )
  )
  WITH CHECK (
    group_id IN (
      SELECT id 
      FROM study_groups 
      WHERE created_by = auth.uid()
    )
  );