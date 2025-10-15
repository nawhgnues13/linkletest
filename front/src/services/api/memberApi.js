import { get, put } from '../apiClient';

export const memberApi = {
  // 회원 프로필 조회
  getProfile: async () => {
    return await get('/member/profile');
  },

  // 관심사 수정
  updateInterests: async (interests) => {
    const response = await put('/member/interests', { interests });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '관심사 수정에 실패했습니다.');
    }
  },
};
