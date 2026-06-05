/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from "axios";
import api from "../../../lib/api";

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
    // console.log("response:", response.status);
    return response.data;
  } catch (error) {
    const message =
      (((error as AxiosError).response?.data as any)?.message as string) ||
      "Registration failed";
    throw new Error(message);
  }
}

export async function verifyOtp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  try {
    const response = await api.post("/api/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    const message =
      (((error as AxiosError).response?.data as any)?.message as string) ||
      "Verification failed";
    throw new Error(message);
  }
}

export async function resendOtp(email: string) {
  try {
    const response = await api.post("/api/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    const message =
      (((error as AxiosError).response?.data as any)?.message as string) ||
      "Failed to resend OTP";
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
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as any;

    if (axiosError.response?.status === 403 && data?.requiresVerification) {
      throw {
        requiresVerification: true,
        email: data.email,
        message: data.message,
      };
    }

    throw new Error(data?.message || "Login failed");
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await api.get("/api/auth/logout");
  } catch {
    // ignore
  }
}
