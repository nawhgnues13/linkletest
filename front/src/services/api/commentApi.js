import { get, post, put, del } from '../apiClient';

export const commentApi = {
  // 게시글의 댓글 목록 조회
  getComments: async (postId) => {
    return await get(`/api/posts/${postId}/comments`);
  },

  // 댓글 등록
  createComment: async (postId, commentData) => {
    try {
      const response = await post(`/api/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      throw new Error('댓글 등록에 실패했습니다.');
    }
  },

  // 댓글 수정
  updateComment: async (commentId, content) => {
    try {
      const response = await put(`/api/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw new Error('댓글 수정에 실패했습니다.');
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    try {
      const response = await del(`/api/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw new Error('댓글 삭제에 실패했습니다.');
    }
  },
  // 댓글 좋아요 토글
  toggleCommentLike: async (commentId) => {
    try {
      const response = await post(`/api/comments/${commentId}/likes`, {});
      return response.data;
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
      throw new Error('댓글 좋아요 처리에 실패했습니다.');
    }
  },

  // 댓글 좋아요 상태 조회
  getCommentLikeStatus: async (commentId) => {
    try {
      return await get(`/api/comments/${commentId}/likes/status`);
    } catch (error) {
      console.error('댓글 좋아요 상태 조회 실패:', error);
      throw new Error('댓글 좋아요 상태 조회에 실패했습니다.');
    }
  },
};
