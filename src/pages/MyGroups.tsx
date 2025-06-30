import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, MessageCircle, BookOpen, Plus, Settings, Edit, Trash2 } from 'lucide-react';
import { StudyGroup } from '../types';
import { useStudyGroups } from '../hooks/useStudyGroups';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function MyGroups() {
  const { user } = useAuth();
  const { userGroups, fetchUserGroups, deleteGroup, isLoading } = useStudyGroups();
  const [activeTab, setActiveTab] = useState('joined');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('MyGroups: Fetching user groups for:', user.email);
      fetchUserGroups();
    }
  }, [user]);

  // Filter groups based on ownership - FIXED LOGIC
  const joinedGroups = userGroups.filter(group => {
    const isOwner = group.createdBy === user?.id;
    console.log(`Group "${group.name}": createdBy=${group.createdBy}, userId=${user?.id}, isOwner=${isOwner}`);
    return !isOwner; // Only groups NOT created by the user
  });
  
  const ownedGroups = userGroups.filter(group => {
    const isOwner = group.createdBy === user?.id;
    return isOwner; // Only groups created by the user
  });
  
  console.log('MyGroups: Filtering results:', {
    totalGroups: userGroups.length,
    joinedGroups: joinedGroups.length,
    ownedGroups: ownedGroups.length,
    activeTab
  });
  
  const displayGroups = activeTab === 'joined' ? joinedGroups : ownedGroups;

  const getNextSession = (schedule: StudyGroup['schedule']) => {
    if (!schedule || schedule.length === 0) return 'No upcoming sessions';
    // Simplified - just return the first scheduled session
    const session = schedule[0];
    return `Next ${session.day} at ${session.startTime}`;
  };

  const handleDeleteGroup = async (groupId: string) => {
    console.log('Deleting group:', groupId);
    const { error } = await deleteGroup(groupId);
    if (!error) {
      setShowDeleteConfirm(null);
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
        <div className="flex justify-between items-center mb-8">
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
                {displayGroups.map((group) => {
                  const isOwner = group.createdBy === user?.id;
                  
                  return (
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
                        
                        {/* Show edit/delete options only for group owners */}
                        {isOwner && (
                          <div className="flex items-center space-x-2">
                            <button 
                              className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"
                              aria-label="Edit group"
                              title="Edit group"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm(group.id)}
                              className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                              aria-label="Delete group"
                              title="Delete group"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-neutral-500">
                          <Users className="w-4 h-4 mr-2" />
                          {group.memberCount || group.members?.length || 0} members
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
                  );
                })}
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
                {userGroups.reduce((acc, group) => acc + (group.schedule?.length || 0), 0)}
              </div>
              <div className="text-sm text-neutral-600">Weekly Sessions</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-accent-600 mb-1">
                {userGroups.reduce((acc, group) => acc + (group.memberCount || group.members?.length || 0), 0)}
              </div>
              <div className="text-sm text-neutral-600">Study Partners</div>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Study Group</h3>
              <p className="text-neutral-600 mb-6">
                Are you sure you want to delete this study group? This action cannot be undone and will remove all associated data.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteGroup(showDeleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}