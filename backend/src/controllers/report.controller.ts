import type { Request, Response } from "express";
import prisma from "../db/singleton";
import openrouter from "../lib/openrouter";
import { CreateReport, ClaudeReport } from "../types/report.type";

async function createReportController(req: Request, res: Response) {
  const parsed = CreateReport.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "resumeId and jobId are required" });
  }

  const { resumeId, jobId } = parsed.data;
  const userId = req.user!.id;

  const [resume, job] = await Promise.all([
    prisma.resume.findFirst({ where: { id: resumeId, userId } }),
    prisma.job.findFirst({ where: { id: jobId, userId } }),
  ]);

  if (!resume) return res.status(404).json({ message: "Resume not found" });
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (!job.jobDescription)
    return res
      .status(400)
      .json({ message: "Job has no description to analyze" });

  const prompt = `You are a professional resume analyst. Analyze the resume against the job description and return
  ONLY a valid JSON object with this exact structure, no other text:

  {
    "score": <integer 0-100 representing overall match>,
    "summary": "<2-3 sentence summary of the candidate's fit>",
    "skillGaps": [
      { "skill": "<missing or weak skill>", "severity": "Low" | "Medium" | "High" }
    ],
    "questions": [
      { "question": "<interview question>", "intention": "<what the interviewer is assessing>", "answer": "<suggested
  answer for the candidate>" }
    ]
  }

  Rules:
  - skillGaps: up to 8 skills from the JD that are missing or underdeveloped in the resume
  - questions: exactly 5 questions tailored to the role and the candidate's gaps

  RESUME:
  ${resume.content}

  JOB DESCRIPTION:
  ${job.jobDescription}`;

  const completion = await openrouter.chat.completions.create({
    model: "anthropic/claude-sonnet-4-5",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = completion.choices[0]?.message.content ?? "";

  let analysisData;
  try {
    analysisData = ClaudeReport.parse(JSON.parse(raw));
  } catch {
    return res.status(500).json({ message: "Failed to parse AI response" });
  }

  const report = await prisma.report.create({
    data: {
      userId,
      resumeId,
      jobId,
      score: analysisData.score,
      summary: analysisData.summary,
      skillGaps: {
        create: analysisData.skillGaps,
      },
      questions: {
        create: analysisData.questions,
      },
    },
    include: { skillGaps: true, questions: true },
  });

  return res
    .status(201)
    .json({ message: "Report generated successfully", report });
}

async function getReportsController(req: Request, res: Response) {
  const userId = req.user!.id;

  const reports = await prisma.report.findMany({
    where: { userId },
    select: {
      id: true,
      score: true,
      summary: true,
      createdAt: true,
      job: { select: { title: true, company: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json({ message: "Reports fetched successfully", reports });
}

async function getReportByIdController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }

  const report = await prisma.report.findFirst({
    where: { id, userId },
    include: {
      skillGaps: true,
      questions: true,
      job: { select: { title: true, company: true, jobUrl: true } },
    },
  });

  if (!report) return res.status(404).json({ message: "Report not found" });

  return res
    .status(200)
    .json({ message: "Report fetched successfully", report });
}

export {
  createReportController,
  getReportsController,
  getReportByIdController,
};
