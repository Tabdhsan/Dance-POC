import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClassCard } from '@/components/ClassCard';
import { ClassDetailModal } from '@/components/ClassDetailModal';
import { useUser } from '@/contexts/UserContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { getChoreographerById, getClassesByChoreographer } from '@/utils/dataLoader';
import type { User, DanceClass } from '@/types';

export const ChoreographerProfile: React.FC = () => {
  const { choreographerId } = useParams<{ choreographerId: string }>();
  const navigate = useNavigate();
  const { state: userState } = useUser();

  const { state: preferencesState, toggleClassInterest, toggleClassAttending } = usePreferences();

  const [choreographer, setChoreographer] = useState<User | null>(null);
  const [choreographerClasses, setChoreographerClasses] = useState<DanceClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null);

  useEffect(() => {
    const loadChoreographerData = async () => {
      if (!choreographerId) {
        setError('Choreographer ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load choreographer details
        const choreographerData = await getChoreographerById(choreographerId);
        if (!choreographerData) {
          setError('Choreographer not found');
          setLoading(false);
          return;
        }

        setChoreographer(choreographerData);

        // Load choreographer's classes
        const choreographerClassData = await getClassesByChoreographer(choreographerId);
        
        // Filter to only show upcoming classes (not cancelled)
        const upcomingClasses = choreographerClassData.filter(cls => {
          const classDate = new Date(cls.dateTime);
          const now = new Date();
          return classDate > now && cls.status !== 'cancelled';
        });

        setChoreographerClasses(upcomingClasses);
      } catch (err) {
        console.error('Error loading choreographer data:', err);
        setError('Failed to load choreographer profile');
      } finally {
        setLoading(false);
      }
    };

    loadChoreographerData();
  }, [choreographerId]);

  const handleClassInterestToggle = (classId: string) => {
    toggleClassInterest(classId);
  };

  const handleClassAttendingToggle = (classId: string) => {
    toggleClassAttending(classId);
  };

  const handleViewClassDetails = (danceClass: DanceClass) => {
    setSelectedClass(danceClass);
  };

  const handleEditProfile = () => {
    // For POC, this would navigate to an edit profile page
    // For now, we'll just show an alert
    alert('Edit Profile functionality would be implemented here');
  };

  const isOwner = userState.currentUser?.id === choreographerId;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (error || !choreographer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            {error || 'Choreographer not found'}
          </h2>
          <Button 
            onClick={() => navigate('/schedule')} 
            className="mt-4 min-h-[44px] touch-manipulation"
            variant="outline"
          >
            Back to Schedule
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
      {/* Profile Header */}
      <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0 self-center sm:self-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-muted">
              {choreographer.profilePhoto ? (
                <img
                  src={choreographer.profilePhoto}
                  alt={choreographer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl sm:text-4xl font-bold">
                  {choreographer.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  {choreographer.name}
                </h1>
                {choreographer.pronouns && (
                  <p className="text-muted-foreground text-base sm:text-lg">
                    {choreographer.pronouns}
                  </p>
                )}
              </div>
              
              {isOwner && (
                <Button 
                  onClick={handleEditProfile}
                  variant="outline"
                  className="self-center sm:self-start min-h-[44px] touch-manipulation w-full sm:w-auto"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Bio */}
            {choreographer.bio && (
              <p className="text-muted-foreground mt-4 leading-relaxed text-sm sm:text-base">
                {choreographer.bio}
              </p>
            )}

            {/* Social Links */}
            {choreographer.socialLinks && (
              <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                {choreographer.website && (
                  <a
                    href={choreographer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline min-h-[44px] flex items-center touch-manipulation"
                  >
                    Website
                  </a>
                )}
                {choreographer.socialLinks.instagram && (
                  <a
                    href={`https://instagram.com/${choreographer.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline min-h-[44px] flex items-center touch-manipulation"
                  >
                    Instagram
                  </a>
                )}
                {choreographer.socialLinks.youtube && (
                  <a
                    href={`https://youtube.com/@${choreographer.socialLinks.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline min-h-[44px] flex items-center touch-manipulation"
                  >
                    YouTube
                  </a>
                )}
                {choreographer.socialLinks.tiktok && (
                  <a
                    href={`https://tiktok.com/@${choreographer.socialLinks.tiktok.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline min-h-[44px] flex items-center touch-manipulation"
                  >
                    TikTok
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Video */}
      {choreographer.featuredVideo && (
        <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Featured Video</h2>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Video player would be embedded here
              <br />
              <span className="text-sm">({choreographer.featuredVideo})</span>
            </p>
          </div>
        </div>
      )}

      {/* Teaching Style */}
      {choreographer.teachingStyle && (
        <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Teaching Style</h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {choreographer.teachingStyle}
          </p>
        </div>
      )}

      {/* Achievements */}
      {choreographer.achievements && choreographer.achievements.length > 0 && (
        <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Achievements</h2>
          <ul className="space-y-2">
            {choreographer.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-muted-foreground text-sm sm:text-base">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming Classes */}
      <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
          Upcoming Classes ({choreographerClasses.length})
        </h2>
        
        {choreographerClasses.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {choreographerClasses.map((danceClass) => (
              <ClassCard
                key={danceClass.id}
                danceClass={danceClass}
                isInterested={preferencesState.userPreferences.interestedClasses.includes(danceClass.id)}
                isAttending={preferencesState.userPreferences.attendingClasses.includes(danceClass.id)}
                onInterestToggle={handleClassInterestToggle}
                onAttendingToggle={handleClassAttendingToggle}
                onViewDetails={handleViewClassDetails}
                onChoreographerClick={() => {}} // Don't navigate since we're already on the profile
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming classes scheduled</p>
          </div>
        )}
      </div>

      {/* Class Detail Modal */}
      {selectedClass && (
        <ClassDetailModal
          danceClass={selectedClass}
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
          onChoreographerClick={() => {}} // Don't navigate since we're already on the profile
        />
      )}
    </div>
  );
};