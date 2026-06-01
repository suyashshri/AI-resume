import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import resumeRouter from "./routes/resume.routes";
import jobRouter from "./routes/job.routes";
import reportRouter from "./routes/report.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/job", jobRouter);
app.use("/api/report", reportRouter);

export default app;
