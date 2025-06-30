import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MessageCircle, Users, BookOpen, CheckSquare, Video, 
  Plus, Send, Paperclip, MoreVertical, Clock, Trophy,
  Search, Filter, Star, Calendar, Target
} from 'lucide-react';
import { StudyGroup, Task, Resource, Quiz } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const MOCK_GROUP: StudyGroup = {
  id: '1',
  name: 'Advanced Algorithms Study Circle',
  subject: 'Computer Science',
  description: 'Deep dive into complex algorithms and data structures. Perfect for preparing for technical interviews.',
  members: [
    { userId: '1', name: 'You', role: 'Member', expertise: 'Intermediate', joinedAt: new Date() },
    { userId: '2', name: 'Alex Chen', role: 'Owner', expertise: 'Advanced', joinedAt: new Date() },
    { userId: '3', name: 'Sarah Kim', role: 'Member', expertise: 'Intermediate', joinedAt: new Date() },
    { userId: '4', name: 'Mike Johnson', role: 'Member', expertise: 'Advanced', joinedAt: new Date() }
  ],
  maxMembers: 8,
  schedule: [
    { day: 'Tuesday', startTime: '19:00', endTime: '21:00' },
    { day: 'Thursday', startTime: '19:00', endTime: '21:00' }
  ],
  tags: ['Algorithms', 'Data Structures', 'Interview Prep'],
  difficulty: 'Advanced',
  isPrivate: false,
  createdBy: '2',
  createdAt: new Date('2024-01-15')
};

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Binary Search Tree Implementation',
    description: 'Implement a balanced BST with insertion, deletion, and search operations',
    assignedTo: ['1', '3'],
    dueDate: new Date('2025-01-20'),
    status: 'in-progress',
    priority: 'high',
    groupId: '1',
    createdBy: '2',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Study Dynamic Programming Chapter',
    description: 'Read and summarize key concepts from DP chapter',
    assignedTo: ['1', '2', '3', '4'],
    dueDate: new Date('2025-01-18'),
    status: 'pending',
    priority: 'medium',
    groupId: '1',
    createdBy: '2',
    createdAt: new Date()
  }
];

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Algorithms Cheat Sheet',
    description: 'Comprehensive guide to common algorithms',
    type: 'document',
    url: '#',
    tags: ['Algorithms', 'Reference'],
    groupId: '1',
    uploadedBy: '2',
    uploadedAt: new Date()
  },
  {
    id: '2',
    title: 'Dynamic Programming Tutorial',
    description: 'Video tutorial on DP concepts',
    type: 'video',
    url: '#',
    tags: ['Dynamic Programming', 'Tutorial'],
    groupId: '1',
    uploadedBy: '3',
    uploadedAt: new Date()
  }
];

const MOCK_MESSAGES = [
  { id: '1', sender: 'Alex Chen', content: 'Hey everyone! Ready for tomorrow\'s session?', timestamp: new Date(), userId: '2' },
  { id: '2', sender: 'Sarah Kim', content: 'Yes! I\'ve prepared some practice problems on BST', timestamp: new Date(), userId: '3' },
  { id: '3', sender: 'You', content: 'Great! I\'ll bring my notes on tree traversal algorithms', timestamp: new Date(), userId: '1' },
];

type TabType = 'chat' | 'tasks' | 'resources' | 'quizzes' | 'progress';

