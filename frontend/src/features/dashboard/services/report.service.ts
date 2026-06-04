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

export async function deleteReport(id: string) {
  const response = await api.delete(`/api/report/${id}`);
  return response.data;
}

export async function enhanceResume(id: string) {
  const response = await api.post(`/api/report/${id}/enhance`);
  return response.data;
}

export async function generateTexResume(id: string) {
  const response = await api.post(`/api/report/${id}/enhance-tex`);
  return response.data;
}

export async function checkReportJobStatus(jobId: string) {
  const response = await api.get(`/api/report/job-status/${jobId}`);
  return response.data;
}

export async function streamCoverLetter(
  id: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
) {
  const response = await fetch(
    `http://localhost:3000/api/report/${id}/cover-letter`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok || !response.body) {
    onError("Failed to start cover letter generation");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "").trim();
      if (data === "[DONE]") {
        onDone();
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          onError(parsed.error);
          return;
        }
        if (parsed.content) onChunk(parsed.content);
      } catch {
        // skip malformed chunk, continue reading
      }
    }
  }
}
