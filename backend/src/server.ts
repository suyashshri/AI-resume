import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import resumeRouter from "./routes/resume.routes";
import jobRouter from "./routes/job.routes";
import reportRouter from "./routes/report.routes";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "Too many requests, please slow down." },
});
const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "500kb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/job", jobRouter);
app.use("/api/report", aiLimiter, reportRouter);

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
