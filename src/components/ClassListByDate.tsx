// ClassListByDate component for displaying classes grouped by date
import React, { useMemo, useCallback } from 'react';
import { ClassCard } from './ClassCard';
import { useClassPreferences } from '@/hooks/useUserState';
import type { DanceClass } from '@/types';
import { cn } from '@/lib/utils';

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
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(danceClass);
    });

    // Sort groups by date and sort classes within each group by time
    return Array.from(groups.entries())
      .map(([dateKey, classesInGroup]) => {
        const date = new Date(dateKey);
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
      <div className={cn("space-y-8", className)}>
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="h-8 bg-muted-foreground/20 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
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
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (groupedClasses.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-muted-foreground">
          <div className="text-6xl mb-4">🕺</div>
          <h3 className="text-lg font-medium mb-2">No Classes Found</h3>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {groupedClasses.map((group) => (
        <div key={group.date} className="space-y-4">
          {/* Date Header */}
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              {group.displayDate}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {group.classes.length} {group.classes.length === 1 ? 'class' : 'classes'}
            </span>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
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
        </div>
      ))}
    </div>
  );
};