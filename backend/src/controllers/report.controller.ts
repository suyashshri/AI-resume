import type { Request, Response } from "express";
import prisma from "../db/singleton";
import openrouter from "../lib/openrouter";
import { CreateReport, ClaudeReport } from "../types/report.type";
import { reportQueue } from "../lib/reportQueue";

async function createReportController(req: Request, res: Response) {
  const parsed = CreateReport.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "resumeId and jobId are required" });
  }

  const { resumeId, jobId } = parsed.data;
  const userId = req.user!.id;

  try {
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

    const queueJob = await reportQueue.add("analyze", {
      resumeId,
      jobId,
      userId,
    });

    return res.status(202).json({
      message: "Analysis started",
      jobId: queueJob.id,
    });
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }

  // const parsed = CreateReport.safeParse(req.body);
  // if (!parsed.success) {
  //   return res.status(400).json({ message: "resumeId and jobId are required" });
  // }

  // const { resumeId, jobId } = parsed.data;
  // const userId = req.user!.id;

  // try {
  //   const [resume, job] = await Promise.all([
  //     prisma.resume.findFirst({ where: { id: resumeId, userId } }),
  //     prisma.job.findFirst({ where: { id: jobId, userId } }),
  //   ]);

  //   if (!resume) return res.status(404).json({ message: "Resume not found" });
  //   if (!job) return res.status(404).json({ message: "Job not found" });
  //   if (!job.jobDescription)
  //     return res
  //       .status(400)
  //       .json({ message: "Job has no description to analyze" });

  //   const prompt = `You are a professional resume analyst. Analyze the resume against the job description and return
  // ONLY a valid JSON object with this exact structure, no other text:

  // {
  //   "score": <integer 0-100 representing overall match>,
  //   "summary": "<2-3 sentence summary of the candidate's fit>",
  //   "skillGaps": [
  //     { "skill": "<missing or weak skill>", "severity": "Low" | "Medium" | "High" }
  //   ],
  //   "questions": [
  //     { "question": "<interview question>", "intention": "<what the interviewer is assessing>", "answer": "<suggested
  // answer for the candidate>" }
  //   ]
  // }

  // Rules:
  // - skillGaps: up to 8 skills from the JD that are missing or underdeveloped in the resume
  // - questions: exactly 5 questions tailored to the role and the candidate's gaps

  // RESUME:
  // ${resume.content}

  // JOB DESCRIPTION:
  // ${job.jobDescription}`;

  //   const completion = await openrouter.chat.completions.create({
  //     model: "anthropic/claude-sonnet-4-5",
  //     max_tokens: 2048,
  //     messages: [{ role: "user", content: prompt }],
  //   });

  //   const raw = completion.choices[0]?.message.content ?? "";

  //   const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  //   const jsonString = (jsonMatch?.[1] ?? raw).trim();

  //   let analysisData;
  //   try {
  //     analysisData = ClaudeReport.parse(JSON.parse(jsonString));
  //   } catch {
  //     return res.status(500).json({ message: "Failed to parse AI response" });
  //   }

  //   const report = await prisma.report.create({
  //     data: {
  //       userId,
  //       resumeId,
  //       jobId,
  //       score: analysisData.score,
  //       summary: analysisData.summary,
  //       skillGaps: {
  //         create: analysisData.skillGaps,
  //       },
  //       questions: {
  //         create: analysisData.questions,
  //       },
  //     },
  //     include: { skillGaps: true, questions: true },
  //   });

  //   return res
  //     .status(201)
  //     .json({ message: "Report generated successfully", report });
  // } catch (error) {
  //   console.error("createReport error:", error);
  //   return res.status(500).json({ message: "Something went wrong" });
  // }
}

