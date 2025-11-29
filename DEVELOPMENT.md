# EventChey - Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Architecture Overview

### State Management
- **React Query**: Server state management (caching, refetching, mutations)
- **React Context**: Global auth state
- **Local State**: Component-level state with useState

### Routing Structure
```
/ → Redirects to /events
/events → Event list page
/events/:eventId → Event details with agenda
/agenda/:agendaId → Agenda item with Q&A, polls, and AI summary
```

### API Integration
All API calls go through `axiosClient.js` which provides:
- Base URL configuration
- Request/response interceptors
- JWT token injection
- Centralized error handling

### Component Hierarchy
```
App
├── Layout
│   ├── Navigation
│   └── Footer
├── EventsPage
│   ├── EventCard (multiple)
│   └── CreateEventModal
├── EventDetailsPage
│   ├── AgendaItemCard (multiple)
│   └── AddAgendaModal
└── AgendaPage
    ├── QuestionsTab
    │   └── QuestionItem (multiple)
    ├── PollsTab
    │   └── PollCard (multiple)
    └── SummaryTab
```

## Key Features Implementation

### 1. Event Management
- List all events with search functionality
- Create new events with form validation
- View event details with agenda
- AI-generated event summaries

### 2. Agenda Management
- Add agenda items with time slots and speakers
- Expandable cards with quick actions
- Navigate to Q&A, polls, or full details

### 3. Q&A System
- Ask questions (anonymous or named)
- Upvote questions
- Speakers can answer questions
- Real-time updates via React Query

### 4. Polling System
- Create polls with multiple options
- Vote on polls
- View live results with animated bar charts
- Color-coded options

### 5. AI Summaries
- Auto-generated summaries for events and agenda
- Manual regeneration option
- Beautiful gradient UI

## Styling Guide

### Color System
```javascript
Primary: indigo-600 (#4f46e5)
Secondary: gray-200 (#e5e7eb)
Success: green-600 (#16a34a)
Error: red-600 (#dc2626)
Warning: yellow-600 (#ca8a04)
```

### Spacing Scale
```
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
```

### Typography
```
Heading 1: text-3xl font-bold
Heading 2: text-2xl font-semibold
Heading 3: text-xl font-semibold
Body: text-base
Small: text-sm
```

### Component Patterns

#### Card
```jsx
<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6">
  {/* Content */}
</div>
```

#### Button
```jsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

#### Input
```jsx
<Input
  label="Email"
  type="email"
  error={formik.errors.email}
/>
```

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Mock external dependencies
- Focus on user interactions

### Integration Tests
- Test component interactions
- Mock API calls
- Test routing navigation

### Test Coverage Goals
- Components: 80%+
- Utilities: 90%+
- API clients: 70%+

## Performance Optimization

### React Query Configuration
```javascript
{
  refetchOnWindowFocus: false, // Prevent unnecessary refetches
  retry: 1,                     // Retry failed requests once
  staleTime: 5 * 60 * 1000,    // Cache for 5 minutes
}
```

### Code Splitting
- Lazy load heavy components
- Dynamic imports for large libraries
- Route-based splitting

### Image Optimization
- Use WebP format
- Lazy load images
- Provide responsive sizes

## Deployment Checklist

- [ ] Update API URL in .env
- [ ] Run production build
- [ ] Test in production mode
- [ ] Check bundle size
- [ ] Verify all routes work
- [ ] Test on mobile devices
- [ ] Check accessibility
- [ ] Monitor error logging

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Troubleshooting

### API Connection Issues
1. Check .env file configuration
2. Verify backend is running
3. Check CORS settings
4. Inspect network tab in DevTools

### Build Errors
1. Clear node_modules and reinstall
2. Clear npm cache: `npm cache clean --force`
3. Delete build folder: `rm -rf build`
4. Rebuild: `npm run build`

### React Query Issues
1. Check QueryClientProvider is wrapping app
2. Verify query keys are correct
3. Check network tab for API responses
4. Use React Query DevTools for debugging

## Best Practices

### Component Design
- Keep components small and focused
- Use composition over inheritance
- Extract reusable logic to custom hooks
- Props should be explicit and typed

### State Management
- Use React Query for server state
- Use Context sparingly (auth, theme, etc.)
- Keep local state close to where it's used
- Avoid prop drilling

### Code Style
- Use meaningful variable names
- Keep functions pure when possible
- Add comments for complex logic
- Use ESLint and Prettier

### Git Workflow
- Feature branches for new work
- Meaningful commit messages
- Pull requests for code review
- Keep main branch stable

## Resources

- [React Documentation](https://react.dev)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Formik Documentation](https://formik.org)
- [Recharts Documentation](https://recharts.org)
