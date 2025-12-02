import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Button from './UI/Button';
import EmptyState from './UI/EmptyState';
import Spinner from './UI/Spinner';

const AgendaTimeline = ({ 
  event, 
  agendaItems, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAddNew,
  showAddButton = true 
}) => {
  const navigate = useNavigate();
  
  // Smart date selection: current day if ongoing, first day if upcoming, last day if past
  const getInitialDate = () => {
    if (!event || !event.startDate || !event.endDate) return new Date();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    const startDate = new Date(event.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(event.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    // If event is ongoing (today is between start and end), select today
    if (today >= startDate && today <= endDate) {
      return today;
    }
    
    // If event is upcoming (today is before start), select first day
    if (today < startDate) {
      return startDate;
    }
    
    // If event has passed (today is after end), select last day
    return endDate;
  };
  
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  
  // Update selected date when event data loads or changes
  useEffect(() => {
    if (event && event.startDate && event.endDate) {
      setSelectedDate(getInitialDate());
    }
  }, [event?.startDate, event?.endDate]);

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

  const handleViewAgenda = (agenda) => {
    navigate(`/events/${event.id}/agenda/${agenda.id}?tab=summary`);
  };

  // Calculate agenda item position on timeline
  const getAgendaPosition = (startTime, endTime) => {
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

  // Format time for display
  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';
    if (timeString.includes('T')) {
      const timePart = timeString.split('T')[1];
      return timePart ? timePart.substring(0, 5) : timeString;
    }
    return timeString;
  };

  // Filter agenda items by selected date
  const getFilteredItems = () => {
    if (!agendaItems || agendaItems.length === 0) return [];
    
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return agendaItems.filter(item => {
      if (!item.startTime) return false;
      const itemDate = item.startTime.split('T')[0];
      return itemDate === selectedDateStr;
    });
  };

  const filteredItems = getFilteredItems();

  return (
    <div>
      {showAddButton && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Agenda Timeline</h2>
          <Button onClick={onAddNew}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Agenda Item
          </Button>
        </div>
      )}

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
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner />
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const position = getAgendaPosition(item.startTime, item.endTime);
                  
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
                          {onEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                              }}
                              className="p-1 bg-white/20 rounded hover:bg-white/30"
                            >
                              <PencilIcon className="h-3 w-3 text-white" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this agenda item?')) {
                                  onDelete(item.id);
                                }
                              }}
                              className="p-1 bg-white/20 rounded hover:bg-white/30"
                            >
                              <TrashIcon className="h-3 w-3 text-white" />
                            </button>
                          )}
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
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <EmptyState
                    icon={CalendarIcon}
                    title="No agenda items for this date"
                    description="Add your first agenda item for this day"
                    action={
                      showAddButton && onAddNew ? (
                        <Button onClick={onAddNew}>
                          <PlusIcon className="h-5 w-5 mr-2" />
                          Add Agenda Item
                        </Button>
                      ) : null
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaTimeline;
