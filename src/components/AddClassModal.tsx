// AddClassModal component for creating new dance classes
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  X, 
  DollarSign, 
  Link,
  Image,
  Plus
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import type { DanceClass } from '@/types';
import { cn } from '@/lib/utils';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassAdded: (newClass: DanceClass) => void;
}

// Common dance styles for selection
const DANCE_STYLES = [
  'Hip Hop', 'Contemporary', 'Jazz', 'Ballet', 'Tap', 'Lyrical',
  'Modern', 'Street Jazz', 'Breaking', 'Popping', 'Locking',
  'House', 'Waacking', 'Vogue', 'Afro', 'Latin', 'Salsa',
  'Bachata', 'K-Pop', 'Heels', 'Commercial', 'Musical Theatre'
];

export const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  onClose,
  onClassAdded
}) => {
  const { state: userState } = useUser();
  const { currentUser } = userState;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    style: [] as string[],
    dateTime: '',
    location: '',
    description: '',
    price: '',
    videoLink: '',
    rsvpLink: '',
    flyer: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        style: [],
        dateTime: '',
        location: '',
        description: '',
        price: '',
        videoLink: '',
        rsvpLink: '',
        flyer: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle style selection
  const handleStyleToggle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter(s => s !== style)
        : [...prev.style, style]
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Class title is required';
    }

    if (formData.style.length === 0) {
      newErrors.style = 'Please select at least one dance style';
    }

    if (!formData.dateTime) {
      newErrors.dateTime = 'Date and time is required';
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.dateTime = 'Class must be scheduled for a future date and time';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new class object
      const newClass: DanceClass = {
        id: `class-${Date.now()}`, // Simple ID generation for POC
        title: formData.title.trim(),
        choreographerId: currentUser?.id || '',
        choreographerName: currentUser?.name || '',
        style: formData.style,
        dateTime: formData.dateTime,
        location: formData.location.trim(),
        description: formData.description.trim(),
        price: formData.price ? Number(formData.price) : undefined,
        videoLink: formData.videoLink.trim() || undefined,
        rsvpLink: formData.rsvpLink.trim() || undefined,
        flyer: formData.flyer.trim() || undefined,
        status: 'active'
      };

      // Add to class context
      onClassAdded(newClass);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error creating class:', error);
      setErrors({ submit: 'Failed to create class. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">
            Add New Class
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Class Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter class title"
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Dance Styles */}
          <div className="space-y-2">
            <Label>Dance Styles *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DANCE_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleStyleToggle(style)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md border transition-colors",
                    formData.style.includes(style)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-accent"
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
            {errors.style && (
              <p className="text-sm text-destructive">{errors.style}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="dateTime">Date & Time *</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => handleInputChange('dateTime', e.target.value)}
              className={cn(errors.dateTime && "border-destructive")}
            />
            {errors.dateTime && (
              <p className="text-sm text-destructive">{errors.dateTime}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter class location"
              className={cn(errors.location && "border-destructive")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (optional)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your class..."
              rows={4}
              className={cn(errors.description && "border-destructive")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Optional Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="videoLink">Video Link (optional)</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="videoLink"
                  type="url"
                  value={formData.videoLink}
                  onChange={(e) => handleInputChange('videoLink', e.target.value)}
                  placeholder="https://..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsvpLink">RSVP Link (optional)</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="rsvpLink"
                  type="url"
                  value={formData.rsvpLink}
                  onChange={(e) => handleInputChange('rsvpLink', e.target.value)}
                  placeholder="https://..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Flyer Image */}
          <div className="space-y-2">
            <Label htmlFor="flyer">Flyer Image URL (optional)</Label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="flyer"
                type="url"
                value={formData.flyer}
                onChange={(e) => handleInputChange('flyer', e.target.value)}
                placeholder="https://..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 min-h-[44px] touch-manipulation"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Class
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 min-h-[44px] touch-manipulation"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 