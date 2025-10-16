import { get, put } from '../apiClient';

export const memberApi = {
  getProfile: async () => {
    return await get('/member/profile');
  },

  updateProfile: async (data) => {
    return await put('/member/profile', data);
  },

  updateInterests: async (interests) => {
    return await put('/member/interests', { interests });
  },

  checkNickname: async (nickname) => {
    return await get(`/member/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  },
};
