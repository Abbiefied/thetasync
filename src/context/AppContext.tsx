import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { StudyGroup, Task, Quiz, Resource, User } from '../types';

interface AppState {
  // User data
  userProfile: User | null;
  
  // Study groups
  studyGroups: StudyGroup[];
  currentGroup: StudyGroup | null;
  userGroups: StudyGroup[];
  
  // Tasks
  tasks: Task[];
  userTasks: Task[];
  
  // Quizzes
  quizzes: Quiz[];
  quizAttempts: any[];
  
  // Resources
  resources: Resource[];
  
  // Messages
  messages: any[];
  
  // Leaderboard
  leaderboard: any[];
  userRank: number | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: Date;
  }>;
}

type AppAction =
  // User actions
  | { type: 'SET_USER_PROFILE'; payload: User }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<User> }
  
  // Study group actions
  | { type: 'SET_STUDY_GROUPS'; payload: StudyGroup[] }
  | { type: 'SET_USER_GROUPS'; payload: StudyGroup[] }
  | { type: 'SET_CURRENT_GROUP'; payload: StudyGroup | null }
  | { type: 'ADD_STUDY_GROUP'; payload: StudyGroup }
  | { type: 'UPDATE_STUDY_GROUP'; payload: { id: string; updates: Partial<StudyGroup> } }
  | { type: 'REMOVE_STUDY_GROUP'; payload: string }
  
  // Task actions
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_USER_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'REMOVE_TASK'; payload: string }
  
  // Quiz actions
  | { type: 'SET_QUIZZES'; payload: Quiz[] }
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'SET_QUIZ_ATTEMPTS'; payload: any[] }
  | { type: 'ADD_QUIZ_ATTEMPT'; payload: any }
  
  // Resource actions
  | { type: 'SET_RESOURCES'; payload: Resource[] }
  | { type: 'ADD_RESOURCE'; payload: Resource }
  | { type: 'REMOVE_RESOURCE'; payload: string }
  
  // Message actions
  | { type: 'SET_MESSAGES'; payload: any[] }
  | { type: 'ADD_MESSAGE'; payload: any }
  
  // Leaderboard actions
  | { type: 'SET_LEADERBOARD'; payload: any[] }
  | { type: 'SET_USER_RANK'; payload: number }
  
  // UI actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  
  // Notification actions
  | { type: 'ADD_NOTIFICATION'; payload: { type: 'success' | 'error' | 'info' | 'warning'; message: string } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const initialState: AppState = {
  userProfile: null,
  studyGroups: [],
  currentGroup: null,
  userGroups: [],
  tasks: [],
  userTasks: [],
  quizzes: [],
  quizAttempts: [],
  resources: [],
  messages: [],
  leaderboard: [],
  userRank: null,
  isLoading: false,
  error: null,
  notifications: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // User actions
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'UPDATE_USER_PROFILE':
      return { 
        ...state, 
        userProfile: state.userProfile ? { ...state.userProfile, ...action.payload } : null 
      };
    
    // Study group actions
    case 'SET_STUDY_GROUPS':
      return { ...state, studyGroups: action.payload };
    case 'SET_USER_GROUPS':
      return { ...state, userGroups: action.payload };
    case 'SET_CURRENT_GROUP':
      return { ...state, currentGroup: action.payload };
    case 'ADD_STUDY_GROUP':
      return { 
        ...state, 
        studyGroups: [action.payload, ...state.studyGroups],
        userGroups: [action.payload, ...state.userGroups]
      };
    case 'UPDATE_STUDY_GROUP':
      return {
        ...state,
        studyGroups: state.studyGroups.map(group =>
          group.id === action.payload.id ? { ...group, ...action.payload.updates } : group
        ),
        userGroups: state.userGroups.map(group =>
          group.id === action.payload.id ? { ...group, ...action.payload.updates } : group
        ),
        currentGroup: state.currentGroup?.id === action.payload.id 
          ? { ...state.currentGroup, ...action.payload.updates } 
          : state.currentGroup
      };
    case 'REMOVE_STUDY_GROUP':
      return {
        ...state,
        studyGroups: state.studyGroups.filter(group => group.id !== action.payload),
        userGroups: state.userGroups.filter(group => group.id !== action.payload),
        currentGroup: state.currentGroup?.id === action.payload ? null : state.currentGroup
      };
    
    // Task actions
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_USER_TASKS':
      return { ...state, userTasks: action.payload };
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks],
        userTasks: action.payload.assignedTo?.includes(state.userProfile?.id || '') 
          ? [action.payload, ...state.userTasks] 
          : state.userTasks
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
        userTasks: state.userTasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        )
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        userTasks: state.userTasks.filter(task => task.id !== action.payload)
      };
    
    // Quiz actions
    case 'SET_QUIZZES':
      return { ...state, quizzes: action.payload };
    case 'ADD_QUIZ':
      return { ...state, quizzes: [action.payload, ...state.quizzes] };
    case 'SET_QUIZ_ATTEMPTS':
      return { ...state, quizAttempts: action.payload };
    case 'ADD_QUIZ_ATTEMPT':
      return { ...state, quizAttempts: [action.payload, ...state.quizAttempts] };
    
    // Resource actions
    case 'SET_RESOURCES':
      return { ...state, resources: action.payload };
    case 'ADD_RESOURCE':
      return { ...state, resources: [action.payload, ...state.resources] };
    case 'REMOVE_RESOURCE':
      return { ...state, resources: state.resources.filter(resource => resource.id !== action.payload) };
    
    // Message actions
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    
    // Leaderboard actions
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_USER_RANK':
      return { ...state, userRank: action.payload };
    
    // UI actions
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    // Notification actions
    case 'ADD_NOTIFICATION':
      const newNotification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...action.payload,
        timestamp: new Date()
      };
      return { 
        ...state, 
        notifications: [...state.notifications, newNotification]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Helper hooks for specific data
export function useNotifications() {
  const { state, dispatch } = useApp();
  
  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type, message } });
  };
  
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };
  
  return {
    notifications: state.notifications,
    addNotification,
    removeNotification
  };
}