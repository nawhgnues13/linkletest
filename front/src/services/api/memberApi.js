import { get, put, del } from '../apiClient';

export const memberApi = {
  getProfile: async () => {
    return await get('/api/member/profile');
  },

  updateProfile: async (data) => {
    return await put('/api/member/profile', data);
  },

  updateInterests: async (interests) => {
    return await put('/api/member/interests', { interests });
  },

  checkNickname: async (nickname) => {
    return await get(`/api/member/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await put('/api/member/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  withdrawAccount: async (password) => {
    const response = await del('/api/member/withdrawal', password ? { password } : {});
    return response.data;
  },
  // 나의 활동 조회
  getMyActivities: async (type = 'all') => {
    const response = await apiClient.get('/api/member/activities/posts', {
      params: { type },
    });
    return response.data;
  },
};
