import { Router } from "express";
import { authoriseUser } from "../middleware/auth.middleware";
import {
  createJobController,
  getJobsController,
  getJobByIdController,
  deleteJobController,
  updateJobStatusController,
} from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.post("/", authoriseUser, createJobController);
jobRouter.get("/", authoriseUser, getJobsController);
jobRouter.patch("/:id/status", authoriseUser, updateJobStatusController);
jobRouter.get("/:id", authoriseUser, getJobByIdController);
jobRouter.delete("/:id", authoriseUser, deleteJobController);

export default jobRouter;
