import { z } from "zod";

export const RegisterUser = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});
