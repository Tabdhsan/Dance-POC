// ClassCard component for displaying dance class information
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Heart, 
  UserCheck, 
  ExternalLink,
  User
} from 'lucide-react';
import type { ClassCardProps } from '@/types';
import { cn, formatDateTime } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const ClassCard: React.FC<ClassCardProps> = ({
  danceClass,
  isInterested = false,
  isAttending = false,
  onInterestToggle,
  onAttendingToggle,
  onViewDetails,
  showFlyer = false,
}) => {
  const navigate = useNavigate();
  // Format date and time
  console.log(danceClass.title, showFlyer, danceClass.flyer, danceClass.status);
  const { date, time } = formatDateTime(danceClass.dateTime);

  // Handle interest toggle
  const handleInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInterestToggle?.(danceClass.id);
  };

  // Handle attending toggle
  const handleAttendingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAttendingToggle?.(danceClass.id);
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
      "bg-card text-card-foreground rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200",
      danceClass.status === 'cancelled' && "opacity-80",
      danceClass.status === 'featured' && !showFlyer && "ring-2 ring-blue-500/50"
    )}>
      <div className="flex flex-col space-y-3 h-full">

      {/* Class Image/Flyer */}
      {danceClass.status === 'featured' && showFlyer && (
      <div className="relative bg-gray-100">
        {danceClass.flyer ? (
          <img
            src={danceClass.flyer}
            alt={`${danceClass.title} flyer`}
            className="w-full h-48 object-contain rounded-t-lg object-top"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Placeholder when no image or image fails */}
        <div className={cn(
          "w-full h-48 bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden",
          danceClass.flyer && "hidden"
        )}>
          {/* Unsplash placeholder image */}
          <img
            src='https://idsb.tmgrup.com.tr/ly/uploads/images/2024/04/09/thumbs/800x531/323101.jpg'
            alt="Dance class placeholder"
            className="bg-white w-full h-full object-cover opacity-60"
            onError={(e) => {
              // Fallback to icon if Unsplash fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          
          {/* Fallback icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground bg-muted/80 hidden">
            <div>
              <Calendar className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm font-medium">{danceClass.title}</p>
            </div>
          </div>
          
          {/* Class title overlay on Unsplash image */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <Calendar className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm font-medium">{danceClass.title}</p>
            </div>
          </div>
        </div>

        {/* Status badges */}
        {/* <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </span>
        </div> */}
      </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col flex-grow space-y-3 p-4">
        {/* Title and Choreographer */}
        <div className="flex h-auto justify-between h-10">
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {danceClass.title}
            </h3>
            {/* Interest/Attending buttons */}
            { danceClass.status !== 'cancelled' ? (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 touch-manipulation cursor-pointer",
                  isInterested && "text-red-500 hover:text-red-600"
                )}
                onClick={handleInterestClick}
                title={isInterested ? "Remove from interested" : "Mark as interested"}
                aria-label={isInterested ? "Remove from interested" : "Mark as interested"}
              >
                <Heart className={cn("h-5 w-5", isInterested && "fill-current")} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 touch-manipulation cursor-pointer",
                  isAttending && "text-green-500 hover:text-green-600"
                )}
                onClick={handleAttendingClick}
                title={isAttending ? "Remove from attending" : "Mark as attending"}
                aria-label={isAttending ? "Remove from attending" : "Mark as attending"}
              >
                <UserCheck className={cn("h-5 w-5", isAttending && "fill-current")} />
              </Button>
            </div>
            ) : (
              <div className="flex gap-1">
                <span className="bg-destructive m-auto opacity-80 text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full cursor-default">
                  Cancelled
                </span>
              </div>
            )}
        </div>
        <button
          onClick={() => navigate(`/choreographer/${danceClass.choreographerUsername}`)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <User className="h-3 w-3" />
          {danceClass.choreographerName}
        </button>

        {/* Dance Styles */}
        <div className="flex flex-wrap gap-1">
          {/* Status badges */}
          {danceClass.status === 'featured' && (
          <div className="flex gap-2">
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
          )}
          {danceClass.style.map((style, index) => (
            <span
              key={index}
              className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full"
            >
              {style}
            </span>
          ))}
        </div>

        {/* Date, Time, and Location */}
        <div className="space-y-2 text-sm text-muted-foreground flex-grow">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date} at {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{danceClass.location}</span>
          </div>
          {danceClass.price && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>${danceClass.price}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {danceClass.description}
          </p>
        </div>
        

        {/* Action Buttons */}
        <div className="flex  gap-2 pt-2">
          {danceClass.rsvpLink && danceClass.status !== 'cancelled' && (
            <Button
              onClick={handleRSVPClick}
              className="flex-1 min-h-[44px] touch-manipulation"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              RSVP
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-h-[44px] touch-manipulation"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(danceClass);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
    </div>

  );
};