import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, Clock, Star, Plus } from 'lucide-react';
import { StudyGroup } from '../types';
import { useStudyGroups } from '../hooks/useStudyGroups';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function Discover() {
  const { user } = useAuth();
  const { studyGroups, fetchPublicGroups, isLoading, isUserMember } = useStudyGroups();
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    fetchPublicGroups();
  }, []);

  useEffect(() => {
    let filtered = studyGroups;

    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(group => group.subject === selectedSubject);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(group => group.difficulty === selectedDifficulty);
    }

    setFilteredGroups(filtered);
  }, [studyGroups, searchTerm, selectedSubject, selectedDifficulty]);

  const subjects = [...new Set(studyGroups.map(group => group.subject))];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-secondary-100 text-secondary-700';
      case 'Intermediate': return 'bg-accent-100 text-accent-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getScheduleText = (schedule: StudyGroup['schedule']) => {
    if (!schedule || schedule.length === 0) return 'No scheduled meetings';
    if (schedule.length === 1) {
      const slot = schedule[0];
      return `${slot.day}s ${slot.startTime}-${slot.endTime}`;
    }
    return `${schedule.length} sessions per week`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200">
                  <div className="h-6 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                    <div className="h-6 bg-neutral-200 rounded w-20"></div>
                  </div>
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Discover Study Groups</h1>
          <p className="text-neutral-600">Find the perfect study group that matches your interests and schedule.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search groups, subjects, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            <Link to="/create-group">
              <Button className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </Link>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredGroups.map((group) => {
              const isMember = isUserMember(group.id);
              const isOwner = group.createdBy === user?.id;
              const isGroupFull = (group.memberCount || 0) >= group.maxMembers;

              return (
                <Card key={group.id} hover className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">
                        {group.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty)}`}>
                        {group.difficulty}
                      </span>
                    </div>

                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                      {group.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-neutral-500">
                        <Users className="w-4 h-4 mr-2" />
                        {group.memberCount || 0} of {group.maxMembers} members
                      </div>

                      <div className="flex items-center text-sm text-neutral-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {getScheduleText(group.schedule)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(group.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {(group.tags || []).length > 3 && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                          +{(group.tags || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Show different buttons based on user's relationship to the group */}
                  {isMember || isOwner ? (
                    <Link to={`/group/${group.id}`}>
                      <Button className="w-full">
                        View Group
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/group/${group.id}/join`}>
                      <Button 
                        className="w-full"
                        disabled={isGroupFull}
                      >
                        {isGroupFull ? 'Group Full' : 'Join Group'}
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No groups found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search criteria or create a new group.
            </p>
            <Link to="/create-group">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Group
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}