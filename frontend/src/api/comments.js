import apiClient, { unwrap } from "./client";

export const commentsApi = {
  async list(taskId) {
    return unwrap(await apiClient.get(`/tasks/${taskId}/comments`));
  },
  async create(taskId, content) {
    return unwrap(await apiClient.post(`/tasks/${taskId}/comments`, { content }));
  },
  async remove(taskId, commentId) {
    return unwrap(await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`));
  },
};
