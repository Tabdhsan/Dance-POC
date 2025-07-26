// Main layout component with responsive navigation
import React from 'react';
import { NavigationBar } from './NavigationBar';
import { PageContainer } from './PageContainer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <PageContainer>
        {children}
      </PageContainer>
    </div>
  );
};