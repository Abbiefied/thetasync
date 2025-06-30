import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, MessageCircle, BookOpen, Plus, Settings, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useStudyGroups } from '../hooks/useStudyGroups';
import { useAuth } from '../context/AuthContext';
import { StudyGroup } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function MyGroups() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userGroups, fetchUserGroups, deleteGroup, leaveGroup, canManageGroup, isGroupOwner, isLoading } = useStudyGroups();
  const [activeTab, setActiveTab] = useState('joined');

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const joinedGroups = userGroups.filter(group => !isGroupOwner(group));
  const ownedGroups = userGroups.filter(group => isGroupOwner(group));
  
  const displayGroups = activeTab === 'joined' ? joinedGroups : ownedGroups;

  const getNextSession = (schedule: StudyGroup['schedule']) => {
    if (schedule.length === 0) return 'No upcoming sessions';
    // Simplified - just return the first scheduled session
    const session = schedule[0];
    return `Next ${session.day} at ${session.startTime}`;
  };

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (window.confirm(`Are you sure you want to delete "${groupName}"? This action cannot be undone.`)) {
      await deleteGroup(groupId);
      fetchUserGroups(); // Refresh the list
    }
  };

  const handleLeaveGroup = async (groupId: string, groupName: string) => {
    if (window.confirm(`Are you sure you want to leave "${groupName}"?`)) {
      await leaveGroup(groupId);
      fetchUserGroups(); // Refresh the list
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200">
                  <div className="h-6 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
              ))}
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Study Groups</h1>
              <p className="text-neutral-600">Manage your active study groups and track your progress.</p>
            </div>
            
            <Link to="/discover">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Join New Group
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-neutral-200 mb-8">
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('joined')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'joined'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Joined Groups ({joinedGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('owned')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'owned'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              My Groups ({ownedGroups.length})
            </button>
          </div>

          <div className="p-6">
            {displayGroups.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayGroups.map((group) => (
                  <Card key={group.id} hover className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {group.name}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">{group.subject}</p>
                        <p className="text-sm text-neutral-500 line-clamp-2">
                          {group.description}
                        </p>
                      </div>
                      
                      {/* Action Menu */}
                      <div className="flex items-center space-x-2">
                        {canManageGroup(group) && (
                          <button 
                            className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"
                            title="Edit group"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        
                        {isGroupOwner(group) ? (
                          <button 
                            onClick={() => handleDeleteGroup(group.id, group.name)}
                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Delete group"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleLeaveGroup(group.id, group.name)}
                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Leave group"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-neutral-500">
                        <Users className="w-4 h-4 mr-2" />
                        {group.members.length} members
                        {isGroupOwner(group) && (
                          <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                            Owner
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-neutral-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {getNextSession(group.schedule)}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link to={`/group/${group.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Group
                        </Button>
                      </Link>
                      
                      <Link to={`/group/${group.id}/resources`} className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Resources
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {activeTab === 'joined' ? 'No groups joined yet' : 'No groups created yet'}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {activeTab === 'joined' 
                    ? 'Join your first study group to start collaborating with other students.'
                    : 'Create your first study group and invite other students to join.'
                  }
                </p>
                <Link to={activeTab === 'joined' ? '/discover' : '/create-group'}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {activeTab === 'joined' ? 'Browse Groups' : 'Create Group'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {userGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {userGroups.length}
              </div>
              <div className="text-sm text-neutral-600">Active Groups</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-secondary-600 mb-1">
                {userGroups.reduce((acc, group) => acc + group.schedule.length, 0)}
              </div>
              <div className="text-sm text-neutral-600">Weekly Sessions</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-accent-600 mb-1">
                {userGroups.reduce((acc, group) => acc + group.members.length, 0)}
              </div>
              <div className="text-sm text-neutral-600">Study Partners</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}