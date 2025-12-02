# Component Architecture Diagram

## Component Hierarchy

```
EventDetailsPage
│
├── Header Section
│   ├── Back Button
│   ├── Event Title
│   ├── Event Details (Date, Location, Attendee Count)
│   └── Description
│
├── Tab Navigation
│   ├── Agenda Tab
│   └── Attendees Tab ⭐ NEW
│
└── Content Grid (3 columns)
    │
    ├── Main Content (2 columns)
    │   │
    │   ├── [Agenda Section] (when activeTab === 'agenda')
    │   │   ├── Section Header
    │   │   │   ├── Title
    │   │   │   └── Add Item Button
    │   │   │
    │   │   └── Agenda Items List
    │   │       └── AgendaItemCard (multiple)
    │   │
    │   └── [Attendees Section] ⭐ NEW (when activeTab === 'attendees')
    │       │
    │       └── AttendeeList Component
    │           │
    │           ├── Header
    │           │   ├── Title + Count Badge
    │           │   └── Invite Attendees Button
    │           │
    │           ├── Statistics Dashboard
    │           │   ├── Total Card (Filter Button)
    │           │   ├── Confirmed Card (Filter Button)
    │           │   ├── Pending Card (Filter Button)
    │           │   └── Declined Card (Filter Button)
    │           │
    │           ├── Attendee List
    │           │   └── Attendee Cards (filtered)
    │           │       ├── Status Icon
    │           │       ├── Name/Email
    │           │       ├── Status Badge
    │           │       └── Delete Button
    │           │
    │           └── InviteAttendeesModal ⭐ NEW
    │               │
    │               ├── Modal Header
    │               ├── Description
    │               │
    │               ├── Attendee Form Fields (dynamic)
    │               │   └── For each attendee:
    │               │       ├── Name Input (optional)
    │               │       ├── Email Input (required)
    │               │       └── Remove Button
    │               │
    │               ├── Add Another Button
    │               │
    │               └── Action Buttons
    │                   ├── Send Invitations
    │                   └── Cancel
    │
    └── Sidebar (1 column)
        │
        ├── AI Summary Section
        │   ├── Summary Text
        │   └── Refresh Button
        │
        └── Quick Stats Section
            ├── Agenda Items Count
            ├── Total Questions Count
            └── Total Polls Count
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      EventDetailsPage                        │
│                                                              │
│  State:                                                      │
│  - activeTab: 'agenda' | 'attendees'                        │
│  - isAddAgendaModalOpen: boolean                            │
│                                                              │
│  Props Passed Down:                                         │
│  - eventId → AttendeeList                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │       AttendeeList            │
        │                               │
        │  Props:                       │
        │  - eventId (from parent)      │
        │                               │
        │  State:                       │
        │  - isInviteModalOpen          │
        │  - filter: 'all' | status     │
        │                               │
        │  Queries:                     │
        │  - attendees (useQuery)       │
        │                               │
        │  Mutations:                   │
        │  - removeAttendee             │
        └───────┬──────────────┬────────┘
                │              │
                ▼              ▼
    ┌──────────────────┐  ┌─────────────────────────┐
    │  attendeeApi     │  │ InviteAttendeesModal    │
    │                  │  │                         │
    │  - getAttendees  │  │  Props:                 │
    │  - removeAttendee│  │  - eventId              │
    │                  │  │  - isOpen               │
    └──────────────────┘  │  - onClose              │
                          │                         │
                          │  State:                 │
                          │  - attendees: Array     │
                          │                         │
                          │  Mutations:             │
                          │  - inviteAttendees      │
                          └────────┬────────────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │   attendeeApi    │
                          │                  │
                          │ - inviteAttendees│
                          └──────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    React Query Cache                         │
│                                                              │
│  Keys:                                                       │
│  - ['attendees', eventId] → Attendee List Data              │
│  - ['event', eventId] → Event Details (includes count)      │
└──────────────┬───────────────────────────────────────┬──────┘
               │                                       │
               │ GET                                   │ Invalidate on:
               │                                       │ - Invite
               ▼                                       │ - Remove
    ┌──────────────────────┐                         │
    │   AttendeeList       │                         │
    │   (Consumer)         │                         │
    │                      │                         │
    │   - Displays data    │◄────────────────────────┘
    │   - Filters locally  │
    │   - Triggers actions │
    └──────────────────────┘
```

