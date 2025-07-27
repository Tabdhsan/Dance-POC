// ClassList component with responsive grid layout
import React from 'react';
import { ClassCard } from './ClassCard';
import { useClassPreferences } from '@/hooks/useUserState';
import type { DanceClass } from '@/types';
import { cn } from '@/lib/utils';

interface ClassListProps {
  classes: DanceClass[];
  onViewDetails?: (danceClass: DanceClass) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  showFlyer?: boolean;
}

export const ClassList: React.FC<ClassListProps> = ({
  classes,
  onViewDetails,
  className,
  showFlyer = false,
  emptyMessage = "No classes found",
  loading = false
}) => {
  const { 
    toggleInterest, 
    toggleAttending, 
    isInterested, 
    isAttending 
  } = useClassPreferences();

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6",
        className
      )}>
        {Array.from({ length: 8 }).map((_, index) => (
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
    );
  }

  // Empty state
  if (classes.length === 0) {
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
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6",
      className
    )}>
      {classes.map((danceClass) => (
        <ClassCard
          key={danceClass.id}
          danceClass={danceClass}
          showFlyer={showFlyer}
          isInterested={isInterested(danceClass.id)}
          isAttending={isAttending(danceClass.id)}
          onInterestToggle={toggleInterest}
          onAttendingToggle={toggleAttending}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};