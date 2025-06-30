/*
  # Fix RLS Policies and Add Demo Groups

  1. Problem Resolution
    - Fix infinite recursion in RLS policies
    - Simplify policy structure to avoid circular dependencies
    - Ensure proper access control without recursion

  2. Demo Data
    - Add demo study groups for testing
    - Make all demo groups public
    - Include realistic data with schedules and tags

  3. Security
    - Maintain proper access control
    - Ensure authenticated users can access appropriate data
    - Prevent unauthorized access to private groups
*/

-- ============================================================================
-- CLEAN UP EXISTING POLICIES
-- ============================================================================

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public groups are viewable by authenticated users" ON study_groups;
DROP POLICY IF EXISTS "Group members can view their groups" ON study_groups;
DROP POLICY IF EXISTS "Group owners can view their own groups" ON study_groups;
DROP POLICY IF EXISTS "Authenticated users can create study groups" ON study_groups;
DROP POLICY IF EXISTS "Group owners can update their groups" ON study_groups;
DROP POLICY IF EXISTS "Group owners can delete their groups" ON study_groups;

DROP POLICY IF EXISTS "Users can view their own membership" ON group_members;
DROP POLICY IF EXISTS "Users can view members of public groups" ON group_members;
DROP POLICY IF EXISTS "Group owners can view all group members" ON group_members;
DROP POLICY IF EXISTS "Authenticated users can join groups" ON group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON group_members;
DROP POLICY IF EXISTS "Group owners can remove members" ON group_members;
DROP POLICY IF EXISTS "Group owners can update member roles" ON group_members;

-- ============================================================================
-- CREATE SIMPLIFIED NON-RECURSIVE POLICIES
-- ============================================================================

-- Study Groups Policies
CREATE POLICY "Allow viewing public groups"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (is_private = false);

CREATE POLICY "Allow viewing owned groups"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Allow creating groups"
  ON study_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow updating owned groups"
  ON study_groups
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Allow deleting owned groups"
  ON study_groups
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Group Members Policies
CREATE POLICY "Allow viewing own membership"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow viewing public group members"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM study_groups WHERE is_private = false
    )
  );

CREATE POLICY "Allow viewing owned group members"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM study_groups WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Allow joining groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow leaving groups"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow owners to manage members"
  ON group_members
  FOR ALL
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM study_groups WHERE created_by = auth.uid()
    )
  );

-- ============================================================================
-- ADD DEMO GROUPS
-- ============================================================================

-- Insert demo study groups (only if they don't already exist)
DO $$
DECLARE
    demo_user_id uuid;
    group1_id uuid;
    group2_id uuid;
    group3_id uuid;
    group4_id uuid;
BEGIN
    -- Check if we have any user profiles to use as demo group creators
    SELECT id INTO demo_user_id FROM user_profiles LIMIT 1;
    
    -- Only proceed if we have at least one user profile
    IF demo_user_id IS NOT NULL THEN
        -- Insert demo groups only if they don't exist
        IF NOT EXISTS (SELECT 1 FROM study_groups WHERE name = 'Advanced Algorithms Study Circle') THEN
            INSERT INTO study_groups (id, name, subject, description, max_members, difficulty, is_private, tags, created_by)
            VALUES (
                gen_random_uuid(),
                'Advanced Algorithms Study Circle',
                'Computer Science',
                'Deep dive into complex algorithms and data structures. Perfect for preparing for technical interviews and mastering algorithmic thinking.',
                8,
                'Advanced',
                false,
                ARRAY['Algorithms', 'Data Structures', 'Interview Prep', 'Problem Solving'],
                demo_user_id
            ) RETURNING id INTO group1_id;

            -- Add schedule for group 1
            INSERT INTO group_schedules (group_id, day, start_time, end_time)
            VALUES 
                (group1_id, 'Tuesday', '19:00', '21:00'),
                (group1_id, 'Thursday', '19:00', '21:00');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM study_groups WHERE name = 'Machine Learning Fundamentals') THEN
            INSERT INTO study_groups (id, name, subject, description, max_members, difficulty, is_private, tags, created_by)
            VALUES (
                gen_random_uuid(),
                'Machine Learning Fundamentals',
                'Computer Science',
                'Learn the basics of machine learning algorithms and their applications. Hands-on approach with Python and popular ML libraries.',
                10,
                'Beginner',
                false,
                ARRAY['Machine Learning', 'AI', 'Python', 'Data Science'],
                demo_user_id
            ) RETURNING id INTO group2_id;

            -- Add schedule for group 2
            INSERT INTO group_schedules (group_id, day, start_time, end_time)
            VALUES (group2_id, 'Friday', '16:00', '18:00');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM study_groups WHERE name = 'Organic Chemistry Mastery') THEN
            INSERT INTO study_groups (id, name, subject, description, max_members, difficulty, is_private, tags, created_by)
            VALUES (
                gen_random_uuid(),
                'Organic Chemistry Mastery',
                'Chemistry',
                'Master organic chemistry concepts through collaborative problem-solving and peer teaching. Focus on reaction mechanisms and synthesis.',
                6,
                'Intermediate',
                false,
                ARRAY['Organic Chemistry', 'Problem Solving', 'Pre-Med', 'Synthesis'],
                demo_user_id
            ) RETURNING id INTO group3_id;

            -- Add schedule for group 3
            INSERT INTO group_schedules (group_id, day, start_time, end_time)
            VALUES 
                (group3_id, 'Monday', '18:00', '20:00'),
                (group3_id, 'Wednesday', '18:00', '20:00');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM study_groups WHERE name = 'Calculus III Study Group') THEN
            INSERT INTO study_groups (id, name, subject, description, max_members, difficulty, is_private, tags, created_by)
            VALUES (
                gen_random_uuid(),
                'Calculus III Study Group',
                'Mathematics',
                'Work through multivariable calculus problems and prepare for exams together. Focus on vector calculus and applications.',
                5,
                'Intermediate',
                false,
                ARRAY['Calculus', 'Mathematics', 'Problem Solving', 'Vector Calculus'],
                demo_user_id
            ) RETURNING id INTO group4_id;

            -- Add schedule for group 4
            INSERT INTO group_schedules (group_id, day, start_time, end_time)
            VALUES (group4_id, 'Sunday', '14:00', '16:00');
        END IF;

        RAISE NOTICE 'Demo groups created successfully';
    ELSE
        RAISE NOTICE 'No user profiles found - demo groups not created';
    END IF;
END $$;