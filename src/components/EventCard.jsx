import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/events/${event.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-2">
          {event.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          event.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status || 'UPCOMING'}
        </span>
      </div>

      {event.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          <span>{event.attendeeCount || 0} attendees</span>
        </div>
      </div>

      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventCard;
