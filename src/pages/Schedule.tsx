// Schedule page component
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '@/contexts/ClassContext';
import { ClassListByDate } from '@/components/ClassListByDate';
import { ClassDetailModal } from '@/components/ClassDetailModal';
import { FilterPanel } from '@/components/FilterPanel';
import type { DanceClass, FilterOptions } from '@/types';

export const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const { state: classState } = useClasses();
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    styles: [],
    choreographers: [],
    studios: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter classes based on search and filters
  const filteredClasses = useMemo(() => {
    let filtered = [...classState.classes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(cls => 
        cls.title.toLowerCase().includes(query) ||
        cls.choreographerName.toLowerCase().includes(query) ||
        cls.style.some(style => style.toLowerCase().includes(query)) ||
        cls.location.toLowerCase().includes(query) ||
        cls.description.toLowerCase().includes(query)
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

    // Apply studio filters (using location field)
    if (activeFilters.studios.length > 0) {
      filtered = filtered.filter(cls => 
        activeFilters.studios.includes(cls.location)
      );
    }

    // Apply date range filter if specified
    if (activeFilters.dateRange) {
      const startDate = new Date(activeFilters.dateRange.start);
      const endDate = new Date(activeFilters.dateRange.end);
      
      filtered = filtered.filter(cls => {
        const classDate = new Date(cls.dateTime);
        return classDate >= startDate && classDate <= endDate;
      });
    }

    return filtered;
  }, [classState.classes, activeFilters, searchQuery]);

  // Handle filter changes
  const handleFiltersChange = (filters: FilterOptions, search: string) => {
    setActiveFilters(filters);
    setSearchQuery(search);
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

      {/* Class List */}
      <ClassListByDate
        classes={filteredClasses}
        loading={classState.loading}
        emptyMessage="No classes match your current filters. Try adjusting your search criteria."
        onChoreographerClick={handleChoreographerClick}
        onViewDetails={handleClassSelect}
      />

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