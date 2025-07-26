// Dashboard page component
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserState, useClassPreferences } from '@/hooks/useUserState';
import { useClasses } from '@/contexts/ClassContext';
import { ClassList } from '@/components/ClassList';
import { ClassDetailModal } from '@/components/ClassDetailModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Heart, UserCheck, BookOpen } from 'lucide-react';
import type { DanceClass } from '@/types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isChoreographer, getCurrentUserClasses } = useUserState();
  const { interestedClasses, attendingClasses, getInterestedClasses, getAttendingClasses } = useClassPreferences();
  const { state: classState } = useClasses();
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get featured classes for display
  const featuredClasses = classState.featuredClasses.slice(0, 4);

  // Get user's interested and attending classes with full class data
  const userInterestedClasses = useMemo(() => {
    return getInterestedClasses(classState.classes);
  }, [getInterestedClasses, classState.classes]);

  const userAttendingClasses = useMemo(() => {
    return getAttendingClasses(classState.classes);
  }, [getAttendingClasses, classState.classes]);

  // Get choreographer's upcoming classes
  const choreographerClasses = useMemo(() => {
    if (!isChoreographer()) return [];
    return getCurrentUserClasses(classState.classes);
  }, [isChoreographer, getCurrentUserClasses, classState.classes]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 sm:p-6 border">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Welcome back, {currentUser?.name}! 👋
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isChoreographer() 
                ? `You're currently teaching ${choreographerClasses.length} classes and have ${userAttendingClasses.length + userInterestedClasses.length} classes on your radar.`
                : `You're attending ${userAttendingClasses.length} classes and interested in ${userInterestedClasses.length} more. Keep dancing!`
              }
            </p>
          </div>
          <div className="hidden sm:block text-4xl sm:text-6xl opacity-20 ml-4">
            🕺
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Interested Classes Card */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Interested Classes</h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary">{interestedClasses.length}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Classes you're interested in</p>
        </div>

        {/* Attending Classes Card */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Attending Classes</h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary">{attendingClasses.length}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Classes you're attending</p>
        </div>

        {/* Role-specific card */}
        {isChoreographer() ? (
          <div className="rounded-lg border bg-card p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">My Classes</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{choreographerClasses.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Classes you're teaching</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Favorite Choreographers</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary">0</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Choreographers you follow</p>
          </div>
        )}
      </div>

      {/* My Classes Tabs - for tracked classes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Classes</h2>
        
        <Tabs defaultValue="attending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="attending" className="flex items-center gap-2 min-h-[44px] touch-manipulation">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Attending ({userAttendingClasses.length})</span>
              <span className="sm:hidden">Attending</span>
            </TabsTrigger>
            <TabsTrigger value="interested" className="flex items-center gap-2 min-h-[44px] touch-manipulation">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Interested ({userInterestedClasses.length})</span>
              <span className="sm:hidden">Interested</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="attending" className="space-y-4">
            <ClassList
              classes={userAttendingClasses}
              loading={classState.loading}
              emptyMessage="You're not attending any classes yet. Browse classes to find ones you'd like to attend!"
              onChoreographerClick={(choreographerId) => {
                navigate(`/choreographer/${choreographerId}`);
              }}
              onViewDetails={(danceClass) => {
                setSelectedClass(danceClass);
                setIsModalOpen(true);
              }}
            />
          </TabsContent>
          
          <TabsContent value="interested" className="space-y-4">
            <ClassList
              classes={userInterestedClasses}
              loading={classState.loading}
              emptyMessage="You haven't marked any classes as interesting yet. Explore our featured classes below!"
              onChoreographerClick={(choreographerId) => {
                navigate(`/choreographer/${choreographerId}`);
              }}
              onViewDetails={(danceClass) => {
                setSelectedClass(danceClass);
                setIsModalOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* My Upcoming Classes - for choreographers */}
      {isChoreographer() && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Upcoming Classes
            </h2>
            <Link to="/my-classes">
              <Button variant="outline" size="sm">
                Manage All Classes →
              </Button>
            </Link>
          </div>
          
          <ClassList
            classes={choreographerClasses.slice(0, 4)}
            loading={classState.loading}
            emptyMessage="You haven't created any classes yet. Start by creating your first class!"
            onChoreographerClick={(choreographerId) => {
              navigate(`/choreographer/${choreographerId}`);
            }}
            onViewDetails={(danceClass) => {
              setSelectedClass(danceClass);
              setIsModalOpen(true);
            }}
          />
        </div>
      )}

      {/* Featured Classes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Classes</h2>
          <Link to="/schedule">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>
        
        <ClassList
          classes={featuredClasses}
          loading={classState.loading}
          emptyMessage="No featured classes available"
          onChoreographerClick={(choreographerId) => {
            navigate(`/choreographer/${choreographerId}`);
          }}
          onViewDetails={(danceClass) => {
            setSelectedClass(danceClass);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-4 sm:p-6">
            <h3 className="font-medium mb-2">Browse Classes</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Discover new dance classes and workshops
            </p>
            <Link 
              to="/schedule" 
              className="inline-flex items-center text-sm text-primary hover:underline min-h-[44px] touch-manipulation"
            >
              Go to Schedule →
            </Link>
          </div>
          
          {isChoreographer() && (
            <div className="rounded-lg border bg-card p-4 sm:p-6">
              <h3 className="font-medium mb-2">Manage Classes</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create and manage your dance classes
              </p>
              <Link 
                to="/my-classes" 
                className="inline-flex items-center text-sm text-primary hover:underline min-h-[44px] touch-manipulation"
              >
                Go to My Classes →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Class Detail Modal */}
      <ClassDetailModal
        danceClass={selectedClass}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClass(null);
        }}
        onChoreographerClick={(choreographerId) => {
          navigate(`/choreographer/${choreographerId}`);
        }}
      />
    </div>
  );
};