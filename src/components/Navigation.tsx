// Navigation bar with role-based menu items
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Home, 
  Calendar, 
  BookOpen, 
  User, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { useUserState } from '@/hooks/useUserState';

import { RoleToggle } from './RoleToggle';

export const Navigation: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {currentUser, isChoreographer } = useUserState();
  const location = useLocation();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/schedule', label: 'Schedule', icon: Calendar },
    ];

    // Add "My Classes" for choreographers
    if (isChoreographer()) {
      baseItems.push({ path: '/my-classes', label: 'My Classes', icon: BookOpen });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  // Check if current path is active
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
    <header className="fixed top-0 z-40 flex h-16 w-full items-center border-b border-border bg-card/95 backdrop-blur-sm px-4 sm:px-6 shadow-sm">
				<div className="flex w-full items-center justify-between">
					{/* Left side */}
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="lg:hidden hover:bg-accent/10 hover:text-accent"
						>
							<Menu className="size-5" />
						</Button>

						<div className="flex items-center space-x-4">
             <Link 
               to="/dashboard" 
               className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300"
               onClick={() => setIsSidebarOpen(false)}
             >
               DanceApp
             </Link>
           </div>
					</div>

					{/* Right side */}
					<div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center space-x-4">
              {/* Role Toggle */}
              <RoleToggle />
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20">
                    <User className="h-4 w-4" />
                    <span className="max-w-32 truncate">{currentUser?.name || 'User'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 shadow-accent">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2 hover:bg-accent/10 hover:text-accent">
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center space-x-2 hover:bg-accent/10 hover:text-accent">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
					</div>
				</div>
			</header>

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 transform border-r border-border bg-card/95 backdrop-blur-sm transition-transform duration-300 ease-in-out shadow-lg ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0`}
			>
				<nav className="flex h-full flex-col p-4">
					<div className="flex-1 space-y-1">
          {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift ${
                    isActivePath(item.path)
                      ? 'bg-accent text-accent-foreground shadow-accent/20 shadow-md border border-accent/20'
                      : 'text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 sm:hidden border-t border-border pt-4 mt-4">
            <Link
                  key={'/profile'}
                  to={'/profile'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift ${
                    isActivePath('/profile')
                      ? 'bg-accent text-accent-foreground shadow-accent/20 shadow-md border border-accent/20'
                      : 'text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              <Link
                  key={'/settings'}
                  to={'/settings'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift ${
                    isActivePath('/settings')
                      ? 'bg-accent text-accent-foreground shadow-accent/20 shadow-md border border-accent/20'
                      : 'text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
              </Link>
            </div>
					</div>
				</nav>
			</aside>

			{/* Sidebar Overlay */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-20 bg-primary/20 backdrop-blur-sm lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}
    </>
  );
};