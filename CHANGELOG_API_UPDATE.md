# API Structure Update Changelog

**Date**: December 1, 2025  
**Type**: Breaking Changes  
**Impact**: All API calls updated to match backend structure

---

## Summary

Updated all API endpoints to align with the backend resource structure where events are the primary resource containing nested attendees and agenda items, and agenda items contain nested questions and polls.

---

## Files Changed

### API Layer (4 files)

1. **`src/api/attendeeApi.js`**
   - ✅ Updated `getAttendees()` to fetch from event endpoint and extract attendees array
   - ✅ All write operations remain on `/events/{eventId}/attendees/...` paths

2. **`src/api/agendaApi.js`**
   - ✅ Updated `getAgenda()` to fetch from event endpoint and extract agenda array
   - ✅ Updated `getAgendaItem()` to fetch event and filter agenda items client-side
   - ✅ All write operations remain on `/events/{eventId}/agenda/...` paths

3. **`src/api/questionApi.js`**
   - ✅ Updated `getQuestions()` to accept `eventId` and `agendaId`, extract from event object
   - ✅ Updated all mutation methods to include `eventId` and `agendaId` in parameters
   - ✅ Updated all paths from `/agenda/{agendaId}/...` to `/events/{eventId}/agenda/{agendaId}/...`

4. **`src/api/pollApi.js`**
   - ✅ Updated `getPolls()` to accept `eventId` and `agendaId`, extract from event object
   - ✅ Updated `getPoll()` to accept `eventId`, `agendaId`, and `pollId`, filter client-side
   - ✅ Updated all mutation methods to include `eventId` and `agendaId` in parameters
   - ✅ Updated all paths from `/polls/{pollId}/...` to `/events/{eventId}/agenda/{agendaId}/polls/...`

### Component Layer (2 files)

5. **`src/pages/AgendaPage.jsx`**
   - ✅ Updated query keys to include `eventId`
   - ✅ Updated all API calls to pass `eventId` as first parameter
   - ✅ Added event cache invalidation to all mutations
   - ✅ Updated mutation functions with correct parameter order

6. **`src/pages/EventDetailsPage.jsx`**
   - ✅ Removed redundant `getAgenda()` API call
   - ✅ Now extracts agenda directly from event object: `event?.agenda || []`
   - ✅ Updated cache invalidation from `['agenda', eventId]` to `['event', eventId]`
   - ✅ Improved performance by eliminating extra HTTP request

### Documentation (2 files)

7. **`API_STRUCTURE_UPDATE.md`** (New)
   - ✅ Comprehensive guide to API changes
   - ✅ Before/after examples for each API
   - ✅ Benefits and migration checklist

8. **`CHANGELOG_API_UPDATE.md`** (This file)
   - ✅ Complete record of changes made

---

## Breaking Changes

### 1. Method Signatures

All question and poll API methods now require additional parameters:

```javascript
// ❌ OLD
questionApi.getQuestions(agendaId)
questionApi.addQuestion(agendaId, data)
questionApi.upvoteQuestion(questionId)
pollApi.getPolls(agendaId)
pollApi.submitVote(pollId, optionId)

// ✅ NEW
questionApi.getQuestions(eventId, agendaId)
questionApi.addQuestion(eventId, agendaId, data)
questionApi.upvoteQuestion(eventId, agendaId, questionId)
pollApi.getPolls(eventId, agendaId)
pollApi.submitVote(eventId, agendaId, pollId, optionId)
```

### 2. API Paths

Question and poll endpoints now follow the full resource hierarchy:

```javascript
// ❌ OLD
POST /agenda/{agendaId}/questions
PUT  /questions/{questionId}
POST /polls/{pollId}/vote

// ✅ NEW
POST /events/{eventId}/agenda/{agendaId}/questions
PUT  /events/{eventId}/agenda/{agendaId}/questions/{questionId}
POST /events/{eventId}/agenda/{agendaId}/polls/{pollId}/vote
```

