import { get, put, del } from '../apiClient';

export const notificationApi = {
  getNotifications: async () => {
    return await get('/api/notifications');
  },

  markAsRead: async (notificationId) => {
    await put(`/api/notifications/${notificationId}/read`);
  },

  markAllAsRead: async () => {
    await put('/api/notifications/read-all');
  },

  deleteNotification: async (notificationId) => {
    await del(`/api/notifications/${notificationId}`);
  },
};
