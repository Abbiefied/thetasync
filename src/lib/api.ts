import { supabase } from './supabase';
import { StudyGroup, Task, Resource, Quiz, QuizQuestion, User, TimeSlot, GroupMember } from '../types';

// ============================================================================
// USER PROFILE OPERATIONS
// ============================================================================

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

// ============================================================================
// STUDY GROUPS OPERATIONS
// ============================================================================

export const getPublicStudyGroups = async () => {
  const { data, error } = await supabase
    .from('study_groups')
    .select(`
      *,
      group_members(count),
      group_schedules(day, start_time, end_time)
    `)
    .eq('is_private', false)
    .order('created_at', { ascending: false });
  
  if (error) return { data: null, error };

  // Transform the data to match StudyGroup interface
  const transformedData: StudyGroup[] = (data || []).map(group => ({
    id: group.id,
    name: group.name,
    subject: group.subject,
    description: group.description,
    members: [], // Will be populated when needed
    memberCount: group.group_members?.[0]?.count || 0,
    maxMembers: group.max_members,
    schedule: (group.group_schedules || []).map((schedule: any) => ({
      day: schedule.day,
      startTime: schedule.start_time,
      endTime: schedule.end_time
    })),
    tags: group.tags || [],
    difficulty: group.difficulty,
    isPrivate: group.is_private,
    createdBy: group.created_by,
    createdAt: new Date(group.created_at)
  }));
  
  return { data: transformedData, error: null };
};

export const getUserStudyGroups = async (userId: string) => {
  const { data, error } = await supabase
    .from('study_groups')
    .select(`
      *,
      group_members!inner(
        user_id,
        role,
        expertise,
        joined_at,
        user_profiles(name)
      ),
      group_schedules(day, start_time, end_time)
    `)
    .eq('group_members.user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) return { data: null, error };

  // Transform the data to match StudyGroup interface
  const transformedData: StudyGroup[] = (data || []).map(group => ({
    id: group.id,
    name: group.name,
    subject: group.subject,
    description: group.description,
    members: (group.group_members || []).map((member: any) => ({
      userId: member.user_id,
      name: member.user_profiles?.name || 'Unknown',
      role: member.role,
      expertise: member.expertise,
      joinedAt: new Date(member.joined_at)
    })),
    memberCount: group.group_members?.length || 0,
    maxMembers: group.max_members,
    schedule: (group.group_schedules || []).map((schedule: any) => ({
      day: schedule.day,
      startTime: schedule.start_time,
      endTime: schedule.end_time
    })),
    tags: group.tags || [],
    difficulty: group.difficulty,
    isPrivate: group.is_private,
    createdBy: group.created_by,
    createdAt: new Date(group.created_at)
  }));
  
  return { data: transformedData, error: null };
};

export const getStudyGroupById = async (groupId: string) => {
  const { data, error } = await supabase
    .from('study_groups')
    .select(`
      *,
      group_members(
        user_id,
        role,
        expertise,
        joined_at,
        user_profiles(name, email)
      ),
      group_schedules(day, start_time, end_time)
    `)
    .eq('id', groupId)
    .single();
  
  if (error) return { data: null, error };

  // Transform the data to match StudyGroup interface
  const transformedData: StudyGroup = {
    id: data.id,
    name: data.name,
    subject: data.subject,
    description: data.description,
    members: (data.group_members || []).map((member: any) => ({
      userId: member.user_id,
      name: member.user_profiles?.name || 'Unknown',
      role: member.role,
      expertise: member.expertise,
      joinedAt: new Date(member.joined_at)
    })),
    memberCount: data.group_members?.length || 0,
    maxMembers: data.max_members,
    schedule: (data.group_schedules || []).map((schedule: any) => ({
      day: schedule.day,
      startTime: schedule.start_time,
      endTime: schedule.end_time
    })),
    tags: data.tags || [],
    difficulty: data.difficulty,
    isPrivate: data.is_private,
    createdBy: data.created_by,
    createdAt: new Date(data.created_at)
  };
  
  return { data: transformedData, error: null };
};

export const createStudyGroup = async (groupData: {
  name: string;
  subject: string;
  description: string;
  max_members: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  is_private: boolean;
  tags: string[];
  schedules: Array<{ day: string; start_time: string; end_time: string }>;
}) => {
  const { data: group, error: groupError } = await supabase
    .from('study_groups')
    .insert({
      name: groupData.name,
      subject: groupData.subject,
      description: groupData.description,
      max_members: groupData.max_members,
      difficulty: groupData.difficulty,
      is_private: groupData.is_private,
      tags: groupData.tags,
      created_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (groupError) return { data: null, error: groupError };

  // Add schedules
  if (groupData.schedules.length > 0) {
    const { error: scheduleError } = await supabase
      .from('group_schedules')
      .insert(
        groupData.schedules.map(schedule => ({
          group_id: group.id,
          day: schedule.day,
          start_time: schedule.start_time,
          end_time: schedule.end_time
        }))
      );

    if (scheduleError) return { data: null, error: scheduleError };
  }

  return { data: group, error: null };
};

export const updateStudyGroup = async (groupId: string, updates: {
  name?: string;
  subject?: string;
  description?: string;
  max_members?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  is_private?: boolean;
  tags?: string[];
}) => {
  const { data, error } = await supabase
    .from('study_groups')
    .update(updates)
    .eq('id', groupId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteStudyGroup = async (groupId: string) => {
  const { error } = await supabase
    .from('study_groups')
    .delete()
    .eq('id', groupId);
  
  return { error };
};

export const joinStudyGroup = async (groupId: string, expertise: 'Beginner' | 'Intermediate' | 'Advanced') => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: new Error('User not authenticated') };

  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      user_id: user.id,
      role: 'Member',
      expertise: expertise
    })
    .select()
    .single();
  
  return { data, error };
};

export const leaveStudyGroup = async (groupId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: new Error('User not authenticated') };

  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id);
  
  return { error };
};

