// My Classes page for choreographers
import React from 'react';
import { PageContainer } from '@/components/PageContainer';
import { MyClassesManager } from '@/components/MyClassesManager';

export const MyClasses: React.FC = () => {
  return (
    <PageContainer>
      <MyClassesManager />
    </PageContainer>
  );
};