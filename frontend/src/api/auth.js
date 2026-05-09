import apiClient, { unwrap } from "./client";

export const authApi = {
  async login(payload) {
    return unwrap(await apiClient.post("/auth/login", payload));
  },
  async register(payload) {
    return unwrap(await apiClient.post("/auth/register", payload));
  },
  async me() {
    return unwrap(await apiClient.get("/auth/me"));
  },
};
