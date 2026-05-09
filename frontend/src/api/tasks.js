import apiClient, { unwrap } from "./client";

export const tasksApi = {
  async list(params = {}) {
    return unwrap(await apiClient.get("/tasks", { params }));
  },
  async create(payload) {
    return unwrap(await apiClient.post("/tasks", payload));
  },
  async update(id, payload) {
    return unwrap(await apiClient.put(`/tasks/${id}`, payload));
  },
  async updateStatus(id, status) {
    return unwrap(await apiClient.patch(`/tasks/${id}/status`, { status }));
  },
  async remove(id) {
    return unwrap(await apiClient.delete(`/tasks/${id}`));
  },
};
