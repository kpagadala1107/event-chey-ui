import axiosClient from './axiosClient';

export const questionApi = {
  getQuestions: async (eventId, agendaId) => {
    const response = await axiosClient.get(`/events/${eventId}`);
    const agenda = response.data.agenda || [];
    const agendaItem = agenda.find(item => item.id === agendaId);
    return agendaItem?.questions || [];
  },

  addQuestion: async (eventId, agendaId, questionData) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda/${agendaId}/questions`, questionData);
    return response.data;
  },

  updateQuestion: async (eventId, agendaId, questionId, questionData) => {
    const response = await axiosClient.put(`/events/${eventId}/agenda/${agendaId}/questions/${questionId}`, questionData);
    return response.data;
  },

  deleteQuestion: async (eventId, agendaId, questionId) => {
    const response = await axiosClient.delete(`/events/${eventId}/agenda/${agendaId}/questions/${questionId}`);
    return response.data;
  },

  answerQuestion: async (eventId, agendaId, questionId, answer) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda/${agendaId}/questions/${questionId}/answer`, { answer });
    return response.data;
  },

  upvoteQuestion: async (eventId, agendaId, questionId) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda/${agendaId}/questions/${questionId}/upvote`);
    return response.data;
  },

  downvoteQuestion: async (eventId, agendaId, questionId) => {
    const response = await axiosClient.post(`/events/${eventId}/agenda/${agendaId}/questions/${questionId}/downvote`);
    return response.data;
  },
};

export default questionApi;
