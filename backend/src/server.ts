import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import resumeRouter from "./routes/resume.routes";
import jobRouter from "./routes/job.routes";
import reportRouter from "./routes/report.routes";
import helmet from "helmet";
import { config } from "./config/config";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "500kb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/job", jobRouter);
app.use("/api/report", reportRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  },
);

export default app;
