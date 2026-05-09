import apiClient, { unwrap } from "./client";

export const projectsApi = {
  async list() {
    return unwrap(await apiClient.get("/projects"));
  },
  async create(payload) {
    return unwrap(await apiClient.post("/projects", payload));
  },
};
