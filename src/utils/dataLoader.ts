// Data loading utilities for mock JSON files
import type { DanceClass, User, ClassesResponse, UsersResponse, ChoreographersResponse } from '@/types';

// Simulate network delay for realistic POC experience
const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Load dance classes from mock JSON data
 */
export const loadClasses = async (): Promise<DanceClass[]> => {
  try {
    await simulateNetworkDelay();
    const response = await fetch('/data/classes.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load classes: ${response.statusText}`);
    }
    
    const data: ClassesResponse = await response.json();
    return data.classes;
  } catch (error) {
    console.error('Error loading classes:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Load users from mock JSON data (combines users.json and choreographers.json)
 */
export const loadUsers = async (): Promise<User[]> => {
  try {
    await simulateNetworkDelay(300);
    
    // Load both users and choreographers
    const [usersResponse, choreographersResponse] = await Promise.all([
      fetch('/data/users.json'),
      fetch('/data/choreographers.json')
    ]);
    
    if (!usersResponse.ok) {
      throw new Error(`Failed to load users: ${usersResponse.statusText}`);
    }
    
    if (!choreographersResponse.ok) {
      throw new Error(`Failed to load choreographers: ${choreographersResponse.statusText}`);
    }
    
    const usersData: UsersResponse = await usersResponse.json();
    const choreographersData: ChoreographersResponse = await choreographersResponse.json();
    
    // Merge users and choreographers, with choreographers taking precedence for duplicates
    const allUsers = [...usersData.users];
    
    choreographersData.choreographers.forEach(choreo => {
      const existingIndex = allUsers.findIndex(user => user.id === choreo.id);
      if (existingIndex >= 0) {
        // Replace existing user with more complete choreographer data
        allUsers[existingIndex] = choreo;
      } else {
        // Add new choreographer
        allUsers.push(choreo);
      }
    });
    
    return allUsers;
  } catch (error) {
    console.error('Error loading users:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Load choreographers from mock JSON data
 */
export const loadChoreographers = async (): Promise<User[]> => {
  try {
    await simulateNetworkDelay(400);
    const response = await fetch('/data/choreographers.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load choreographers: ${response.statusText}`);
    }
    
    const data: ChoreographersResponse = await response.json();
    return data.choreographers;
  } catch (error) {
    console.error('Error loading choreographers:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Get a specific class by ID
 */
export const getClassById = async (classId: string): Promise<DanceClass | null> => {
  const classes = await loadClasses();
  return classes.find(cls => cls.id === classId) || null;
};

/**
 * Get a specific user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  const users = await loadUsers();
  return users.find(user => user.id === userId) || null;
};

/**
 * Get a specific choreographer by ID
 */
export const getChoreographerById = async (choreographerId: string): Promise<User | null> => {
  const choreographers = await loadChoreographers();
  return choreographers.find(choreo => choreo.id === choreographerId) || null;
};

/**
 * Get classes by choreographer ID
 */
export const getClassesByChoreographer = async (choreographerId: string): Promise<DanceClass[]> => {
  const classes = await loadClasses();
  return classes.filter(cls => cls.choreographerId === choreographerId);
};

/**
 * Get classes by style
 */
export const getClassesByStyle = async (style: string): Promise<DanceClass[]> => {
  const classes = await loadClasses();
  return classes.filter(cls => cls.style.includes(style));
};

/**
 * Get featured classes
 */
export const getFeaturedClasses = async (): Promise<DanceClass[]> => {
  const classes = await loadClasses();
  return classes.filter(cls => cls.status === 'featured');
};

/**
 * Get upcoming classes (not cancelled)
 */
export const getUpcomingClasses = async (): Promise<DanceClass[]> => {
  const classes = await loadClasses();
  const now = new Date();
  
  return classes.filter(cls => {
    const classDate = new Date(cls.dateTime);
    return classDate > now && cls.status !== 'cancelled';
  });
};

/**
 * Search classes by title or description
 */
export const searchClasses = async (query: string): Promise<DanceClass[]> => {
  const classes = await loadClasses();
  const lowercaseQuery = query.toLowerCase();
  
  return classes.filter(cls => 
    cls.title.toLowerCase().includes(lowercaseQuery) ||
    cls.description.toLowerCase().includes(lowercaseQuery) ||
    cls.choreographerName.toLowerCase().includes(lowercaseQuery) ||
    cls.style.some(style => style.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Get default user for app initialization
 */
export const getDefaultUser = async (): Promise<User> => {
  const choreographers = await loadChoreographers();
  // Return the first choreographer as default
  return choreographers[0] || {
    id: 'default-user',
    name: 'Demo User',
    role: 'choreographer'
  };
};