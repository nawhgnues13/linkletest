import { get, put } from '../apiClient';

export const memberApi = {
  // 회원 프로필 조회
  getProfile: async () => {
    return await get('/member/profile');
  },

  updateProfile: async (data) => {
    const response = await put('/member/profile', data);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '프로필 수정에 실패했습니다.');
    }
  },

  // 관심사 수정
  updateInterests: async (interests) => {
    const response = await put('/member/interests', { interests });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '관심사 수정에 실패했습니다.');
    }
  },

  checkNickname: async (nickname) => {
    return await get(`/member/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  },
};
