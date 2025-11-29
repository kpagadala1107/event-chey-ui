import axiosClient from './axiosClient';

export const agendaApi = {
  getAgenda: async (eventId) => {
    const response = await axiosClient.get(`/events/${eventId}/agenda`);
    return response.data;
  },

  getAgendaItem: async (agendaId) => {
    const response = await axiosClient.get(`/agenda/${agendaId}`);
    return response.data;
  },

  addAgendaItem: async (eventId, agendaData) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda`, agendaData);
    return response.data;
  },

  updateAgendaItem: async (agendaId, agendaData) => {
    const response = await axiosClient.put(`/agenda/${agendaId}`, agendaData);
    return response.data;
  },

  deleteAgendaItem: async (agendaId) => {
    const response = await axiosClient.delete(`/agenda/${agendaId}`);
    return response.data;
  },

  getAgendaSummary: async (agendaId) => {
    const response = await axiosClient.get(`/agenda/${agendaId}/summary`);
    return response.data;
  },

  regenerateAgendaSummary: async (agendaId) => {
    const response = await axiosClient.post(`/agenda/${agendaId}/summary/regenerate`);
    return response.data;
  },
};

export default agendaApi;
