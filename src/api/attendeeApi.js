import axiosClient from './axiosClient';

export const attendeeApi = {
  // Get attendees from the event object (attendees are embedded in event response)
  getAttendees: async (eventId) => {
    const response = await axiosClient.get(`/events/${eventId}`);
    return response.data.attendees || [];
  },

  inviteAttendees: async (eventId, attendees) => {
    const response = await axiosClient.post(`/events/${eventId}/attendees/invite`, { attendees });
    return response.data;
  },

  removeAttendee: async (eventId, attendeeId) => {
    const response = await axiosClient.delete(`/events/${eventId}/attendees/${attendeeId}`);
    return response.data;
  },

  updateAttendeeStatus: async (eventId, attendeeId, status) => {
    const response = await axiosClient.patch(`/events/${eventId}/attendees/${attendeeId}`, { status });
    return response.data;
  },

  // Update response for current user (self-response)
  respondToInvitation: async (eventId, status) => {
    const response = await axiosClient.patch(`/events/${eventId}/attendees/me/respond`, { status });
    return response.data;
  },
};

export default attendeeApi;
