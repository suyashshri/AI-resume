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

const reportRouter = Router();

reportRouter.post("/", authoriseUser, createReportController);
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
  generateCoverLetterController,
);
reportRouter.post("/:id/enhance", authoriseUser, enhanceResumeController);
reportRouter.post(
  "/:id/enhance-tex",
  authoriseUser,
  generateTexResumeController,
);

export default reportRouter;
