// User Context for managing current user and role switching
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { loadUsers, getDefaultUser } from '@/utils/dataLoader';
import { getCurrentUserId, saveCurrentUserId, initializeUserPreferences } from '@/utils/localStorage';

// User state interface
interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

// User actions
type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SWITCH_USER_ROLE'; payload: UserRole };

// Initial state
const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: true,
  error: null
};

// User reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload, loading: false, error: null };
    
    case 'SWITCH_USER_ROLE':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          role: action.payload
        }
      };
    
    default:
      return state;
  }
};

// Context interface
interface UserContextType {
  state: UserState;
  switchUserRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  refreshUsers: () => Promise<void>;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider props
interface UserProviderProps {
  children: ReactNode;
}

// User Provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Initialize users and current user on mount
  useEffect(() => {
    initializeUser();
  }, []);
 
  // Load saved user data from localStorage
  const loadSavedUserData = (userId: string): User | null => {
    try {
      const userKey = `user-${userId}`;
      const savedData = localStorage.getItem(userKey);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to load saved user data:', error);
    }
    return null;
  };

  // Initialize user data
  const initializeUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load all users
      const users = await loadUsers();
      dispatch({ type: 'SET_USERS', payload: users });
      
      // Get current user ID from localStorage or use default
      let currentUserId = getCurrentUserId();
      let currentUser: User;
      
      if (currentUserId) {
        // Try to find existing user
        const existingUser = users.find(user => user.id === currentUserId);
        if (existingUser) {
          // Check if there's saved data for this user
          const savedUserData = loadSavedUserData(currentUserId);
          currentUser = savedUserData || existingUser;
        } else {
          // Fallback to default user if stored ID not found
          currentUser = await getDefaultUser();
          currentUserId = currentUser.id;
        }
      } else {
        // No stored user, use default
        currentUser = await getDefaultUser();
        currentUserId = currentUser.id;
      }
      
      // Initialize user preferences and save current user ID
      initializeUserPreferences(currentUserId);
      saveCurrentUserId(currentUserId);
      
      dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
      
    } catch (error) {
      console.error('Failed to initialize user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
    }
  };

  // Switch user role
  const switchUserRole = (role: UserRole) => {
    if (!state.currentUser) return;
    
    dispatch({ type: 'SWITCH_USER_ROLE', payload: role });
    
    // Update the user in the users array as well
    const updatedUsers = state.users.map(user => 
      user.id === state.currentUser!.id 
        ? { ...user, role }
        : user
    );
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
  };

  // Switch to different user
  const switchUser = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      // Check for saved data first
      const savedUserData = loadSavedUserData(userId);
      const userToSwitch = savedUserData || user;
      
      saveCurrentUserId(userId);
      initializeUserPreferences(userId);
      dispatch({ type: 'SET_CURRENT_USER', payload: userToSwitch });
    }
  };

  // Refresh users data
  const refreshUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const users = await loadUsers();
      dispatch({ type: 'SET_USERS', payload: users });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Failed to refresh users:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh user data' });
    }
  };

  const contextValue: UserContextType = {
    state,
    switchUserRole,
    switchUser,
    refreshUsers
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};