export default function GroupWorkspace() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGroup(MOCK_GROUP);
      setTasks(MOCK_TASKS);
      setResources(MOCK_RESOURCES);
      setIsLoading(false);
    }, 800);
  }, [id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date(),
        userId: '1'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="h-96 bg-neutral-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Group not found</h2>
          <Link to="/my-groups">
            <Button>Back to My Groups</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Group Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{group.name}</h1>
              <p className="text-neutral-600 mb-4">{group.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {group.members.length} members
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {group.schedule.length} sessions/week
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {group.difficulty}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Start Call
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Member Avatars */}
          <div className="flex items-center space-x-2">
            {group.members.map((member) => (
              <div
                key={member.userId}
                className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-600"
                title={member.name}
              >
                {member.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'chat', label: 'Chat', icon: MessageCircle },
                { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                { id: 'resources', label: 'Resources', icon: BookOpen },
                { id: 'quizzes', label: 'Quizzes', icon: Star },
                { id: 'progress', label: 'Progress', icon: Trophy }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as TabType)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                <div className="h-96 bg-neutral-50 rounded-lg p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.userId === '1' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.userId === '1'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-neutral-200'
                          }`}
                        >
                          {message.userId !== '1' && (
                            <div className="text-xs font-medium text-neutral-500 mb-1">
                              {message.sender}
                            </div>
                          )}
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            message.userId === '1' ? 'text-primary-100' : 'text-neutral-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-neutral-900">Group Tasks</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-neutral-700 mb-3">To Do</h4>
                    <div className="space-y-3">
                      {tasks.filter(task => task.status === 'pending').map((task) => (
                        <Card key={task.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-neutral-900 text-sm">{task.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.dueDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {task.assignedTo.length}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neutral-700 mb-3">In Progress</h4>
                    <div className="space-y-3">
                      {tasks.filter(task => task.status === 'in-progress').map((task) => (
                        <Card key={task.id} className="p-4 border-l-4 border-l-blue-500">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-neutral-900 text-sm">{task.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.dueDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {task.assignedTo.length}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neutral-700 mb-3">Completed</h4>
                    <div className="space-y-3">
                      {tasks.filter(task => task.status === 'completed').map((task) => (
                        <Card key={task.id} className="p-4 opacity-75">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-neutral-900 text-sm">{task.title}</h5>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              Done
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.dueDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {task.assignedTo.length}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-neutral-900">Shared Resources</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Resource
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource) => (
                    <Card key={resource.id} hover className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          resource.type === 'document' ? 'bg-blue-100' :
                          resource.type === 'video' ? 'bg-red-100' :
                          resource.type === 'link' ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          <BookOpen className={`w-5 h-5 ${
                            resource.type === 'document' ? 'text-blue-600' :
                            resource.type === 'video' ? 'text-red-600' :
                            resource.type === 'link' ? 'text-green-600' : 'text-purple-600'
                          }`} />
                        </div>
                        <span className="text-xs text-neutral-500 capitalize">{resource.type}</span>
                      </div>
                      
                      <h4 className="font-medium text-neutral-900 mb-2">{resource.title}</h4>
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{resource.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-xs text-neutral-500">
                        Uploaded {resource.uploadedAt.toLocaleDateString()}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-neutral-900">Study Quizzes</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                </div>
                
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h4 className="text-lg font-medium text-neutral-900 mb-2">No quizzes yet</h4>
                  <p className="text-neutral-600 mb-6">Create your first quiz to test knowledge and track progress.</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Quiz
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-900">Group Progress</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {tasks.filter(t => t.status === 'completed').length}
                    </div>
                    <div className="text-sm text-neutral-600">Tasks Completed</div>
                  </Card>
                  
                  <Card className="text-center">
                    <div className="text-2xl font-bold text-secondary-600 mb-1">
                      {resources.length}
                    </div>
                    <div className="text-sm text-neutral-600">Resources Shared</div>
                  </Card>
                  
                  <Card className="text-center">
                    <div className="text-2xl font-bold text-accent-600 mb-1">
                      {group.schedule.length * 4}
                    </div>
                    <div className="text-sm text-neutral-600">Study Hours/Month</div>
                  </Card>
                </div>

                <Card>
                  <h4 className="font-medium text-neutral-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-neutral-600">Sarah completed "Binary Search Tree Implementation"</span>
                      <span className="text-xs text-neutral-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-neutral-600">Alex uploaded new resource "DP Tutorial"</span>
                      <span className="text-xs text-neutral-400">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-neutral-600">You joined the study session</span>
                      <span className="text-xs text-neutral-400">2 days ago</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}