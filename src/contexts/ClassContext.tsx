// Class Context for managing dance classes and filtering
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { DanceClass, FilterOptions } from '@/types';
import { 
  loadClasses, 
  getFeaturedClasses,
  getUpcomingClasses 
} from '@/utils/dataLoader';

// Class state interface
interface ClassState {
  classes: DanceClass[];
  filteredClasses: DanceClass[];
  featuredClasses: DanceClass[];
  upcomingClasses: DanceClass[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeFilters: FilterOptions;
}

// Class actions
type ClassAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CLASSES'; payload: DanceClass[] }
  | { type: 'SET_FILTERED_CLASSES'; payload: DanceClass[] }
  | { type: 'SET_FEATURED_CLASSES'; payload: DanceClass[] }
  | { type: 'SET_UPCOMING_CLASSES'; payload: DanceClass[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'CLEAR_FILTERS' };

// Initial state
const initialState: ClassState = {
  classes: [],
  filteredClasses: [],
  featuredClasses: [],
  upcomingClasses: [],
  loading: true,
  error: null,
  searchQuery: '',
  activeFilters: {
    styles: [],
    choreographers: [],
    studios: []
  }
};

// Class reducer
const classReducer = (state: ClassState, action: ClassAction): ClassState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_CLASSES':
      return { ...state, classes: action.payload };
    
    case 'SET_FILTERED_CLASSES':
      return { ...state, filteredClasses: action.payload };
    
    case 'SET_FEATURED_CLASSES':
      return { ...state, featuredClasses: action.payload };
    
    case 'SET_UPCOMING_CLASSES':
      return { ...state, upcomingClasses: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, activeFilters: action.payload };
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        activeFilters: {
          styles: [],
          choreographers: [],
          studios: []
        },
        searchQuery: '',
        filteredClasses: state.classes
      };
    
    default:
      return state;
  }
};

// Context interface
interface ClassContextType {
  state: ClassState;
  searchClasses: (query: string) => Promise<void>;
  filterByStyle: (styles: string[]) => Promise<void>;
  filterByChoreographer: (choreographers: string[]) => Promise<void>;
  applyFilters: (filters: FilterOptions) => Promise<void>;
  clearFilters: () => void;
  refreshClasses: () => Promise<void>;
  getClassById: (id: string) => DanceClass | undefined;
}

// Create context
const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Provider props
interface ClassProviderProps {
  children: ReactNode;
}

// Class Provider component
export const ClassProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(classReducer, initialState);

  // Initialize classes on mount
  useEffect(() => {
    initializeClasses();
  }, []);

  // Initialize class data
  const initializeClasses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load all classes
      const classes = await loadClasses();
      dispatch({ type: 'SET_CLASSES', payload: classes });
      dispatch({ type: 'SET_FILTERED_CLASSES', payload: classes });
      
      // Load featured classes
      const featured = await getFeaturedClasses();
      dispatch({ type: 'SET_FEATURED_CLASSES', payload: featured });
      
      // Load upcoming classes
      const upcoming = await getUpcomingClasses();
      dispatch({ type: 'SET_UPCOMING_CLASSES', payload: upcoming });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      
    } catch (error) {
      console.error('Failed to initialize classes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load class data' });
    }
  };

  // Apply filters to classes
  const applyFiltersToClasses = (
    classes: DanceClass[], 
    filters: FilterOptions, 
    searchQuery: string = ''
  ): DanceClass[] => {
    let filtered = [...classes];
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cls => 
        cls.title.toLowerCase().includes(query) ||
        cls.description.toLowerCase().includes(query) ||
        cls.choreographerName.toLowerCase().includes(query) ||
        cls.style.some(style => style.toLowerCase().includes(query)) ||
        cls.location.toLowerCase().includes(query)
      );
    }
    
    // Apply style filters
    if (filters.styles.length > 0) {
      filtered = filtered.filter(cls => 
        cls.style.some(style => filters.styles.includes(style))
      );
    }
    
    // Apply choreographer filters
    if (filters.choreographers.length > 0) {
      filtered = filtered.filter(cls => 
        filters.choreographers.includes(cls.choreographerId) ||
        filters.choreographers.includes(cls.choreographerName)
      );
    }
    
    // Apply studio/location filters
    if (filters.studios.length > 0) {
      filtered = filtered.filter(cls => 
        filters.studios.some(studio => cls.location.toLowerCase().includes(studio.toLowerCase()))
      );
    }
    
    // Apply date range filter if provided
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(cls => {
        const classDate = new Date(cls.dateTime);
        return classDate >= start && classDate <= end;
      });
    }
    
    return filtered;
  };

  // Search classes by query
  const handleSearchClasses = async (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (!query.trim()) {
      // If empty query, apply current filters to all classes
      const filtered = applyFiltersToClasses(state.classes, state.activeFilters);
      dispatch({ type: 'SET_FILTERED_CLASSES', payload: filtered });
      return;
    }
    
    try {
      // Apply search with current filters
      const filtered = applyFiltersToClasses(state.classes, state.activeFilters, query);
      dispatch({ type: 'SET_FILTERED_CLASSES', payload: filtered });
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Search failed' });
    }
  };

  // Filter by style
  const filterByStyle = async (styles: string[]) => {
    const newFilters = { ...state.activeFilters, styles };
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
    
    const filtered = applyFiltersToClasses(state.classes, newFilters, state.searchQuery);
    dispatch({ type: 'SET_FILTERED_CLASSES', payload: filtered });
  };

  // Filter by choreographer
  const filterByChoreographer = async (choreographers: string[]) => {
    const newFilters = { ...state.activeFilters, choreographers };
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
    
    const filtered = applyFiltersToClasses(state.classes, newFilters, state.searchQuery);
    dispatch({ type: 'SET_FILTERED_CLASSES', payload: filtered });
  };

  // Apply multiple filters
  const applyFilters = async (filters: FilterOptions) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    
    const filtered = applyFiltersToClasses(state.classes, filters, state.searchQuery);
    dispatch({ type: 'SET_FILTERED_CLASSES', payload: filtered });
  };

  // Clear all filters
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Refresh classes data
  const refreshClasses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await initializeClasses();
    } catch (error) {
      console.error('Failed to refresh classes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh class data' });
    }
  };

  // Get class by ID
  const getClassById = (id: string): DanceClass | undefined => {
    return state.classes.find(cls => cls.id === id);
  };

  const contextValue: ClassContextType = {
    state,
    searchClasses: handleSearchClasses,
    filterByStyle,
    filterByChoreographer,
    applyFilters,
    clearFilters,
    refreshClasses,
    getClassById
  };

  return (
    <ClassContext.Provider value={contextValue}>
      {children}
    </ClassContext.Provider>
  );
};

// Custom hook to use ClassContext
export const useClasses = (): ClassContextType => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
};