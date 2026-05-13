import apiClient, { unwrap } from "./client";

export const reportsApi = {
  async summary() {
    return unwrap(await apiClient.get("/reports/summary"));
  },
  exportTasksUrl() {
    const baseUrl = import.meta.env.VITE_API_URL || "/api";
    return `${baseUrl}/reports/tasks.csv`;
  },
};
