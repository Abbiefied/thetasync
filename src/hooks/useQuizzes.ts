import { useState } from 'react';
import { useApp, useNotifications } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../lib/api';
import { Quiz, QuizQuestion } from '../types';

export function useQuizzes() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch quizzes for a specific group
  const fetchGroupQuizzes = async (groupId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getGroupQuizzes(groupId);
      if (error) throw error;
      
      dispatch({ type: 'SET_QUIZZES', payload: data || [] });
    } catch (error) {
      console.error('Error fetching group quizzes:', error);
      addNotification('error', 'Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's quiz attempts
  const fetchUserQuizAttempts = async (quizId?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await api.getUserQuizAttempts(user.id, quizId);
      if (error) throw error;
      
      dispatch({ type: 'SET_QUIZ_ATTEMPTS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      addNotification('error', 'Failed to load quiz attempts');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new quiz
  const createQuiz = async (quizData: {
    title: string;
    description: string;
    group_id: string;
    time_limit: number;
    max_attempts: number;
    questions: QuizQuestion[];
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.createQuiz(quizData);
      if (error) throw error;
      
      dispatch({ type: 'ADD_QUIZ', payload: data });
      addNotification('success', 'Quiz created successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating quiz:', error);
      addNotification('error', 'Failed to create quiz');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Submit a quiz attempt
  const submitQuizAttempt = async (attemptData: {
    quiz_id: string;
    answers: Record<string, number>;
    time_taken: number;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.submitQuizAttempt(attemptData);
      if (error) throw error;
      
      dispatch({ type: 'ADD_QUIZ_ATTEMPT', payload: data });
      addNotification('success', `Quiz completed! Score: ${data.score}%`);
      return { data, error: null };
    } catch (error) {
      console.error('Error submitting quiz:', error);
      addNotification('error', 'Failed to submit quiz');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    quizzes: state.quizzes,
    quizAttempts: state.quizAttempts,
    isLoading,
    fetchGroupQuizzes,
    fetchUserQuizAttempts,
    createQuiz,
    submitQuizAttempt
  };
}