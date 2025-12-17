# Authentication & Event Management Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐      ┌──────────────────────────────────┐  │
│  │  LoginPage     │      │  Events Page (Protected)         │  │
│  │                │      │                                  │  │
│  │  [Google]      │──────►  ┌───────────────────────────┐  │  │
│  │  [Facebook]    │      │  │ Tabs:                     │  │  │
│  │  [Email]       │      │  │ • Organized (created by)  │  │  │
│  │                │      │  │ • Invited (pending)       │  │  │
│  └────────────────┘      │  │ • Going (accepted)        │  │  │
│                          │  │ • Declined (declined)     │  │  │
│                          │  └───────────────────────────┘  │  │
│                          │                                  │  │
│                          │  [Event Cards Grid]              │  │
│                          └──────────────────────────────────┘  │
│                                       │                         │
│                                       ▼                         │
│                          ┌──────────────────────────────────┐  │
│                          │  Event Details Page (Protected)  │  │
│                          │                                  │  │
│                          │  Event Info                      │  │
│                          │  Agenda Timeline                 │  │
│                          │  Attendees List                  │  │
│                          │                                  │  │
│                          │  ┌────────────────────────────┐ │  │
│                          │  │ RSVP Actions (Attendees)   │ │  │
│                          │  │                            │ │  │
│                          │  │ Your Response: Pending     │ │  │
│                          │  │                            │ │  │
│                          │  │ [✓ Accept]                 │ │  │
│                          │  │ [? Tentative]              │ │  │
│                          │  │ [✗ Decline]                │ │  │
│                          │  └────────────────────────────┘ │  │
│                          └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  authApi.js                eventApi.js            attendeeApi.js │
│  • googleLogin()           • getEvents()          • respondTo    │
│  • facebookLogin()         • getEvent()             Invitation() │
│  • login()                 • createEvent()        • update       │
│  • getCurrentUser()        • updateEvent()          Status()     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API ENDPOINTS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Authentication:                                                 │
│  POST   /api/auth/google                                         │
│  POST   /api/auth/facebook                                       │
│  POST   /api/auth/login                                          │
│  GET    /api/auth/me                                             │
│                                                                  │
│  Events:                                                         │
│  GET    /api/events                                              │
│  GET    /api/events/:id                                          │
│  POST   /api/events                                              │
│  PUT    /api/events/:id                                          │
│                                                                  │
│  RSVP:                                                           │
│  PATCH  /api/events/:id/attendees/me/respond                     │
│  PATCH  /api/events/:id/attendees/:attendeeId                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐           ┌──────────────┐           ┌──────────┐
│  User    │           │  Frontend    │           │ Backend  │
└────┬─────┘           └──────┬───────┘           └────┬─────┘
     │                        │                        │
     │ Click Google Login     │                        │
     ├───────────────────────►│                        │
     │                        │                        │
     │                        │ Open OAuth Popup       │
     │                        ├────────────────┐       │
     │                        │                │       │
     │ Authorize App          │                │       │
     ├────────────────────────┼───────────────►│       │
     │                        │                │       │
     │ Receive Credential     │                │       │
     │◄───────────────────────┼────────────────┘       │
     │                        │                        │
     │                        │ POST /auth/google      │
     │                        ├───────────────────────►│
     │                        │ {credential}           │
     │                        │                        │
     │                        │ Return token & user    │
     │                        │◄───────────────────────┤
     │                        │ {token, user}          │
     │                        │                        │
     │                        │ Store in localStorage  │
     │                        ├──────┐                 │
     │                        │      │                 │
     │                        │◄─────┘                 │
     │                        │                        │
     │ Redirect to /events    │                        │
     │◄───────────────────────┤                        │
     │                        │                        │
```

## Event Tabs Filtering Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                     Event Filtering Logic                        │
└─────────────────────────────────────────────────────────────────┘

For each event in events[]:

┌──────────────────────────────────────────────────────────────────┐
│ ORGANIZED TAB                                                    │
├──────────────────────────────────────────────────────────────────┤
│ Show if: event.createdBy === currentUser.id                      │
│       OR event.createdBy === currentUser.email                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ INVITED TAB                                                      │
├──────────────────────────────────────────────────────────────────┤
│ Show if: event.attendees.some(attendee =>                        │
│   (attendee.email === currentUser.email OR                       │
│    attendee.id === currentUser.id)                               │
│   AND attendee.status === 'PENDING'                              │
│ )                                                                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ GOING TAB                                                        │
├──────────────────────────────────────────────────────────────────┤
│ Show if: event.attendees.some(attendee =>                        │
│   (attendee.email === currentUser.email OR                       │
│    attendee.id === currentUser.id)                               │
│   AND (attendee.status === 'ACCEPTED' OR                         │
│        attendee.status === 'CONFIRMED')                          │
│ )                                                                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ DECLINED TAB                                                     │
├──────────────────────────────────────────────────────────────────┤
│ Show if: event.attendees.some(attendee =>                        │
│   (attendee.email === currentUser.email OR                       │
│    attendee.id === currentUser.id)                               │
│   AND attendee.status === 'DECLINED'                             │
│ )                                                                │
└──────────────────────────────────────────────────────────────────┘
```

