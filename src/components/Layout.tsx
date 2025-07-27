// Main layout component with responsive navigation
import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-[4rem] lg:pl-72">
				<main className="p-4 sm:p-6 lg:p-8">{children}</main>
			</div>
    </div>
  );
};