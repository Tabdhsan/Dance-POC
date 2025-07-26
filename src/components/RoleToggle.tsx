// Role toggle dropdown component for switching between dancer/choreographer
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Users } from 'lucide-react';
import { useUserState } from '@/hooks/useUserState';
import type { UserRole } from '@/types';

export const RoleToggle: React.FC = () => {
  const { currentUser, switchRole } = useUserState();

  // Handle role switch
  const handleRoleSwitch = (role: UserRole) => {
    if (currentUser && currentUser.role !== role) {
      switchRole(role);
    }
  };

  // Get role display info
  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'dancer':
        return { label: 'Dancer', icon: User };
      case 'choreographer':
        return { label: 'Choreographer', icon: Users };
      case 'both':
        return { label: 'Both', icon: Users };
      default:
        return { label: 'Unknown', icon: User };
    }
  };

  const currentRoleInfo = getRoleInfo(currentUser?.role || 'dancer');
  const CurrentRoleIcon = currentRoleInfo.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <CurrentRoleIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentRoleInfo.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => handleRoleSwitch('dancer')}
          className={`flex items-center space-x-2 ${
            currentUser?.role === 'dancer' ? 'bg-accent' : ''
          }`}
        >
          <User className="h-4 w-4" />
          <span>Dancer</span>
          {currentUser?.role === 'dancer' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleRoleSwitch('choreographer')}
          className={`flex items-center space-x-2 ${
            currentUser?.role === 'choreographer' ? 'bg-accent' : ''
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Choreographer</span>
          {currentUser?.role === 'choreographer' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleRoleSwitch('both')}
          className={`flex items-center space-x-2 ${
            currentUser?.role === 'both' ? 'bg-accent' : ''
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Both</span>
          {currentUser?.role === 'both' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};