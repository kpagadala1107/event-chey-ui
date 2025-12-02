import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  PlusIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { agendaApi } from '../api/agendaApi';
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
  const activeTab = searchParams.get('tab') || 'questions';
  const queryClient = useQueryClient();

  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isAddPollModalOpen, setIsAddPollModalOpen] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);

  const { data: agendaItem, isLoading: isLoadingAgenda } = useQuery({
    queryKey: ['agendaItem', eventId, agendaId],
    queryFn: () => agendaApi.getAgendaItem(eventId, agendaId),
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', eventId, agendaId],
    queryFn: () => questionApi.getQuestions(eventId, agendaId),
    enabled: activeTab === 'questions',
  });

  const { data: polls, isLoading: isLoadingPolls } = useQuery({
    queryKey: ['polls', eventId, agendaId],
    queryFn: () => pollApi.getPolls(eventId, agendaId),
    enabled: activeTab === 'polls',
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['agendaSummary', eventId, agendaId],
    queryFn: () => agendaApi.getAgendaSummary(eventId, agendaId),
    enabled: activeTab === 'summary',
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

  if (isLoadingAgenda) {
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
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">{agendaItem?.title}</h1>
          {agendaItem?.description && (
            <p className="mt-2 text-gray-600">{agendaItem.description}</p>
          )}
          {agendaItem?.speaker && (
            <p className="mt-2 text-sm text-gray-500">Speaker: {agendaItem.speaker}</p>
          )}

          {/* Tabs */}
          <div className="mt-6 flex gap-4 border-b border-gray-200">
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
};

export default AgendaPage;
