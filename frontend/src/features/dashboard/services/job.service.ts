import api from "../../../lib/api";

export async function createJob(data: {
  title?: string;
  company?: string;
  jobDescription?: string;
  jobUrl?: string;
}) {
  const response = await api.post("/api/job", data);
  return response.data;
}

export async function getJobs() {
  const response = await api.get("/api/job");
  return response.data;
}

export async function deleteJob(id: string) {
  const response = await api.delete(`/api/job/${id}`);
  return response.data;
}
