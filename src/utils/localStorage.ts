// localStorage utilities for user preferences and app settings
import type { UserPreferences, AppSettings } from '@/types';

// localStorage keys
const STORAGE_KEYS = {
  USER_PREFERENCES: 'dance-app-user-preferences',
  APP_SETTINGS: 'dance-app-settings',
  CURRENT_USER_ID: 'dance-app-current-user-id'
} as const;

/**
 * Default user preferences
 */
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  currentUserId: '',
  interestedClasses: [],
  attendingClasses: [],
  favoritedChoreographers: []
};

/**
 * Default app settings
 */
const DEFAULT_APP_SETTINGS: AppSettings = {
  filters: {
    styles: [],
    choreographers: [],
    studios: []
  }
};

/**
 * Safely parse JSON from localStorage
 */
const safeJSONParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return fallback;
  }
};

/**
 * Get user preferences from localStorage
 */
export const getUserPreferences = (): UserPreferences => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  return safeJSONParse(stored, DEFAULT_USER_PREFERENCES);
};

/**
 * Save user preferences to localStorage
 */
export const saveUserPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save user preferences:', error);
  }
};

/**
 * Get app settings from localStorage
 */
export const getAppSettings = (): AppSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
  return safeJSONParse(stored, DEFAULT_APP_SETTINGS);
};

/**
 * Save app settings to localStorage
 */
export const saveAppSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save app settings:', error);
  }
};

/**
 * Get current user ID from localStorage
 */
export const getCurrentUserId = (): string => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '';
};

/**
 * Save current user ID to localStorage
 */
export const saveCurrentUserId = (userId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  } catch (error) {
    console.error('Failed to save current user ID:', error);
  }
};

/**
 * Add class to interested list
 */
export const addInterestedClass = (classId: string): void => {
  const preferences = getUserPreferences();
  
  if (!preferences.interestedClasses.includes(classId)) {
    preferences.interestedClasses.push(classId);
    saveUserPreferences(preferences);
  }
};

/**
 * Remove class from interested list
 */
export const removeInterestedClass = (classId: string): void => {
  const preferences = getUserPreferences();
  preferences.interestedClasses = preferences.interestedClasses.filter(id => id !== classId);
  saveUserPreferences(preferences);
};

/**
 * Add class to attending list
 */
export const addAttendingClass = (classId: string): void => {
  const preferences = getUserPreferences();
  
  if (!preferences.attendingClasses.includes(classId)) {
    preferences.attendingClasses.push(classId);
    saveUserPreferences(preferences);
  }
};

/**
 * Remove class from attending list
 */
export const removeAttendingClass = (classId: string): void => {
  const preferences = getUserPreferences();
  preferences.attendingClasses = preferences.attendingClasses.filter(id => id !== classId);
  saveUserPreferences(preferences);
};

/**
 * Toggle interested status for a class
 */
export const toggleInterestedClass = (classId: string): boolean => {
  const preferences = getUserPreferences();
  const isCurrentlyInterested = preferences.interestedClasses.includes(classId);
  
  if (isCurrentlyInterested) {
    removeInterestedClass(classId);
    return false;
  } else {
    addInterestedClass(classId);
    return true;
  }
};

/**
 * Toggle attending status for a class
 */
export const toggleAttendingClass = (classId: string): boolean => {
  const preferences = getUserPreferences();
  const isCurrentlyAttending = preferences.attendingClasses.includes(classId);
  
  if (isCurrentlyAttending) {
    removeAttendingClass(classId);
    return false;
  } else {
    addAttendingClass(classId);
    return true;
  }
};

/**
 * Add choreographer to favorites
 */
export const addFavoriteChoreographer = (choreographerId: string): void => {
  const preferences = getUserPreferences();
  
  if (!preferences.favoritedChoreographers.includes(choreographerId)) {
    preferences.favoritedChoreographers.push(choreographerId);
    saveUserPreferences(preferences);
  }
};

/**
 * Remove choreographer from favorites
 */
export const removeFavoriteChoreographer = (choreographerId: string): void => {
  const preferences = getUserPreferences();
  preferences.favoritedChoreographers = preferences.favoritedChoreographers.filter(id => id !== choreographerId);
  saveUserPreferences(preferences);
};

/**
 * Toggle favorite status for a choreographer
 */
export const toggleFavoriteChoreographer = (choreographerId: string): boolean => {
  const preferences = getUserPreferences();
  const isCurrentlyFavorited = preferences.favoritedChoreographers.includes(choreographerId);
  
  if (isCurrentlyFavorited) {
    removeFavoriteChoreographer(choreographerId);
    return false;
  } else {
    addFavoriteChoreographer(choreographerId);
    return true;
  }
};

/**
 * Check if class is in interested list
 */
export const isClassInterested = (classId: string): boolean => {
  const preferences = getUserPreferences();
  return preferences.interestedClasses.includes(classId);
};

/**
 * Check if class is in attending list
 */
export const isClassAttending = (classId: string): boolean => {
  const preferences = getUserPreferences();
  return preferences.attendingClasses.includes(classId);
};

/**
 * Check if choreographer is favorited
 */
export const isChoreographerFavorited = (choreographerId: string): boolean => {
  const preferences = getUserPreferences();
  return preferences.favoritedChoreographers.includes(choreographerId);
};

/**
 * Clear all user data (for demo reset)
 */
export const clearAllUserData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.APP_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    console.log('All user data cleared successfully');
  } catch (error) {
    console.error('Failed to clear user data:', error);
  }
};

/**
 * Initialize user preferences with default user ID
 */
export const initializeUserPreferences = (defaultUserId: string): void => {
  const currentUserId = getCurrentUserId();
  
  if (!currentUserId) {
    const preferences = { ...DEFAULT_USER_PREFERENCES, currentUserId: defaultUserId };
    saveUserPreferences(preferences);
    saveCurrentUserId(defaultUserId);
  }
};