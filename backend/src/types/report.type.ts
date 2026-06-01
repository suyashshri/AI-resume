import { z } from "zod";

export const CreateReport = z.object({
  resumeId: z.string(),
  jobId: z.string(),
});

export const ClaudeReport = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string(),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["Low", "Medium", "High"]),
    }),
  ),
  questions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
});
