# Single Answer Per Question - Implementation Summary

## Overview

The Q&A feature allows **one answer per question** that can be submitted and edited by anyone (both attendees and speakers). This creates a collaborative, wiki-style approach where the community can refine the best answer to each question.

## Features Implemented

### 1. **Single Answer Model**
- Each question can have only one answer
- If no answer exists, users see an input form to submit an answer
- If an answer exists, it's displayed with an edit button
- No ability to add multiple answers per question

### 2. **Inline Edit Capability**
- A pencil icon edit button appears next to the answer
- Visible to all users (attendees and speakers)
- Clicking edit replaces the answer display with an editable textarea
- Pre-populates with the existing answer text

### 3. **Unified Answer Form**
- Same form used for both new answers and editing
- Shows "Submit Answer" for new answers
- Shows "Save Changes" when editing
- Cancel button only appears during editing
- Auto-focuses the textarea when opened

### 4. **Status Indicator**
- Questions show "Answered" badge when they have an answer
- Green checkmark icon for visual clarity
- Replaces the answer count that was shown before

## Files Modified

### 1. `src/components/QuestionItem.jsx`
**Changes:**
- Added `PencilIcon` and `CheckCircleIcon` imports from Heroicons
- Removed `ChatBubbleLeftIcon` and `AnimatePresence` (no longer needed)
- Simplified state management:
  - `isEditing`: Boolean to track if answer is being edited
  - `answerText`: Stores both new and edited answer text
  - Removed multiple answer tracking
- Added helper variables:
  - `hasAnswer`: Checks if question has an answer
  - `currentAnswer`: Gets the single answer text
- Unified handler functions:
  - `handleSubmitOrEdit()`: Handles both new submissions and edits
  - `handleEditClick()`: Initiates edit mode
  - `handleCancel()`: Cancels editing
- Updated UI:
  - Single answer display with edit button
  - Unified form for new/edit with conditional text
  - "Answered" badge instead of answer count
  - Auto-focus on textarea when editing

### 2. `src/api/questionApi.js`
**Changes:**
- Added `editAnswer()` API method
- Endpoint: `PUT /events/{eventId}/agenda/{agendaId}/questions/{questionId}/answers/{answerIndex}`
- Accepts `{ answer }` in request body

### 3. `src/pages/AgendaPage.jsx`
**Changes:**
- Added `editAnswerMutation` using `useMutation` hook
- Configured to invalidate queries on success
- Added toast notification for successful updates
- Updated `QuestionItem` component to include `onEditAnswer` prop
- Connected mutation to component via callback

## API Endpoint

```javascript
PUT /events/{eventId}/agenda/{agendaId}/questions/{questionId}/answers/{answerIndex}

Request Body:
{
  "answer": "Updated answer text"
}

Response:
{
  // Updated question object with modified answer
}
```

## Usage Example

### For All Users (Attendees & Speakers):

**Answering an unanswered question:**
1. Navigate to an agenda item's Questions tab
2. View a question without an answer
3. The answer form is automatically visible below the question
4. Type your answer in the textarea
5. Click "Submit Answer"
6. Answer appears with "Answered" badge and edit button

**Editing an existing answer:**
1. View a question that already has an answer
2. Click the pencil icon next to the answer
3. The answer transforms into an editable textarea
4. Make your changes
5. Click "Save Changes" to update or "Cancel" to discard
6. See success notification on save

### Component Usage:
```jsx
<QuestionItem
  question={question}
  onUpvote={(id) => upvoteMutation.mutate(id)}
  onAnswer={(id, answer) => answerMutation.mutate({ questionId: id, answer })}
  onEditAnswer={(questionId, answerIndex, answer) => 
    editAnswerMutation.mutate({ questionId, answerIndex, answer })
  }
/>
```

## Permission Control

- **No restrictions**: All users can submit the single answer to any question
- **No restrictions**: All users can edit the existing answer
- **Collaborative model**: Anyone can improve the answer
- **Wiki-style approach**: Community-driven answer refinement

## Design Philosophy

This single-answer model promotes:
- **Quality over quantity**: Focus on one great answer rather than many mediocre ones
- **Collaboration**: Everyone works together to improve the answer
- **Simplicity**: Clear, uncluttered UI with one definitive answer per question
- **Continuous improvement**: Answers can be refined and updated as needed

## State Management

- Uses React Query for server state synchronization
- Optimistic UI updates via query invalidation
- Local component state for edit mode management
- No global state modifications required

## Styling

- Consistent with existing answer display styling
- Indigo color scheme for edit button and interactions
- Smooth hover transitions
- Proper spacing and padding maintained
- Responsive design preserved

## Error Handling

- Empty answer validation before save
- API error handling via React Query
- Toast notifications for user feedback
- Graceful fallback to view mode on errors

## Future Enhancements

Potential improvements for future iterations:

1. **Answer History**: Track all edits with timestamps and author names
2. **Edit Permissions**: Optional setting to restrict editing to answer author only
3. **Version Comparison**: Show diff between answer versions
4. **Approval System**: Optional speaker approval before answer is published
5. **Rich Text Editor**: Support for formatted text, links, and code blocks
6. **Answer Lock**: Allow locking an answer once it's finalized
7. **Answer Attribution**: Better display of who last edited the answer
8. **Upvote Answer**: Allow users to upvote the answer quality
9. **Answer Comments**: Add discussion threads below answers

## Testing Recommendations

1. **Unit Tests**:
   - Test edit mode toggling
   - Test save/cancel handlers
   - Test permission-based rendering

2. **Integration Tests**:
   - Test API call with correct parameters
   - Test query invalidation
   - Test error scenarios

3. **E2E Tests**:
   - Test complete edit workflow
   - Test permission restrictions
   - Test multiple concurrent edits

## Dependencies

No new dependencies added. Uses existing packages:
- React (hooks)
- Heroicons (PencilIcon)
- React Query (mutations)
- React Hot Toast (notifications)