async function getReportJobStatusController(req: Request, res: Response) {
  try {
    const { jobId } = req.params;
    if (!jobId || Array.isArray(jobId)) {
      return res.status(400).json({ message: "Please share valid id" });
    }
    const job = await reportQueue.getJob(jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    const state = await job.getState();
    const result = job.returnvalue;

    return res.status(200).json({ state, reportId: result?.reportId ?? null });
  } catch (error) {
    console.error("getReportJobStatus error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function getReportsController(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
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
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function getReportByIdController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }

  try {
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
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function generateCoverLetterController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }

  try {
    const report = await prisma.report.findFirst({
      where: { id, userId },
      include: { resume: true, job: true },
    });

    if (!report) return res.status(404).json({ message: "Report not found" });
    if (!report.job.jobDescription)
      return res.status(400).json({ message: "Job has no description" });

    const prompt = `You are an expert cover letter writer. Write a professional, compelling cover letter
  based on the resume and job description below.

  Rules:
  1. Keep it to 3-4 paragraphs — opening, why you're a fit, specific skills, closing
  2. Do not copy the resume verbatim — synthesize and highlight the most relevant experience
  3. Match the tone of the job description (startup = casual/energetic, enterprise = formal)
  4. Do NOT use generic phrases like "I am writing to apply" or "I believe I am a perfect fit"
  5. Return ONLY the cover letter text — no subject line, no commentary

  RESUME:
  ${report.resume.content}

  JOB DESCRIPTION:
  ${report.job.jobDescription}

  Job Title: ${report.job.title ?? "the role"}
  Company: ${report.job.company ?? "the company"}`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openrouter.chat.completions.create({
      model: "anthropic/claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("generateCoverLetter error:", error);
    res.write(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`);
    res.end();
  }
}

async function enhanceResumeController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }
  try {
    const report = await prisma.report.findFirst({
      where: { id, userId },
      include: {
        resume: true,
        job: true,
        skillGaps: true,
      },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const skillGapsList = report.skillGaps
      .map((g) => `- ${g.skill} (${g.severity} priority)`)
      .join("\n");

    const prompt = `You are a professional resume writer. Below is a candidate's original resume and a list of skills they are missing for their target role.
Your task is to produce an enhanced version of the resume that:
  1. Adds the missing skills naturally into the Skills or Technical Skills section
  2. Where genuinely plausible, subtly incorporates missing technologies into existing project or experience bullet
  points
  3. Does NOT invent new job titles, companies, degrees, or dates that are not already present
  4. Keeps the same overall structure, format and tone as the original
  5. Returns ONLY the enhanced resume text — no commentary, no code fences, no explanations
  
  ORIGINAL RESUME:
  ${report.resume.content}

  MISSING SKILLS TO INCORPORATE:
  ${skillGapsList}`;

    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-sonnet-4-5",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const enhancedResume = completion.choices[0]?.message.content?.trim() ?? "";

    if (!enhancedResume) {
      return res
        .status(500)
        .json({ message: "Failed to generate enhanced resume" });
    }

    return res.status(200).json({
      message: "Enhanced resume generated successfully",
      enhancedResume,
    });
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function generateTexResumeController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }
  try {
    const report = await prisma.report.findFirst({
      where: { id, userId },
      include: { resume: true, job: true, skillGaps: true },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const skillGapsList = report.skillGaps
      .map((g) => `- ${g.skill} (${g.severity} priority)`)
      .join("\n");

    const prompt = `You are a LaTeX expert and professional resume writer. Below is a candidate's resume and a
  list of skills they are missing.

  Your task:
  1. Produce a complete, compilable ATS-friendly LaTeX resume using the template structure below
  2. Incorporate the missing skills naturally into the appropriate sections
  3. Do NOT invent new jobs, companies, degrees, or dates
  4. Escape ALL special LaTeX characters: & % $ # _ { } ~ ^ \\
  5. Return ONLY the raw .tex file content — no explanation, no markdown fences

  Use this exact template structure:

  \\documentclass[letterpaper,11pt]{article}
  \\usepackage{latexsym}
  \\usepackage[empty]{fullpage}
  \\usepackage{titlesec}
  \\usepackage[usenames,dvipsnames]{color}
  \\usepackage{enumitem}
  \\usepackage[hidelinks]{hyperref}
  \\usepackage[english]{babel}
  \\usepackage{geometry}
  \\geometry{left=0.5in,right=0.5in,top=0.5in,bottom=0.5in}
  \\raggedbottom
  \\raggedright
  \\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule\\vs
  pace{-5pt}]
  \\newcommand{\\resumeItem}[1]{\\item\\small{#1 \\vspace{-2pt}}}
  \\newcommand{\\resumeSubheading}[4]{
    \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
  }
  \\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
  }
  \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
  \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
  \\newcommand{\\resumeItemListStart}{\\begin{itemize}}
  \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

  \\begin{document}
  % --- FILL IN THE RESUME CONTENT HERE ---
  \\end{document}

  ORIGINAL RESUME:
  ${report.resume.content}

  MISSING SKILLS TO INCORPORATE:
  ${skillGapsList}`;

    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0]?.message.content?.trim() ?? "";

    // Strip markdown fences if the model wrapped the output
    const jsonMatch = raw.match(/```(?:latex|tex)?\s*([\s\S]*?)```/);
    const texContent = (jsonMatch?.[1] ?? raw).trim();

    if (!texContent) {
      return res
        .status(500)
        .json({ message: "Failed to generate LaTeX resume" });
    }

    return res.status(200).json({
      message: "LaTeX resume generated successfully",
      texContent,
    });
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export {
  createReportController,
  getReportJobStatusController,
  getReportsController,
  getReportByIdController,
  generateCoverLetterController,
  enhanceResumeController,
  generateTexResumeController,
};
