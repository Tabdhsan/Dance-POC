// ConfirmModal component for delete and cancel confirmations
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  X, 
  AlertTriangle,
  Trash2,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  variant?: 'delete' | 'cancel' | 'warning';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false
}) => {
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'delete':
        return {
          icon: Trash2,
          iconColor: 'text-destructive',
          confirmButton: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          confirmText: 'Delete'
        };
      case 'cancel':
        return {
          icon: Ban,
          iconColor: 'text-orange-600',
          confirmButton: 'bg-orange-600 text-white hover:bg-orange-700',
          confirmText: 'Cancel Class'
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 text-white hover:bg-yellow-700',
          confirmText: 'Confirm'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-none sm:rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className={cn("h-5 w-5", styles.iconColor)} />
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 shrink-0"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6">
          <p className="text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-6 py-4 border-t bg-muted/30">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 min-h-[44px] touch-manipulation",
              styles.confirmButton
            )}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Processing...
              </>
            ) : (
              <>
                <IconComponent className="h-4 w-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 min-h-[44px] touch-manipulation"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 