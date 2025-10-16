import { get, apiRequest } from '../apiClient';

export const notificationApi = {
  getNotifications: async () => {
    return await get('/notifications');
  },

  getUnreadCount: async () => {
    return await get('/notifications/unread-count');
  },

  markAsRead: async (notificationId) => {
    const response = await apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('알림 읽음 처리에 실패했습니다.');
    }
  },

  markAllAsRead: async () => {
    const response = await apiRequest('/notifications/read-all', {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('전체 읽음 처리에 실패했습니다.');
    }
  },

  deleteNotification: async (notificationId) => {
    const response = await apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('알림 삭제에 실패했습니다.');
    }
  },
};
