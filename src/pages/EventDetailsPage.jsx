import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  SparklesIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { eventApi } from '../api/eventApi';
import { agendaApi } from '../api/agendaApi';
import AgendaTimeline from '../components/AgendaTimeline';
import AttendeeList from '../components/AttendeeList';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Spinner from '../components/UI/Spinner';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddAgendaModalOpen, setIsAddAgendaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda'); // 'agenda', 'attendees', or 'summary'
  const [editingAgenda, setEditingAgenda] = useState(null);

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.getEvent(eventId),
  });

  // Extract agenda from event object (it's embedded in the response)
  const agenda = event?.agenda || [];

  // Fetch all agenda items separately for timeline view
  const { data: agendaItems, isLoading: isLoadingAgendaItems } = useQuery({
    queryKey: ['agenda', eventId],
    queryFn: () => agendaApi.getAgenda(eventId),
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['eventSummary', eventId],
    queryFn: () => eventApi.getEventSummary(eventId),
    enabled: activeTab === 'summary', // Only fetch when Summary tab is active
  });

  const addAgendaMutation = useMutation({
    mutationFn: (data) => agendaApi.addAgendaItem(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['agenda', eventId] });
      toast.success('Agenda item added successfully!');
      setIsAddAgendaModalOpen(false);
      formik.resetForm();
      setEditingAgenda(null);
    },
  });

  const updateAgendaMutation = useMutation({
    mutationFn: ({ agendaId, data }) => agendaApi.updateAgendaItem(eventId, agendaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['agenda', eventId] });
      toast.success('Agenda item updated successfully!');
      setIsAddAgendaModalOpen(false);
      formik.resetForm();
      setEditingAgenda(null);
    },
  });

  const deleteAgendaMutation = useMutation({
    mutationFn: (agendaId) => agendaApi.deleteAgendaItem(eventId, agendaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['agenda', eventId] });
      toast.success('Agenda item deleted successfully!');
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
      location: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string(),
      startTime: Yup.string().required('Start time is required'),
      endTime: Yup.string().required('End time is required'),
      speaker: Yup.string(),
      location: Yup.string(),
    }),
    onSubmit: (values) => {
      if (editingAgenda) {
        updateAgendaMutation.mutate({ agendaId: editingAgenda.id, data: values });
      } else {
        addAgendaMutation.mutate(values);
      }
    },
  });

  const handleEditAgenda = (agenda) => {
    setEditingAgenda(agenda);
    
    // Extract time from DateTime string (e.g., "2025-12-01T09:00:00" -> "09:00")
    const extractTime = (dateTimeString) => {
      if (!dateTimeString) return '';
      const timePart = dateTimeString.split('T')[1];
      return timePart ? timePart.substring(0, 5) : dateTimeString;
    };
    
    formik.setValues({
      title: agenda.title,
      description: agenda.description || '',
      speaker: agenda.speaker || '',
      startTime: extractTime(agenda.startTime),
      endTime: extractTime(agenda.endTime),
      location: agenda.location || '',
    });
    setIsAddAgendaModalOpen(true);
  };

  const handleDeleteAgenda = (agendaId) => {
    deleteAgendaMutation.mutate(agendaId);
  };

  const handleAddNewAgenda = () => {
    setEditingAgenda(null);
    formik.resetForm();
    setIsAddAgendaModalOpen(true);
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
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('agenda')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'agenda'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setActiveTab('attendees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'attendees'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attendees
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'summary'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Summary
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agenda Section */}
            {activeTab === 'agenda' && (
              <AgendaTimeline
                event={event}
                agendaItems={agendaItems || []}
                isLoading={isLoadingAgendaItems}
                onEdit={handleEditAgenda}
                onDelete={handleDeleteAgenda}
                onAddNew={handleAddNewAgenda}
                showAddButton={true}
              />
            )}

            {/* Attendees Section */}
            {activeTab === 'attendees' && (
              <AttendeeList eventId={eventId} />
            )}

            {/* AI Summary Section */}
            {activeTab === 'summary' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                      <SparklesIcon className="h-6 w-6 mr-2" />
                      AI Generated Summary
                    </h3>
                    <button
                      onClick={() => regenerateSummaryMutation.mutate()}
                      disabled={regenerateSummaryMutation.isPending}
                      className="px-4 py-2 text-sm text-indigo-600 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {regenerateSummaryMutation.isPending ? 'Regenerating...' : 'Regenerate Summary'}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {isLoadingSummary ? (
                    <div className="flex justify-center py-12">
                      <Spinner size="lg" />
                    </div>
                  ) : summary?.cachedAiSummary ? (
                    <div>
                      <div className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1 prose-li:text-gray-700">
                        <ReactMarkdown
                          components={{
                            h3: ({ ...props }) => (
                              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0" {...props} />
                            ),
                            h2: ({ ...props }) => (
                              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 first:mt-0" {...props} />
                            ),
                            p: ({ ...props }) => (
                              <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                            ),
                            strong: ({ ...props }) => (
                              <strong className="font-semibold text-gray-900" {...props} />
                            ),
                            ul: ({ ...props }) => (
                              <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />
                            ),
                            li: ({ ...props }) => (
                              <li className="text-gray-700" {...props} />
                            ),
                          }}
                        >
                          {summary.cachedAiSummary}
                        </ReactMarkdown>
                      </div>
                      {summary.aiSummaryGeneratedAt && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500 flex items-center">
                            <SparklesIcon className="h-4 w-4 mr-1" />
                            Generated: {format(new Date(summary.aiSummaryGeneratedAt), 'MMMM dd, yyyy h:mm a')}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <SparklesIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Summary Available</h4>
                      <p className="text-gray-500 text-sm mb-6">
                        Generate an AI-powered summary of your event to get insights and highlights.
                      </p>
                      <button
                        onClick={() => regenerateSummaryMutation.mutate()}
                        disabled={regenerateSummaryMutation.isPending}
                        className="px-6 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {regenerateSummaryMutation.isPending ? 'Generating...' : 'Generate Summary'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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

      {/* Add/Edit Agenda Modal */}
      <Modal
        isOpen={isAddAgendaModalOpen}
        onClose={() => {
          setIsAddAgendaModalOpen(false);
          formik.resetForm();
          setEditingAgenda(null);
        }}
        title={editingAgenda ? 'Edit Agenda Item' : 'Add Agenda Item'}
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
              type="time"
              value={formik.values.startTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startTime && formik.errors.startTime}
            />

            <Input
              label="End Time"
              name="endTime"
              type="time"
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

          <Input
            label="Location"
            name="location"
            placeholder="Room or venue (optional)"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && formik.errors.location}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth loading={addAgendaMutation.isPending || updateAgendaMutation.isPending}>
              {editingAgenda ? 'Update' : 'Add'} Agenda Item
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsAddAgendaModalOpen(false);
                formik.resetForm();
                setEditingAgenda(null);
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
