import { post, get } from '../apiClient';

export const authApi = {
  login: async (email, password) => {
    const response = await post('/api/auth/login', { email, password });
    return response.data;
  },

  registerStep1: async (email, password, name) => {
    const response = await post('/api/auth/register/step1', { email, password, name });
    return response.data;
  },

  registerStep2: async (memberId, nickname, birthDate, gender, sido, sigungu) => {
    const response = await post('/api/auth/register/step2', {
      memberId,
      nickname,
      birthDate,
      gender,
      sido,
      sigungu,
    });
    return response.data;
  },

  registerStep3: async (memberId, interests) => {
    const response = await post('/api/auth/register/step3', {
      memberId,
      interests,
    });
    return response.data;
  },

  verifyEmail: async (token) => {
    return await get(`/api/auth/email/verify?token=${encodeURIComponent(token)}`);
  },

  checkNickname: async (nickname) => {
    return await get(`/api/member/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  },

  findId: async (email) => {
    const response = await post('/api/auth/find-id', { email });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  },

  logout: async () => {
    try {
      const response = await post('/api/auth/logout', {});
      return response.data;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    const response = await post('/api/auth/refresh', { refreshToken });
    return response.data;
  },
};
