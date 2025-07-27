// My Classes Manager component for choreographer class management
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Edit, 
  Calendar, 
  MapPin, 
  Clock,
  DollarSign,
  Star,
  X
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useClasses } from '@/contexts/ClassContext';
import { AddClassModal } from './AddClassModal';
import { EditClassModal } from './EditClassModal';
import { ConfirmModal } from './ConfirmModal';
import type { DanceClass } from '@/types';

export const MyClassesManager: React.FC = () => {
  const { state: userState } = useUser();
  const { state: classState, addClass, updateClass, deleteClass, updateClassStatus } = useClasses();
  const { currentUser } = userState;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState<DanceClass | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedClassForAction, setSelectedClassForAction] = useState<DanceClass | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter classes to show only those created by current user
  const myClasses = useMemo(() => {
    if (!currentUser) return [];
    
    return classState.classes.filter(cls => 
      cls.choreographerId === currentUser.id
    ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [classState.classes, currentUser]);

  // Format date and time for display
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { dateStr, timeStr };
  };

  // Get status badge styling
  const getStatusBadge = (status: DanceClass['status']) => {
    switch (status) {
      case 'featured':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Handle add new class
  const handleAddNewClass = () => {
    setIsAddModalOpen(true);
  };

  const handleClassAdded = (newClass: DanceClass) => {
    addClass(newClass);
  };

  const handleClassUpdated = (updatedClass: DanceClass) => {
    updateClass(updatedClass);
  };

  const handleEditClass = (classId: string) => {
    const classToEdit = myClasses.find(cls => cls.id === classId);
    if (classToEdit) {
      setSelectedClassForEdit(classToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleCancelClass = (classId: string) => {
    const classToCancel = myClasses.find(cls => cls.id === classId);
    if (classToCancel) {
      setSelectedClassForAction(classToCancel);
      setIsCancelModalOpen(true);
    }
  };

  const handleDeleteClass = (classId: string) => {
    const classToDelete = myClasses.find(cls => cls.id === classId);
    if (classToDelete) {
      setSelectedClassForAction(classToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedClassForAction) return;
    
    setIsLoading(true);
    try {
      deleteClass(selectedClassForAction.id);
      setIsDeleteModalOpen(false);
      setSelectedClassForAction(null);
    } catch (error) {
      console.error('Error deleting class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedClassForAction) return;
    
    setIsLoading(true);
    try {
      updateClassStatus(selectedClassForAction.id, 'cancelled');
      setIsCancelModalOpen(false);
      setSelectedClassForAction(null);
    } catch (error) {
      console.error('Error cancelling class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForFeature = (classId: string) => {
    const classToToggle = myClasses.find(cls => cls.id === classId);
    if (classToToggle) {
      const newStatus = "submitted";
      updateClassStatus(classId, newStatus);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-muted-foreground">Please log in to view your classes.</p>
      </div>
    );
  }

  // Check if user is a choreographer
  if (currentUser.role !== 'choreographer' && currentUser.role !== 'both') {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <p className="text-muted-foreground text-center">
          This page is only available for choreographers.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Switch to choreographer role to manage your classes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add New Class button */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Classes</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your upcoming dance classes
            </p>
          </div>
          <Button 
            onClick={handleAddNewClass}
            className="flex items-center space-x-2 min-h-[44px] touch-manipulation w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Class</span>
          </Button>
        </div>
      </div>

      {/* Classes List */}
      {myClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-64 space-y-4 border-2 border-dashed border-border rounded-lg">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-foreground">No classes yet</h3>
            <p className="text-muted-foreground">
              Create your first class to start teaching!
            </p>
            <Button 
              onClick={handleAddNewClass}
              className="mt-4 min-h-[44px] touch-manipulation"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Class
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {myClasses.map((danceClass) => {
            const { dateStr, timeStr } = formatDateTime(danceClass.dateTime);
            
            return (
              <div
                key={danceClass.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Class Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {danceClass.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {danceClass.style.map((style) => (
                            <span
                              key={style}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                              {style}
                            </span>
                          ))}
                          {danceClass.status !== 'active' && (
                             <span
                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(danceClass.status)}`}
                           >
                             {danceClass.status.charAt(0).toUpperCase() + danceClass.status.slice(1)}
                           </span>
                          )}
                         
                        </div>
                      </div>
                    </div>

                    {/* Class Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{timeStr}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{danceClass.location}</span>
                      </div>
                      {danceClass.price && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>${danceClass.price}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {danceClass.description}
                    </p>
                  </div>

                  {/* Management Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[120px] w-full sm:w-[12rem]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClass(danceClass.id)}
                      className="flex items-center space-x-1 flex-1 lg:flex-none min-h-[44px] touch-manipulation"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    
                    {/* Featured Toggle */}
                    {danceClass.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubmitForFeature(danceClass.id)}
                        className="text-green-700 hover:text-green-900 hover:bg-green-50 flex items-center space-x-1 flex-1 lg:flex-none min-h-[44px] touch-manipulation"
                      >
                        <Star className="h-4 w-4" />
                        <span>Submit for Featured</span>
                      </Button>
                    )}
                    
                    {/* Cancel Button */}
                    {danceClass.status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelClass(danceClass.id)}
                        className="flex items-center space-x-1 flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] touch-manipulation"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                    )}
                    
                    {/* Delete Button */}
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClass(danceClass.id)}
                      className="flex items-center space-x-1 flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] touch-manipulation"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Class Modal */}
      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClassAdded={handleClassAdded}
      />

      {/* Edit Class Modal */}
      <EditClassModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClassForEdit(null);
        }}
        onClassUpdated={handleClassUpdated}
        danceClass={selectedClassForEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClassForAction(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Class"
        message={`Are you sure you want to delete "${selectedClassForAction?.title}"? This action cannot be undone.`}
        confirmText="Delete Class"
        variant="delete"
        isLoading={isLoading}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedClassForAction(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Class"
        message={`Are you sure you want to cancel "${selectedClassForAction?.title}"? This will mark the class as cancelled and notify any interested students.`}
        confirmText="Cancel Class"
        variant="cancel"
        isLoading={isLoading}
      />
    </div>
  );
};