// Preferences Context for managing user preferences and localStorage sync
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { UserPreferences, AppSettings } from '@/types';
import {
  getUserPreferences,
  saveUserPreferences,
  getAppSettings,
  saveAppSettings,
  toggleInterestedClass,
  toggleAttendingClass,
  toggleFavoriteChoreographer,
  clearAllUserData
} from '@/utils/localStorage';

// Preferences state interface
interface PreferencesState {
  userPreferences: UserPreferences;
  appSettings: AppSettings;
  loading: boolean;
  error: string | null;
}

// Preferences actions
type PreferencesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER_PREFERENCES'; payload: UserPreferences }
  | { type: 'SET_APP_SETTINGS'; payload: AppSettings }
  | { type: 'TOGGLE_INTERESTED_CLASS'; payload: { classId: string; isInterested: boolean } }
  | { type: 'TOGGLE_ATTENDING_CLASS'; payload: { classId: string; isAttending: boolean } }
  | { type: 'TOGGLE_FAVORITE_CHOREOGRAPHER'; payload: { choreographerId: string; isFavorited: boolean } }
  | { type: 'UPDATE_CURRENT_USER'; payload: string }
  | { type: 'CLEAR_ALL_DATA' };

// Initial state
const initialState: PreferencesState = {
  userPreferences: {
    currentUserId: '',
    interestedClasses: [],
    attendingClasses: [],
    favoritedChoreographers: []
  },
  appSettings: {
    preferredView: 'list',
    filters: {
      styles: [],
      choreographers: [],
      studios: []
    }
  },
  loading: true,
  error: null
};

// Preferences reducer
const preferencesReducer = (state: PreferencesState, action: PreferencesAction): PreferencesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER_PREFERENCES':
      return { ...state, userPreferences: action.payload, loading: false };
    
    case 'SET_APP_SETTINGS':
      return { ...state, appSettings: action.payload };
    
    case 'TOGGLE_INTERESTED_CLASS':
      const { classId: interestedClassId, isInterested } = action.payload;
      const updatedInterestedClasses = isInterested
        ? [...state.userPreferences.interestedClasses, interestedClassId]
        : state.userPreferences.interestedClasses.filter(id => id !== interestedClassId);
      
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          interestedClasses: updatedInterestedClasses
        }
      };
    
    case 'TOGGLE_ATTENDING_CLASS':
      const { classId: attendingClassId, isAttending } = action.payload;
      const updatedAttendingClasses = isAttending
        ? [...state.userPreferences.attendingClasses, attendingClassId]
        : state.userPreferences.attendingClasses.filter(id => id !== attendingClassId);
      
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          attendingClasses: updatedAttendingClasses
        }
      };
    
    case 'TOGGLE_FAVORITE_CHOREOGRAPHER':
      const { choreographerId, isFavorited } = action.payload;
      const updatedFavoriteChoreographers = isFavorited
        ? [...state.userPreferences.favoritedChoreographers, choreographerId]
        : state.userPreferences.favoritedChoreographers.filter(id => id !== choreographerId);
      
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          favoritedChoreographers: updatedFavoriteChoreographers
        }
      };
    
    case 'UPDATE_CURRENT_USER':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          currentUserId: action.payload
        }
      };
    
    case 'CLEAR_ALL_DATA':
      return {
        ...initialState,
        loading: false
      };
    
    default:
      return state;
  }
};

// Context interface
interface PreferencesContextType {
  state: PreferencesState;
  toggleClassInterest: (classId: string) => boolean;
  toggleClassAttending: (classId: string) => boolean;
  toggleChoreographerFavorite: (choreographerId: string) => boolean;
  updatePreferredView: (view: 'list' | 'calendar') => void;
  updateFilters: (filters: AppSettings['filters']) => void;
  updateCurrentUser: (userId: string) => void;
  clearAllData: () => void;
  refreshPreferences: () => void;
  // Utility functions
  isClassInterested: (classId: string) => boolean;
  isClassAttending: (classId: string) => boolean;
  isChoreographerFavorited: (choreographerId: string) => boolean;
}