## RSVP Response Flow

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│ Attendee │         │  Frontend    │         │ Backend  │
└────┬─────┘         └──────┬───────┘         └────┬─────┘
     │                      │                      │
     │ View Event Details   │                      │
     ├─────────────────────►│                      │
     │                      │                      │
     │                      │ GET /events/:id      │
     │                      ├─────────────────────►│
     │                      │                      │
     │                      │ Return event data    │
     │                      │◄─────────────────────┤
     │                      │                      │
     │ Display RSVP Buttons │                      │
     │◄─────────────────────┤                      │
     │                      │                      │
     │ Click "Accept"       │                      │
     ├─────────────────────►│                      │
     │                      │                      │
     │                      │ PATCH /attendees/    │
     │                      │       me/respond     │
     │                      ├─────────────────────►│
     │                      │ {status: 'ACCEPTED'} │
     │                      │                      │
     │                      │ Update attendee      │
     │                      │◄─────────────────────┤
     │                      │                      │
     │                      │ Invalidate queries   │
     │                      ├────┐                 │
     │                      │    │                 │
     │                      │◄───┘                 │
     │                      │                      │
     │ Show success toast   │                      │
     │◄─────────────────────┤                      │
     │ "You're going!"      │                      │
     │                      │                      │
     │ Event moves to       │                      │
     │ "Going" tab          │                      │
     │◄─────────────────────┤                      │
     │                      │                      │
```

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    Component Hierarchy                      │
└────────────────────────────────────────────────────────────┘

App (GoogleOAuthProvider)
 │
 ├─ AuthProvider (Context)
 │   │
 │   ├─ Router
 │   │   │
 │   │   ├─ Public Route
 │   │   │   └─ LoginPage
 │   │   │
 │   │   └─ Protected Routes (ProtectedRoute wrapper)
 │   │       │
 │   │       ├─ Layout
 │   │       │   │
 │   │       │   ├─ EventsPage
 │   │       │   │   ├─ Tabs (Organized/Invited/Going/Declined)
 │   │       │   │   ├─ Search Bar
 │   │       │   │   └─ EventCard[] (filtered by active tab)
 │   │       │   │
 │   │       │   ├─ EventDetailsPage
 │   │       │   │   ├─ Event Info
 │   │       │   │   ├─ RSVP Buttons (if attendee)
 │   │       │   │   ├─ Tabs (Agenda/Attendees/Summary)
 │   │       │   │   │   ├─ AgendaTimeline
 │   │       │   │   │   ├─ AttendeeList
 │   │       │   │   │   └─ Summary
 │   │       │   │
 │   │       │   └─ AgendaPage
 │   │       │
 │   │       └─ Toaster (Notifications)
```

## State Management

```
┌────────────────────────────────────────────────────────────┐
│                    React Query Cache                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ['events']           - All events with attendees          │
│  ['event', id]        - Single event details               │
│  ['attendees', id]    - Event attendees list               │
│  ['agenda', id]       - Event agenda items                 │
│  ['eventSummary', id] - AI-generated summary               │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    AuthContext State                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  user              - Current user object                   │
│  loading           - Auth loading state                    │
│  isAuthenticated   - Boolean auth status                   │
│  login()           - Login function                        │
│  logout()          - Logout function                       │
│  updateUser()      - Update user data                      │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    LocalStorage                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  authToken         - JWT token                             │
│  userData          - Serialized user object                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Event Status Mapping

```
┌────────────────────────────────────────────────────────────┐
│                 Attendee Status Values                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  PENDING    → Yellow badge  → "Invited" tab                │
│  ACCEPTED   → Green badge   → "Going" tab                  │
│  CONFIRMED  → Green badge   → "Going" tab                  │
│  TENTATIVE  → Orange badge  → "Invited" tab (maybe)        │
│  DECLINED   → Red badge     → "Declined" tab               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Security Flow

```
┌────────────────────────────────────────────────────────────┐
│              Request Authentication Flow                    │
└────────────────────────────────────────────────────────────┘

Every API Request:

1. Get token from localStorage
   ↓
2. Add to Authorization header
   Authorization: Bearer <token>
   ↓
3. Send request to backend
   ↓
4. Backend validates token
   ↓
5. If valid → Process request
   If invalid → Return 401
   ↓
6. Frontend handles 401 → Redirect to /login
```

This architecture provides:
- ✅ Secure authentication with OAuth
- ✅ Protected routes for authenticated users
- ✅ Organized event categorization
- ✅ Seamless RSVP functionality
- ✅ Real-time UI updates
- ✅ Responsive design
