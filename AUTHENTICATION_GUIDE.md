# Authentication & Event Management Implementation Guide

## Overview
This guide covers the implementation of Google/Facebook authentication and event management features including organized, invited, going, and declined event tabs with attendee RSVP functionality.

## Features Implemented

### 1. Authentication System

#### Social Login (OAuth)
- **Google OAuth**: Integrated using `@react-oauth/google` package
- **Facebook OAuth**: Integrated using Facebook JavaScript SDK
- **Email/Password Login**: Traditional authentication method

#### Files Created/Modified:
- `src/pages/LoginPage.jsx` - Login UI with OAuth buttons
- `src/api/authApi.js` - Authentication API endpoints
- `src/App.js` - Added GoogleOAuthProvider and protected routes
- `public/index.html` - Added Facebook SDK initialization

### 2. Event Tabs on Home Page

The Events page now displays events categorized into four tabs:

#### Tab Categories:
1. **Organized** - Events created by the current user
2. **Invited** - Events where the user is invited but hasn't responded (pending status)
3. **Going** - Events where the user has accepted the invitation
4. **Declined** - Events where the user has declined the invitation

#### Implementation:
- Each tab shows a count badge
- Events are filtered based on user's relationship with the event
- Search functionality works across all tabs

### 3. Attendee RSVP System

#### Response Options:
- **Accept** - User will attend the event
- **Tentative** - User might attend (maybe)
- **Decline** - User won't attend

#### Features:
- Attendees see RSVP buttons on event details page
- Current response status is displayed
- Visual feedback with color-coded buttons
- Real-time updates across all views

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @react-oauth/google --legacy-peer-deps
```

### 2. Configure Environment Variables

Update your `.env` file with OAuth credentials:

```bash
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# Facebook OAuth
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
```

### 3. Get OAuth Credentials

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Set authorized JavaScript origins: `http://localhost:3000`
6. Set authorized redirect URIs: `http://localhost:3000`
7. Copy the Client ID to your `.env` file

#### Facebook OAuth Setup:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs: `http://localhost:3000/`
5. Copy the App ID to your `.env` file

### 4. Backend API Requirements

Your backend should implement these endpoints:

#### Authentication Endpoints:
```
POST /api/auth/google
  Body: { credential: string }
  Response: { token: string, user: object }

POST /api/auth/facebook
  Body: { accessToken: string }
  Response: { token: string, user: object }

POST /api/auth/login
  Body: { email: string, password: string }
  Response: { token: string, user: object }

GET /api/auth/me
  Response: { user: object }
```

#### Event Endpoints:
```
GET /api/events
  Response: Array of events with attendees embedded

GET /api/events/:id
  Response: Event object with attendees array
```

#### Attendee RSVP Endpoints:
```
PATCH /api/events/:eventId/attendees/me/respond
  Body: { status: 'ACCEPTED' | 'DECLINED' | 'TENTATIVE' }
  Response: Updated attendee object
```

### 5. Event Data Structure

Events should include attendee information:

```javascript
{
  id: "event-123",
  name: "Annual Tech Conference",
  description: "...",
  startDate: "2025-12-10T09:00:00Z",
  endDate: "2025-12-10T18:00:00Z",
  location: "Convention Center",
  createdBy: "user-id-or-email",
  attendees: [
    {
      id: "attendee-1",
      email: "user@example.com",
      name: "John Doe",
      status: "ACCEPTED" | "DECLINED" | "TENTATIVE" | "PENDING"
    }
  ]
}
```

## Usage Guide

### For End Users

#### Logging In:
1. Navigate to `/login`
2. Click "Continue with Google" or "Continue with Facebook"
3. Or click "Sign in with email" for traditional login
4. Authorize the application
5. You'll be redirected to the events page

#### Viewing Events:
1. **Organized Tab**: See events you created
2. **Invited Tab**: See pending invitations
3. **Going Tab**: See events you're attending
4. **Declined Tab**: See events you declined

