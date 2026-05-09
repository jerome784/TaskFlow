import apiClient, { unwrap } from "./client";

export const habitsApi = {
  async list(date) {
    const params = date ? { date } : {};
    return unwrap(await apiClient.get("/habits", { params }));
  },
  async create(name) {
    return unwrap(await apiClient.post("/habits", { name }));
  },
  async toggle(id, date) {
    const params = date ? { date } : {};
    return unwrap(await apiClient.post(`/habits/${id}/toggle`, null, { params }));
  }
};
