import api from "../../../lib/api";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await api.post("/api/resume", formData);
  return response.data;
}

export async function getResumes() {
  const response = await api.get("/api/resume");
  return response.data;
}

export async function deleteResume(id: string) {
  const response = await api.delete(`/api/resume/${id}`);
  return response.data;
}
