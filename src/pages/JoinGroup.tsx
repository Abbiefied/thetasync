import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, Clock, Star, ChevronLeft, MessageCircle } from 'lucide-react';
import { StudyGroup } from '../types';
import { useStudyGroups } from '../hooks/useStudyGroups';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/AppContext';
import { getStudyGroupById } from '../lib/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function JoinGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { joinGroup, isUserMember } = useStudyGroups();
  
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) {
        console.log('No group ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching group with ID:', id);
        const { data, error } = await getStudyGroupById(id);
        
        if (error) {
          console.error('Error fetching group:', error);
          addNotification('error', 'Failed to load group details');
          setGroup(null);
        } else {
          console.log('Group fetched successfully:', data);
          setGroup(data);
        }
      } catch (error) {
        console.error('Error fetching group:', error);
        addNotification('error', 'Failed to load group details');
        setGroup(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroup();
  }, [id]); // Only depend on id, not addNotification

  const handleJoinGroup = async () => {
    if (!group || !user) {
      addNotification('error', 'Please log in to join a group');
      return;
    }

    console.log('Attempting to join group:', group.id);
    setIsJoining(true);
    
    try {
      const { error } = await joinGroup(group.id, selectedExpertise);
      
      if (!error) {
        console.log('Successfully joined group, navigating to my-groups');
        addNotification('success', `Successfully joined ${group.name}!`);
        // Navigate immediately without waiting
        navigate('/my-groups');
      } else {
        console.error('Error joining group:', error);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      addNotification('error', 'Failed to join group');
    } finally {
      setIsJoining(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-secondary-100 text-secondary-700';
      case 'Intermediate': return 'bg-accent-100 text-accent-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="bg-white rounded-xl border border-neutral-200 p-8">
              <div className="h-6 bg-neutral-200 rounded mb-4"></div>
              <div className="h-4 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-6"></div>
              <div className="h-32 bg-neutral-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Group not found</h2>
          <p className="text-neutral-600 mb-6">The study group you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/discover')}>
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  const isGroupFull = group.memberCount >= group.maxMembers;
  const userIsMember = user ? isUserMember(group.id) : false;
  const isOwner = group.createdBy === user?.id;

  return (
    <div className="min-h-screen bg-neutral-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/discover')}
            className="flex items-center text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Discover
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-neutral-900">{group.name}</h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty)}`}>
                      {group.difficulty}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-4">{group.subject}</p>
                </div>
              </div>

              <div className="prose prose-neutral max-w-none mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">About This Group</h3>
                <p className="text-neutral-700 leading-relaxed">{group.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Members ({group.memberCount}/{group.maxMembers})
                  </h4>
                  <div className="space-y-2">
                    {group.members && group.members.length > 0 ? (
                      group.members.map((member) => (
                        <div key={member.userId} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-neutral-900">{member.name}</div>
                              <div className="text-xs text-neutral-500">{member.expertise} • {member.role}</div>
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400">
                            Joined {member.joinedAt.toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-neutral-500">
                        No members to display
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </h4>
                  <div className="space-y-2">
                    {group.schedule && group.schedule.length > 0 ? (
                      group.schedule.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            <span className="font-medium text-neutral-900">{slot.day}s</span>
                          </div>
                          <span className="text-neutral-600">{slot.startTime} - {slot.endTime}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-neutral-500">
                        No scheduled meetings
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-medium text-neutral-900 mb-3">Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {(group.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {userIsMember || isOwner ? 'Already a Member' : 'Join This Group'}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {userIsMember || isOwner
                    ? 'You are already a member of this group'
                    : `Connect with ${group.memberCount} other students and start learning together.`
                  }
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Group Size:</span>
                  <span className="font-medium text-neutral-900">
                    {group.memberCount} of {group.maxMembers} members
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty)}`}>
                    {group.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Meetings:</span>
                  <span className="font-medium text-neutral-900">{(group.schedule || []).length}x per week</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Created:</span>
                  <span className="font-medium text-neutral-900">{group.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              {!userIsMember && !isOwner && !group.isPrivate && (
                <>
                  <div className="mb-4">
                    <label htmlFor="expertise" className="block text-sm font-medium text-neutral-700 mb-2">
                      Your Expertise Level
                    </label>
                    <select
                      id="expertise"
                      value={selectedExpertise}
                      onChange={(e) => setSelectedExpertise(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="joinMessage" className="block text-sm font-medium text-neutral-700 mb-2">
                      Introduction Message (Optional)
                    </label>
                    <textarea
                      id="joinMessage"
                      value={joinMessage}
                      onChange={(e) => setJoinMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                      placeholder="Tell the group about yourself and why you'd like to join..."
                    />
                  </div>
                </>
              )}

              {userIsMember || isOwner ? (
                <Button
                  onClick={() => navigate('/my-groups')}
                  className="w-full"
                >
                  Go to My Groups
                </Button>
              ) : (
                <Button
                  onClick={handleJoinGroup}
                  disabled={isGroupFull || !user || isJoining}
                  isLoading={isJoining}
                  className="w-full"
                >
                  {!user ? 'Login to Join' : isGroupFull ? 'Group Full' : 'Join Group'}
                </Button>
              )}

              {isGroupFull && !userIsMember && !isOwner && (
                <p className="text-sm text-neutral-500 text-center mt-3">
                  This group has reached its maximum capacity. You can still bookmark it or check back later.
                </p>
              )}

              {!user && (
                <p className="text-sm text-neutral-500 text-center mt-3">
                  Please log in to join this group.
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Group Owner
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}