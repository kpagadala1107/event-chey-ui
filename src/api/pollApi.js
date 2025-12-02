import axiosClient from './axiosClient';

export const pollApi = {
  getPolls: async (eventId, agendaId) => {
    const response = await axiosClient.get(`/events/${eventId}`);
    const agenda = response.data.agenda || [];
    const agendaItem = agenda.find(item => item.id === agendaId);
    return agendaItem?.polls || [];
  },

  getPoll: async (eventId, agendaId, pollId) => {
    const response = await axiosClient.get(`/events/${eventId}`);
    const agenda = response.data.agenda || [];
    const agendaItem = agenda.find(item => item.id === agendaId);
    const polls = agendaItem?.polls || [];
    return polls.find(poll => poll.id === pollId) || null;
  },

  createPoll: async (eventId, agendaId, pollData) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda/${agendaId}/polls`, pollData);
    return response.data;
  },

  updatePoll: async (eventId, agendaId, pollId, pollData) => {
    const response = await axiosClient.put(`/events/${eventId}/agenda/${agendaId}/polls/${pollId}`, pollData);
    return response.data;
  },

  deletePoll: async (eventId, agendaId, pollId) => {
    const response = await axiosClient.delete(`/events/${eventId}/agenda/${agendaId}/polls/${pollId}`);
    return response.data;
  },

  submitVote: async (eventId, agendaId, pollId, optionId) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda/${agendaId}/polls/${pollId}/vote`, { optionId });
    return response.data;
  },

  getPollResults: async (eventId, agendaId, pollId) => {
    const response = await axiosClient.get(`/events/${eventId}/agenda/${agendaId}/polls/${pollId}/results`);
    return response.data;
  },
};

export default pollApi;
