# Attendee Management - Usage Guide

## Quick Start

### 1. Access the Attendee Feature

1. Navigate to the Events page
2. Click on any event to view its details
3. Click on the **"Attendees"** tab in the navigation bar

### 2. Invite Attendees

#### Step-by-step:

1. Click the **"Invite Attendees"** button (top-right of the attendee section)
2. Fill in the attendee information:
   - **Name** (Optional): Enter the attendee's full name
   - **Email** (Required): Enter a valid email address
3. To invite multiple attendees:
   - Click **"Add Another Attendee"** button
   - Fill in additional attendee details
4. To remove an attendee field:
   - Click the trash icon (🗑️) next to the attendee field
5. Click **"Send Invitations"** to submit

#### Validation:
- At least one email address is required
- All emails must be in valid format (e.g., user@example.com)
- You'll see a success toast notification when invitations are sent

### 3. View Attendees

The attendee list displays:
- **Attendee Name** (or email if name not provided)
- **Email Address**
- **Status Badge** (Confirmed/Pending/Declined)
- **Status Icon** with color coding:
  - ✅ Green checkmark = Confirmed/Accepted
  - ⏰ Yellow clock = Pending
  - ❌ Red X = Declined

### 4. Filter Attendees

Use the statistics cards at the top to filter attendees:

- **Total**: Shows all attendees (default view)
- **Confirmed**: Shows only confirmed attendees
- **Pending**: Shows only pending responses
- **Declined**: Shows only declined invitations

Click on any card to apply the filter. The active filter is highlighted with a colored border.

### 5. Remove Attendees

1. Find the attendee you want to remove
2. Click the trash icon (🗑️) on the right side of the attendee row
3. Confirm the removal in the popup dialog
4. The attendee will be removed and you'll see a success notification

### 6. Monitor Statistics

The statistics dashboard shows real-time counts:

```
┌──────────┬────────────┬─────────┬──────────┐
│  Total   │ Confirmed  │ Pending │ Declined │
│    15    │      8     │    5    │     2    │
└──────────┴────────────┴─────────┴──────────┘
```

## Common Use Cases

### Scenario 1: Small Event (< 10 attendees)
1. Click "Invite Attendees"
2. Add all attendees at once using the "Add Another Attendee" button
3. Fill in all details
4. Send invitations in one batch

### Scenario 2: Large Event (> 10 attendees)
1. Invite attendees in batches
2. Use the statistics to track response rates
3. Follow up with pending attendees
4. Filter by status to manage different groups

### Scenario 3: Last-Minute Changes
1. Navigate to the Attendees tab
2. Remove attendees who can't attend (Declined status)
3. Add new attendees as replacements
4. Monitor the confirmed count to ensure capacity

## Tips & Best Practices

### ✅ Do:
- Include attendee names for better organization
- Use valid email addresses to ensure delivery
- Regularly check the pending status and follow up
- Filter by status when managing large attendee lists
- Remove declined attendees to keep the list clean

### ❌ Don't:
- Don't invite duplicate email addresses
- Don't remove attendees without confirmation
- Don't forget to check the statistics before the event
- Don't use invalid email formats

## Keyboard Shortcuts

When the Invite Modal is open:
- **Tab**: Move between fields
- **Enter**: Submit the form (when all required fields are filled)
- **Escape**: Close the modal

## Troubleshooting

### Issue: Can't send invitations
**Solution**: Ensure at least one email is filled in and valid

### Issue: Attendee not showing up
**Solution**: Refresh the page or check the "All" filter

### Issue: Can't remove attendee
**Solution**: Check your permissions or network connection

### Issue: Statistics not updating
**Solution**: The page uses real-time updates via React Query cache. If stuck, refresh the page.

## Mobile Experience

The attendee feature is fully responsive:
- Statistics cards stack vertically on mobile
- Attendee cards are touch-friendly
- Modal forms adapt to smaller screens
- All actions work with touch gestures

## API Endpoints Used

For developers or debugging:

- `GET /events/{eventId}/attendees` - Fetch attendees
- `POST /events/{eventId}/attendees/invite` - Invite attendees
- `DELETE /events/{eventId}/attendees/{attendeeId}` - Remove attendee
- `PATCH /events/{eventId}/attendees/{attendeeId}` - Update status

## Future Features (Coming Soon)

- 📧 Resend invitations to pending attendees
- 📊 Export attendee list to CSV/Excel
- 📱 QR code generation for check-in
- 📅 Calendar integration
- 🔔 Automatic reminders
- 📝 Custom invitation templates
- 👥 Bulk operations (bulk remove, bulk status update)

---

**Need Help?** Check the main README or contact support.
