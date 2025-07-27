import type { DanceClass } from '@/types';
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { UserCheck } from "lucide-react";
import { MapPin } from "lucide-react";
import { DollarSign } from "lucide-react";
// Compact list item component for list view
export const ClassListItem: React.FC<{
    danceClass: DanceClass;
    isInterested: boolean;
    isAttending: boolean;
    onInterestToggle: (id: string) => void;
    onAttendingToggle: (id: string) => void;
    onViewDetails?: (danceClass: DanceClass) => void;
  }> = ({
    danceClass,
    isInterested,
    isAttending,
    onInterestToggle,
    onAttendingToggle,
    onViewDetails
  }) => {
    const { date, time } = formatDateTime(danceClass.dateTime);
  
    // Handle interest toggle
    const handleInterestClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onInterestToggle(danceClass.id);
    };
  
    // Handle attending toggle
    const handleAttendingClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onAttendingToggle(danceClass.id);
    };
  
    // Handle view details
    const handleViewDetails = (e: React.MouseEvent) => {
      e.stopPropagation();
      onViewDetails?.(danceClass);
    };
  
    // Handle RSVP click
    const handleRSVPClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (danceClass.rsvpLink) {
        window.open(danceClass.rsvpLink, '_blank');
      }
    };
  
    return (
      <div className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer",
        danceClass.status === 'cancelled' && "opacity-80"
      )} onClick={handleViewDetails}>
        <div className="flex items-center gap-4">
          {/* Time and Date */}
          <div className="flex-shrink-0 text-center min-w-[80px]">
            <div className="text-sm font-medium text-foreground">{time}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
  
          {/* Class Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight truncate">
                  {danceClass.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {danceClass.choreographerName}
                </p>
                
                {/* Dance Styles */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {danceClass.status === 'featured' && (
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {danceClass.style.slice(0, 2).map((style, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                  {danceClass.style.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{danceClass.style.length - 2} more
                    </span>
                  )}
                </div>
              </div>
  
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {danceClass.status !== 'cancelled' ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0",
                        isInterested && "text-red-500 hover:text-red-600"
                      )}
                      onClick={handleInterestClick}
                      title={isInterested ? "Remove from interested" : "Mark as interested"}
                    >
                      <Heart className={cn("h-4 w-4", isInterested && "fill-current")} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0",
                        isAttending && "text-green-500 hover:text-green-600"
                      )}
                      onClick={handleAttendingClick}
                      title={isAttending ? "Remove from attending" : "Mark as attending"}
                    >
                      <UserCheck className={cn("h-4 w-4", isAttending && "fill-current")} />
                    </Button>
  
                    
                  </>
                ) : (
                  <span className="bg-destructive/80 text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Cancelled
                  </span>
                )}
                
                
              </div>
            </div>
  
            {/* Location and Price */}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{danceClass.location}</span>
              </div>
              {danceClass.price && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>${danceClass.price}</span>
                </div>
              )}
              <div className="flex items-center gap-2 flex-grow flex-shrink-0"></div>
              {danceClass.rsvpLink && danceClass.status !== 'cancelled' && (
                <Button
                size="sm"
                onClick={handleRSVPClick}
                className="text-xs px-3"
                >
                RSVP
                </Button>
              )}
              {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDetails}
                  className="text-xs px-3"
                >
                  Details
                </Button> */}
                    
            </div>
          </div>
        </div>
      </div>
    );
  };