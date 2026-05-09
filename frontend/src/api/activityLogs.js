import apiClient, { unwrap } from "./client";

export const activityLogsApi = {
  async latest() {
    return unwrap(await apiClient.get("/activity-logs"));
  },
};