## API Integration Diagram

```
Frontend                          Backend
────────                          ───────

AttendeeList
    │
    │ useQuery(['attendees', eventId])
    ├────────────────────────────────────► GET /events/{id}/attendees
    │                                                    │
    │◄───────────────────────────────────────────────────┘
    │                                      [{ id, name, email, status }]
    │
    │
InviteAttendeesModal
    │
    │ useMutation(inviteAttendees)
    ├────────────────────────────────────► POST /events/{id}/attendees/invite
    │                                      Body: { attendees: [...] }
    │                                                    │
    │◄───────────────────────────────────────────────────┘
    │                                      { success: true }
    │
    │ Invalidates: ['attendees', eventId]
    │ Invalidates: ['event', eventId]
    │
    │
AttendeeList (Remove)
    │
    │ useMutation(removeAttendee)
    ├────────────────────────────────────► DELETE /events/{id}/attendees/{attendeeId}
    │                                                    │
    │◄───────────────────────────────────────────────────┘
    │                                      { success: true }
    │
    │ Invalidates: ['attendees', eventId]
    │ Invalidates: ['event', eventId]
```

## Component Props Interface

```typescript
// AttendeeList.jsx
interface AttendeeListProps {
  eventId: string; // Required: The event ID
}

// InviteAttendeesModal.jsx
interface InviteAttendeesModalProps {
  eventId: string;     // Required: The event ID
  isOpen: boolean;     // Required: Controls modal visibility
  onClose: () => void; // Required: Callback when modal closes
}

// Data Structures
interface Attendee {
  id: string;
  name?: string;        // Optional
  email: string;        // Required
  status: 'confirmed' | 'pending' | 'declined' | 'accepted';
}

interface InviteAttendeeInput {
  name?: string;        // Optional
  email: string;        // Required, validated
}
```

## User Interaction Flow

```
User Journey: Inviting Attendees
─────────────────────────────────

1. Navigate to Event Details
   │
   ▼
2. Click "Attendees" Tab
   │
   ▼
3. Click "Invite Attendees" Button
   │
   ▼
4. Modal Opens
   │
   ├─► Fill in First Attendee
   │   - Name (optional)
   │   - Email (required)
   │
   ├─► Click "Add Another Attendee" (optional)
   │   - Repeat for more attendees
   │
   └─► Click "Send Invitations"
       │
       ├─► Validation Check
       │   ├─► ✅ Valid → Submit
       │   └─► ❌ Invalid → Show Error Toast
       │
       ▼
5. API Request Sent
   │
   ├─► ✅ Success
   │   ├─► Cache Invalidated
   │   ├─► Data Refetched
   │   ├─► Success Toast Shown
   │   ├─► Modal Closes
   │   └─► List Updates
   │
   └─► ❌ Error
       ├─► Error Toast Shown
       └─► Modal Stays Open


User Journey: Filtering Attendees
──────────────────────────────────

1. View Attendee List
   │
   ▼
2. See Statistics Cards
   │
   ├─► Click "Total" → Show All
   ├─► Click "Confirmed" → Show Confirmed Only
   ├─► Click "Pending" → Show Pending Only
   └─► Click "Declined" → Show Declined Only
       │
       ▼
3. List Filters Instantly (Client-side)
   │
   └─► Active filter highlighted with border
```

## Error Handling Flow

```
┌─────────────────────────────────────────┐
│         API Request Made                 │
└────────────┬────────────────────────────┘
             │
             ▼
      ┌──────────────┐
      │   Success?   │
      └──┬────────┬──┘
         │        │
      YES│        │NO
         │        │
         ▼        ▼
   ┌─────────┐  ┌──────────────────────┐
   │ Success │  │   Error Interceptor  │
   │ Path    │  │   (axiosClient)      │
   └────┬────┘  └─────────┬────────────┘
        │                 │
        ├─► Update Cache  ├─► Extract Error Message
        ├─► Show Toast    ├─► Show Error Toast
        └─► Close Modal   └─► Keep Modal Open
                               (for retry)
```

## Legend

- ⭐ NEW: Newly added component/feature
- ─►: Data flow direction
- ├─►: Decision branch
- │: Hierarchical relationship
- ▼: Flow continuation

---

**Diagram Version**: 1.0  
**Last Updated**: November 29, 2025
