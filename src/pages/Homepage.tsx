import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Trophy, Target, Users, BookOpen, 
  MessageCircle, ArrowRight, Star, Zap, CheckCircle,
  TrendingUp, Bell, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface UpcomingSession {
  id: string;
  groupName: string;
  subject: string;
  time: string;
  date: string;
  type: 'study' | 'quiz' | 'review';
}

interface NextQuiz {
  id: string;
  title: string;
  groupName: string;
  dueDate: string;
  questionsCount: number;
  timeLimit: number;
}

interface LeaderboardRank {
  currentRank: number;
  totalUsers: number;
  points: number;
  change: number;
}

interface RecentActivity {
  id: string;
  type: 'task_completed' | 'quiz_taken' | 'group_joined' | 'resource_shared';
  description: string;
  timestamp: string;
  groupName?: string;
}

const MOCK_TASK_SUMMARY: TaskSummary = {
  total: 12,
  completed: 8,
  pending: 3,
  overdue: 1
};

const MOCK_UPCOMING_SESSIONS: UpcomingSession[] = [
  {
    id: '1',
    groupName: 'Advanced Algorithms Study Circle',
    subject: 'Computer Science',
    time: '7:00 PM',
    date: 'Today',
    type: 'study'
  },
  {
    id: '2',
    groupName: 'Machine Learning Fundamentals',
    subject: 'Computer Science',
    time: '4:00 PM',
    date: 'Tomorrow',
    type: 'quiz'
  },
  {
    id: '3',
    groupName: 'Organic Chemistry Mastery',
    subject: 'Chemistry',
    time: '6:00 PM',
    date: 'Friday',
    type: 'review'
  }
];

const MOCK_NEXT_QUIZ: NextQuiz = {
  id: '1',
  title: 'Dynamic Programming Concepts',
  groupName: 'Advanced Algorithms Study Circle',
  dueDate: 'Tomorrow at 11:59 PM',
  questionsCount: 15,
  timeLimit: 30
};

const MOCK_LEADERBOARD_RANK: LeaderboardRank = {
  currentRank: 7,
  totalUsers: 2847,
  points: 2290,
  change: 1
};

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    type: 'task_completed',
    description: 'Completed "Binary Search Tree Implementation"',
    timestamp: '2 hours ago',
    groupName: 'Advanced Algorithms Study Circle'
  },
  {
    id: '2',
    type: 'quiz_taken',
    description: 'Scored 92% on "ML Basics Quiz"',
    timestamp: '1 day ago',
    groupName: 'Machine Learning Fundamentals'
  },
  {
    id: '3',
    type: 'resource_shared',
    description: 'Shared "Algorithm Complexity Guide"',
    timestamp: '2 days ago',
    groupName: 'Advanced Algorithms Study Circle'
  },
  {
    id: '4',
    type: 'group_joined',
    description: 'Joined "Data Structures Deep Dive"',
    timestamp: '3 days ago'
  }
];

