import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { attendeeApi } from '../api/attendeeApi';
import Button from './UI/Button';
import Input from './UI/Input';
import Modal from './UI/Modal';
import toast from 'react-hot-toast';

const InviteAttendeesModal = ({ eventId, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [attendees, setAttendees] = useState([{ name: '', email: '' }]);

  const inviteAttendeesMutation = useMutation({
    mutationFn: (data) => attendeeApi.inviteAttendees(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendees', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Attendees invited successfully!');
      handleClose();
    },
    onError: () => {
      toast.error('Failed to invite attendees');
    },
  });

  const handleClose = () => {
    setAttendees([{ name: '', email: '' }]);
    onClose();
  };

  const addAttendeeField = () => {
    setAttendees([...attendees, { name: '', email: '' }]);
  };

  const removeAttendeeField = (index) => {
    if (attendees.length > 1) {
      const newAttendees = attendees.filter((_, i) => i !== index);
      setAttendees(newAttendees);
    }
  };

  const updateAttendee = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that at least one attendee has an email
    const validAttendees = attendees.filter((a) => a.email.trim() !== '');

    if (validAttendees.length === 0) {
      toast.error('Please provide at least one email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validAttendees.filter((a) => !emailRegex.test(a.email));

    if (invalidEmails.length > 0) {
      toast.error('Please provide valid email addresses');
      return;
    }

    inviteAttendeesMutation.mutate(validAttendees);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Attendees">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Add attendees by providing their email addresses. They will receive an invitation to join the event.
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {attendees.map((attendee, index) => (
            <div key={index} className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 space-y-3">
                <Input
                  label="Name (Optional)"
                  placeholder="John Doe"
                  value={attendee.name}
                  onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={attendee.email}
                  onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                  required
                />
              </div>
              {attendees.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttendeeField(index)}
                  className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={addAttendeeField}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Another Attendee
        </Button>

        <div className="flex gap-3 pt-4">
          <Button type="submit" fullWidth loading={inviteAttendeesMutation.isPending}>
            Send Invitations
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteAttendeesModal;
