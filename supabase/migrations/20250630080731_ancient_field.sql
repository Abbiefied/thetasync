/*
  # Create StudyCircle Application Tables

  1. New Tables
    - `study_groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `subject` (text)
      - `description` (text)
      - `max_members` (integer)
      - `difficulty` (text)
      - `is_private` (boolean)
      - `tags` (text array)
      - `created_by` (uuid, references user_profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `group_members`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references study_groups)
      - `user_id` (uuid, references user_profiles)
      - `role` (text)
      - `expertise` (text)
      - `joined_at` (timestamp)

    - `group_schedules`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references study_groups)
      - `day` (text)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamp)

    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `group_id` (uuid, references study_groups)
      - `assigned_to` (uuid array)
      - `due_date` (timestamp)
      - `status` (text)
      - `priority` (text)
      - `created_by` (uuid, references user_profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `quizzes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `group_id` (uuid, references study_groups)
      - `time_limit` (integer)
      - `max_attempts` (integer)
      - `questions` (jsonb)
      - `created_by` (uuid, references user_profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `quiz_attempts`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, references quizzes)
      - `user_id` (uuid, references user_profiles)
      - `answers` (jsonb)
      - `score` (integer)
      - `completed_at` (timestamp)
      - `time_taken` (integer)

    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `url` (text)
      - `file_path` (text)
      - `tags` (text array)
      - `group_id` (uuid, references study_groups)
      - `uploaded_by` (uuid, references user_profiles)
      - `uploaded_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references study_groups)
      - `user_id` (uuid, references user_profiles)
      - `content` (text)
      - `message_type` (text)
      - `reply_to` (uuid, references messages)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `achievement_type` (text)
      - `achievement_data` (jsonb)
      - `points_earned` (integer)
      - `earned_at` (timestamp)

    - `leaderboard_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `total_points` (integer)
      - `tasks_completed` (integer)
      - `quizzes_completed` (integer)
      - `study_hours` (integer)
      - `current_rank` (integer)
      - `previous_rank` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create study_groups table
CREATE TABLE IF NOT EXISTS study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  max_members integer NOT NULL DEFAULT 10 CHECK (max_members >= 2 AND max_members <= 50),
  difficulty text NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  is_private boolean NOT NULL DEFAULT false,
  tags text[] DEFAULT '{}',
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'Member' CHECK (role IN ('Owner', 'Admin', 'Member')),
  expertise text NOT NULL CHECK (expertise IN ('Beginner', 'Intermediate', 'Advanced')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group_schedules table
CREATE TABLE IF NOT EXISTS group_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  assigned_to uuid[] DEFAULT '{}',
  due_date timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  time_limit integer DEFAULT 30 CHECK (time_limit > 0),
  max_attempts integer DEFAULT 3 CHECK (max_attempts > 0),
  questions jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}',
  score integer DEFAULT 0 CHECK (score >= 0),
  completed_at timestamptz DEFAULT now(),
  time_taken integer DEFAULT 0 CHECK (time_taken >= 0)
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('document', 'video', 'link', 'image')),
  url text,
  file_path text,
  tags text[] DEFAULT '{}',
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  uploaded_at timestamptz DEFAULT now(),
  CHECK ((url IS NOT NULL AND file_path IS NULL) OR (url IS NULL AND file_path IS NOT NULL))
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  reply_to uuid REFERENCES messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_data jsonb DEFAULT '{}',
  points_earned integer NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
  earned_at timestamptz DEFAULT now()
);

-- Create leaderboard_entries table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_points integer NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  tasks_completed integer NOT NULL DEFAULT 0 CHECK (tasks_completed >= 0),
  quizzes_completed integer NOT NULL DEFAULT 0 CHECK (quizzes_completed >= 0),
  study_hours integer NOT NULL DEFAULT 0 CHECK (study_hours >= 0),
  current_rank integer,
  previous_rank integer,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_groups_created_by ON study_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_study_groups_subject ON study_groups(subject);
CREATE INDEX IF NOT EXISTS idx_study_groups_difficulty ON study_groups(difficulty);
CREATE INDEX IF NOT EXISTS idx_study_groups_is_private ON study_groups(is_private);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

CREATE INDEX IF NOT EXISTS idx_group_schedules_group_id ON group_schedules(group_id);

CREATE INDEX IF NOT EXISTS idx_tasks_group_id ON tasks(group_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_quizzes_group_id ON quizzes(group_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_resources_group_id ON resources(group_id);
CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by ON resources(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(achievement_type);

CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_user_id ON leaderboard_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_total_points ON leaderboard_entries(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_current_rank ON leaderboard_entries(current_rank);

-- Enable RLS on all tables
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Study Groups Policies
CREATE POLICY "Users can view public groups and their own groups"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (
    NOT is_private OR 
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = study_groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON study_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Group owners can update their groups"
  ON study_groups
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Group owners can delete their groups"
  ON study_groups
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Group Members Policies
CREATE POLICY "Users can view group members of groups they belong to"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM study_groups sg 
      WHERE sg.id = group_members.group_id AND NOT sg.is_private
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Group owners and admins can manage members"
  ON group_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_members.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

CREATE POLICY "Users can leave groups and owners can remove members"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_members.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

-- Group Schedules Policies
CREATE POLICY "Users can view schedules of groups they belong to"
  ON group_schedules
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_schedules.group_id AND gm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM study_groups sg 
      WHERE sg.id = group_schedules.group_id AND NOT sg.is_private
    )
  );

CREATE POLICY "Group owners and admins can manage schedules"
  ON group_schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_schedules.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

-- Tasks Policies
CREATE POLICY "Group members can view tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = tasks.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = tasks.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Task creators and group admins can update tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = tasks.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

CREATE POLICY "Task creators and group admins can delete tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = tasks.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

-- Quizzes Policies
CREATE POLICY "Group members can view quizzes"
  ON quizzes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = quizzes.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create quizzes"
  ON quizzes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = quizzes.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Quiz creators and group admins can update quizzes"
  ON quizzes
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = quizzes.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

CREATE POLICY "Quiz creators and group admins can delete quizzes"
  ON quizzes
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = quizzes.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

-- Quiz Attempts Policies
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own quiz attempts"
  ON quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN group_members gm ON gm.group_id = q.group_id
      WHERE q.id = quiz_attempts.quiz_id AND gm.user_id = auth.uid()
    )
  );

-- Resources Policies
CREATE POLICY "Group members can view resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = resources.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can upload resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = resources.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Resource uploaders and group admins can update resources"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = resources.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

CREATE POLICY "Resource uploaders and group admins can delete resources"
  ON resources
  FOR DELETE
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = resources.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

-- Messages Policies
CREATE POLICY "Group members can view messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = messages.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = messages.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Message senders and group admins can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = messages.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

CREATE POLICY "Message senders and group admins can delete messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = messages.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('Owner', 'Admin')
    )
  );

-- User Achievements Policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Leaderboard Entries Policies
CREATE POLICY "All authenticated users can view leaderboard"
  ON leaderboard_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own leaderboard entry"
  ON leaderboard_entries
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_study_groups_updated_at
  BEFORE UPDATE ON study_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_entries_updated_at
  BEFORE UPDATE ON leaderboard_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically add group creator as owner
CREATE OR REPLACE FUNCTION add_group_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role, expertise)
  VALUES (
    NEW.id, 
    NEW.created_by, 
    'Owner',
    (SELECT degree_level FROM user_profiles WHERE id = NEW.created_by)
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER add_group_creator_as_owner_trigger
  AFTER INSERT ON study_groups
  FOR EACH ROW
  EXECUTE FUNCTION add_group_creator_as_owner();

-- Function to initialize leaderboard entry for new users
CREATE OR REPLACE FUNCTION initialize_leaderboard_entry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO leaderboard_entries (user_id, total_points, tasks_completed, quizzes_completed, study_hours)
  VALUES (NEW.id, 0, 0, 0, 0);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER initialize_leaderboard_entry_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_leaderboard_entry();