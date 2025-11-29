import axiosClient from './axiosClient';

export const eventApi = {
  getEvents: async () => {
    const response = await axiosClient.get('/events');
    return response.data;
  },

  getEvent: async (id) => {
    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await axiosClient.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await axiosClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await axiosClient.delete(`/events/${id}`);
    return response.data;
  },

  inviteAttendees: async (eventId, attendees) => {
    const response = await axiosClient.post(`/events/${eventId}/invite`, { attendees });
    return response.data;
  },

  getEventSummary: async (eventId) => {
    const response = await axiosClient.get(`/events/${eventId}/summary`);
    return response.data;
  },

  regenerateEventSummary: async (eventId) => {
    const response = await axiosClient.post(`/events/${eventId}/summary/regenerate`);
    return response.data;
  },
};

export default eventApi;
