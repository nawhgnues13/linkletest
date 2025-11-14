import { get, post, put, del } from '../apiClient';

export const scheduleApi = {
  // 동호회 일정 목록 조회
  getSchedulesByClubId: async (clubId) => {
    return await get(`/api/schedules/club/${clubId}`);
  },

  // 일정 상세 조회
  getSchedule: async (scheduleId) => {
    return await get(`/api/schedules/${scheduleId}`);
  },

  // 일정 생성
  createSchedule: async (data) => {
    const response = await post('/api/schedules', data);
    return response.data;
  },

  // 일정 취소
  cancelSchedule: async (scheduleId) => {
    await del(`/api/schedules/${scheduleId}`);
  },

  // 참석 상태 변경
  updateAttendanceStatus: async (scheduleId, status) => {
    await put(`/api/schedules/${scheduleId}/attendance?status=${status}`);
  },

  // 동호회 회원 수 조회
  getClubMemberCount: async (clubId) => {
    return await get(`/api/clubs/${clubId}/member-count`);
  },
};
