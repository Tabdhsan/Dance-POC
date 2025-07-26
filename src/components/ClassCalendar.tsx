// ClassCalendar component using react-big-calendar
import React, { useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import type { DanceClass } from '@/types';
import { useClassPreferences } from '@/hooks/useUserState';
import { cn } from '@/lib/utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface ClassCalendarProps {
  classes: DanceClass[];
  onSelectClass?: (danceClass: DanceClass) => void;
  onChoreographerClick?: (choreographerId: string) => void;
  className?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: DanceClass;
  isInterested: boolean;
  isAttending: boolean;
}

export const ClassCalendar: React.FC<ClassCalendarProps> = ({
  classes,
  onSelectClass,
  className
}) => {
  const { isInterested, isAttending } = useClassPreferences();

  // Convert dance classes to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return classes.map(danceClass => {
      const startDate = new Date(danceClass.dateTime);
      const endDate = new Date(startDate.getTime() + 90 * 60 * 1000); // Assume 90 minutes duration

      return {
        id: danceClass.id,
        title: danceClass.title,
        start: startDate,
        end: endDate,
        resource: danceClass,
        isInterested: isInterested(danceClass.id),
        isAttending: isAttending(danceClass.id)
      };
    });
  }, [classes, isInterested, isAttending]);

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const { resource: danceClass, isInterested: interested, isAttending: attending } = event;
    
    return (
      <div className={cn(
        "p-1 rounded text-xs overflow-hidden",
        danceClass.status === 'cancelled' && "opacity-60",
        danceClass.status === 'featured' && "ring-1 ring-yellow-400",
        interested && "bg-red-100 border-red-300 text-red-800",
        attending && "bg-green-100 border-green-300 text-green-800",
        !interested && !attending && "bg-blue-100 border-blue-300 text-blue-800"
      )}>
        <div className="font-medium truncate">{danceClass.title}</div>
        <div className="text-xs opacity-75 truncate">{danceClass.choreographerName}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {danceClass.style.slice(0, 2).map((style, index) => (
            <span
              key={index}
              className="bg-white/50 text-xs px-1 rounded"
            >
              {style}
            </span>
          ))}
          {danceClass.style.length > 2 && (
            <span className="bg-white/50 text-xs px-1 rounded">
              +{danceClass.style.length - 2}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent) => {
    onSelectClass?.(event.resource);
  };

  // Custom event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const { resource: danceClass, isInterested: interested, isAttending: attending } = event;
    
    let backgroundColor = '#3174ad';
    let borderColor = '#265985';
    
    if (danceClass.status === 'cancelled') {
      backgroundColor = '#6b7280';
      borderColor = '#4b5563';
    } else if (attending) {
      backgroundColor = '#10b981';
      borderColor = '#059669';
    } else if (interested) {
      backgroundColor = '#ef4444';
      borderColor = '#dc2626';
    } else if (danceClass.status === 'featured') {
      backgroundColor = '#f59e0b';
      borderColor = '#d97706';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        opacity: danceClass.status === 'cancelled' ? 0.6 : 1
      }
    };
  };

  // Custom toolbar component
  const CustomToolbar = ({ label, onNavigate, onView, view }: any) => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('PREV')}
            className="px-4 py-2 border border-input rounded-md hover:bg-accent text-sm min-h-[44px] touch-manipulation"
            aria-label="Previous"
          >
            ←
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-center flex-1 mx-4">{label}</h2>
          <button
            onClick={() => onNavigate('NEXT')}
            className="px-4 py-2 border border-input rounded-md hover:bg-accent text-sm min-h-[44px] touch-manipulation"
            aria-label="Next"
          >
            →
          </button>
        </div>
        
        <div className="flex gap-1 justify-center">
          {[Views.MONTH, Views.WEEK, Views.DAY].map((viewName) => (
            <button
              key={viewName}
              onClick={() => onView(viewName)}
              className={cn(
                "px-3 py-2 text-sm rounded-md border border-input min-h-[44px] touch-manipulation flex-1 sm:flex-none",
                view === viewName 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
            >
              {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("bg-background", className)}>
      <style>{`
        .rbc-calendar {
          font-family: inherit;
          background: transparent;
        }
        
        .rbc-header {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid hsl(var(--border));
          padding: 8px;
          font-weight: 500;
        }
        
        .rbc-month-view, .rbc-time-view {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-date-cell {
          padding: 4px;
          border-right: 1px solid hsl(var(--border));
        }
        
        .rbc-day-bg {
          background: hsl(var(--background));
          border-right: 1px solid hsl(var(--border));
        }
        
        .rbc-day-bg:hover {
          background: hsl(var(--accent));
        }
        
        .rbc-today {
          background: hsl(var(--accent)) !important;
        }
        
        .rbc-off-range-bg {
          background: hsl(var(--muted));
        }
        
        .rbc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 12px;
          line-height: 1.2;
        }
        
        .rbc-selected {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 1px;
        }
        
        .rbc-time-slot {
          border-top: 1px solid hsl(var(--border));
        }
        
        .rbc-time-content {
          border-left: 1px solid hsl(var(--border));
        }
        
        .rbc-current-time-indicator {
          background-color: hsl(var(--primary));
        }
      `}</style>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 300px)', minHeight: 500 }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
          toolbar: CustomToolbar
        }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        popup
        popupOffset={{ x: 30, y: 20 }}
        formats={{
          timeGutterFormat: 'h:mm A',
          eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
            localizer?.format(start, 'h:mm A', culture) + ' - ' + localizer?.format(end, 'h:mm A', culture)
        }}
      />
    </div>
  );
};