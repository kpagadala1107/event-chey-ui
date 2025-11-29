import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  PlusIcon,
  SparklesIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { eventApi } from '../api/eventApi';
import { agendaApi } from '../api/agendaApi';
import AgendaItemCard from '../components/AgendaItemCard';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Spinner from '../components/UI/Spinner';
import EmptyState from '../components/UI/EmptyState';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddAgendaModalOpen, setIsAddAgendaModalOpen] = useState(false);

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.getEvent(eventId),
  });

  const { data: agenda, isLoading: isLoadingAgenda } = useQuery({
    queryKey: ['agenda', eventId],
    queryFn: () => agendaApi.getAgenda(eventId),
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['eventSummary', eventId],
    queryFn: () => eventApi.getEventSummary(eventId),
  });

  const addAgendaMutation = useMutation({
    mutationFn: (data) => agendaApi.addAgendaItem(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', eventId] });
      toast.success('Agenda item added successfully!');
      setIsAddAgendaModalOpen(false);
      formik.resetForm();
    },
  });

  const regenerateSummaryMutation = useMutation({
    mutationFn: () => eventApi.regenerateEventSummary(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventSummary', eventId] });
      toast.success('Summary regenerated successfully!');
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      speaker: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string(),
      startTime: Yup.string().required('Start time is required'),
      endTime: Yup.string(),
      speaker: Yup.string(),
    }),
    onSubmit: (values) => {
      addAgendaMutation.mutate(values);
    },
  });

  const handleAgendaItemClick = (agendaId, section) => {
    navigate(`/agenda/${agendaId}?tab=${section}`);
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Events
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{event?.name}</h1>
              
              <div className="mt-4 space-y-2">
                {event?.startDate && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>
                      {format(new Date(event.startDate), 'MMMM dd, yyyy')} - {' '}
                      {format(new Date(event.endDate), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                )}
                
                {event?.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>{event?.attendeeCount || 0} attendees</span>
                </div>
              </div>

              {event?.description && (
                <p className="mt-4 text-gray-600">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agenda Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Agenda</h2>
                <Button size="sm" onClick={() => setIsAddAgendaModalOpen(true)}>
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {isLoadingAgenda ? (
                <Spinner />
              ) : agenda && agenda.length > 0 ? (
                <div className="space-y-4">
                  {agenda.map((item) => (
                    <AgendaItemCard
                      key={item.id}
                      agendaItem={item}
                      onClick={(section) => handleAgendaItemClick(item.id, section)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No agenda items yet"
                  description="Add your first agenda item to get started"
                  action={
                    <Button size="sm" onClick={() => setIsAddAgendaModalOpen(true)}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  }
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Summary */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  AI Summary
                </h3>
                <button
                  onClick={() => regenerateSummaryMutation.mutate()}
                  disabled={regenerateSummaryMutation.isPending}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {regenerateSummaryMutation.isPending ? 'Generating...' : 'Refresh'}
                </button>
              </div>

              {isLoadingSummary ? (
                <Spinner size="sm" />
              ) : summary ? (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {summary.summary || summary.text || 'No summary available'}
                </p>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Summary will be generated based on event content
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Agenda Items</span>
                  <span className="font-semibold text-gray-900">{agenda?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-semibold text-gray-900">
                    {agenda?.reduce((sum, item) => sum + (item.questionCount || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Polls</span>
                  <span className="font-semibold text-gray-900">
                    {agenda?.reduce((sum, item) => sum + (item.pollCount || 0), 0) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Agenda Modal */}
      <Modal
        isOpen={isAddAgendaModalOpen}
        onClose={() => {
          setIsAddAgendaModalOpen(false);
          formik.resetForm();
        }}
        title="Add Agenda Item"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            placeholder="Enter agenda title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              name="startTime"
              type="datetime-local"
              value={formik.values.startTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startTime && formik.errors.startTime}
            />

            <Input
              label="End Time"
              name="endTime"
              type="datetime-local"
              value={formik.values.endTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.endTime && formik.errors.endTime}
            />
          </div>

          <Input
            label="Speaker"
            name="speaker"
            placeholder="Enter speaker name"
            value={formik.values.speaker}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.speaker && formik.errors.speaker}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth loading={addAgendaMutation.isPending}>
              Add Agenda Item
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsAddAgendaModalOpen(false);
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

export default EventDetailsPage;
