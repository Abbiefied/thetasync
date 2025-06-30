import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Users, Target, TrendingUp, Crown, Star, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  tasksCompleted: number;
  quizzesCompleted: number;
  studyHours: number;
  rank: number;
  change: number; // Position change from last week
}

interface LeaderboardGroup {
  id: string;
  name: string;
  subject: string;
  memberCount: number;
  points: number;
  tasksCompleted: number;
  averageScore: number;
  studyHours: number;
  rank: number;
  change: number;
}

const MOCK_INDIVIDUAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Alex Chen',
    points: 2850,
    tasksCompleted: 47,
    quizzesCompleted: 23,
    studyHours: 156,
    rank: 1,
    change: 2
  },
  {
    id: '2',
    name: 'Sarah Kim',
    points: 2720,
    tasksCompleted: 42,
    quizzesCompleted: 28,
    studyHours: 142,
    rank: 2,
    change: -1
  },
  {
    id: '3',
    name: 'Mike Johnson',
    points: 2680,
    tasksCompleted: 39,
    quizzesCompleted: 31,
    studyHours: 138,
    rank: 3,
    change: 1
  },
  {
    id: '4',
    name: 'Emily Davis',
    points: 2540,
    tasksCompleted: 35,
    quizzesCompleted: 26,
    studyHours: 128,
    rank: 4,
    change: 0
  },
  {
    id: '5',
    name: 'David Wilson',
    points: 2420,
    tasksCompleted: 33,
    quizzesCompleted: 24,
    studyHours: 119,
    rank: 5,
    change: 3
  },
  {
    id: '6',
    name: 'Lisa Brown',
    points: 2380,
    tasksCompleted: 31,
    quizzesCompleted: 22,
    studyHours: 115,
    rank: 6,
    change: -2
  },
  {
    id: '7',
    name: 'You',
    points: 2290,
    tasksCompleted: 28,
    quizzesCompleted: 19,
    studyHours: 108,
    rank: 7,
    change: 1
  },
  {
    id: '8',
    name: 'John Smith',
    points: 2180,
    tasksCompleted: 26,
    quizzesCompleted: 18,
    studyHours: 102,
    rank: 8,
    change: -1
  },
  {
    id: '9',
    name: 'Maria Garcia',
    points: 2050,
    tasksCompleted: 24,
    quizzesCompleted: 16,
    studyHours: 95,
    rank: 9,
    change: 2
  },
  {
    id: '10',
    name: 'Kevin Zhang',
    points: 1980,
    tasksCompleted: 22,
    quizzesCompleted: 15,
    studyHours: 89,
    rank: 10,
    change: 0
  }
];

