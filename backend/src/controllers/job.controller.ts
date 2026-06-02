import type { Request, Response } from "express";
import prisma from "../db/singleton";
import firecrawl from "../lib/firecrawl";
import { CreateJob } from "../types/job.type";

async function createJobController(req: Request, res: Response) {
  const parsed = CreateJob.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message });
  }

  const { title, company, selfDescription, jobDescription, jobUrl } =
    parsed.data;
  const userId = req.user!.id;

  let description = jobDescription;

  if (jobUrl && !description) {
    const result = await firecrawl.scrape(jobUrl, { formats: ["markdown"] });

    if (!result || !result.markdown || result.markdown.trim().length < 100) {
      return res.status(422).json({
        message:
          "Could not scrape this URL. The site may require a login (LinkedIn, Indeed, Glassdoor) or block automated access. Please paste the job description as text instead.",
      });
    }

    description = result.markdown;
  }

  const job = await prisma.job.create({
    data: {
      title,
      company,
      selfDescription,
      jobDescription: description,
      jobUrl,
      userId,
    },
  });

  return res.status(201).json({
    message: "Job saved successfully",
    job: { id: job.id, createdAt: job.createdAt },
  });
}

async function getJobsController(req: Request, res: Response) {
  const userId = req.user!.id;

  const jobs = await prisma.job.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      company: true,
      jobUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({ message: "Jobs fetched successfully", jobs });
}

async function getJobByIdController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }

  const job = await prisma.job.findFirst({ where: { id, userId } });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  return res.status(200).json({ message: "Job fetched successfully", job });
}

async function deleteJobController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }

  const job = await prisma.job.findFirst({ where: { id, userId } });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await prisma.job.delete({ where: { id } });

  return res.status(200).json({ message: "Job deleted successfully" });
}

export {
  createJobController,
  getJobsController,
  getJobByIdController,
  deleteJobController,
};
