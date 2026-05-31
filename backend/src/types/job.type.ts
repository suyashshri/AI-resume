import { z } from "zod";

export const CreateJob = z
  .object({
    title: z.string().optional(),
    company: z.string().optional(),
    selfDescription: z.string().optional(),
    jobDescription: z.string().optional(),
    jobUrl: z.url().optional(),
  })
  .refine((data) => data.jobDescription || data.jobUrl, {
    message: "Either jobDescription or jobUrl must be provided",
  });
