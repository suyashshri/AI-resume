import { Router } from "express";
import multer from "multer";
import { authoriseUser } from "../middleware/auth.middleware";
import {
  uploadResumeController,
  getResumesController,
  getResumeByIdController,
  deleteResumeController,
} from "../controllers/resume.controller";

const resumeRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

resumeRouter.post(
  "/",
  authoriseUser,
  upload.single("resume"),
  uploadResumeController,
);
resumeRouter.get("/", authoriseUser, getResumesController);
resumeRouter.get("/:id", authoriseUser, getResumeByIdController);
resumeRouter.delete("/:id", authoriseUser, deleteResumeController);

export default resumeRouter;
