// InterestButton component for toggling interested/attending status
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterestButtonProps {
  classId: string;
  type: 'interested' | 'attending';
  isActive: boolean;
  onToggle: (classId: string) => void;
  variant?: 'default' | 'compact';
  disabled?: boolean;
}

export const InterestButton: React.FC<InterestButtonProps> = ({
  classId,
  type,
  isActive,
  onToggle,
  variant = 'default',
  disabled = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onToggle(classId);
    }
  };

  const getButtonConfig = () => {
    if (type === 'interested') {
      return {
        icon: Heart,
        activeColor: 'text-red-500 hover:text-red-600',
        label: isActive ? 'Remove from interested' : 'Mark as interested',
        text: isActive ? 'Interested' : 'Interest'
      };
    } else {
      return {
        icon: UserCheck,
        activeColor: 'text-green-500 hover:text-green-600',
        label: isActive ? 'Remove from attending' : 'Mark as attending',
        text: isActive ? 'Attending' : 'Attend'
      };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          isActive && config.activeColor,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleClick}
        title={config.label}
        disabled={disabled}
      >
        <Icon className={cn("h-4 w-4", isActive && "fill-current")} />
      </Button>
    );
  }

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={cn(
        "flex items-center gap-2",
        isActive && type === 'interested' && "bg-red-500 hover:bg-red-600 text-white",
        isActive && type === 'attending' && "bg-green-500 hover:bg-green-600 text-white",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      <Icon className={cn("h-4 w-4", isActive && "fill-current")} />
      <span className="hidden sm:inline">{config.text}</span>
    </Button>
  );
};