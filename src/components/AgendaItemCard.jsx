import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const AgendaItemCard = ({ agendaItem, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (timeString) => {
    try {
      return format(new Date(timeString), 'h:mm a');
    } catch {
      return timeString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {agendaItem.title}
            </h3>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {agendaItem.startTime && (
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    {formatTime(agendaItem.startTime)}
                    {agendaItem.endTime && ` - ${formatTime(agendaItem.endTime)}`}
                  </span>
                </div>
              )}

              {agendaItem.speaker && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{agendaItem.speaker}</span>
                </div>
              )}
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 bg-gray-50">
              {agendaItem.description && (
                <p className="text-gray-600 mb-4">{agendaItem.description}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick('summary');
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  AI Summary
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick('questions');
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Q&A ({agendaItem.questionCount || 0})
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick('polls');
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Polls ({agendaItem.pollCount || 0})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AgendaItemCard;
