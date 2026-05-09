import apiClient, { unwrap } from "./client";

export const notificationsApi = {
  async list() {
    return unwrap(await apiClient.get("/notifications"));
  },
  async getUnread() {
    return unwrap(await apiClient.get("/notifications/unread"));
  },
  async markAsRead(id) {
    return unwrap(await apiClient.patch(`/notifications/${id}/read`));
  },
  async markAllAsRead() {
    return unwrap(await apiClient.post("/notifications/read-all"));
  },
};
