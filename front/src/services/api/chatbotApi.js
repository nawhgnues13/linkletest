import { post } from '../apiClient';

export const chatbotApi = {
  sendMessage: async (message) => {
    return await post('/api/chatbot/chat', { message });
  },
};
