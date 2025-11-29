import axiosClient from './axiosClient';

export const questionApi = {
  getQuestions: async (agendaId) => {
    const response = await axiosClient.get(`/agenda/${agendaId}/questions`);
    return response.data;
  },

  addQuestion: async (agendaId, questionData) => {
    const response = await axiosClient.post(`/agenda/${agendaId}/questions`, questionData);
    return response.data;
  },

  updateQuestion: async (questionId, questionData) => {
    const response = await axiosClient.put(`/questions/${questionId}`, questionData);
    return response.data;
  },

  deleteQuestion: async (questionId) => {
    const response = await axiosClient.delete(`/questions/${questionId}`);
    return response.data;
  },

  answerQuestion: async (questionId, answer) => {
    const response = await axiosClient.post(`/questions/${questionId}/answer`, { answer });
    return response.data;
  },

  upvoteQuestion: async (questionId) => {
    const response = await axiosClient.post(`/questions/${questionId}/upvote`);
    return response.data;
  },

  downvoteQuestion: async (questionId) => {
    const response = await axiosClient.post(`/questions/${questionId}/downvote`);
    return response.data;
  },
};

export default questionApi;