const MOCK_GROUP_LEADERBOARD: LeaderboardGroup[] = [
  {
    id: '1',
    name: 'Advanced Algorithms Study Circle',
    subject: 'Computer Science',
    memberCount: 8,
    points: 18420,
    tasksCompleted: 156,
    averageScore: 92,
    studyHours: 624,
    rank: 1,
    change: 1
  },
  {
    id: '2',
    name: 'Machine Learning Fundamentals',
    subject: 'Computer Science',
    memberCount: 10,
    points: 17850,
    tasksCompleted: 142,
    averageScore: 89,
    studyHours: 580,
    rank: 2,
    change: -1
  },
  {
    id: '3',
    name: 'Organic Chemistry Mastery',
    subject: 'Chemistry',
    memberCount: 6,
    points: 16920,
    tasksCompleted: 128,
    averageScore: 94,
    studyHours: 512,
    rank: 3,
    change: 2
  },
  {
    id: '4',
    name: 'Calculus III Study Group',
    subject: 'Mathematics',
    memberCount: 5,
    points: 15680,
    tasksCompleted: 118,
    averageScore: 87,
    studyHours: 465,
    rank: 4,
    change: 0
  },
  {
    id: '5',
    name: 'Data Structures Deep Dive',
    subject: 'Computer Science',
    memberCount: 7,
    points: 14920,
    tasksCompleted: 105,
    averageScore: 91,
    studyHours: 428,
    rank: 5,
    change: 1
  },
  {
    id: '6',
    name: 'Physics Problem Solvers',
    subject: 'Physics',
    memberCount: 9,
    points: 14350,
    tasksCompleted: 98,
    averageScore: 85,
    studyHours: 402,
    rank: 6,
    change: -2
  },
  {
    id: '7',
    name: 'Statistics & Probability',
    subject: 'Mathematics',
    memberCount: 6,
    points: 13780,
    tasksCompleted: 89,
    averageScore: 88,
    studyHours: 378,
    rank: 7,
    change: 1
  },
  {
    id: '8',
    name: 'Biochemistry Basics',
    subject: 'Biology',
    memberCount: 8,
    points: 12940,
    tasksCompleted: 82,
    averageScore: 86,
    studyHours: 345,
    rank: 8,
    change: 0
  }
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'individual' | 'group'>('individual');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');
  const [individualData, setIndividualData] = useState<LeaderboardUser[]>([]);
  const [groupData, setGroupData] = useState<LeaderboardGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIndividualData(MOCK_INDIVIDUAL_LEADERBOARD);
      setGroupData(MOCK_GROUP_LEADERBOARD);
      setIsLoading(false);
    }, 800);
  }, [timeframe]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-neutral-600">#{rank}</span>;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-600 text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          +{change}
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-600 text-xs rotate-180">
          <TrendingUp className="w-3 h-3 mr-1" />
          {Math.abs(change)}
        </div>
      );
    }
    return <div className="text-neutral-400 text-xs">—</div>;
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-primary-100 text-primary-600',
      'bg-secondary-100 text-secondary-600',
      'bg-accent-100 text-accent-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Leaderboard</h1>
              <p className="text-neutral-600">See how you and your groups rank among top performers</p>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-neutral-700">Time Period:</span>
            <div className="flex bg-white rounded-lg border border-neutral-200 p-1">
              {[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'all', label: 'All Time' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeframe(value as any)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeframe === value
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-8">
          <div className="border-b border-neutral-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('individual')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'individual'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Individual Leaderboard</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'group'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Group Leaderboard</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Individual Leaderboard */}
            {activeTab === 'individual' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">Top Individual Performers</h2>
                  <div className="text-sm text-neutral-500">Based on tasks, quizzes, and study hours</div>
                </div>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {individualData.slice(0, 3).map((user, index) => (
                    <Card key={user.id} className={`text-center relative overflow-hidden ${
                      index === 0 ? 'ring-2 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' :
                      index === 1 ? 'ring-2 ring-gray-200 bg-gradient-to-br from-gray-50 to-slate-50' :
                      'ring-2 ring-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50'
                    }`}>
                      <div className="absolute top-4 right-4">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="pt-6">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold ${getAvatarColor(user.name)}`}>
                          {getAvatarInitials(user.name)}
                        </div>
                        
                        <h3 className={`font-semibold mb-1 ${user.name === 'You' ? 'text-primary-700' : 'text-neutral-900'}`}>
                          {user.name}
                        </h3>
                        
                        <div className="text-2xl font-bold text-neutral-900 mb-2">
                          {user.points.toLocaleString()}
                          <span className="text-sm font-normal text-neutral-500 ml-1">pts</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs text-neutral-600">
                          <div>
                            <div className="font-medium">{user.tasksCompleted}</div>
                            <div>Tasks</div>
                          </div>
                          <div>
                            <div className="font-medium">{user.quizzesCompleted}</div>
                            <div>Quizzes</div>
                          </div>
                          <div>
                            <div className="font-medium">{user.studyHours}h</div>
                            <div>Study</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Rest of Rankings */}
                <div className="space-y-2">
                  {individualData.slice(3).map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                        user.name === 'You' 
                          ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-200' 
                          : 'bg-white border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(user.name)}`}>
                          {getAvatarInitials(user.name)}
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-medium ${user.name === 'You' ? 'text-primary-700' : 'text-neutral-900'}`}>
                            {user.name}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {user.tasksCompleted} tasks • {user.quizzesCompleted} quizzes • {user.studyHours}h study
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold text-neutral-900">
                            {user.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-neutral-500">points</div>
                        </div>
                        
                        <div className="w-12 flex justify-center">
                          {getChangeIndicator(user.change)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group Leaderboard */}
            {activeTab === 'group' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">Top Study Groups</h2>
                  <div className="text-sm text-neutral-500">Based on collective performance and engagement</div>
                </div>

                {/* Top 3 Groups */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                  {groupData.slice(0, 3).map((group, index) => (
                    <Card key={group.id} className={`text-center relative overflow-hidden ${
                      index === 0 ? 'ring-2 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' :
                      index === 1 ? 'ring-2 ring-gray-200 bg-gradient-to-br from-gray-50 to-slate-50' :
                      'ring-2 ring-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50'
                    }`}>
                      <div className="absolute top-4 right-4">
                        {getRankIcon(group.rank)}
                      </div>
                      
                      <div className="pt-6">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${getAvatarColor(group.name)}`}>
                          <Users className="w-8 h-8" />
                        </div>
                        
                        <h3 className="font-semibold mb-1 text-neutral-900 line-clamp-2">
                          {group.name}
                        </h3>
                        
                        <p className="text-sm text-neutral-600 mb-2">{group.subject}</p>
                        
                        <div className="text-2xl font-bold text-neutral-900 mb-2">
                          {group.points.toLocaleString()}
                          <span className="text-sm font-normal text-neutral-500 ml-1">pts</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                          <div>
                            <div className="font-medium">{group.memberCount}</div>
                            <div>Members</div>
                          </div>
                          <div>
                            <div className="font-medium">{group.averageScore}%</div>
                            <div>Avg Score</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Rest of Group Rankings */}
                <div className="space-y-2">
                  {groupData.slice(3).map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(group.rank)}
                        </div>
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(group.name)}`}>
                          <Users className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">{group.name}</div>
                          <div className="text-sm text-neutral-500">
                            {group.subject} • {group.memberCount} members • {group.tasksCompleted} tasks completed
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-neutral-900">{group.averageScore}%</div>
                          <div className="text-xs text-neutral-500">Avg Score</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-neutral-900">
                            {group.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-neutral-500">points</div>
                        </div>
                        
                        <div className="w-12 flex justify-center">
                          {getChangeIndicator(group.change)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">2,847</div>
            <div className="text-sm text-neutral-600">Total Active Users</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">156</div>
            <div className="text-sm text-neutral-600">Active Groups</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-accent-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">8,924</div>
            <div className="text-sm text-neutral-600">Tasks Completed</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">15,680</div>
            <div className="text-sm text-neutral-600">Study Hours</div>
          </Card>
        </div>
      </div>
    </div>
  );
}