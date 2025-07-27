// Profile page component with Facebook-style layout
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { useClasses } from '@/contexts/ClassContext';
import type { Choreographer } from '@/types';
import { Edit3, Save, X, Camera, Globe, Instagram, Youtube, ExternalLink, Play, AlertCircle, Check } from 'lucide-react';
import { placeholderImage } from '@/lib/utils';
import { extractYouTubeVideoId, generateYouTubeEmbedUrl, validateYouTubeUrl } from '@/utils/youtubeUtils';

export const Profile: React.FC = () => {
  const { state: { currentUser }, switchUser } = useUser();
  const { state: { classes } } = useClasses();
  
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Choreographer>({} as Choreographer);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [photoEditMode, setPhotoEditMode] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  // Get user's classes
  const userClasses = classes.filter(cls => cls.choreographerId === currentUser?.id);

  useEffect(() => {
    if (currentUser) {
      setEditForm(currentUser as Choreographer);
    }
  }, [currentUser]);

  const handleEditProfile = () => {
    setEditMode(true);
    setEditForm(currentUser as Choreographer);
    setVideoError(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditForm(currentUser as Choreographer);
    setSaveStatus('idle');
    setVideoError(null);
    setPhotoEditMode(false);
    setPhotoUrl('');
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Choreographer] as Record<string, any>),
          [child]: value
        }
      }));
    } else if (field === 'achievements') {
      // Handle achievements as array
      const achievements = typeof value === 'string' ? value.split('\n').filter(a => a.trim()) : value;
      setEditForm(prev => ({ ...prev, achievements }));
    } else if (field === 'featuredVideo') {
      // Clear video error when user changes the video URL
      setVideoError(null);
      setEditForm(prev => ({ ...prev, [field]: value as string }));
    } else {
      setEditForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    try {
      // Mock save - in real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the current user in context by switching to the updated user
      // This will trigger a re-render with the new data
      const updatedUser = { ...currentUser, ...editForm } as Choreographer;
      
      // Save to localStorage for persistence
      const userKey = `user-${currentUser?.id}`;
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
      
      // Update the user context
      switchUser(currentUser?.id || '');
      
      setSaveStatus('success');
      setEditMode(false);
      
      // Show success message briefly
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
    }
  };

  // Helper function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    return extractYouTubeVideoId(url);
  };

  // Helper function to get placeholder profile image
  const getPlaceholderImage = (): string => {
    return placeholderImage
  };

  const handleChangePhoto = () => {
    setPhotoEditMode(true);
    setPhotoUrl(editForm.profilePhoto || '');
  };

  const handleSavePhoto = () => {
    handleInputChange('profilePhoto', photoUrl);
    setPhotoEditMode(false);
  };

  const handleCancelPhotoEdit = () => {
    setPhotoEditMode(false);
    setPhotoUrl(editForm.profilePhoto || '');
  };

  // Handle iframe load error
  const handleVideoError = () => {
    setVideoError('Failed to load video. Please check the URL and try again.');
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const user = currentUser as Choreographer;
  const profileImage = (editMode ? editForm.profilePhoto : user.profilePhoto) || getPlaceholderImage();
  const youtubeVideoId = user.featuredVideo ? getYouTubeVideoId(user.featuredVideo) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and showcase your work
          </p>
        </div>
        {!editMode && (
          <Button onClick={handleEditProfile} variant="outline">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Photo Section */}
        <div className="lg:col-span-1">
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={profileImage} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            {editMode && !photoEditMode && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Button variant="secondary" size="sm" onClick={handleChangePhoto}>
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            )}
          </div>
          
          {/* Photo Edit Mode */}
          {photoEditMode && (
            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="photoUrl" className="text-sm font-medium">
                  Photo URL
                </Label>
                <Input
                  id="photoUrl"
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., https://example.com/photo.jpg)"
                />
              </div>
              
              {/* Preview */}
              {photoUrl && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="aspect-square w-24 rounded-lg overflow-hidden bg-muted border">
                    <img 
                      src={photoUrl} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'block';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSavePhoto} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Save Photo
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelPhotoEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name and Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {editMode ? (
                <div className="flex-1 space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-bold">{user.name}</h2>
              )}
            </div>

            <div className="flex items-center gap-4">
              {editMode ? (
                <div className="flex-1 space-y-2">
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input
                    id="pronouns"
                    value={editForm.pronouns || ''}
                    onChange={(e) => handleInputChange('pronouns', e.target.value)}
                    placeholder="she/her, he/him, they/them"
                  />
                </div>
              ) : (
                user.pronouns && (
                  <span className="text-muted-foreground">{user.pronouns}</span>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {user.role}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Bio</Label>
            {editMode ? (
              <Textarea
                value={editForm.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            ) : (
              <p className="text-muted-foreground">{user.bio || 'No bio added yet.'}</p>
            )}
          </div>

          {/* Teaching Style */}
          {user.role === 'choreographer' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Teaching Style</Label>
              {editMode ? (
                <Textarea
                  value={editForm.teachingStyle || ''}
                  onChange={(e) => handleInputChange('teachingStyle', e.target.value)}
                  placeholder="Describe your teaching approach..."
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground">{user.teachingStyle || 'No teaching style added yet.'}</p>
              )}
            </div>
          )}

          {/* Achievements */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Achievements</Label>
            {editMode ? (
              <Textarea
                value={editForm.achievements?.join('\n') || ''}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                placeholder="List your achievements (one per line)..."
                rows={4}
              />
            ) : (
              <div className="space-y-1">
                {user.achievements && user.achievements.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {user.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No achievements added yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Contact & Links */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Contact & Links</Label>
            <div className="space-y-3">
              {/* Website */}
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {editMode ? (
                  <Input
                    value={editForm.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="Your website URL"
                    className="flex-1"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    {user.website ? (
                      <>
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {user.website}
                        </a>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </>
                    ) : (
                      <span className="text-muted-foreground">No website added</span>
                    )}
                  </div>
                )}
              </div>

              {/* Social Links */}
              {editMode ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={editForm.socialLinks?.instagram || ''}
                      onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                      placeholder="@username"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Youtube className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={editForm.socialLinks?.youtube || ''}
                      onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                      placeholder="Channel name"
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {user.socialLinks?.instagram && (
                    <div className="flex items-center gap-3">
                      <Instagram className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`https://instagram.com/${user.socialLinks.instagram.replace('@', '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.socialLinks.instagram}
                      </a>
                    </div>
                  )}
                  {user.socialLinks?.youtube && (
                    <div className="flex items-center gap-3">
                      <Youtube className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`https://youtube.com/@${user.socialLinks.youtube}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.socialLinks.youtube}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Featured Video */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Featured Video</Label>
            {youtubeVideoId ? (
              <div className="space-y-2">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                  <iframe
                    src={generateYouTubeEmbedUrl(youtubeVideoId)}
                    title="Featured Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onError={handleVideoError}
                    onLoad={() => setVideoError(null)}
                  />
                </div>
                {videoError && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-yellow-800 text-sm">{videoError}</p>
                  </div>
                )}
                {editMode && (
                  <div className="space-y-2">
                    <Input
                      value={editForm.featuredVideo || ''}
                      onChange={(e) => handleInputChange('featuredVideo', e.target.value)}
                      placeholder="YouTube video URL (e.g., https://youtube.com/watch?v=...)"
                      className="mt-2"
                    />
                    {editForm.featuredVideo && (
                      <div className="text-xs text-muted-foreground">
                        {(() => {
                          const validation = validateYouTubeUrl(editForm.featuredVideo);
                          return validation.isValid 
                            ? '✅ Valid YouTube URL' 
                            : `❌ ${validation.error}`;
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No featured video added</p>
                  {editMode && (
                    <div className="space-y-2">
                      <Input
                        value={editForm.featuredVideo || ''}
                        onChange={(e) => handleInputChange('featuredVideo', e.target.value)}
                        placeholder="YouTube video URL (e.g., https://youtube.com/watch?v=...)"
                        className="mt-2"
                      />
                      {editForm.featuredVideo && (
                        <div className="text-xs text-muted-foreground">
                          {(() => {
                            const validation = validateYouTubeUrl(editForm.featuredVideo);
                            return validation.isValid 
                              ? '✅ Valid YouTube URL' 
                              : `❌ ${validation.error}`;
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Edit Mode Actions */}
          {editMode && (
            <div className="flex items-center gap-3 pt-4">
              <Button 
                onClick={handleSaveProfile} 
                disabled={saveStatus === 'saving'}
                className="flex-1"
              >
                {saveStatus === 'saving' ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
                disabled={saveStatus === 'saving'}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          {/* Save Status Messages */}
          {saveStatus === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">Profile saved successfully!</p>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">Failed to save profile. Please try again.</p>
            </div>
          )}
        </div>
      </div>

      {/* My Classes Section */}
      {userClasses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">My Classes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userClasses.map((danceClass) => (
              <div key={danceClass.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{danceClass.title}</h4>
                <p className="text-sm text-muted-foreground">{danceClass.style.join(', ')}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(danceClass.dateTime).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 