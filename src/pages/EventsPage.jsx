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

const EventsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

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

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Event name is required'),
      description: Yup.string(),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
      location: Yup.string(),
    }),
    onSubmit: (values) => {
      createEventMutation.mutate(values);
    },
  });

  const filteredEvents = events?.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
              <EventCard key={event.id} event={event} />
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDate && formik.errors.startDate}
            />

            <Input
              label="End Date"
              name="endDate"
              type="date"
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
