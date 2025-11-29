import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '../api/eventApi';
import toast from 'react-hot-toast';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventApi.getEvents,
  });
};

export const useEvent = (eventId) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.getEvent(eventId),
    enabled: !!eventId,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully!');
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => eventApi.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
      toast.success('Event updated successfully!');
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully!');
    },
  });
};

export const useEventSummary = (eventId) => {
  return useQuery({
    queryKey: ['eventSummary', eventId],
    queryFn: () => eventApi.getEventSummary(eventId),
    enabled: !!eventId,
  });
};

export const useRegenerateEventSummary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventApi.regenerateEventSummary,
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['eventSummary', eventId] });
      toast.success('Summary regenerated successfully!');
    },
  });
};
