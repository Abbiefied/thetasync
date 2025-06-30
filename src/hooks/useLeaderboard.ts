import { useState } from 'react';
import { useApp, useNotifications } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../lib/api';

export function useLeaderboard() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch leaderboard data
  const fetchLeaderboard = async (type: 'individual' | 'group' = 'individual') => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getLeaderboard(type);
      if (error) throw error;
      
      dispatch({ type: 'SET_LEADERBOARD', payload: data || [] });
      
      // Find user's rank if individual leaderboard
      if (type === 'individual' && user && data) {
        const userEntry = data.find((entry: any) => entry.user_id === user.id);
        if (userEntry) {
          const rank = data.findIndex((entry: any) => entry.user_id === user.id) + 1;
          dispatch({ type: 'SET_USER_RANK', payload: rank });
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      addNotification('error', 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user's leaderboard stats
  const updateUserStats = async (updates: {
    tasks_completed?: number;
    quizzes_completed?: number;
    points?: number;
    study_hours?: number;
  }) => {
    if (!user) return;
    
    try {
      const { error } = await api.updateLeaderboardStats(user.id, updates);
      if (error) throw error;
      
      // Refresh leaderboard
      await fetchLeaderboard('individual');
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return {
    leaderboard: state.leaderboard,
    userRank: state.userRank,
    isLoading,
    fetchLeaderboard,
    updateUserStats
  };
}