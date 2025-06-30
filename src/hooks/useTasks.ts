import { useState, useEffect } from 'react';
import { useApp, useNotifications } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../lib/api';
import { Task } from '../types';

export function useTasks() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks for a specific group
  const fetchGroupTasks = async (groupId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getGroupTasks(groupId);
      if (error) throw error;
      
      dispatch({ type: 'SET_TASKS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching group tasks:', error);
      addNotification('error', 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's tasks across all groups
  const fetchUserTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await api.getUserTasks(user.id);
      if (error) throw error;
      
      dispatch({ type: 'SET_USER_TASKS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      addNotification('error', 'Failed to load your tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: {
    title: string;
    description: string;
    group_id: string;
    assigned_to: string[];
    due_date?: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.createTask(taskData);
      if (error) throw error;
      
      dispatch({ type: 'ADD_TASK', payload: data });
      addNotification('success', 'Task created successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating task:', error);
      addNotification('error', 'Failed to create task');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update a task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.updateTask(taskId, updates);
      if (error) throw error;
      
      dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates } });
      
      // Update leaderboard if task was completed
      if (updates.status === 'completed' && user) {
        await api.updateLeaderboardStats(user.id, { tasks_completed: 1, points: 10 });
      }
      
      addNotification('success', 'Task updated successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      addNotification('error', 'Failed to update task');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      const { error } = await api.deleteTask(taskId);
      if (error) throw error;
      
      dispatch({ type: 'REMOVE_TASK', payload: taskId });
      addNotification('success', 'Task deleted successfully!');
      return { error: null };
    } catch (error) {
      console.error('Error deleting task:', error);
      addNotification('error', 'Failed to delete task');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return await updateTask(taskId, { status: newStatus });
  };

  return {
    tasks: state.tasks,
    userTasks: state.userTasks,
    isLoading,
    fetchGroupTasks,
    fetchUserTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
}