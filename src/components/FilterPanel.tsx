// FilterPanel component for filtering classes
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  MapPin,
  User
} from 'lucide-react';
import { useClasses } from '@/contexts/ClassContext';
import { useAppSettings } from '@/hooks/useUserState';
import type { FilterOptions } from '@/types';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  onFiltersChange?: (filters: FilterOptions, search: string) => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFiltersChange,
  className
}) => {
  const { state: classState, clearFilters } = useClasses();
  const { filters: savedFilters, updateFilters } = useAppSettings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [localFilters, setLocalFilters] = useState<FilterOptions>({
    styles: savedFilters.styles || [],
    choreographers: savedFilters.choreographers || [],
    studios: savedFilters.studios || [],
    dateRange: savedFilters.dateRange ? {
      start: new Date(savedFilters.dateRange.start),
      end: new Date(savedFilters.dateRange.end)
    } : undefined
  });

  // Get unique values for filter options
  const getFilterOptions = () => {
    const styles = new Set<string>();
    const choreographers = new Set<string>();
    const studios = new Set<string>();

    classState.classes.forEach(cls => {
      cls.style.forEach(style => styles.add(style));
      choreographers.add(cls.choreographerName);
      // Extract studio name from location
      const studio = cls.location.split(' - ')[1] || cls.location;
      studios.add(studio);
    });

    return {
      styles: Array.from(styles).sort(),
      choreographers: Array.from(choreographers).sort(),
      studios: Array.from(studios).sort()
    };
  };

  const filterOptions = getFilterOptions();

  // Update filters when they change
  useEffect(() => {
    onFiltersChange?.(localFilters, searchQuery);
  }, [localFilters, searchQuery]); // Removed onFiltersChange from dependencies

  // Update storage when filters change
  useEffect(() => {
    // Convert dates to strings for storage
    const filtersForStorage = {
      ...localFilters,
      dateRange: localFilters.dateRange ? {
        start: localFilters.dateRange.start.toISOString(),
        end: localFilters.dateRange.end.toISOString()
      } : undefined
    };
    updateFilters(filtersForStorage);
  }, [localFilters]); // Removed updateFilters from dependencies

  // Handle style filter toggle
  const handleStyleToggle = (style: string) => {
    setLocalFilters(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };

  // Handle choreographer filter toggle
  const handleChoreographerToggle = (choreographer: string) => {
    setLocalFilters(prev => ({
      ...prev,
      choreographers: prev.choreographers.includes(choreographer)
        ? prev.choreographers.filter(c => c !== choreographer)
        : [...prev.choreographers, choreographer]
    }));
  };

  // Handle studio filter toggle
  const handleStudioToggle = (studio: string) => {
    setLocalFilters(prev => ({
      ...prev,
      studios: prev.studios.includes(studio)
        ? prev.studios.filter(s => s !== studio)
        : [...prev.studios, studio]
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setLocalFilters({
      styles: [],
      choreographers: [],
      studios: []
    });
    setSearchQuery('');
    clearFilters();
  };

  // Check if any filters are active
  const hasActiveFilters = localFilters.styles.length > 0 || 
                          localFilters.choreographers.length > 0 || 
                          localFilters.studios.length > 0 || 
                          searchQuery.trim().length > 0;

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-card rounded-lg border", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search classes, choreographers, or styles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[44px] touch-manipulation"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground touch-manipulation"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {/* Style Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 min-h-[44px] touch-manipulation">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Styles</span>
              <span className="sm:hidden">Style</span>
              {localFilters.styles.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {localFilters.styles.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Dance Styles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.styles.map((style) => (
              <DropdownMenuCheckboxItem
                key={style}
                checked={localFilters.styles.includes(style)}
                onCheckedChange={() => handleStyleToggle(style)}
              >
                {style}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Choreographer Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 min-h-[44px] touch-manipulation">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Choreographers</span>
              <span className="sm:hidden">Artists</span>
              {localFilters.choreographers.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {localFilters.choreographers.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Choreographers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.choreographers.map((choreographer) => (
              <DropdownMenuCheckboxItem
                key={choreographer}
                checked={localFilters.choreographers.includes(choreographer)}
                onCheckedChange={() => handleChoreographerToggle(choreographer)}
              >
                {choreographer}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Studio Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 min-h-[44px] touch-manipulation">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Studios</span>
              <span className="sm:hidden">Studio</span>
              {localFilters.studios.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {localFilters.studios.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Studios</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.studios.map((studio) => (
              <DropdownMenuCheckboxItem
                key={studio}
                checked={localFilters.studios.includes(studio)}
                onCheckedChange={() => handleStudioToggle(studio)}
              >
                {studio}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground min-h-[44px] touch-manipulation"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};