// Create context
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Provider props
interface PreferencesProviderProps {
  children: ReactNode;
}

// Preferences Provider component
export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(preferencesReducer, initialState);

  // Initialize preferences on mount
  useEffect(() => {
    initializePreferences();
  }, []);

  // Sync preferences to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      saveUserPreferences(state.userPreferences);
    }
  }, [state.userPreferences, state.loading]);

  // Sync app settings to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      saveAppSettings(state.appSettings);
    }
  }, [state.appSettings, state.loading]);

  // Initialize preferences from localStorage
  const initializePreferences = () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const userPreferences = getUserPreferences();
      const appSettings = getAppSettings();
      
      dispatch({ type: 'SET_USER_PREFERENCES', payload: userPreferences });
      dispatch({ type: 'SET_APP_SETTINGS', payload: appSettings });
      
    } catch (error) {
      console.error('Failed to initialize preferences:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load preferences' });
    }
  };

  // Toggle class interest
  const toggleClassInterest = (classId: string): boolean => {
    const newStatus = toggleInterestedClass(classId);
    dispatch({ 
      type: 'TOGGLE_INTERESTED_CLASS', 
      payload: { classId, isInterested: newStatus } 
    });
    return newStatus;
  };

  // Toggle class attending
  const toggleClassAttending = (classId: string): boolean => {
    const newStatus = toggleAttendingClass(classId);
    dispatch({ 
      type: 'TOGGLE_ATTENDING_CLASS', 
      payload: { classId, isAttending: newStatus } 
    });
    return newStatus;
  };

  // Toggle choreographer favorite
  const toggleChoreographerFavorite = (choreographerId: string): boolean => {
    const newStatus = toggleFavoriteChoreographer(choreographerId);
    dispatch({ 
      type: 'TOGGLE_FAVORITE_CHOREOGRAPHER', 
      payload: { choreographerId, isFavorited: newStatus } 
    });
    return newStatus;
  };

  // Update preferred view
  const updatePreferredView = (view: 'list' | 'calendar') => {
    const updatedSettings = { ...state.appSettings, preferredView: view };
    dispatch({ type: 'SET_APP_SETTINGS', payload: updatedSettings });
  };

  // Update filters
  const updateFilters = (filters: AppSettings['filters']) => {
    const updatedSettings = { ...state.appSettings, filters };
    dispatch({ type: 'SET_APP_SETTINGS', payload: updatedSettings });
  };

  // Update current user
  const updateCurrentUser = (userId: string) => {
    dispatch({ type: 'UPDATE_CURRENT_USER', payload: userId });
  };

  // Clear all data
  const clearAllData = () => {
    clearAllUserData();
    dispatch({ type: 'CLEAR_ALL_DATA' });
  };

  // Refresh preferences from localStorage
  const refreshPreferences = () => {
    initializePreferences();
  };

  // Utility functions
  const checkClassInterested = (classId: string): boolean => {
    return state.userPreferences.interestedClasses.includes(classId);
  };

  const checkClassAttending = (classId: string): boolean => {
    return state.userPreferences.attendingClasses.includes(classId);
  };

  const checkChoreographerFavorited = (choreographerId: string): boolean => {
    return state.userPreferences.favoritedChoreographers.includes(choreographerId);
  };

  const contextValue: PreferencesContextType = {
    state,
    toggleClassInterest,
    toggleClassAttending,
    toggleChoreographerFavorite,
    updatePreferredView,
    updateFilters,
    updateCurrentUser,
    clearAllData,
    refreshPreferences,
    isClassInterested: checkClassInterested,
    isClassAttending: checkClassAttending,
    isChoreographerFavorited: checkChoreographerFavorited
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook to use PreferencesContext
export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};