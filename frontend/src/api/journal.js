import apiClient, { unwrap } from "./client";

export const journalApi = {
  async getEntry(date) {
    const params = date ? { date } : {};
    return unwrap(await apiClient.get("/journal", { params }));
  },
  async saveEntry(date, content) {
    const params = date ? { date } : {};
    return unwrap(await apiClient.post("/journal", { content }, { params }));
  }
};