#### Responding to Invitations:
1. Click on an event where you're an attendee
2. On the right side, you'll see RSVP buttons
3. Click **Accept**, **Tentative**, or **Decline**
4. Your response is updated immediately
5. The event moves to the appropriate tab

### For Organizers

#### Creating Events:
1. Click "Create Event" button
2. Fill in event details
3. After creation, invite attendees from the event details page

#### Managing Attendees:
1. Go to event details page
2. Click "Attendees" tab
3. View attendee responses
4. Filter by status (all, confirmed, pending, declined)

## Component Structure

### New Components:
- **LoginPage** (`src/pages/LoginPage.jsx`)
  - OAuth buttons for Google/Facebook
  - Email/password login form
  - Responsive design

### Modified Components:
- **EventsPage** (`src/pages/EventsPage.jsx`)
  - Added tab navigation
  - Event filtering by user relationship
  - Tab count badges

- **EventDetailsPage** (`src/pages/EventDetailsPage.jsx`)
  - Added RSVP buttons for attendees
  - Shows current response status
  - Disabled for organizers

- **App** (`src/App.js`)
  - GoogleOAuthProvider wrapper
  - ProtectedRoute component
  - Public/protected route separation

### API Modules:
- **authApi** (`src/api/authApi.js`)
  - Google/Facebook OAuth
  - Email login
  - User profile retrieval

- **attendeeApi** (`src/api/attendeeApi.js`)
  - Added `respondToInvitation` method
  - Self-response endpoint

## Styling

All components use Tailwind CSS for styling with:
- Indigo color scheme for primary actions
- Green for accepted/confirmed
- Red for declined
- Yellow for pending/tentative
- Responsive breakpoints for mobile/tablet/desktop

## Security Considerations

1. **Token Storage**: Auth tokens stored in localStorage
2. **Protected Routes**: Unauthenticated users redirected to login
3. **API Authentication**: All API calls include auth token in headers
4. **OAuth Security**: Following OAuth 2.0 best practices

## Testing

### Manual Testing Checklist:
- [ ] Google login works
- [ ] Facebook login works
- [ ] Email login works
- [ ] Protected routes redirect when not authenticated
- [ ] Organized tab shows only user's events
- [ ] Invited tab shows pending invitations
- [ ] Going tab shows accepted events
- [ ] Declined tab shows declined events
- [ ] Accept button updates status
- [ ] Tentative button updates status
- [ ] Decline button updates status
- [ ] Event moves to correct tab after response
- [ ] Search works across all tabs

## Troubleshooting

### OAuth Issues:
- **Google login fails**: Check Client ID in `.env`
- **Facebook login fails**: Check App ID and domain configuration
- **Redirect issues**: Verify authorized URIs in OAuth settings

### Tab Filtering Issues:
- **Events not showing**: Check user ID/email matching logic
- **Wrong tab counts**: Verify attendee status values match case-insensitively

### RSVP Issues:
- **Buttons not working**: Check backend endpoint implementation
- **Status not updating**: Verify query invalidation in mutations

## Future Enhancements

Potential improvements:
1. Email notifications for invitations
2. Calendar integration (Google Calendar, Outlook)
3. Bulk RSVP actions
4. Custom response messages
5. Waitlist functionality
6. Guest +1 management
7. Social sharing of events
8. Two-factor authentication

## API Response Examples

### Successful Google Login:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://...",
    "role": "USER"
  }
}
```

### Event with Attendees:
```json
{
  "id": "event-456",
  "name": "Team Meeting",
  "createdBy": "user-123",
  "attendees": [
    {
      "id": "att-1",
      "email": "attendee@example.com",
      "name": "Jane Smith",
      "status": "ACCEPTED"
    }
  ]
}
```

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Check network tab for API request/response details
4. Verify environment variables are set correctly

## Changelog

### Version 1.0.0 (December 5, 2025)
- Initial implementation of OAuth authentication
- Added event tabs (Organized, Invited, Going, Declined)
- Implemented attendee RSVP system
- Added protected routes
- Created login page with social auth
