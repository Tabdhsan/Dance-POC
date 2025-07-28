// RoleToggle component for switching between user and choreographer roles
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRound, Sparkles } from 'lucide-react';
import { useUserState } from '@/hooks/useUserState';
import { cn } from '@/lib/utils';

export const RoleToggle: React.FC = () => {
  const { currentUser, toggleRole, isChoreographer } = useUserState();

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleRole}
        variant="outline"
        size="sm"
        className={cn(
          "relative overflow-hidden transition-all duration-300 border-2",
          isChoreographer() 
            ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 shadow-accent/20" 
            : "border-border hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
        )}
      >
        <div className="flex items-center gap-2">
          {isChoreographer() ? (
            <Sparkles className="h-4 w-4" />
          ) : (
            <UserRound className="h-4 w-4" />
          )}
          <span className="font-medium">
            {isChoreographer() ? 'Choreographer' : 'Student'}
          </span>
        </div>
        
        {/* Subtle glow effect for choreographer mode */}
        {isChoreographer() && (
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 animate-pulse" />
        )}
      </Button>
    </div>
  );
};