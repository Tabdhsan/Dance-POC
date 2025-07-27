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
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // // Toggle mobile menu
  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  // // Close mobile menu
  // const closeMobileMenu = () => {
  //   setIsMobileMenuOpen(false);
  // };

  return (
    <>
    <header className="fixed top-0 z-40 flex h-16 w-full items-center border-b border-gray-200 bg-white px-4 sm:px-6">
				<div className="flex w-full items-center justify-between">
					{/* Left side */}
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="lg:hidden"
						>
							<Menu className="size-5" />
						</Button>

						<div className="flex items-center space-x-4">
             <Link 
               to="/dashboard" 
               className="text-xl font-bold text-foreground hover:text-primary transition-colors"
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
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-32 truncate">{currentUser?.name || 'User'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center space-x-2">
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
				className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out ${
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 sm:hidden">
            <Link
                  key={'/profile'}
                  to={'/profile'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath('/profile')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              <Link
                  key={'/settings'}
                  to={'/settings'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath('/settings')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
					className="fixed inset-0 z-20 bg-gray-950/50 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}
    </>

  )

  // return (
  //   <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  //     <div className="container mx-auto px-4">
  //       <div className="flex h-16 items-center justify-between">
  //         {/* Logo/Brand */}
  //         <div className="flex items-center space-x-4">
  //           <Link 
  //             to="/dashboard" 
  //             className="text-xl font-bold text-foreground hover:text-primary transition-colors"
  //             onClick={closeMobileMenu}
  //           >
  //             DanceApp
  //           </Link>
  //         </div>

  //         {/* Desktop Navigation */}
  //         {/* <div className="hidden md:flex items-center space-x-6">
  //           {navigationItems.map((item) => {
  //             const Icon = item.icon;
  //             return (
  //               <Link
  //                 key={item.path}
  //                 to={item.path}
  //                 className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
  //                   isActivePath(item.path)
  //                     ? 'bg-primary text-primary-foreground'
  //                     : 'text-muted-foreground hover:text-foreground hover:bg-accent'
  //                 }`}
  //               >
  //                 <Icon className="h-4 w-4" />
  //                 <span>{item.label}</span>
  //               </Link>
  //             );
  //           })}
  //         </div> */}

  //         {/* Desktop Right Side */}
  //         <div className="hidden md:flex items-center space-x-4">
  //           {/* Role Toggle */}
  //           <RoleToggle />
            
  //           {/* Profile Dropdown */}
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" size="sm" className="flex items-center space-x-2">
  //                 <User className="h-4 w-4" />
  //                 <span className="max-w-32 truncate">{currentUser?.name || 'User'}</span>
  //                 <ChevronDown className="h-3 w-3" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end" className="w-48">
  //               <DropdownMenuItem asChild>
  //                 <Link to="/profile" className="flex items-center space-x-2">
  //                   <User className="h-4 w-4" />
  //                   <span>My Profile</span>
  //                 </Link>
  //               </DropdownMenuItem>
  //               <DropdownMenuItem asChild>
  //                 <Link to="/settings" className="flex items-center space-x-2">
  //                   <Settings className="h-4 w-4" />
  //                   <span>Settings</span>
  //                 </Link>
  //               </DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </div>

  //         {/* Mobile Menu Button */}
  //         <div className="md:hidden">
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             onClick={toggleMobileMenu}
  //             className="h-11 w-11 p-0 touch-manipulation"
  //             aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  //           >
  //             {isMobileMenuOpen ? (
  //               <X className="h-6 w-6" />
  //             ) : (
  //               <Menu className="h-6 w-6" />
  //             )}
  //           </Button>
  //         </div>
  //       </div>

  //       {/* Mobile Navigation Menu */}
  //       {isMobileMenuOpen && (
  //         <div className="md:hidden border-t border-border">
  //           <div className="px-2 pt-2 pb-3 space-y-1">
  //             {/* {navigationItems.map((item) => {
  //               const Icon = item.icon;
  //               return (
  //                 <Link
  //                   key={item.path}
  //                   to={item.path}
  //                   onClick={closeMobileMenu}
  //                   className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors touch-manipulation min-h-[44px] ${
  //                     isActivePath(item.path)
  //                       ? 'bg-primary text-primary-foreground'
  //                       : 'text-muted-foreground hover:text-foreground hover:bg-accent'
  //                   }`}
  //                 >
  //                   <Icon className="h-5 w-5" />
  //                   <span>{item.label}</span>
  //                 </Link>
  //               );
  //             })} */}
              
  //             {/* Mobile Role Toggle */}
  //             <div className="px-4 py-3">
  //               <RoleToggle />
  //             </div>
              
  //             {/* Mobile Profile Links */}
  //             <div className="border-t border-border pt-2 mt-2">
  //               <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
  //                 {currentUser?.name || 'User'} ({currentUser?.role || 'unknown'})
  //               </div>
                
  //               <Link
  //                 to="/profile"
  //                 onClick={closeMobileMenu}
  //                 className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors touch-manipulation min-h-[44px]"
  //               >
  //                 <User className="h-5 w-5" />
  //                 <span>My Profile</span>
  //               </Link>
                
  //               <Link
  //                 to="/settings"
  //                 onClick={closeMobileMenu}
  //                 className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors touch-manipulation min-h-[44px]"
  //               >
  //                 <Settings className="h-5 w-5" />
  //                 <span>Settings</span>
  //               </Link>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </nav>
  // );
};