// ============================================================================
// DEMO DATA CREATION
// ============================================================================

export const createDemoGroups = async () => {
  const demoGroups = [
    {
      name: "Advanced React Development",
      subject: "Computer Science",
      description: "Deep dive into React hooks, context, and advanced patterns. Perfect for developers looking to master modern React development.",
      max_members: 8,
      difficulty: "Advanced" as const,
      is_private: false,
      tags: ["React", "JavaScript", "Frontend", "Hooks"],
      schedules: [
        { day: "Tuesday", start_time: "19:00", end_time: "21:00" },
        { day: "Thursday", start_time: "19:00", end_time: "21:00" }
      ]
    },
    {
      name: "Calculus Study Circle",
      subject: "Mathematics",
      description: "Weekly sessions covering differential and integral calculus. We work through problem sets and prepare for exams together.",
      max_members: 12,
      difficulty: "Intermediate" as const,
      is_private: false,
      tags: ["Calculus", "Problem Solving", "Exam Prep"],
      schedules: [
        { day: "Wednesday", start_time: "18:00", end_time: "20:00" }
      ]
    },
    {
      name: "Organic Chemistry Lab Partners",
      subject: "Chemistry",
      description: "Form study partnerships for organic chemistry lab work and theory. Share notes, discuss mechanisms, and prepare for lab practicals.",
      max_members: 6,
      difficulty: "Advanced" as const,
      is_private: false,
      tags: ["Organic Chemistry", "Lab Work", "Mechanisms"],
      schedules: [
        { day: "Monday", start_time: "16:00", end_time: "18:00" },
        { day: "Friday", start_time: "14:00", end_time: "16:00" }
      ]
    },
    {
      name: "Spanish Conversation Practice",
      subject: "Languages",
      description: "Practice Spanish conversation in a supportive environment. All levels welcome! We focus on practical communication skills.",
      max_members: 10,
      difficulty: "Beginner" as const,
      is_private: false,
      tags: ["Spanish", "Conversation", "Language Learning"],
      schedules: [
        { day: "Saturday", start_time: "10:00", end_time: "12:00" }
      ]
    },
    {
      name: "Data Structures & Algorithms",
      subject: "Computer Science",
      description: "Master fundamental data structures and algorithms. Perfect for technical interview preparation and computer science coursework.",
      max_members: 15,
      difficulty: "Intermediate" as const,
      is_private: false,
      tags: ["Algorithms", "Data Structures", "Interview Prep", "Coding"],
      schedules: [
        { day: "Sunday", start_time: "14:00", end_time: "17:00" }
      ]
    },
    {
      name: "Psychology Research Methods",
      subject: "Psychology",
      description: "Study group for research methods in psychology. We review statistical concepts, research design, and analyze published studies.",
      max_members: 8,
      difficulty: "Intermediate" as const,
      is_private: false,
      tags: ["Research Methods", "Statistics", "Psychology"],
      schedules: [
        { day: "Tuesday", start_time: "15:00", end_time: "17:00" }
      ]
    }
  ];

  const results = [];
  for (const groupData of demoGroups) {
    try {
      const result = await createStudyGroup(groupData);
      results.push(result);
    } catch (error) {
      console.error('Error creating demo group:', error);
    }
  }

  return results;
};