### 3. Data Fetching Strategy

Attendees and agenda are now read from the event object:

```javascript
// ❌ OLD - Separate API calls
const { data: attendees } = useQuery(['attendees', eventId], () => attendeeApi.getAttendees(eventId))
const { data: agenda } = useQuery(['agenda', eventId], () => agendaApi.getAgenda(eventId))

// ✅ NEW - Extracted from event
const { data: event } = useQuery(['event', eventId], () => eventApi.getEvent(eventId))
const attendees = event?.attendees || []
const agenda = event?.agenda || []
```

---

## Migration Guide

### For Existing Components

If you have components using these APIs:

1. **Add `eventId` parameter** to all question/poll API calls
2. **Update query keys** to include `eventId`
3. **Update cache invalidation** to target `['event', eventId]`
4. **Extract nested data** from event object where possible

### Example Migration

```javascript
// ❌ Before
const { data: questions } = useQuery(
  ['questions', agendaId],
  () => questionApi.getQuestions(agendaId)
);

const addQuestion = useMutation({
  mutationFn: (data) => questionApi.addQuestion(agendaId, data),
  onSuccess: () => {
    queryClient.invalidateQueries(['questions', agendaId]);
  }
});

// ✅ After
const { data: questions } = useQuery(
  ['questions', eventId, agendaId],
  () => questionApi.getQuestions(eventId, agendaId)
);

const addQuestion = useMutation({
  mutationFn: (data) => questionApi.addQuestion(eventId, agendaId, data),
  onSuccess: () => {
    queryClient.invalidateQueries(['questions', eventId, agendaId]);
    queryClient.invalidateQueries(['event', eventId]); // Keep event cache fresh
  }
});
```

---

## Testing Notes

### What to Test

- [ ] Event list loads correctly
- [ ] Event details page shows attendees from embedded data
- [ ] Event details page shows agenda from embedded data
- [ ] Adding/removing attendees updates event cache
- [ ] Adding/editing/deleting agenda items updates event cache
- [ ] Questions page loads and displays questions
- [ ] Adding/answering/upvoting questions works
- [ ] Polls page loads and displays polls
- [ ] Creating polls and voting works
- [ ] All cache invalidation triggers UI updates

### Mock Data Structure

Tests should now mock the full event structure:

```javascript
const mockEvent = {
  id: "event-1",
  name: "Tech Conference 2025",
  attendees: [
    { id: "1", name: "John", email: "john@example.com", status: "INVITED" }
  ],
  agenda: [
    {
      id: "agenda-1",
      title: "Keynote",
      questions: [],
      polls: []
    }
  ]
};
```

---

## Performance Impact

### Improvements ✅

- **Reduced HTTP requests**: EventDetailsPage now makes 1 request instead of 3
- **Better caching**: Single event cache contains all data
- **Faster initial load**: Fewer roundtrips to server

### Considerations ⚠️

- **Larger payload**: Event response includes all nested data
- **Client-side filtering**: getAgendaItem filters locally instead of server-side
- **Cache size**: Event cache is larger but shared across components

---

## Rollback Plan

If issues arise, revert these commits in order:

1. `CHANGELOG_API_UPDATE.md` and `API_STRUCTURE_UPDATE.md` (documentation)
2. `EventDetailsPage.jsx` changes
3. `AgendaPage.jsx` changes
4. `pollApi.js` changes
5. `questionApi.js` changes
6. `agendaApi.js` changes
7. `attendeeApi.js` changes

---

## Questions or Issues?

If you encounter any issues with these changes:

1. Check the `API_STRUCTURE_UPDATE.md` for detailed examples
2. Verify your backend is returning the nested structure shown above
3. Check browser console for API errors
4. Verify React Query DevTools shows correct cache keys

---

**Updated by**: AI Assistant  
**Review status**: Pending human review  
**Next steps**: Manual testing and verification
