import { Router } from "express";
import { authoriseUser } from "../middleware/auth.middleware";
import {
  createReportController,
  getReportsController,
  getReportByIdController,
  enhanceResumeController,
  generateTexResumeController,
  generateCoverLetterController,
  deleteReportController,
  getReportJobStatusController,
} from "../controllers/report.controller";
import rateLimit from "express-rate-limit";

const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.user!.id,
  message: { message: "Too many AI requests. Please try again in 5 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const reportRouter = Router();

reportRouter.post("/", authoriseUser, aiLimiter, createReportController);
reportRouter.get(
  "/job-status/:jobId",
  authoriseUser,
  getReportJobStatusController,
);
reportRouter.get("/", authoriseUser, getReportsController);
reportRouter.get("/:id", authoriseUser, getReportByIdController);
reportRouter.delete("/:id", authoriseUser, deleteReportController);
reportRouter.get(
  "/:id/cover-letter",
  authoriseUser,
  aiLimiter,
  generateCoverLetterController,
);
reportRouter.post(
  "/:id/enhance",
  authoriseUser,
  aiLimiter,
  enhanceResumeController,
);
reportRouter.post(
  "/:id/enhance-tex",
  aiLimiter,
  authoriseUser,
  generateTexResumeController,
);

export default reportRouter;
