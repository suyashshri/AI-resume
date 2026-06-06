import type { AxiosError } from "axios";
import api from "../../../lib/api";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);
  try {
    const response = await api.post("/api/resume", formData);
    return response.data;
  } catch (error) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((error as AxiosError).response?.data as any)?.message ||
      "Failed to upload resume";
    throw new Error(message);
  }
}

export async function getResumes() {
  const response = await api.get("/api/resume");
  return response.data;
}

export async function deleteResume(id: string) {
  const response = await api.delete(`/api/resume/${id}`);
  return response.data;
}
