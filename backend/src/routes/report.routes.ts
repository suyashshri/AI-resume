import { Router } from "express";
import { authoriseUser } from "../middleware/auth.middleware";
import {
  createReportController,
  getReportsController,
  getReportByIdController,
} from "../controllers/report.controller";

const reportRouter = Router();

reportRouter.post("/", authoriseUser, createReportController);
reportRouter.get("/", authoriseUser, getReportsController);
reportRouter.get("/:id", authoriseUser, getReportByIdController);

export default reportRouter;
