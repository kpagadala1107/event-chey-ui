import axiosClient from './axiosClient';

export const agendaApi = {
  // Get agenda from the event object (agenda is embedded in event response)
  getAgenda: async (eventId) => {
    const response = await axiosClient.get(`/events/${eventId}`);
    return response.data.agenda || [];
  },

  getAgendaItem: async (eventId, agendaId) => {
    const response = await axiosClient.get(`/events/${eventId}`);
    const agenda = response.data.agenda || [];
    return agenda.find(item => item.id === agendaId) || null;
  },

  addAgendaItem: async (eventId, agendaData) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda`, agendaData);
    return response.data;
  },

  updateAgendaItem: async (eventId, agendaId, agendaData) => {
    const response = await axiosClient.put(`/events/${eventId}/agenda/${agendaId}`, agendaData);
    return response.data;
  },

  deleteAgendaItem: async (eventId, agendaId) => {
    const response = await axiosClient.delete(`/events/${eventId}/agenda/${agendaId}`);
    return response.data;
  },

  getAgendaSummary: async (eventId, agendaId) => {
    const response = await axiosClient.get(`/events/${eventId}/agenda/${agendaId}/summary`);
    return response.data;
  },

  regenerateAgendaSummary: async (eventId, agendaId) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda/${agendaId}/summary/regenerate`);
    return response.data;
  },
};

export default agendaApi;
