import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      toast.error("Too many requests. Please try again in 5 minutes.", {
        duration: 8000,
      });
    }
    return Promise.reject(error);
  },
);

export default api;