// ============================================================================
// TASKS OPERATIONS
// ============================================================================

export const getGroupTasks = async (groupId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      user_profiles!tasks_created_by_fkey(name)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      study_groups(name),
      user_profiles!tasks_created_by_fkey(name)
    `)
    .contains('assigned_to', [userId])
    .order('due_date', { ascending: true });
  
  return { data, error };
};

export const createTask = async (taskData: {
  title: string;
  description: string;
  group_id: string;
  assigned_to: string[];
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
}) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: new Error('User not authenticated') };

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      created_by: user.id
    })
    .select()
    .single();
  
  return { data, error };
};

export const updateTask = async (taskId: string, updates: {
  title?: string;
  description?: string;
  assigned_to?: string[];
  due_date?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  return { error };
};

// ============================================================================
// RESOURCES OPERATIONS
// ============================================================================

export const getGroupResources = async (groupId: string) => {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      user_profiles!resources_uploaded_by_fkey(name)
    `)
    .eq('group_id', groupId)
    .order('uploaded_at', { ascending: false });
  
  return { data, error };
};

export const getAllResources = async () => {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      user_profiles!resources_uploaded_by_fkey(name),
      study_groups(name, subject)
    `)
    .order('uploaded_at', { ascending: false });
  
  return { data, error };
};

export const createResource = async (resourceData: {
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'image';
  url: string;
  tags: string[];
  group_id: string;
}) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: new Error('User not authenticated') };

  const { data, error } = await supabase
    .from('resources')
    .insert({
      ...resourceData,
      uploaded_by: user.id
    })
    .select()
    .single();
  
  return { data, error };
};

export const deleteResource = async (resourceId: string) => {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId);
  
  return { error };
};

// ============================================================================
// QUIZZES OPERATIONS
// ============================================================================

export const getGroupQuizzes = async (groupId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      user_profiles!quizzes_created_by_fkey(name)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getQuizById = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      user_profiles!quizzes_created_by_fkey(name),
      study_groups(name)
    `)
    .eq('id', quizId)
    .single();
  
  return { data, error };
};

export const createQuiz = async (quizData: {
  title: string;
  description: string;
  group_id: string;
  time_limit: number;
  max_attempts: number;
  questions: QuizQuestion[];
}) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: new Error('User not authenticated') };

  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      ...quizData,
      created_by: user.id
    })
    .select()
    .single();
  
  return { data, error };
};

export const submitQuizAttempt = async (attemptData: {
  quiz_id: string;
  answers: Record<string, number>;
  time_taken: number;
}) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: new Error('User not authenticated') };

  // Get quiz to calculate score
  const { data: quiz, error: quizError } = await getQuizById(attemptData.quiz_id);
  if (quizError || !quiz) return { error: quizError || new Error('Quiz not found') };

  // Calculate score
  let correctAnswers = 0;
  const questions = quiz.questions as QuizQuestion[];
  
  questions.forEach((question, index) => {
    if (attemptData.answers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / questions.length) * 100);

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: attemptData.quiz_id,
      user_id: user.id,
      answers: attemptData.answers,
      score: score,
      time_taken: attemptData.time_taken
    })
    .select()
    .single();

  // Update leaderboard
  if (!error) {
    await updateLeaderboardStats(user.id, { quizzes_completed: 1, points: score });
  }
  
  return { data, error };
};

