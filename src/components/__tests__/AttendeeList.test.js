import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import AttendeeList from '../AttendeeList';
import { attendeeApi } from '../../api/attendeeApi';
import '@testing-library/jest-dom';

// Mock the API
jest.mock('../../api/attendeeApi');

// Mock toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('AttendeeList', () => {
  const mockAttendees = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'confirmed',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'declined',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    attendeeApi.getAttendees.mockImplementation(() => new Promise(() => {}));
    
    render(<AttendeeList eventId="event-1" />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders attendee list successfully', async () => {
    attendeeApi.getAttendees.mockResolvedValue(mockAttendees);
    
    render(<AttendeeList eventId="event-1" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  it('displays correct statistics', async () => {
    attendeeApi.getAttendees.mockResolvedValue(mockAttendees);
    
    render(<AttendeeList eventId="event-1" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Total
      expect(screen.getByText('1')).toBeInTheDocument(); // Confirmed
      expect(screen.getByText('1')).toBeInTheDocument(); // Pending
      expect(screen.getByText('1')).toBeInTheDocument(); // Declined
    });
  });

  it('filters attendees by status', async () => {
    attendeeApi.getAttendees.mockResolvedValue(mockAttendees);
    
    render(<AttendeeList eventId="event-1" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click on confirmed filter
    const confirmedButton = screen.getByText('Confirmed');
    fireEvent.click(confirmedButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
    });
  });

  it('opens invite modal when clicking invite button', async () => {
    attendeeApi.getAttendees.mockResolvedValue(mockAttendees);
    
    render(<AttendeeList eventId="event-1" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const inviteButton = screen.getByText('Invite Attendees');
    fireEvent.click(inviteButton);

    await waitFor(() => {
      expect(screen.getByText('Send Invitations')).toBeInTheDocument();
    });
  });

  it('shows empty state when no attendees', async () => {
    attendeeApi.getAttendees.mockResolvedValue([]);
    
    render(<AttendeeList eventId="event-1" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('No attendees yet')).toBeInTheDocument();
      expect(screen.getByText('Invite attendees to get started')).toBeInTheDocument();
    });
  });

  it('removes attendee when delete button is clicked', async () => {
    attendeeApi.getAttendees.mockResolvedValue(mockAttendees);
    attendeeApi.removeAttendee.mockResolvedValue({});
    
    // Mock window.confirm
    global.confirm = jest.fn(() => true);
    
    render(<AttendeeList eventId="event-1" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const deleteButton = deleteButtons.find(btn => btn.querySelector('svg'));
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    await waitFor(() => {
      expect(attendeeApi.removeAttendee).toHaveBeenCalled();
    });
  });
});
