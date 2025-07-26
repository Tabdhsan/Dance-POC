// Public choreographer profile page component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useClasses } from '@/contexts/ClassContext';
//import { findChoreographerByUsername, generateUsername } from '@/utils/dataLoader';
import type { Choreographer } from '@/types';
import { ArrowLeft, Globe, Instagram, Youtube, ExternalLink, Play, Calendar, MapPin, Users } from 'lucide-react';
import { extractYouTubeVideoId, generateYouTubeEmbedUrl } from '@/utils/youtubeUtils';
import { placeholderImage } from '@/lib/utils';

export const ChoreographerProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { state: { users } } = useUser();
  const { state: { classes } } = useClasses();
  
  const [choreographer, setChoreographer] = useState<Choreographer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (username && users.length > 0) {
      const foundChoreographer = users.find(user => user.username === username) as Choreographer;
      setChoreographer(foundChoreographer);
      setLoading(false);
    }
  }, [username, users]);

  // Helper function to get placeholder profile image
  const getPlaceholderImage = (): string => {
    return placeholderImage
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!choreographer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Choreographer Not Found</h1>
        <p className="text-muted-foreground">
          The choreographer profile "{username}" could not be found.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Get choreographer's classes
  const choreographerClasses = classes.filter(cls => cls.choreographerId === choreographer.id);
  const upcomingClasses = choreographerClasses.filter(cls => 
    new Date(cls.dateTime) > new Date() && cls.status === 'active'
  );

  const profileImage = choreographer.profilePhoto || getPlaceholderImage();
  const youtubeVideoId = choreographer.featuredVideo ? extractYouTubeVideoId(choreographer.featuredVideo) : null;

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{choreographer.name}</h1>
          <p className="text-muted-foreground">
            @{choreographer.username}
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Photo Section */}
        <div className="lg:col-span-1">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img 
              src={profileImage} 
              alt={choreographer.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">{choreographer.name}</h2>
              {choreographer.pronouns && (
                <span className="text-muted-foreground">({choreographer.pronouns})</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {choreographer.role}
              </span>
            </div>
          </div>

          {/* Bio */}
          {choreographer.bio && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-muted-foreground leading-relaxed">{choreographer.bio}</p>
            </div>
          )}

          {/* Teaching Style */}
          {choreographer.teachingStyle && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Teaching Style</h3>
              <p className="text-muted-foreground leading-relaxed">{choreographer.teachingStyle}</p>
            </div>
          )}

          {/* Achievements */}
          {choreographer.achievements && choreographer.achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {choreographer.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact & Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="space-y-3">
              {/* Website */}
              {choreographer.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={choreographer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    {choreographer.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Social Links */}
              {choreographer.socialLinks?.instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`https://instagram.com/${choreographer.socialLinks.instagram.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {choreographer.socialLinks.instagram}
                  </a>
                </div>
              )}
              {choreographer.socialLinks?.youtube && (
                <div className="flex items-center gap-3">
                  <Youtube className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`https://youtube.com/${choreographer.socialLinks.youtube}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {choreographer.socialLinks.youtube}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Featured Video */}
          {youtubeVideoId && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Featured Video</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={generateYouTubeEmbedUrl(youtubeVideoId)}
                  title="Featured Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Classes Section */}
      {upcomingClasses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h3 className="text-xl font-semibold">Upcoming Classes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingClasses.map((danceClass) => (
              <div key={danceClass.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-medium text-lg mb-2">{danceClass.title}</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(danceClass.dateTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{danceClass.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{danceClass.style.join(', ')}</span>
                  </div>
                  {danceClass.price && (
                    <div className="text-primary font-medium">
                      ${danceClass.price}
                    </div>
                  )}
                </div>
                {danceClass.rsvpLink && (
                  <Button size="sm" className="w-full mt-3" asChild>
                    <a href={danceClass.rsvpLink} target="_blank" rel="noopener noreferrer">
                      RSVP
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Classes by Choreographer */}
      {choreographerClasses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">All Classes</h3>
          <div className="text-muted-foreground">
            {choreographer.name} has taught {choreographerClasses.length} classes
          </div>
        </div>
      )}
    </div>
  );
}; 