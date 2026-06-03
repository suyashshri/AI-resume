import { Router } from "express";
import { authoriseUser } from "../middleware/auth.middleware";
import {
  createReportController,
  getReportsController,
  getReportByIdController,
  enhanceResumeController,
  generateTexResumeController,
  generateCoverLetterController,
} from "../controllers/report.controller";

const reportRouter = Router();

reportRouter.post("/", authoriseUser, createReportController);
reportRouter.get("/", authoriseUser, getReportsController);
reportRouter.get("/:id", authoriseUser, getReportByIdController);
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
