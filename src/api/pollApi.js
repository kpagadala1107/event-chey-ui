import axiosClient from './axiosClient';

export const pollApi = {
  getPolls: async (agendaId) => {
    const response = await axiosClient.get(`/agenda/${agendaId}/polls`);
    return response.data;
  },

  getPoll: async (pollId) => {
    const response = await axiosClient.get(`/polls/${pollId}`);
    return response.data;
  },

  createPoll: async (agendaId, pollData) => {
    const response = await axiosClient.post(`/agenda/${agendaId}/polls`, pollData);
    return response.data;
  },

  updatePoll: async (pollId, pollData) => {
    const response = await axiosClient.put(`/polls/${pollId}`, pollData);
    return response.data;
  },

  deletePoll: async (pollId) => {
    const response = await axiosClient.delete(`/polls/${pollId}`);
    return response.data;
  },

  submitVote: async (pollId, optionId) => {
    const response = await axiosClient.post(`/polls/${pollId}/vote`, { optionId });
    return response.data;
  },

  getPollResults: async (pollId) => {
    const response = await axiosClient.get(`/polls/${pollId}/results`);
    return response.data;
  },
};

export default pollApi;
