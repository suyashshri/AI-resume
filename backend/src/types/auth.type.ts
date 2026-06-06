import { z } from "zod";

export const RegisterUser = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.email(),
  password: z.string().min(8).max(30),
});

export const LoginUser = z.object({
  email: z.email(),
  password: z.string().min(8).max(30),
});

export const AuthSchema = z.object({
  id: z.string(),
  username: z.string(),
});
