import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  PlusIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { agendaApi } from '../api/agendaApi';
import { eventApi } from '../api/eventApi';
import { questionApi } from '../api/questionApi';
import { pollApi } from '../api/pollApi';
import QuestionItem from '../components/QuestionItem';
import PollCard from '../components/PollCard';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Spinner from '../components/UI/Spinner';
import EmptyState from '../components/UI/EmptyState';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const AgendaPage = () => {
  const { eventId, agendaId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || (agendaId ? 'summary' : 'timeline');
  const queryClient = useQueryClient();

  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isAddPollModalOpen, setIsAddPollModalOpen] = useState(false);
  const [isAddAgendaModalOpen, setIsAddAgendaModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [editingAgenda, setEditingAgenda] = useState(null);

  // Fetch event details for date range
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.getEvent(eventId),
  });

  // Fetch all agenda items for timeline view
  const { data: agendaItems, isLoading: isLoadingAgendaItems } = useQuery({
    queryKey: ['agenda', eventId],
    queryFn: () => agendaApi.getAgenda(eventId),
  });

  const { data: agendaItem, isLoading: isLoadingAgenda } = useQuery({
    queryKey: ['agendaItem', eventId, agendaId],
    queryFn: () => agendaApi.getAgendaItem(eventId, agendaId),
    enabled: !!agendaId,
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', eventId, agendaId],
    queryFn: () => questionApi.getQuestions(eventId, agendaId),
    enabled: !!agendaId && activeTab === 'questions',
  });

  const { data: polls, isLoading: isLoadingPolls } = useQuery({
    queryKey: ['polls', eventId, agendaId],
    queryFn: () => pollApi.getPolls(eventId, agendaId),
    enabled: !!agendaId && activeTab === 'polls',
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['agendaSummary', eventId, agendaId],
    queryFn: () => agendaApi.getAgendaSummary(eventId, agendaId),
    enabled: !!agendaId && activeTab === 'summary',
  });

  const addQuestionMutation = useMutation({
    mutationFn: (data) => questionApi.addQuestion(eventId, agendaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', eventId, agendaId] });
      queryClient.invalidateQueries({ queryKey: ['agendaItem', eventId, agendaId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Question added successfully!');
      setIsAddQuestionModalOpen(false);
      questionFormik.resetForm();
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: (questionId) => questionApi.upvoteQuestion(eventId, agendaId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', eventId, agendaId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ questionId, answer }) => questionApi.answerQuestion(eventId, agendaId, questionId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', eventId, agendaId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Answer submitted successfully!');
    },
  });

  const createPollMutation = useMutation({
    mutationFn: (data) => pollApi.createPoll(eventId, agendaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls', eventId, agendaId] });
      queryClient.invalidateQueries({ queryKey: ['agendaItem', eventId, agendaId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Poll created successfully!');
      setIsAddPollModalOpen(false);
      pollFormik.resetForm();
      setPollOptions(['', '']);
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ pollId, optionId }) => pollApi.submitVote(eventId, agendaId, pollId, optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls', eventId, agendaId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Vote submitted successfully!');
    },
  });

  const regenerateSummaryMutation = useMutation({
    mutationFn: () => agendaApi.regenerateAgendaSummary(eventId, agendaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendaSummary', eventId, agendaId] });
      toast.success('Summary regenerated successfully!');
    },
  });

  const addAgendaMutation = useMutation({
    mutationFn: (data) => agendaApi.addAgendaItem(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Agenda item added successfully!');
      setIsAddAgendaModalOpen(false);
      agendaFormik.resetForm();
      setEditingAgenda(null);
    },
  });

  const updateAgendaMutation = useMutation({
    mutationFn: ({ agendaId, data }) => agendaApi.updateAgendaItem(eventId, agendaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Agenda item updated successfully!');
      setIsAddAgendaModalOpen(false);
      agendaFormik.resetForm();
      setEditingAgenda(null);
    },
  });

  const deleteAgendaMutation = useMutation({
    mutationFn: (agendaId) => agendaApi.deleteAgendaItem(eventId, agendaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Agenda item deleted successfully!');
    },
  });

  const questionFormik = useFormik({
    initialValues: {
      question: '',
      askedBy: '',
    },
    validationSchema: Yup.object({
      question: Yup.string().required('Question is required'),
      askedBy: Yup.string(),
    }),
    onSubmit: (values) => {
      addQuestionMutation.mutate(values);
    },
  });

  const pollFormik = useFormik({
    initialValues: {
      question: '',
    },
    validationSchema: Yup.object({
      question: Yup.string().required('Poll question is required'),
    }),
    onSubmit: (values) => {
      const validOptions = pollOptions.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        toast.error('Please provide at least 2 options');
        return;
      }
      createPollMutation.mutate({
        ...values,
        options: validOptions,
      });
    },
  });

  const agendaFormik = useFormik({
    initialValues: {
      title: '',
      description: '',
      speaker: '',
      startTime: '',
      endTime: '',
      location: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      startTime: Yup.string().required('Start time is required'),
      endTime: Yup.string()
        .required('End time is required')
        .test('is-after', 'End time must be after start time', function(value) {
          const { startTime } = this.parent;
          return !startTime || !value || value > startTime;
        }),
      speaker: Yup.string(),
      location: Yup.string(),
    }),
    onSubmit: (values) => {
      // Combine date with time to create full DateTime strings
      const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const agendaData = {
        title: values.title,
        description: values.description,
        speaker: values.speaker,
        location: values.location,
        startTime: `${dateString}T${values.startTime}:00`, // YYYY-MM-DDTHH:mm:ss
        endTime: `${dateString}T${values.endTime}:00`,     // YYYY-MM-DDTHH:mm:ss
        date: dateString, // Keep date field for filtering
      };
      
      if (editingAgenda) {
        updateAgendaMutation.mutate({ agendaId: editingAgenda.id, data: agendaData });
      } else {
        addAgendaMutation.mutate(agendaData);
      }
    },
  });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  // Generate time slots (6 AM to 11 PM in 30-min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 23) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get dates between start and end
  const getEventDates = () => {
    if (!event) return [];
    const dates = [];
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const eventDates = getEventDates();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleEditAgenda = (agenda) => {
    setEditingAgenda(agenda);
    
    // Extract time from DateTime string (e.g., "2025-12-01T09:00:00" -> "09:00")
    const extractTime = (dateTimeString) => {
      if (!dateTimeString) return '';
      const timePart = dateTimeString.split('T')[1];
      return timePart ? timePart.substring(0, 5) : dateTimeString; // Get HH:mm
    };
    
    agendaFormik.setValues({
      title: agenda.title,
      description: agenda.description || '',
      speaker: agenda.speaker || '',
      startTime: extractTime(agenda.startTime),
      endTime: extractTime(agenda.endTime),
      location: agenda.location || '',
    });
    setSelectedDate(new Date(agenda.date));
    setIsAddAgendaModalOpen(true);
  };

  const handleViewAgenda = (agenda) => {
    navigate(`/events/${eventId}/agenda/${agenda.id}?tab=questions`);
  };

  // Calculate agenda item position on timeline
  const getAgendaPosition = (startTime, endTime) => {
    // Extract time from DateTime format if needed (e.g., "2025-12-01T09:00:00" -> "09:00")
    const extractTime = (timeString) => {
      if (!timeString) return '00:00';
      if (timeString.includes('T')) {
        const timePart = timeString.split('T')[1];
        return timePart ? timePart.substring(0, 5) : timeString;
      }
      return timeString;
    };
    
    const startTimeStr = extractTime(startTime);
    const endTimeStr = extractTime(endTime);
    
    const startMinutes = parseInt(startTimeStr.split(':')[0]) * 60 + parseInt(startTimeStr.split(':')[1]);
    const endMinutes = parseInt(endTimeStr.split(':')[0]) * 60 + parseInt(endTimeStr.split(':')[1]);
    const dayStart = 6 * 60; // 6 AM
    const dayEnd = 23 * 60; // 11 PM
    
    const top = ((startMinutes - dayStart) / (dayEnd - dayStart)) * 100;
    const height = ((endMinutes - startMinutes) / (dayEnd - dayStart)) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  if (isLoadingAgenda && agendaId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // If we have agendaId, show the detail view with tabs
  const showDetailView = !!agendaId;

  // Handle back navigation
  const handleBackNavigation = () => {
    if (showDetailView) {
      // If viewing specific agenda item, go to event details page with agenda tab
      navigate(`/events/${eventId}`);
    } else {
      // If viewing timeline, go back to events list or previous page
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackNavigation}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back {showDetailView ? 'to Event' : ''}
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            {showDetailView ? agendaItem?.title : (event?.name || 'Event Agenda')}
          </h1>
          {showDetailView && agendaItem?.description && (
            <p className="mt-2 text-gray-600">{agendaItem.description}</p>
          )}
          {showDetailView && agendaItem?.speaker && (
            <p className="mt-2 text-sm text-gray-500">Speaker: {agendaItem.speaker}</p>
          )}

          {/* Tabs - Only show detail tabs when viewing a specific agenda item */}
          {showDetailView && (
            <div className="mt-6 flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setTab('summary')}
                className={`pb-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'summary'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SparklesIcon className="h-5 w-5 inline mr-2" />
                AI Summary
              </button>
              <button
                onClick={() => setTab('questions')}
                className={`pb-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'questions'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                Questions & Answers
              </button>
              <button
                onClick={() => setTab('polls')}
                className={`pb-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'polls'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 inline mr-2" />
                Polls
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timeline Tab - Only show when not viewing a specific agenda item */}
        {!showDetailView && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Agenda Timeline</h2>
              <Button onClick={() => setIsAddAgendaModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Agenda Item
              </Button>
            </div>

            {/* Date Selector */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Select Date</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {eventDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedDate.toDateString() === date.toDateString()
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline View */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex">
                {/* Time Column */}
                <div className="w-20 bg-gray-50 border-r border-gray-200">
                  <div className="h-12 border-b border-gray-200 flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="relative" style={{ height: '1020px' }}>
                    {timeSlots.map((time, index) => (
                      <div
                        key={time}
                        className="absolute w-full border-t border-gray-200 text-xs text-gray-500 px-2 py-1"
                        style={{ top: `${(index / timeSlots.length) * 100}%` }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agenda Items Column */}
                <div className="flex-1 relative">
                  <div className="h-12 border-b border-gray-200 flex items-center px-4">
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(selectedDate)}
                    </span>
                  </div>
                  <div className="relative" style={{ height: '1020px' }}>
                    {/* Grid Lines */}
                    {timeSlots.map((time, index) => (
                      <div
                        key={time}
                        className="absolute w-full border-t border-gray-100"
                        style={{ top: `${(index / timeSlots.length) * 100}%` }}
                      />
                    ))}

                    {/* Agenda Items */}
                    {isLoadingAgendaItems ? (
                      <div className="flex items-center justify-center h-full">
                        <Spinner />
                      </div>
                    ) : agendaItems && agendaItems.length > 0 ? (
                      (() => {
                        // Extract date from startTime (DateTime format: "2025-12-21T13:40:00")
                        const filteredItems = agendaItems.filter(item => {
                          if (!item.startTime) return false;
                          const itemDate = item.startTime.split('T')[0]; // Extract YYYY-MM-DD
                          const selectedDateStr = selectedDate.toISOString().split('T')[0];
                          return itemDate === selectedDateStr;
                        });
                        
                        return filteredItems.length > 0 ? filteredItems.map((item) => {
                          const position = getAgendaPosition(item.startTime, item.endTime);
                          
                          // Format time for display (extract HH:mm from DateTime)
                          const formatTimeDisplay = (timeString) => {
                            if (!timeString) return '';
                            if (timeString.includes('T')) {
                              const timePart = timeString.split('T')[1];
                              return timePart ? timePart.substring(0, 5) : timeString;
                            }
                            return timeString;
                          };
                          
                          return (
                            <div
                              key={item.id}
                              className="absolute left-2 right-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-3 cursor-pointer hover:shadow-lg transition-all group"
                              style={position}
                              onClick={() => handleViewAgenda(item)}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-white font-semibold text-sm line-clamp-1">
                                  {item.title}
                                </h3>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditAgenda(item);
                                    }}
                                    className="p-1 bg-white/20 rounded hover:bg-white/30"
                                  >
                                    <PencilIcon className="h-3 w-3 text-white" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm('Are you sure you want to delete this agenda item?')) {
                                        deleteAgendaMutation.mutate(item.id);
                                      }
                                    }}
                                    className="p-1 bg-white/20 rounded hover:bg-white/30"
                                  >
                                    <TrashIcon className="h-3 w-3 text-white" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-white/90 text-xs mb-1">
                                {formatTimeDisplay(item.startTime)} - {formatTimeDisplay(item.endTime)}
                              </p>
                              {item.speaker && (
                                <p className="text-white/80 text-xs line-clamp-1">
                                  👤 {item.speaker}
                                </p>
                              )}
                              {item.location && (
                                <p className="text-white/80 text-xs line-clamp-1">
                                  📍 {item.location}
                                </p>
                              )}
                            </div>
                          );
                        }) : (
                          <div className="flex items-center justify-center h-full">
                            <EmptyState
                              icon={CalendarIcon}
                              title="No agenda items for this date"
                              description="Add your first agenda item for this day"
                              action={
                                <Button onClick={() => setIsAddAgendaModalOpen(true)}>
                                  <PlusIcon className="h-5 w-5 mr-2" />
                                  Add Agenda Item
                                </Button>
                              }
                            />
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <EmptyState
                          icon={CalendarIcon}
                          title="No agenda items"
                          description="Add your first agenda item for this day"
                          action={
                            <Button onClick={() => setIsAddAgendaModalOpen(true)}>
                              <PlusIcon className="h-5 w-5 mr-2" />
                              Add Agenda Item
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">AI Summary</h2>
              <Button
                variant="outline"
                onClick={() => regenerateSummaryMutation.mutate()}
                loading={regenerateSummaryMutation.isPending}
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Regenerate
              </Button>
            </div>

            {isLoadingSummary ? (
              <Spinner />
            ) : (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-8 border border-indigo-100">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {summary?.summary || summary?.text || 'No summary available. The AI summary will be generated based on the agenda content, questions, and poll results.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Questions & Answers</h2>
              <Button onClick={() => setIsAddQuestionModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Ask Question
              </Button>
            </div>

            {isLoadingQuestions ? (
              <Spinner />
            ) : questions && questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    onUpvote={(id) => upvoteMutation.mutate(id)}
                    onAnswer={(id, answer) => answerMutation.mutate({ questionId: id, answer })}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ChatBubbleLeftRightIcon}
                title="No questions yet"
                description="Be the first to ask a question"
                action={
                  <Button onClick={() => setIsAddQuestionModalOpen(true)}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Ask Question
                  </Button>
                }
              />
            )}
          </div>
        )}

        {/* Polls Tab */}
        {activeTab === 'polls' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Polls</h2>
              <Button onClick={() => setIsAddPollModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Poll
              </Button>
            </div>

            {isLoadingPolls ? (
              <Spinner />
            ) : polls && polls.length > 0 ? (
              <div className="space-y-6">
                {polls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    onVote={(pollId, optionId) => voteMutation.mutate({ pollId, optionId })}
                    hasVoted={poll.hasVoted}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ChartBarIcon}
                title="No polls yet"
                description="Create your first poll to gather audience feedback"
                action={
                  <Button onClick={() => setIsAddPollModalOpen(true)}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Poll
                  </Button>
                }
              />
            )}
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      <Modal
        isOpen={isAddQuestionModalOpen}
        onClose={() => {
          setIsAddQuestionModalOpen(false);
          questionFormik.resetForm();
        }}
        title="Ask a Question"
      >
        <form onSubmit={questionFormik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Question
            </label>
            <textarea
              name="question"
              placeholder="Type your question here..."
              rows={4}
              value={questionFormik.values.question}
              onChange={questionFormik.handleChange}
              onBlur={questionFormik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            {questionFormik.touched.question && questionFormik.errors.question && (
              <p className="mt-1 text-sm text-red-600">{questionFormik.errors.question}</p>
            )}
          </div>

          <Input
            label="Your Name (Optional)"
            name="askedBy"
            placeholder="Enter your name"
            value={questionFormik.values.askedBy}
            onChange={questionFormik.handleChange}
            onBlur={questionFormik.handleBlur}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth loading={addQuestionMutation.isPending}>
              Submit Question
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsAddQuestionModalOpen(false);
                questionFormik.resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Poll Modal */}
      <Modal
        isOpen={isAddPollModalOpen}
        onClose={() => {
          setIsAddPollModalOpen(false);
          pollFormik.resetForm();
          setPollOptions(['', '']);
        }}
        title="Create Poll"
        size="lg"
      >
        <form onSubmit={pollFormik.handleSubmit} className="space-y-4">
          <Input
            label="Poll Question"
            name="question"
            placeholder="Enter your poll question"
            value={pollFormik.values.question}
            onChange={pollFormik.handleChange}
            onBlur={pollFormik.handleBlur}
            error={pollFormik.touched.question && pollFormik.errors.question}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    fullWidth
                  />
                  {pollOptions.length > 2 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removePollOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addPollOption}
              className="mt-2"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth loading={createPollMutation.isPending}>
              Create Poll
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsAddPollModalOpen(false);
                pollFormik.resetForm();
                setPollOptions(['', '']);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add/Edit Agenda Modal */}
      <Modal
        isOpen={isAddAgendaModalOpen}
        onClose={() => {
          setIsAddAgendaModalOpen(false);
          agendaFormik.resetForm();
          setEditingAgenda(null);
        }}
        title={editingAgenda ? 'Edit Agenda Item' : 'Add Agenda Item'}
        size="lg"
      >
        <form onSubmit={agendaFormik.handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            placeholder="e.g., Keynote Speech"
            value={agendaFormik.values.title}
            onChange={agendaFormik.handleChange}
            onBlur={agendaFormik.handleBlur}
            error={agendaFormik.touched.title && agendaFormik.errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the agenda item"
              rows={3}
              value={agendaFormik.values.description}
              onChange={agendaFormik.handleChange}
              onBlur={agendaFormik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              name="startTime"
              type="time"
              value={agendaFormik.values.startTime}
              onChange={agendaFormik.handleChange}
              onBlur={agendaFormik.handleBlur}
              error={agendaFormik.touched.startTime && agendaFormik.errors.startTime}
            />

            <Input
              label="End Time"
              name="endTime"
              type="time"
              value={agendaFormik.values.endTime}
              onChange={agendaFormik.handleChange}
              onBlur={agendaFormik.handleBlur}
              error={agendaFormik.touched.endTime && agendaFormik.errors.endTime}
            />
          </div>

          <Input
            label="Speaker"
            name="speaker"
            placeholder="Speaker name (optional)"
            value={agendaFormik.values.speaker}
            onChange={agendaFormik.handleChange}
            onBlur={agendaFormik.handleBlur}
          />

          <Input
            label="Location"
            name="location"
            placeholder="Room or venue (optional)"
            value={agendaFormik.values.location}
            onChange={agendaFormik.handleChange}
            onBlur={agendaFormik.handleBlur}
          />

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              📅 Date: <span className="font-medium">{formatDate(selectedDate)}</span>
            </p>
          </div>

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
                agendaFormik.resetForm();
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

export default AgendaPage;
