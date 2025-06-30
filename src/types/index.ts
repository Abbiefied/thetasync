export interface User {
  id: string;
  name: string;
  email: string;
  institution: string;
  course_of_study: string;
  academic_focus: string[];
  degree_level: 'undergraduate' | 'masters' | 'phd' | 'postdoc';
  year: string;
  bio?: string;
  learning_preference: 'Visual' | 'Verbal' | 'Kinesthetic';
  general_interests: string[];
  study_goals: string[];
  availability: TimeSlot[];
  created_at: Date;
  updated_at: Date;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  members: GroupMember[];
  memberCount: number;
  maxMembers: number;
  schedule: TimeSlot[];
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface GroupMember {
  userId: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Member';
  expertise: 'Beginner' | 'Intermediate' | 'Advanced';
  joinedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  groupId: string;
  createdBy: string;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  maxAttempts: number;
  groupId: string;
  createdBy: string;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, number>;
  score: number;
  completedAt: Date;
  timeTaken: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'image';
  url: string;
  tags: string[];
  groupId: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  messageType: 'text' | 'file' | 'system';
  replyTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  achievementData: Record<string, any>;
  pointsEarned: number;
  earnedAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  totalPoints: number;
  tasksCompleted: number;
  quizzesCompleted: number;
  studyHours: number;
  currentRank?: number;
  previousRank?: number;
  updatedAt: Date;
}