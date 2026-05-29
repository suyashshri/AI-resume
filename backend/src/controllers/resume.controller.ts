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
}
