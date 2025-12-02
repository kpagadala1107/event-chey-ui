# Attendee Management Feature

## Overview
This feature allows event organizers to invite attendees to events and manage the attendee list in one centralized location.

## Features

### 1. Invite Attendees
- **Multiple Invitations**: Invite multiple attendees at once
- **Email Invitations**: Send invitations via email
- **Optional Names**: Add attendee names (optional, email is required)
- **Batch Management**: Add or remove attendee fields dynamically

### 2. Attendee List View
- **Comprehensive List**: View all invited attendees in one place
- **Status Tracking**: Track attendee status (Confirmed, Pending, Declined)
- **Statistics Dashboard**: See quick stats with visual indicators
  - Total attendees count
  - Confirmed attendees
  - Pending responses
  - Declined invitations

### 3. Filtering
- **Filter by Status**: Toggle between different attendee statuses
- **Visual Feedback**: Color-coded status badges and icons
  - Green for Confirmed/Accepted
  - Yellow for Pending
  - Red for Declined

### 4. Attendee Management
- **Remove Attendees**: Remove attendees from the event
- **Status Icons**: Visual indicators for quick status recognition
- **Contact Information**: Display attendee names and email addresses

## Components

### AttendeeList.jsx
Main component that displays the attendee list with filtering and statistics.

**Props:**
- `eventId` (string, required): The ID of the event

**Features:**
- Status filtering (All, Confirmed, Pending, Declined)
- Statistics cards showing counts for each status
- Remove attendee functionality
- Integration with InviteAttendeesModal

### InviteAttendeesModal.jsx
Modal component for inviting new attendees.

**Props:**
- `eventId` (string, required): The ID of the event
- `isOpen` (boolean, required): Controls modal visibility
- `onClose` (function, required): Callback when modal closes

**Features:**
- Dynamic form fields (add/remove attendees)
- Email validation
- Batch invitation submission
- Success/error notifications

## API Integration

### attendeeApi.js
New API service for attendee-related operations.

**Methods:**
- `getAttendees(eventId)`: Fetch all attendees for an event
- `inviteAttendees(eventId, attendees)`: Invite multiple attendees
- `removeAttendee(eventId, attendeeId)`: Remove an attendee
- `updateAttendeeStatus(eventId, attendeeId, status)`: Update attendee status

## Usage

### In EventDetailsPage
The attendee feature is integrated into the Event Details page with a tab navigation system:

```jsx
<AttendeeList eventId={eventId} />
```

### Navigation
1. Navigate to any event details page
2. Click on the "Attendees" tab
3. Click "Invite Attendees" button to add new attendees
4. View and manage attendees in the list

## UI/UX Features

- **Tab Navigation**: Switch between Agenda and Attendees views
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Visual Feedback**: Color-coded status indicators
- **Loading States**: Spinners during data fetching
- **Empty States**: Helpful messages when no attendees exist
- **Toast Notifications**: Success/error feedback for all actions

## Future Enhancements

Potential improvements for the feature:
- Export attendee list to CSV
- Send reminder emails to pending attendees
- Bulk status updates
- Attendee check-in functionality
- QR code generation for attendees
- Attendance tracking during the event
- Integration with calendar applications
- Custom email templates for invitations
