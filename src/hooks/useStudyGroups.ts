import { useState, useEffect } from 'react';
import { useApp, useNotifications } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../lib/api';
import { StudyGroup } from '../types';

export function useStudyGroups() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch public study groups
  const fetchPublicGroups = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getPublicStudyGroups();
      if (error) throw error;
      
      dispatch({ type: 'SET_STUDY_GROUPS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching public groups:', error);
      addNotification('error', 'Failed to load study groups');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's study groups
  const fetchUserGroups = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await api.getUserStudyGroups(user.id);
      if (error) throw error;
      
      dispatch({ type: 'SET_USER_GROUPS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching user groups:', error);
      addNotification('error', 'Failed to load your groups');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new study group
  const createGroup = async (groupData: {
    name: string;
    subject: string;
    description: string;
    max_members: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    is_private: boolean;
    tags: string[];
    schedules: Array<{ day: string; start_time: string; end_time: string }>;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.createStudyGroup(groupData);
      if (error) throw error;
      
      dispatch({ type: 'ADD_STUDY_GROUP', payload: data });
      addNotification('success', 'Study group created successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating group:', error);
      addNotification('error', 'Failed to create study group');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update a study group
  const updateGroup = async (groupId: string, updates: Partial<StudyGroup>) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.updateStudyGroup(groupId, updates);
      if (error) throw error;
      
      dispatch({ type: 'UPDATE_STUDY_GROUP', payload: { id: groupId, updates } });
      addNotification('success', 'Study group updated successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating group:', error);
      addNotification('error', 'Failed to update study group');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a study group
  const deleteGroup = async (groupId: string) => {
    setIsLoading(true);
    try {
      const { error } = await api.deleteStudyGroup(groupId);
      if (error) throw error;
      
      dispatch({ type: 'REMOVE_STUDY_GROUP', payload: groupId });
      addNotification('success', 'Study group deleted successfully!');
      return { error: null };
    } catch (error) {
      console.error('Error deleting group:', error);
      addNotification('error', 'Failed to delete study group');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Join a study group
  const joinGroup = async (groupId: string, expertise: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setIsLoading(true);
    try {
      const { data, error } = await api.joinStudyGroup(groupId, expertise);
      if (error) throw error;
      
      // Refresh user groups
      await fetchUserGroups();
      addNotification('success', 'Successfully joined the study group!');
      return { data, error: null };
    } catch (error) {
      console.error('Error joining group:', error);
      addNotification('error', 'Failed to join study group');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Leave a study group
  const leaveGroup = async (groupId: string) => {
    setIsLoading(true);
    try {
      const { error } = await api.leaveStudyGroup(groupId);
      if (error) throw error;
      
      // Refresh user groups
      await fetchUserGroups();
      addNotification('success', 'Successfully left the study group');
      return { error: null };
    } catch (error) {
      console.error('Error leaving group:', error);
      addNotification('error', 'Failed to leave study group');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is a member of a group
  const isUserMember = (groupId: string) => {
    if (!user) return false;
    return state.userGroups.some(group => group.id === groupId);
  };

  // Check if user is the owner of a group
  const isUserOwner = (groupId: string) => {
    if (!user) return false;
    return state.userGroups.some(group => group.id === groupId && group.createdBy === user.id);
  };

  return {
    studyGroups: state.studyGroups,
    userGroups: state.userGroups,
    currentGroup: state.currentGroup,
    isLoading,
    fetchPublicGroups,
    fetchUserGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    isUserMember,
    isUserOwner
  };
}