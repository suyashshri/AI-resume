import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function register({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    console.log("response:", response.status);
    return response.data;
  } catch (error) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (((error as AxiosError).response?.data as any)?.message as string) ||
      "Registration failed";
    throw new Error(message);
  }
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (((error as AxiosError).response?.data as any)?.message as string) ||
      "Login failed";

    throw new Error(message);
  }
}
