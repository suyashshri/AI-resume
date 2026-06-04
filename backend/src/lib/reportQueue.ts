import { Queue, tryCatch, Worker } from "bullmq";
import { createClient } from "redis";
import prisma from "../db/singleton";
import openrouter from "./openrouter";
import { ClaudeReport } from "../types/report.type";
import { config } from "../config/config";

const connection = { url: config.REDIS_URL };

export const reportQueue = new Queue("report-analysis", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

export const reportWorker = new Worker(
  "report-analysis",
  async (job) => {
    const { resumeId, jobId, userId } = job.data;

    const [resume, dbJob] = await Promise.all([
      prisma.resume.findFirst({ where: { id: resumeId, userId } }),
      prisma.job.findFirst({ where: { id: jobId, userId } }),
    ]);

    if (!resume || !dbJob || !dbJob.jobDescription) {
      throw new Error("Resume or job not found");
    }

    const prompt = `You are a professional resume analyst. Analyze the resume against the job description
  and return ONLY a valid JSON object with this exact structure, no other text:

  {
    "score": <integer 0-100>,
    "summary": "<2-3 sentence summary>",
    "skillGaps": [{ "skill": "<skill>", "severity": "Low" | "Medium" | "High" }],
    "questions": [{ "question": "<question>", "intention": "<intention>", "answer": "<answer>" }]
  }

  Rules:
  - skillGaps: up to 8 skills missing or underdeveloped
  - questions: exactly 5 questions

  RESUME:
  ${resume.content}

  JOB DESCRIPTION:
  ${dbJob.jobDescription}`;

    try {
      const completion = await openrouter.chat.completions.create({
        model: "anthropic/claude-sonnet-4-5",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const raw = completion.choices[0]?.message.content ?? "";
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = (jsonMatch?.[1] ?? raw).trim();
      const analysisData = ClaudeReport.parse(JSON.parse(jsonString));

      const report = await prisma.report.create({
        data: {
          userId,
          resumeId,
          jobId,
          score: analysisData.score,
          summary: analysisData.summary,
          skillGaps: { create: analysisData.skillGaps },
          questions: { create: analysisData.questions },
        },
        include: { skillGaps: true, questions: true },
      });

      return { reportId: report.id };
    } catch (error) {
      console.log("Error while running worker");
    }
  },
  { connection },
);
