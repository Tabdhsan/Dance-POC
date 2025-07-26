# Requirements Document

## Introduction

This document outlines the requirements for a dance class management POC application that serves both dancers and choreographers. The application will allow dancers to discover, track, and manage their interest in dance classes, while enabling choreographers to showcase their profiles and manage their class offerings. 

**Technology Stack:**
- Frontend: TypeScript + React
- UI Components: ShadCN
- Data Persistence: localStorage + mock JSON files
- No backend required (POC application)

The system will use mock data and localStorage for persistence, focusing on demonstrating core user workflows and interactions with full mobile responsiveness.

## Requirements

### Requirement 1

**User Story:** As a dancer, I want to browse and discover dance classes so that I can find classes that match my interests and schedule.

#### Acceptance Criteria

1. WHEN I visit the schedule page THEN the system SHALL display a list of available dance classes grouped by date
2. WHEN I view a class in the schedule THEN the system SHALL show class title, choreographer name, style tags, date/time, and location
3. WHEN I click on a choreographer name THEN the system SHALL navigate to their profile page
4. WHEN I apply filters for style, choreographer, studio, or date THEN the system SHALL update the displayed classes accordingly
5. WHEN I switch between list and calendar view THEN the system SHALL maintain my current filter selections

### Requirement 2

**User Story:** As a dancer, I want to express interest in classes and track my attendance so that I can manage my dance schedule effectively.

#### Acceptance Criteria

1. WHEN I click the "Interested" button on a class THEN the system SHALL mark me as interested and store this in localStorage
2. WHEN I click the "Attending" button on a class THEN the system SHALL mark me as attending and store this in localStorage
3. WHEN I view my dashboard THEN the system SHALL display my tracked classes in "Attending" and "Interested" tabs
4. WHEN I click on a class card THEN the system SHALL open a detailed modal with full class information
5. IF I am already interested or attending a class THEN the system SHALL visually indicate my current status

### Requirement 3

**User Story:** As a choreographer, I want to have a public profile page so that dancers can learn about me and see my upcoming classes.

#### Acceptance Criteria

1. WHEN a user visits my choreographer profile THEN the system SHALL display my name, pronouns, bio, website/social links, and profile photo
2. WHEN viewing my profile THEN the system SHALL show a list of my upcoming classes
3. WHEN I view my own profile THEN the system SHALL display an "Edit Profile" button
4. IF featured video or media is available THEN the system SHALL display it prominently on my profile
5. WHEN dancers click on my name from any class listing THEN the system SHALL navigate to my profile page

### Requirement 4

**User Story:** As a choreographer, I want to manage my class offerings so that I can track and organize my teaching schedule.

#### Acceptance Criteria

1. WHEN I access the "My Classes" page THEN the system SHALL display only my created classes
2. WHEN viewing my classes THEN the system SHALL show class title, date/time, and management buttons for each class
3. WHEN I click "Add New Class" THEN the system SHALL display a class creation interface
4. WHEN I click Edit, Cancel, or Delete on a class THEN the system SHALL provide appropriate management options
5. IF I am not a choreographer THEN the system SHALL not display the "My Classes" navigation option

### Requirement 5

**User Story:** As a user, I want to switch between dancer and choreographer roles so that I can experience different aspects of the application.

#### Acceptance Criteria

1. WHEN I access the role toggle in the navigation THEN the system SHALL allow me to switch between dancer and choreographer roles
2. WHEN I switch roles THEN the system SHALL update the navigation menu to show role-appropriate options
3. WHEN I switch to choreographer role THEN the system SHALL display "My Classes" in the navigation
4. WHEN I switch roles THEN the system SHALL maintain my previous selections and preferences in localStorage
5. WHEN the app loads THEN the system SHALL set a default user role from the mock data

### Requirement 6

**User Story:** As a user, I want intuitive navigation throughout the application so that I can easily access different features and pages.

#### Acceptance Criteria

1. WHEN I view any page THEN the system SHALL display a top navigation bar with Dashboard, Schedule, and conditional My Classes links
2. WHEN I click the Profile icon THEN the system SHALL navigate to my choreographer profile page if applicable
3. WHEN I access the Dashboard THEN the system SHALL display my tracked classes, featured classes, and my upcoming classes if I'm a choreographer
4. WHEN I navigate between pages THEN the system SHALL maintain consistent navigation and user context
5. WHEN I click the Settings icon THEN the system SHALL display a settings interface (non-functional for POC)

### Requirement 7

**User Story:** As a user, I want the application to work seamlessly on both desktop and mobile devices so that I can access it anywhere.

#### Acceptance Criteria

1. WHEN I access the application on mobile THEN the system SHALL display a responsive layout optimized for mobile screens
2. WHEN I access the application on desktop THEN the system SHALL utilize the full screen space effectively
3. WHEN I interact with buttons and forms THEN the system SHALL provide touch-friendly interfaces on mobile devices
4. WHEN I view class cards and lists THEN the system SHALL adapt the layout appropriately for different screen sizes
5. WHEN I use the calendar view THEN the system SHALL remain functional and readable on mobile devices

### Requirement 8

**User Story:** As a user, I want visual indicators and styling that help me understand class status and categories so that I can quickly identify relevant information.

#### Acceptance Criteria

1. WHEN I view classes THEN the system SHALL use color coding and tags to indicate class status (Cancelled, Featured)
2. WHEN I see style tags THEN the system SHALL display them with consistent visual styling
3. WHEN classes don't have media THEN the system SHALL display appropriate placeholder images or icons
4. WHEN I view my tracked classes THEN the system SHALL visually distinguish between "Interested" and "Attending" status
5. WHEN I interact with buttons THEN the system SHALL provide clear visual feedback for different states

### Requirement 9

**User Story:** As a developer/demo user, I want the application to use realistic mock data so that the POC demonstrates real-world functionality.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL populate with 8-10 demo classes from mock data
2. WHEN I interact with user profiles THEN the system SHALL display information for at least 3 mock users (1 dancer, 2 choreographers)
3. WHEN I view choreographer profiles THEN the system SHALL show realistic bios, images, and media from mock data
4. WHEN I reset the application THEN the system SHALL provide an option to clear localStorage for clean demo sessions
5. WHEN the app initializes THEN the system SHALL set a default user from the mock data for immediate interaction