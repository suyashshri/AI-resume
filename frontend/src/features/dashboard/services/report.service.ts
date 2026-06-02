import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function createReport(resumeId: string, jobId: string) {
  const response = await api.post("/api/report", { resumeId, jobId });
  return response.data;
}

export async function getReports() {
  const response = await api.get("/api/report");
  return response.data;
}

export async function getReportById(id: string) {
  const response = await api.get(`/api/report/${id}`);
  return response.data;
}
