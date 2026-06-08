import type { Request, Response } from "express";
import prisma from "../db/singleton";
import supabase from "../lib/supabase";
import { PDFParse } from "pdf-parse";

async function uploadResumeController(req: Request, res: Response) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.user?.id;

  const resumeCount = await prisma.resume.count({ where: { userId } });
  if (resumeCount >= 4) {
    return res.status(400).json({
      message: "Maximum of 3 resumes allowed. Delete one to upload a new one.",
    });
  }
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${userId}/${Date.now()}-${safeName}`;

  if (!userId) {
    return res.status(401).json({ message: "Unauthenticated Request" });
  }

  try {
    // Extract text from PDF
    const buffer = new Uint8Array(file.buffer);
    const data = new PDFParse(buffer);
    const text = (await data.getText()).text;

    console.log("texttexttexttext", text);

    // Upload to Supabase private bucket
    const { error } = await supabase.storage
      .from("resumes")
      .upload(storagePath, file.buffer, { contentType: "application/pdf" });

    if (error) {
      return res
        .status(500)
        .json({ message: "Failed to upload file", error: error.message });
    }

    const resume = await prisma.resume.create({
      data: {
        content: text,
        resumeUrl: storagePath,
        userId,
      },
    });

    return res.status(201).json({
      message: "Resume uploaded successfully",
      resume: {
        id: resume.id,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("UploadResume error:", error);
    if (error instanceof Error && error.message === "PDF parsing timed out") {
      return res
        .status(400)
        .json({ message: "PDF is too complex to process. Try a simpler PDF." });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function getResumesController(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      select: { id: true, resumeUrl: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Resumes fetched successfully",
      resumes,
    });
  } catch (error) {
    console.error("GetResume error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function getResumeByIdController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }

  try {
    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Generate a signed URL valid for 5 mint
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(resume.resumeUrl!, 300);

    if (error || !data) {
      return res.status(500).json({ message: "Failed to generate file URL" });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      resume: {
        id: resume.id,
        signedUrl: data.signedUrl,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("GetResumebyId error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function deleteResumeController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Please share valid id" });
  }

  try {
    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const reports = await prisma.report.findMany({
      where: { resumeId: id },
      select: { id: true },
    });

    const reportIds = reports.map((r) => r.id);

    if (reportIds.length > 0) {
      await prisma.$transaction([
        prisma.skillGap.deleteMany({ where: { reportId: { in: reportIds } } }),
        prisma.technicalQuestion.deleteMany({
          where: { reportId: { in: reportIds } },
        }),
        prisma.report.deleteMany({ where: { id: { in: reportIds } } }),
      ]);
    }

    if (resume.resumeUrl) {
      await supabase.storage.from("resumes").remove([resume.resumeUrl]);
    }

    await prisma.resume.delete({ where: { id } });

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("DeleteResume error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export {
  uploadResumeController,
  getResumesController,
  getResumeByIdController,
  deleteResumeController,
};
