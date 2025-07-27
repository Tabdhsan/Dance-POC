// ClassDetailModal component for displaying full class information
import React from 'react';
import { Button } from '@/components/ui/button';
import { InterestButton } from './InterestButton';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  ExternalLink,
  User,
  X,
  Clock,
  Info
} from 'lucide-react';
import { useClassPreferences } from '@/hooks/useUserState';
import type { DanceClass } from '@/types';
import { cn, formatDateTime } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ClassDetailModalProps {
  danceClass: DanceClass | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  danceClass,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { 
    toggleInterest, 
    toggleAttending, 
    isInterested, 
    isAttending 
  } = useClassPreferences();

  // Don't render if not open or no class data
  if (!isOpen || !danceClass) {
    return null;
  }

  
  const { date, time } = formatDateTime(danceClass.dateTime);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle choreographer click
  const handleChoreographerClick = () => {
    navigate(`/choreographer/${danceClass.choreographerUsername}`);
    onClose();
  };

  // Handle RSVP click
  const handleRSVPClick = () => {
    if (danceClass.rsvpLink) {
      window.open(danceClass.rsvpLink, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 bg-background border-b px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold truncate pr-4">
            {danceClass.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-11 w-11 p-0 shrink-0 touch-manipulation"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Class Image/Flyer */}
          {danceClass.flyer && (
            <div className="relative">
              <img
                src={danceClass.flyer}
                alt={`${danceClass.title} flyer`}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Status badges */}
              <div className="">
                {danceClass.status === 'featured' && (
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Featured Class
                  </span>
                )}
                {danceClass.status === 'cancelled' && (
                  <span className="bg-destructive text-destructive-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Choreographer */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleChoreographerClick}
              className="flex items-center gap-3 text-left hover:bg-accent rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{danceClass.choreographerName}</p>
                <p className="text-sm text-muted-foreground">Choreographer</p>
              </div>
            </button>

            {/* Interest/Attending buttons */}
            <div className="flex gap-2">
              <InterestButton
                classId={danceClass.id}
                type="interested"
                isActive={isInterested(danceClass.id)}
                onToggle={toggleInterest}
                disabled={danceClass.status === 'cancelled'}
              />
              <InterestButton
                classId={danceClass.id}
                type="attending"
                isActive={isAttending(danceClass.id)}
                onToggle={toggleAttending}
                disabled={danceClass.status === 'cancelled'}
              />
            </div>
          </div>

          {/* Dance Styles */}
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Dance Styles
            </h3>
            <div className="flex flex-wrap gap-2">
              {danceClass.style.map((style, index) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Class Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">{time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{danceClass.location}</p>
                </div>
              </div>
              
              {danceClass.price && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">${danceClass.price}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">About This Class</h3>
            <p className="text-muted-foreground leading-relaxed">
              {danceClass.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {danceClass.rsvpLink && danceClass.status !== 'cancelled' && (
              <Button
                onClick={handleRSVPClick}
                className="flex-1 min-h-[44px] touch-manipulation"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                RSVP Now
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onClose}
              className={cn(
                "min-h-[44px] touch-manipulation",
                danceClass.rsvpLink && danceClass.status !== 'cancelled' ? "flex-1" : "w-full"
              )}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};