# API Structure Update

## Overview
Updated all API calls to match the backend resource structure where events contain nested attendees and agenda items, and agenda items contain nested questions and polls.

## Backend Resource Structure
```json
{
  "id": "691eace5014d827a69765973",
  "name": "Tech Conference 2025",
  "description": "Annual tech event",
  "startDate": "2025-12-01T09:00:00",
  "endDate": "2025-12-01T17:00:00",
  "createdBy": "admin",
  "attendees": [
    {
      "id": "4b20960f-1e14-4001-bfcf-6973a75d16e1",
      "email": "kp@gg.com",
      "phone": null,
      "name": "kp",
      "status": "INVITED"
    }
  ],
  "agenda": [
    {
      "id": "9d0ad770-d022-4faa-8196-ffb809a84cc3",
      "title": "Key note",
      "startTime": "2025-12-01T10:00:00",
      "endTime": "2025-12-01T11:00:00",
      "description": "key note",
      "speaker": "Kiran",
      "questions": [],
      "polls": [],
      "aiSummary": "AI Summary..."
    }
  ],
  "createdAt": "2025-11-19T23:53:41.906",
  "updatedAt": "2025-11-30T10:25:19.776"
}
```

## API Changes

### 1. AttendeeApi (`src/api/attendeeApi.js`)

#### Before:
```javascript
getAttendees: async (eventId) => {
  const response = await axiosClient.get(`/events/${eventId}/attendees`);
  return response.data;
}
```

#### After:
```javascript
getAttendees: async (eventId) => {
  const response = await axiosClient.get(`/events/${eventId}`);
  return response.data.attendees || [];
}
```

**Reason**: Attendees are now embedded in the event response, not a separate endpoint.

---

### 2. AgendaApi (`src/api/agendaApi.js`)

#### Before:
```javascript
getAgenda: async (eventId) => {
  const response = await axiosClient.get(`/events/${eventId}/agenda`);
  return response.data;
},

getAgendaItem: async (eventId, agendaId) => {
  const response = await axiosClient.get(`/events/${eventId}/agenda/${agendaId}`);
  return response.data;
}
```

#### After:
```javascript
getAgenda: async (eventId) => {
  const response = await axiosClient.get(`/events/${eventId}`);
  return response.data.agenda || [];
},

getAgendaItem: async (eventId, agendaId) => {
  const response = await axiosClient.get(`/events/${eventId}`);
  const agenda = response.data.agenda || [];
  return agenda.find(item => item.id === agendaId) || null;
}
```

**Reason**: Agenda items are embedded in the event response. Individual items are filtered client-side.

---

### 3. QuestionApi (`src/api/questionApi.js`)

#### Before:
```javascript
getQuestions: async (agendaId) => {
  const response = await axiosClient.get(`/agenda/${agendaId}/questions`);
  return response.data;
},

addQuestion: async (agendaId, questionData) => {
  const response = await axiosClient.post(`/agenda/${agendaId}/questions`, questionData);
  return response.data;
},

updateQuestion: async (questionId, questionData) => {
  const response = await axiosClient.put(`/questions/${questionId}`, questionData);
  return response.data;
}
```

#### After:
```javascript
getQuestions: async (eventId, agendaId) => {
  const response = await axiosClient.get(`/events/${eventId}`);
  const agenda = response.data.agenda || [];
  const agendaItem = agenda.find(item => item.id === agendaId);
  return agendaItem?.questions || [];
},

addQuestion: async (eventId, agendaId, questionData) => {
  const response = await axiosClient.post(
    `/events/${eventId}/agenda/${agendaId}/questions`, 
    questionData
  );
  return response.data;
},

updateQuestion: async (eventId, agendaId, questionId, questionData) => {
  const response = await axiosClient.put(
    `/events/${eventId}/agenda/${agendaId}/questions/${questionId}`, 
    questionData
  );
  return response.data;
}
```

**Changes**:
- All methods now require `eventId` as the first parameter
- GET requests extract questions from nested event structure
- POST/PUT/DELETE requests use full path: `/events/{eventId}/agenda/{agendaId}/questions/...`

---

### 4. PollApi (`src/api/pollApi.js`)

#### Before:
```javascript
getPolls: async (agendaId) => {
  const response = await axiosClient.get(`/agenda/${agendaId}/polls`);
  return response.data;
},

getPoll: async (pollId) => {
  const response = await axiosClient.get(`/polls/${pollId}`);
  return response.data;
},

submitVote: async (pollId, optionId) => {
  const response = await axiosClient.post(`/polls/${pollId}/vote`, { optionId });
  return response.data;
}
```

