import apiClient, { unwrap } from "./client";

export const usersApi = {
  async list() {
    return unwrap(await apiClient.get("/users"));
  },
  async updateRole(id, role) {
    return unwrap(await apiClient.patch(`/users/${id}/role`, { role }));
  },
};
