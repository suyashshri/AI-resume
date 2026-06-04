import type { Request, Response } from "express";
import prisma from "../db/singleton";
import supabase from "../lib/supabase";
import { extractText, getDocumentProxy } from "unpdf";

async function uploadResumeController(req: Request, res: Response) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.user?.id;
  const storagePath = `${userId}/${Date.now()}-${file.originalname}`;

  if (!userId) {
    return res.status(401).json({ message: "Unauthenticated Request" });
  }

  try {
    // Extract text from PDF
    const buffer = new Uint8Array(file.buffer);
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });

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
