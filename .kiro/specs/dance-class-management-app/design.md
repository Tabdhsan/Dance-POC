# Design Document

## Overview

The dance class management POC is a TypeScript React application that provides a comprehensive platform for dancers and choreographers to interact with dance class offerings. The application uses ShadCN for consistent UI components, localStorage for client-side persistence, and mock JSON data to simulate a backend. The design emphasizes mobile-first responsive design and role-based user experiences.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
├─────────────────────────────────────────────────────────────┤
│  Components Layer (ShadCN + Custom Components)             │
├─────────────────────────────────────────────────────────────┤
│  Pages Layer (React Router)                                │
├─────────────────────────────────────────────────────────────┤
│  State Management (React Context + localStorage)           │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (Mock JSON + localStorage)                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Details

- **Frontend Framework**: React 18+ with TypeScript
- **UI Components**: ShadCN/UI for consistent design system
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS (included with ShadCN)
- **State Management**: React Context API + localStorage
- **Data Storage**: localStorage + static JSON files
- **Build Tool**: Vite (recommended for TypeScript + React)

## Components and Interfaces

### Core Components

#### Navigation Components
- `NavigationBar`: Top navigation with role-based menu items
- `RoleToggle`: Dropdown for switching between dancer/choreographer roles
- `UserProfile`: Profile icon and user context display

#### Class Components
- `ClassCard`: Reusable card component for displaying class information
- `ClassList`: Container for multiple class cards with filtering
- `ClassDetailModal`: Modal for detailed class information
- `ClassCalendar`: Calendar view for class scheduling
- `InterestButton`: Toggle button for interested/attending status

#### User Components
- `ChoreographerProfile`: Public profile display for choreographers
- `UserDashboard`: Personalized dashboard with tracked classes
- `MyClassesManager`: Choreographer's class management interface

#### Layout Components
- `Layout`: Main application layout wrapper
- `PageContainer`: Consistent page container with responsive design
- `FilterPanel`: Filtering interface for classes

### TypeScript Interfaces

```typescript
interface User {
  id: string;
  name: string;
  role: 'dancer' | 'choreographer' | 'both';
  pronouns?: string;
  bio?: string;
  profilePhoto?: string;
  website?: string;
  socialLinks?: SocialLinks;
}

interface DanceClass {
  id: string;
  title: string;
  choreographerId: string;
  choreographerName: string;
  style: string[];
  dateTime: string;
  location: string;
  description: string;
  price?: number;
  rsvpLink?: string;
  flyer?: string;
  status: 'active' | 'cancelled' | 'featured';
}

interface UserPreferences {
  interestedClasses: string[];
  attendingClasses: string[];
  favoritedChoreographers: string[];
}

interface AppState {
  currentUser: User;
  userPreferences: UserPreferences;
  classes: DanceClass[];
  choreographers: User[];
}
```

## Data Models

### Mock Data Structure

#### classes.json
```json
{
  "classes": [
    {
      "id": "class-001",
      "title": "Contemporary Flow",
      "choreographerId": "choreo-001",
      "choreographerName": "Alex Rivera",
      "style": ["Contemporary", "Modern"],
      "dateTime": "2025-01-28T19:00:00Z",
      "location": "Studio A - Downtown Dance Center",
      "description": "An expressive contemporary class focusing on fluid movement and emotional storytelling.",
      "price": 25,
      "status": "featured"
    }
  ]
}
```

#### users.json
```json
{
  "users": [
    {
      "id": "user-001",
      "name": "Sam Chen",
      "role": "dancer",
      "pronouns": "they/them"
    },
    {
      "id": "choreo-001", 
      "name": "Alex Rivera",
      "role": "choreographer",
      "pronouns": "she/her",
      "bio": "Contemporary dance artist with 10+ years of experience...",
      "profilePhoto": "/images/alex-rivera.jpg",
      "website": "https://alexrivera.dance"
    }
  ]
}
```

### localStorage Schema

```typescript
// Key: 'dance-app-user-preferences'
{
  currentUserId: string;
  interestedClasses: string[];
  attendingClasses: string[];
  favoritedChoreographers: string[];
}

// Key: 'dance-app-settings'
{
  preferredView: 'list' | 'calendar';
  filters: {
    styles: string[];
    choreographers: string[];
    studios: string[];
  };
}
```

## Error Handling

### Error Boundaries
- Implement React Error Boundaries for graceful error handling
- Fallback UI components for when data fails to load
- Toast notifications for user actions (using ShadCN Toast component)

### Data Validation
- TypeScript interfaces for compile-time type checking
- Runtime validation for localStorage data
- Graceful degradation when mock data is unavailable

### User Experience Errors
- Loading states for all async operations
- Empty states when no classes match filters
- Network-like delays for realistic POC experience

## Testing Strategy

### Component Testing
- Unit tests for individual components using React Testing Library
- Mock localStorage and JSON data for consistent testing
- Test role-based rendering and user interactions

### Integration Testing
- Test complete user workflows (browse → interested → attending)
- Test role switching and navigation flows
- Test responsive design across different viewport sizes

### User Acceptance Testing
- Manual testing scenarios for each user story
- Cross-browser compatibility testing
- Mobile device testing on actual devices

## Responsive Design Strategy

### Mobile-First Approach
- Design components for mobile screens first (320px+)
- Progressive enhancement for tablet (768px+) and desktop (1024px+)
- Touch-friendly interface elements (minimum 44px touch targets)

### Breakpoint Strategy
```css
/* Mobile: 320px - 767px (default) */
/* Tablet: 768px - 1023px */
/* Desktop: 1024px+ */
```

### Component Responsiveness
- Navigation: Hamburger menu on mobile, full nav on desktop
- Class cards: Single column on mobile, grid layout on larger screens
- Calendar: Simplified mobile view, full calendar on desktop
- Modals: Full-screen on mobile, centered overlay on desktop

## State Management Architecture

### Context Providers
- `UserContext`: Current user and role management
- `ClassContext`: Class data and filtering state
- `PreferencesContext`: User preferences and localStorage sync

### State Flow
1. App initialization loads mock data and localStorage preferences
2. User actions update context state
3. Context changes trigger localStorage updates
4. Components subscribe to relevant context for reactive updates

## Deployment Considerations

### Build Optimization
- Vite build optimization for production
- Code splitting for better performance
- Asset optimization for mobile networks

### Static Hosting
- Designed for deployment on Vercel/Netlify
- All data is client-side (no server requirements)
- Environment-based configuration for demo vs development