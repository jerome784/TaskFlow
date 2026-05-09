import apiClient, { unwrap } from "./client";

export const attachmentsApi = {
  async list(taskId) {
    return unwrap(await apiClient.get(`/tasks/${taskId}/attachments`));
  },
  async upload(taskId, file) {
    const formData = new FormData();
    formData.append("file", file);
    return unwrap(
      await apiClient.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  },
  async remove(taskId, attachmentId) {
    return unwrap(await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`));
  },
  async download(taskId, attachmentId, fileName) {
    const response = await apiClient.get(`/tasks/${taskId}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
};
