import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UserGroupIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { attendeeApi } from '../api/attendeeApi';
import Button from './UI/Button';
import Spinner from './UI/Spinner';
import EmptyState from './UI/EmptyState';
import InviteAttendeesModal from './InviteAttendeesModal';
import toast from 'react-hot-toast';

const AttendeeList = ({ eventId }) => {
  const queryClient = useQueryClient();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, confirmed, pending, declined

  const { data: attendees, isLoading } = useQuery({
    queryKey: ['attendees', eventId],
    queryFn: () => attendeeApi.getAttendees(eventId),
  });

  const removeAttendeeMutation = useMutation({
    mutationFn: (attendeeId) => attendeeApi.removeAttendee(eventId, attendeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendees', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Attendee removed successfully!');
    },
    onError: () => {
      toast.error('Failed to remove attendee');
    },
  });

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'declined':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      accepted: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[normalizedStatus] || styles.pending}`}>
        {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
      </span>
    );
  };

  const filteredAttendees = attendees?.filter((attendee) => {
    if (filter === 'all') return true;
    return attendee.status?.toLowerCase() === filter;
  }) || [];

  const stats = {
    total: attendees?.length || 0,
    confirmed: attendees?.filter((a) => ['confirmed', 'accepted'].includes(a.status?.toLowerCase())).length || 0,
    pending: attendees?.filter((a) => a.status?.toLowerCase() === 'pending').length || 0,
    declined: attendees?.filter((a) => a.status?.toLowerCase() === 'declined').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UserGroupIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-900">Attendees</h2>
          <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {stats.total}
          </span>
        </div>
        <Button size="sm" onClick={() => setIsInviteModalOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Invite Attendees
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filter === 'all' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filter === 'confirmed' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filter === 'pending' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </button>
        <button
          onClick={() => setFilter('declined')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filter === 'declined' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          <div className="text-sm text-gray-600">Declined</div>
        </button>
      </div>

      {/* Attendee List */}
      {filteredAttendees.length > 0 ? (
        <div className="space-y-3">
          {filteredAttendees.map((attendee) => (
            <div
              key={attendee.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0">
                  {getStatusIcon(attendee.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attendee.name || attendee.email}
                    </p>
                    {getStatusBadge(attendee.status)}
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    <span className="truncate">{attendee.email}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove this attendee?')) {
                    removeAttendeeMutation.mutate(attendee.id);
                  }
                }}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                disabled={removeAttendeeMutation.isPending}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={filter === 'all' ? 'No attendees yet' : `No ${filter} attendees`}
          description={filter === 'all' ? 'Invite attendees to get started' : `No attendees with ${filter} status`}
          action={
            filter === 'all' ? (
              <Button size="sm" onClick={() => setIsInviteModalOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-1" />
                Invite Attendees
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => setFilter('all')}>
                View All
              </Button>
            )
          }
        />
      )}

      {/* Invite Modal */}
      <InviteAttendeesModal
        eventId={eventId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};

export default AttendeeList;