export default function Homepage() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [nextQuiz, setNextQuiz] = useState<NextQuiz | null>(null);
  const [leaderboardRank, setLeaderboardRank] = useState<LeaderboardRank | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Simulate API calls to fetch dashboard data
    setTimeout(() => {
      setTaskSummary(MOCK_TASK_SUMMARY);
      setUpcomingSessions(MOCK_UPCOMING_SESSIONS);
      setNextQuiz(MOCK_NEXT_QUIZ);
      setLeaderboardRank(MOCK_LEADERBOARD_RANK);
      setRecentActivity(MOCK_RECENT_ACTIVITY);
      setIsLoading(false);
    }, 1000);
  }, [user, loading, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getSessionTypeIcon = (type: UpcomingSession['type']) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <Star className="w-4 h-4" />;
      case 'review': return <Target className="w-4 h-4" />;
    }
  };

  const getSessionTypeColor = (type: UpcomingSession['type']) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-700';
      case 'quiz': return 'bg-yellow-100 text-yellow-700';
      case 'review': return 'bg-green-100 text-green-700';
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'task_completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'quiz_taken': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'resource_shared': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'group_joined': return <Users className="w-4 h-4 text-purple-600" />;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200">
                  <div className="h-6 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userName = userProfile?.name || user?.user_metadata?.full_name || 'Student';

  return (
    <div className="min-h-screen bg-neutral-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {getGreeting()}, {userName.split(' ')[0]}! 👋
              </h1>
              <p className="text-neutral-600">
                Ready to continue your learning journey? Here's what's happening today.
              </p>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {taskSummary?.completed || 0}/{taskSummary?.total || 0}
            </div>
            <div className="text-sm text-neutral-600">Tasks Completed</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              #{leaderboardRank?.currentRank || 0}
            </div>
            <div className="text-sm text-neutral-600">Global Rank</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-accent-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {leaderboardRank?.points.toLocaleString() || 0}
            </div>
            <div className="text-sm text-neutral-600">Study Points</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">3</div>
            <div className="text-sm text-neutral-600">Active Groups</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Task Summary */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Task Summary</h2>
                <Link to="/my-groups">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {taskSummary?.total || 0}
                  </div>
                  <div className="text-sm text-neutral-600">Total</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    {taskSummary?.completed || 0}
                  </div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700 mb-1">
                    {taskSummary?.pending || 0}
                  </div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700 mb-1">
                    {taskSummary?.overdue || 0}
                  </div>
                  <div className="text-sm text-red-600">Overdue</div>
                </div>
              </div>

              {taskSummary && taskSummary.total > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round((taskSummary.completed / taskSummary.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(taskSummary.completed / taskSummary.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </Card>

            {/* Upcoming Study Sessions */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Upcoming Sessions</h2>
                <Link to="/my-groups">
                  <Button variant="ghost" size="sm">
                    View Schedule
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSessionTypeColor(session.type)}`}>
                      {getSessionTypeIcon(session.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{session.groupName}</h3>
                      <p className="text-sm text-neutral-600">{session.subject}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-neutral-900">{session.time}</div>
                      <div className="text-sm text-neutral-500">{session.date}</div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </div>
                ))}
              </div>
              
              {upcomingSessions.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No upcoming sessions scheduled</p>
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">{activity.description}</p>
                      {activity.groupName && (
                        <p className="text-xs text-neutral-500 mt-1">in {activity.groupName}</p>
                      )}
                    </div>
                    
                    <div className="text-xs text-neutral-400">{activity.timestamp}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Next Quiz */}
            {nextQuiz && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">Next Quiz</h2>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">{nextQuiz.title}</h3>
                    <p className="text-sm text-neutral-600">{nextQuiz.groupName}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Due:</span>
                      <span className="font-medium text-neutral-900">{nextQuiz.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Questions:</span>
                      <span className="font-medium text-neutral-900">{nextQuiz.questionsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Time Limit:</span>
                      <span className="font-medium text-neutral-900">{nextQuiz.timeLimit} min</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Star className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                </div>
              </Card>
            )}

            {/* Leaderboard Rank */}
            {leaderboardRank && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">Your Rank</h2>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-neutral-900 mb-1">
                    #{leaderboardRank.currentRank}
                  </div>
                  <div className="text-sm text-neutral-600 mb-2">
                    out of {leaderboardRank.totalUsers.toLocaleString()} students
                  </div>
                  
                  {leaderboardRank.change !== 0 && (
                    <div className={`inline-flex items-center text-sm ${
                      leaderboardRank.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${leaderboardRank.change < 0 ? 'rotate-180' : ''}`} />
                      {leaderboardRank.change > 0 ? '+' : ''}{leaderboardRank.change} this week
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Current Points:</span>
                    <span className="font-medium text-neutral-900">
                      {leaderboardRank.points.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <Link to="/leaderboard">
                  <Button variant="outline" className="w-full">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Leaderboard
                  </Button>
                </Link>
              </Card>
            )}

            {/* Study Streak */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Study Streak</h2>
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-orange-600 mb-1">7</div>
                <div className="text-sm text-neutral-600">days in a row</div>
              </div>
              
              <div className="flex justify-center space-x-1 mb-4">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full ${
                      i < 7 ? 'bg-orange-500' : 'bg-neutral-200'
                    }`}
                  ></div>
                ))}
              </div>
              
              <p className="text-sm text-neutral-600 text-center">
                Keep it up! You're on fire 🔥
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}