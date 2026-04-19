import { z } from "zod";

export const RegisterUser = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});

export const LoginUser = z.object({
  email: z.email(),
  password: z.string(),
});
