// Schedule page component
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '@/contexts/ClassContext';
import { useAppSettings } from '@/hooks/useUserState';
import { ClassListByDate } from '@/components/ClassListByDate';
import { ClassCalendar } from '@/components/ClassCalendar';
import { ClassDetailModal } from '@/components/ClassDetailModal';
import { FilterPanel } from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { List, Calendar as CalendarIcon } from 'lucide-react';
import type { DanceClass, FilterOptions } from '@/types';


export const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const { state: classState } = useClasses();
  const { preferredView, updateView } = useAppSettings();
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    styles: [],
    choreographers: [],
    studios: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter classes based on active filters and search query
  const filteredClasses = useMemo(() => {
    let filtered = [...classState.classes];

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
    if (activeFilters.styles.length > 0) {
      filtered = filtered.filter(cls => 
        cls.style.some(style => activeFilters.styles.includes(style))
      );
    }

    // Apply choreographer filters
    if (activeFilters.choreographers.length > 0) {
      filtered = filtered.filter(cls => 
        activeFilters.choreographers.includes(cls.choreographerName)
      );
    }

    // Apply studio filters
    if (activeFilters.studios.length > 0) {
      filtered = filtered.filter(cls => {
        const studio = cls.location.split(' - ')[1] || cls.location;
        return activeFilters.studios.some(filterStudio => 
          studio.toLowerCase().includes(filterStudio.toLowerCase())
        );
      });
    }

    // Apply date range filter if provided
    if (activeFilters.dateRange) {
      const { start, end } = activeFilters.dateRange;
      filtered = filtered.filter(cls => {
        const classDate = new Date(cls.dateTime);
        return classDate >= start && classDate <= end;
      });
    }

    return filtered;
  }, [classState.classes, activeFilters, searchQuery]);

  // Handle filter changes
  const handleFiltersChange = (filters: FilterOptions & { searchQuery?: string }) => {
    const { searchQuery: query, ...filterOptions } = filters;
    setActiveFilters(filterOptions);
    if (query !== undefined) {
      setSearchQuery(query);
    }
  };

  // Handle view toggle
  const handleViewToggle = (view: 'list' | 'calendar') => {
    updateView(view);
  };

  // Handle class selection for modal
  const handleClassSelect = (danceClass: DanceClass) => {
    setSelectedClass(danceClass);
    setIsModalOpen(true);
  };

  // Handle choreographer click
  const handleChoreographerClick = (choreographerId: string) => {
    navigate(`/choreographer/${choreographerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Schedule</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Browse and discover dance classes
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-full sm:w-auto">
            <Button
              variant={preferredView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewToggle('list')}
              className="flex items-center gap-2 flex-1 sm:flex-none min-h-[44px] touch-manipulation"
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </Button>
            <Button
              variant={preferredView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewToggle('calendar')}
              className="flex items-center gap-2 flex-1 sm:flex-none min-h-[44px] touch-manipulation"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel onFiltersChange={handleFiltersChange} />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredClasses.length} of {classState.classes.length} classes
        </span>
        {(activeFilters.styles.length > 0 || 
          activeFilters.choreographers.length > 0 || 
          activeFilters.studios.length > 0 || 
          searchQuery.trim()) && (
          <span>Filters applied</span>
        )}
      </div>

      {/* Content based on view mode */}
      {preferredView === 'list' ? (
        <ClassListByDate
          classes={filteredClasses}
          loading={classState.loading}
          emptyMessage="No classes match your current filters. Try adjusting your search criteria."
          onChoreographerClick={handleChoreographerClick}
          onViewDetails={handleClassSelect}
        />
      ) : (
        <ClassCalendar
          classes={filteredClasses}
          onSelectClass={handleClassSelect}
          onChoreographerClick={handleChoreographerClick}
        />
      )}

      {/* Class Detail Modal */}
      <ClassDetailModal
        danceClass={selectedClass}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClass(null);
        }}
        onChoreographerClick={handleChoreographerClick}
      />
    </div>
  );
};