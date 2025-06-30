/*
  # Fix infinite recursion in group_members RLS policy

  1. Problem
    - Current RLS policy on group_members causes infinite recursion when fetching public groups
    - The policy checks group membership which creates a circular dependency

  2. Solution
    - Add a new policy that allows viewing members of public groups
    - This policy specifically targets public groups without checking membership
    - Ensures authenticated users can see members of public groups for discovery

  3. Security
    - Policy only applies to public groups (is_private = false)
    - Still maintains privacy for private groups
    - Only allows SELECT operations for authenticated users
*/

-- Add policy to allow viewing members of public groups
CREATE POLICY "Allow viewing members of public groups"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM study_groups
      WHERE study_groups.id = group_members.group_id 
      AND study_groups.is_private = false
    )
  );