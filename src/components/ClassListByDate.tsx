// ClassListByDate component for displaying classes grouped by date
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ClassCard } from './ClassCard';
import { Button } from '@/components/ui/button';
import { 
  List, 
  LayoutGrid, 
} from 'lucide-react';
import { useClassPreferences } from '@/hooks/useUserState';
import type { DanceClass } from '@/types';
import { cn } from '@/lib/utils';
import { ClassListItem } from './ClassListItem';

type ViewMode = 'grid' | 'list';

interface ClassListByDateProps {
  classes: DanceClass[];
  onViewDetails?: (danceClass: DanceClass) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

interface GroupedClasses {
  date: string;
  displayDate: string;
  classes: DanceClass[];
}

export const ClassListByDate: React.FC<ClassListByDateProps> = ({
  classes,
  onViewDetails,
  className,
  emptyMessage = "No classes found",
  loading = false
}) => {
  // Initialize view mode with responsive logic
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // On mobile, always default to grid
    if (typeof window !== 'undefined' && window.innerWidth < 640) { // sm breakpoint is 640px
      return 'grid';
    }
    
    // On desktop, use localStorage preference with 'list' fallback
    try {
      const saved = localStorage.getItem('classListViewMode');
      return (saved as ViewMode) || 'list';
    } catch {
      return 'list';
    }
  });

  // Check if we're on mobile (below sm breakpoint)
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640; // sm breakpoint is 640px
  };

  // Force grid view on mobile, handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isMobile() && viewMode === 'list') {
        setViewMode('grid');
      } else if (!isMobile() && viewMode === 'grid') {
        setViewMode('list');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Update localStorage when view mode changes (only for desktop)
  const handleViewModeChange = (newViewMode: ViewMode) => {
    // Don't allow list view on mobile
    if (isMobile() && newViewMode === 'list') {
      return;
    }
    
    setViewMode(newViewMode);
    try {
      localStorage.setItem('classListViewMode', newViewMode);
    } catch {
      // Silently handle localStorage errors (private browsing, etc.)
    }
  };
  const { 
    toggleInterest, 
    toggleAttending, 
    isInterested, 
    isAttending 
  } = useClassPreferences();

  // Format date for group headers
  const formatDateHeader = useCallback((date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateString = date.toDateString();
    const todayString = today.toDateString();
    const tomorrowString = tomorrow.toDateString();
    
    if (dateString === todayString) {
      return 'Today';
    } else if (dateString === tomorrowString) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }, []);

  // Group classes by date
  const groupedClasses: GroupedClasses[] = useMemo(() => {
    const groups = new Map<string, DanceClass[]>();
    
    classes.forEach(danceClass => {

      const date = new Date(danceClass.dateTime);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(danceClass);
    });

    // Sort groups by date and sort classes within each group by time
    return Array.from(groups.entries())
      .map(([dateKey, classesInGroup]) => {
        // Parse date in local time to avoid timezone issues
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed
        const displayDate = formatDateHeader(date);
        
        // Sort classes by time within the group
        const sortedClasses = classesInGroup.sort((a, b) => 
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        );

        return {
          date: dateKey,
          displayDate,
          classes: sortedClasses
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [classes, formatDateHeader]);

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Loading header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 bg-muted-foreground/20 rounded w-20 animate-pulse" />
            <div className="h-5 bg-muted-foreground/20 rounded w-16 animate-pulse" />
          </div>
          <div className="h-8 bg-muted-foreground/20 rounded w-32 animate-pulse" />
        </div>

        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <div className="h-8 bg-muted-foreground/20 rounded w-48 animate-pulse" />
              
              {/* Grid loading skeleton (Force grid on mobile) */}
              {viewMode === 'grid' || isMobile() ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-muted rounded-lg">
                        <div className="h-48 bg-muted-foreground/20 rounded-t-lg" />
                        <div className="p-4 space-y-3">
                          <div className="h-6 bg-muted-foreground/20 rounded w-3/4" />
                          <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
                          <div className="flex gap-2">
                            <div className="h-6 bg-muted-foreground/20 rounded-full w-16" />
                            <div className="h-6 bg-muted-foreground/20 rounded-full w-20" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted-foreground/20 rounded w-full" />
                            <div className="h-4 bg-muted-foreground/20 rounded w-full" />
                          </div>
                          <div className="h-4 bg-muted-foreground/20 rounded w-full" />
                          <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
                          <div className="flex gap-2 pt-2">
                            <div className="h-11 bg-muted-foreground/20 rounded flex-1" />
                            <div className="h-11 bg-muted-foreground/20 rounded flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List loading skeleton */
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 text-center min-w-[80px]">
                            <div className="h-5 bg-muted-foreground/20 rounded w-12 mx-auto mb-1" />
                            <div className="h-4 bg-muted-foreground/20 rounded w-16 mx-auto" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="h-6 bg-muted-foreground/20 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
                                <div className="flex gap-1">
                                  <div className="h-5 bg-muted-foreground/20 rounded-full w-16" />
                                  <div className="h-5 bg-muted-foreground/20 rounded-full w-20" />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <div className="h-8 w-8 bg-muted-foreground/20 rounded" />
                                <div className="h-8 w-8 bg-muted-foreground/20 rounded" />
                                <div className="h-8 w-16 bg-muted-foreground/20 rounded" />
                              </div>
                            </div>
                            <div className="flex gap-4 mt-2">
                              <div className="h-4 bg-muted-foreground/20 rounded w-32" />
                              <div className="h-4 bg-muted-foreground/20 rounded w-16" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (groupedClasses.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-muted-foreground">
          {/* <div className="text-6xl mb-4">🕺</div> */}
          <h3 className="text-lg font-medium mb-2">No Classes Found</h3>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* View Toggle Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Classes</h2>
          <span className="text-sm text-muted-foreground">
            ({classes.length} total)
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('grid')}
            className="h-8 px-3"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Classes Content */}
      <div className="space-y-8">
        {groupedClasses.map((group) => (
          <div key={group.date} className="space-y-4">
            {/* Date Header */}
            <div className="flex items-center gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                {group.displayDate}
              </h3>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {group.classes.length} {group.classes.length === 1 ? 'class' : 'classes'}
              </span>
            </div>

            {/* Classes Content - Grid or List (Force grid on mobile) */}
            {viewMode === 'grid' || isMobile() ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {group.classes.map((danceClass) => (
                  <ClassCard
                    key={danceClass.id}
                    danceClass={danceClass}
                    isInterested={isInterested(danceClass.id)}
                    isAttending={isAttending(danceClass.id)}
                    onInterestToggle={toggleInterest}
                    onAttendingToggle={toggleAttending}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {group.classes.map((danceClass) => (
                  <ClassListItem
                    key={danceClass.id}
                    danceClass={danceClass}
                    isInterested={isInterested(danceClass.id)}
                    isAttending={isAttending(danceClass.id)}
                    onInterestToggle={toggleInterest}
                    onAttendingToggle={toggleAttending}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};