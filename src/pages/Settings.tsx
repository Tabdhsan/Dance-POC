// Settings page component
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePreferences } from '@/contexts/PreferencesContext';
import { clearAllUserData } from '@/utils/localStorage';

export const Settings: React.FC = () => {
  const { clearAllData } = usePreferences();

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This will reset the demo and log you in as the default choreographer.')) {
      // Clear all localStorage data
      clearAllUserData();
      
      // Also clear any other localStorage keys that might be used
      const keysToRemove = [
        'dance-app-user-preferences',
        'dance-app-settings', 
        'dance-app-current-user-id',
        // Add any other keys that might be used by the app
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Reload the page to reset everything
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Demo Settings</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Reset Demo Data</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Clear all preferences and reset to default state for a clean demo experience. This will log you in as the default choreographer.
              </p>
              <Button variant="destructive" onClick={handleClearData}>
                Clear All Data
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
          <p className="text-muted-foreground">
            Additional settings will be available in future updates.
          </p>
        </div>
      </div>
    </div>
  );
};