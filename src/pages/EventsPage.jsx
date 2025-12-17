import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '../api/eventApi';
import EventCard from '../components/EventCard';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Spinner from '../components/UI/Spinner';
import EmptyState from '../components/UI/EmptyState';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('organized'); // organized, invited, going, declined
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: eventApi.getEvents,
  });

  const createEventMutation = useMutation({
    mutationFn: eventApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully!');
      setIsCreateModalOpen(false);
      formik.resetForm();
    },
  });

  const handleEventUpdated = (updatedEvent) => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    toast.success('Event updated successfully!');
  };

const formik = useFormik({
  initialValues: {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    createdBy: '', // Added createdBy
  },
  validationSchema: Yup.object({
    name: Yup.string().required('Event name is required'),
    description: Yup.string(),
    startDate: Yup.string().required('Start date and time is required'),
    endDate: Yup.string()
      .required('End date and time is required')
      .test(
        'is-after-start',
        'End date must be after start date',
        function (value) {
          const { startDate } = this.parent;
          return !startDate || !value || new Date(value) > new Date(startDate);
        }
      ),
    location: Yup.string(),
    createdBy: Yup.string(), // Add validation if required
  }),
  onSubmit: (values) => {
    const payload = {
      ...values,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };
    createEventMutation.mutate(payload);
  },
});

  const filteredEvents = events?.filter(event => {
    // First filter by tab
    let matchesTab = false;
    
    switch (activeTab) {
      case 'organized':
        matchesTab = event.createdBy === user?.id || event.createdBy === user?.email;
        break;
      case 'invited':
        matchesTab = event.attendees?.some(
          attendee => 
            (attendee.email === user?.email || attendee.id === user?.id) && 
            attendee.status?.toLowerCase() === 'pending'
        );
        break;
      case 'going':
        matchesTab = event.attendees?.some(
          attendee => 
            (attendee.email === user?.email || attendee.id === user?.id) && 
            ['accepted', 'confirmed'].includes(attendee.status?.toLowerCase())
        );
        break;
      case 'declined':
        matchesTab = event.attendees?.some(
          attendee => 
            (attendee.email === user?.email || attendee.id === user?.id) && 
            attendee.status?.toLowerCase() === 'declined'
        );
        break;
      default:
        matchesTab = true;
    }
    
    // Then filter by search query
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  }) || [];

  const tabs = [
    { id: 'organized', label: 'Organized', count: events?.filter(e => e.createdBy === user?.id || e.createdBy === user?.email).length || 0 },
    { id: 'invited', label: 'Invited', count: events?.filter(e => e.attendees?.some(a => (a.email === user?.email || a.id === user?.id) && a.status?.toLowerCase() === 'pending')).length || 0 },
    { id: 'going', label: 'Going', count: events?.filter(e => e.attendees?.some(a => (a.email === user?.email || a.id === user?.id) && ['accepted', 'confirmed'].includes(a.status?.toLowerCase()))).length || 0 },
    { id: 'declined', label: 'Declined', count: events?.filter(e => e.attendees?.some(a => (a.email === user?.email || a.id === user?.id) && a.status?.toLowerCase() === 'declined')).length || 0 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load events</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['events'] })}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-gray-600 mt-1">Manage and view all your events</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2 inline" />
              Create Event
            </Button>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDaysIcon}
            title={searchQuery ? 'No events found' : 'No events yet'}
            description={
              searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by creating your first event'
            }
            action={
              !searchQuery && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <PlusIcon className="h-5 w-5 mr-2 inline" />
                  Create Event
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onEventUpdated={handleEventUpdated} />
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          formik.resetForm();
        }}
        title="Create New Event"
        size="lg"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            label="Event Name"
            name="name"
            placeholder="Enter event name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter event description"
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <Input
            label="Created By"
            name="createdBy"
            placeholder="Enter creator's name"
            value={formik.values.createdBy}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.createdBy && formik.errors.createdBy}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="datetime-local"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDate && formik.errors.startDate}
            />

            <Input
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.endDate && formik.errors.endDate}
            />
          </div>

          <Input
            label="Location"
            name="location"
            placeholder="Enter event location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && formik.errors.location}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              fullWidth
              loading={createEventMutation.isPending}
            >
              Create Event
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsCreateModalOpen(false);
                formik.resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventsPage;