export const getUserQuizAttempts = async (userId: string, quizId?: string) => {
  let query = supabase
    .from('quiz_attempts')
    .select(`
      *,
      quizzes(title, group_id, study_groups(name))
    `)
    .eq('user_id', userId);

  if (quizId) {
    query = query.eq('quiz_id', quizId);
  }

  const { data, error } = await query.order('completed_at', { ascending: false });
  
  return { data, error };
};

// ============================================================================
// LEADERBOARD OPERATIONS
// ============================================================================

export const getLeaderboard = async (type: 'individual' | 'group' = 'individual') => {
  if (type === 'individual') {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        user_profiles(name, institution)
      `)
      .order('total_points', { ascending: false })
      .limit(50);
    
    return { data, error };
  } else {
    // Group leaderboard - aggregate group member stats
    const { data, error } = await supabase
      .from('study_groups')
      .select(`
        id,
        name,
        subject,
        created_at,
        group_members(
          user_id,
          leaderboard_entries(total_points, tasks_completed, quizzes_completed)
        )
      `)
      .eq('is_private', false)
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};

export const updateLeaderboardStats = async (userId: string, updates: {
  tasks_completed?: number;
  quizzes_completed?: number;
  points?: number;
  study_hours?: number;
}) => {
  // Get current stats
  const { data: current, error: fetchError } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError) return { error: fetchError };

  const newStats = {
    total_points: current.total_points + (updates.points || 0),
    tasks_completed: current.tasks_completed + (updates.tasks_completed || 0),
    quizzes_completed: current.quizzes_completed + (updates.quizzes_completed || 0),
    study_hours: current.study_hours + (updates.study_hours || 0)
  };

  const { data, error } = await supabase
    .from('leaderboard_entries')
    .update(newStats)
    .eq('user_id', userId)
    .select()
    .single();
  
  return { data, error };
};

// ============================================================================
// MESSAGES OPERATIONS
// ============================================================================

export const getGroupMessages = async (groupId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      user_profiles!messages_user_id_fkey(name)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: true });
  
  return { data, error };
};

export const sendMessage = async (messageData: {
  group_id: string;
  content: string;
  message_type?: 'text' | 'file' | 'system';
  reply_to?: string;
}) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: new Error('User not authenticated') };

  const { data, error } = await supabase
    .from('messages')
    .insert({
      ...messageData,
      user_id: user.id,
      message_type: messageData.message_type || 'text'
    })
    .select(`
      *,
      user_profiles!messages_user_id_fkey(name)
    `)
    .single();
  
  return { data, error };
};

export const updateMessage = async (messageId: string, updates: {
  content?: string;
}) => {
  const { data, error } = await supabase
    .from('messages')
    .update(updates)
    .eq('id', messageId)
    .select(`
      *,
      user_profiles!messages_user_id_fkey(name)
    `)
    .single();
  
  return { data, error };
};

export const deleteMessage = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);
  
  return { error };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const checkUserPermissions = async (groupId: string, requiredRole?: 'Owner' | 'Admin') => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { hasPermission: false, error: new Error('User not authenticated') };

  const { data, error } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single();

  if (error) return { hasPermission: false, error };

  if (requiredRole) {
    const hasPermission = data.role === 'Owner' || (requiredRole === 'Admin' && data.role === 'Admin');
    return { hasPermission, error: null };
  }

  return { hasPermission: true, error: null };
};

export const updateUserStreak = async (userId: string) => {
  // This would typically check last activity and update streak accordingly
  // For now, we'll just increment study hours as activity
  return await updateLeaderboardStats(userId, { study_hours: 1 });
};