#### After:
```javascript
getPolls: async (eventId, agendaId) => {
  const response = await axiosClient.get(`/events/${eventId}`);
  const agenda = response.data.agenda || [];
  const agendaItem = agenda.find(item => item.id === agendaId);
  return agendaItem?.polls || [];
},

getPoll: async (eventId, agendaId, pollId) => {
  const response = await axiosClient.get(`/events/${eventId}`);
  const agenda = response.data.agenda || [];
  const agendaItem = agenda.find(item => item.id === agendaId);
  const polls = agendaItem?.polls || [];
  return polls.find(poll => poll.id === pollId) || null;
},

submitVote: async (eventId, agendaId, pollId, optionId) => {
  const response = await axiosClient.post(
    `/events/${eventId}/agenda/${agendaId}/polls/${pollId}/vote`, 
    { optionId }
  );
  return response.data;
}
```

**Changes**:
- All methods now require `eventId` and `agendaId` parameters
- GET requests extract polls from nested event structure
- POST/PUT/DELETE requests use full path: `/events/{eventId}/agenda/{agendaId}/polls/...`

---

## Component Updates

### 1. AgendaPage (`src/pages/AgendaPage.jsx`)

Updated all query keys and mutation functions to include `eventId`:

```javascript
// Query Keys - Updated
['questions', eventId, agendaId]  // was: ['questions', agendaId]
['polls', eventId, agendaId]      // was: ['polls', agendaId]

// Query Functions - Updated
questionApi.getQuestions(eventId, agendaId)  // was: questionApi.getQuestions(agendaId)
pollApi.getPolls(eventId, agendaId)          // was: pollApi.getPolls(agendaId)

// Mutations - Updated
questionApi.addQuestion(eventId, agendaId, data)               // was: questionApi.addQuestion(agendaId, data)
questionApi.upvoteQuestion(eventId, agendaId, questionId)      // was: questionApi.upvoteQuestion(questionId)
questionApi.answerQuestion(eventId, agendaId, questionId, answer)  // was: questionApi.answerQuestion(questionId, answer)
pollApi.createPoll(eventId, agendaId, data)                    // was: pollApi.createPoll(agendaId, data)
pollApi.submitVote(eventId, agendaId, pollId, optionId)        // was: pollApi.submitVote(pollId, optionId)
```

Also added cache invalidation for the event query to ensure UI stays in sync:
```javascript
queryClient.invalidateQueries({ queryKey: ['event', eventId] });
```

### 2. EventDetailsPage (`src/pages/EventDetailsPage.jsx`)

Optimized to use agenda data directly from the event object instead of making a separate API call:

```javascript
// Before:
const { data: agenda, isLoading: isLoadingAgenda } = useQuery({
  queryKey: ['agenda', eventId],
  queryFn: () => agendaApi.getAgenda(eventId),
});

// After:
const agenda = event?.agenda || [];
const isLoadingAgenda = isLoadingEvent;
```

Updated mutation to invalidate the event cache:
```javascript
const addAgendaMutation = useMutation({
  mutationFn: (data) => agendaApi.addAgendaItem(eventId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['event', eventId] });  // was: ['agenda', eventId]
    toast.success('Agenda item added successfully!');
    setIsAddAgendaModalOpen(false);
    formik.resetForm();
  },
});
```

---

## Benefits

1. **Consistent with Backend**: API calls now match the actual backend resource structure
2. **Reduced API Calls**: For read operations, data is extracted from the event object (already cached)
3. **Better Cache Management**: All nested data changes invalidate the parent event cache
4. **Type Safety**: Clear parameter requirements make the API easier to use correctly
5. **RESTful Paths**: Write operations use proper resource hierarchy paths
6. **Optimized Performance**: EventDetailsPage now uses embedded agenda data, eliminating redundant API calls
7. **Single Source of Truth**: Event object contains all nested data, reducing state management complexity

---

## Testing Considerations

- Update API mocks to include nested data structures
- Ensure all components using these APIs pass the correct parameters
- Test cache invalidation to verify UI updates correctly after mutations
- Verify error handling when nested data is missing

---

## Migration Checklist

- [x] Updated `attendeeApi.js`
- [x] Updated `agendaApi.js`
- [x] Updated `questionApi.js`
- [x] Updated `pollApi.js`
- [x] Updated `AgendaPage.jsx`
- [x] Updated `EventDetailsPage.jsx` to use embedded agenda data
- [x] Updated all cache invalidation to target event cache
- [ ] Update test files if API behavior changes are tested
- [ ] Update API documentation
- [ ] Manual testing of all CRUD operations
- [ ] Verify error handling for missing nested data
