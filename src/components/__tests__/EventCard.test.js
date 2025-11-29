import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventCard from '../components/EventCard';

const mockEvent = {
  id: 1,
  name: 'Tech Conference 2025',
  description: 'Annual technology conference',
  startDate: '2025-06-01',
  endDate: '2025-06-03',
  location: 'San Francisco, CA',
  attendeeCount: 500,
  status: 'UPCOMING',
  tags: ['Technology', 'Innovation', 'AI'],
};

describe('EventCard Component', () => {
  test('renders event card with event name', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Tech Conference 2025')).toBeInTheDocument();
  });

  test('displays event description', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Annual technology conference')).toBeInTheDocument();
  });

  test('shows attendee count', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('500 attendees')).toBeInTheDocument();
  });

  test('displays location', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  test('renders event status badge', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('UPCOMING')).toBeInTheDocument();
  });

  test('displays event tags', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Innovation')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });
});
