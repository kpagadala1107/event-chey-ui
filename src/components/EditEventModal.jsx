import React, { useState, useEffect } from 'react';
import Modal from './UI/Modal';
import Input from './UI/Input';
import Button from './UI/Button';
import { eventApi } from '../api/eventApi';

const EditEventModal = ({ isOpen, onClose, event, onEventUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'UPCOMING',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      // Format dates for input type="date"
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      setFormData({
        name: event.name || '',
        description: event.description || '',
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        location: event.location || '',
        status: event.status || 'UPCOMING',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const updatedEvent = await eventApi.updateEvent(event.id, {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      
      if (onEventUpdated) {
        onEventUpdated(updatedEvent);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Event" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Event Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter event name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter event location"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEventModal;
