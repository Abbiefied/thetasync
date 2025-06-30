/*
  # Fix Row Level Security Policies for Study Groups Platform

  1. Updated Policies
    - Allow authenticated users to read all study groups (public and private visibility handled at app level)
    - Allow authenticated users to read basic user profile information
    - Maintain security for write operations (users can only modify their own data)

  2. Security Changes
    - Users can view all study groups and their details
    - Users can view basic profile information of other users (name, institution, etc.)
    - Users can still only modify their own profiles and groups they own
*/

-- Update study_groups policies to allow reading all groups
DROP POLICY IF EXISTS "Allow viewing owned groups" ON study_groups;
DROP POLICY IF EXISTS "Allow viewing public groups" ON study_groups;

CREATE POLICY "Allow authenticated users to read all study groups"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Keep existing policies for write operations
-- Users can still only create, update, and delete their own groups

-- Update user_profiles policies to allow reading basic profile information
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

CREATE POLICY "Allow authenticated users to read basic user profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Keep existing policies for write operations
-- Users can still only insert and update their own profiles

-- Update group_members policies to allow viewing all group memberships
DROP POLICY IF EXISTS "Allow viewing own membership" ON group_members;
DROP POLICY IF EXISTS "Allow viewing owned group members" ON group_members;
DROP POLICY IF EXISTS "Allow viewing public group members" ON group_members;

CREATE POLICY "Allow authenticated users to read all group memberships"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Keep existing policies for write operations
-- Users can still only join/leave groups and owners can manage members