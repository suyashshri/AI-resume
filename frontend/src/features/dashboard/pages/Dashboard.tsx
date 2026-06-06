import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  uploadResume,
  getResumes,
  deleteResume,
} from "../services/resume.service";
import { createJob, getJobs, deleteJob } from "../services/job.service";
import {
  checkReportJobStatus,
  createReport,
  deleteReport,
  getReports,
} from "../services/report.service";
import { toast } from "sonner";
import { ThemeToggle } from "../../ui/ThemeToggle";
import { DashboardSkeleton } from "../../ui/Skeleton";
import { ProfileModal } from "../../auth/pages/ProfileModal";

type Resume = {
  id: string;
  resumeUrl: string;
  createdAt: string;
};

type Job = {
  id: string;
  title: string | null;
  company: string | null;
  jobUrl: string | null;
  createdAt: string;
};

type Report = {
  id: string;
  score: number;
  createdAt: string;
  job: { title: string | null; company: string | null };
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function resumeLabel(url: string) {
  return url.split("/").pop()?.replace(/^\d+-/, "") ?? "Resume";
}

function getScoreColor(score: number): string {
  if (score >= 75) return "#16a34a"; // green
  if (score >= 50) return "#ca8a04"; // amber
  return "#dc2626"; // red
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [uploadingResume, setUploadingResume] = useState(false);
  const [addingJob, setAddingJob] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [showJobForm, setShowJobForm] = useState(false);
  const [jobInputType, setJobInputType] = useState<"text" | "url">("text");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const [isLinkedInUrl, setIsLinkedInUrl] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showProfile, setShowProfile] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [resumeData, jobData, reportData] = await Promise.all([
          getResumes(),
          getJobs(),
          getReports(),
        ]);
        setResumes(resumeData.resumes ?? []);
        setJobs(jobData.jobs ?? []);
        setReports(reportData.reports ?? []);
      } catch {
        toast.error("Failed to load dashboard data. Please refresh.");
      } finally {
        setInitialLoading(false);
      }
    }
    fetchAll();

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      await uploadResume(file);
      const data = await getResumes();
      setResumes(data.resumes ?? []);
      toast.success("Resume uploaded successfully");
    } catch {
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  }

  async function handleDeleteResume(id: string) {
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (selectedResumeId === id) setSelectedResumeId(null);
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  }

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    setAddingJob(true);
    try {
      await createJob({
        title: jobTitle || undefined,
        company: jobCompany || undefined,
        ...(jobInputType === "text" ? { jobDescription } : { jobUrl }),
      });
      const data = await getJobs();
      setJobs(data.jobs ?? []);
      setShowJobForm(false);
      setJobTitle("");
      setJobCompany("");
      setJobDescription("");
      setJobUrl("");
      toast.success("Job saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add job");
    } finally {
      setAddingJob(false);
    }
  }

  async function handleDeleteJob(id: string) {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      if (selectedJobId === id) setSelectedJobId(null);
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  }

  async function handleAnalyze() {
    if (!selectedResumeId || !selectedJobId) return;
    setAnalyzing(true);

    const toastId = toast.loading("Starting analysis...");

    try {
      const data = await createReport(selectedResumeId, selectedJobId);
      const jobId = data.jobId;

      toast.loading("Analysing your resume, this may take a moment...", {
        id: toastId,
      });

      pollingRef.current = setInterval(async () => {
        try {
          const status = await checkReportJobStatus(jobId);

          if (status.state === "completed" && status.reportId) {
            clearInterval(pollingRef.current!);
            pollingRef.current = null;
            toast.success("Analysis complete!", { id: toastId });
            setAnalyzing(false);
            navigate({
              to: "/report/$reportId",
              params: { reportId: status.reportId },
            });
          } else if (status.state === "failed") {
            clearInterval(pollingRef.current!);
            pollingRef.current = null;
            toast.error("Analysis failed. Please try again.", { id: toastId });
            setAnalyzing(false);
          }
        } catch {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          toast.error("Could not check analysis status.", { id: toastId });
          setAnalyzing(false);
        }
      }, 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start analysis",
        { id: toastId },
      );
      setAnalyzing(false);
    }
  }

  async function handleDeleteReport(id: string) {
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    }
  }

  async function onLogout() {
    await handleLogout();
    navigate({ to: "/login" });
  }

  if (initialLoading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-background text-foreground text-left">
      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight">
            <span className="text-foreground">Hire</span>
            <span className="text-primary">Mind</span>
          </span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setShowProfile(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Welcome,{" "}
              <span className="text-foreground font-medium underline-offset-2 hover:underline">
                {user?.username}
              </span>
            </button>
            <button
              onClick={onLogout}
              className="text-sm border border-border px-4 py-1.5 rounded-full hover:bg-surface transition-colors"
            >
              Log Out
            </button>
            {showProfile && (
              <ProfileModal onClose={() => setShowProfile(false)} />
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* ── STEP 1: RESUMES ── */}
          <section className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center
  justify-center shrink-0"
                  >
                    1
                  </span>
                  <h2 className="font-bold text-lg">Pick a Resume</h2>
                </div>
                <p className="text-xs text-muted-foreground pl-8">
                  Click a resume to select it for analysis
                </p>
              </div>
              <label
                className="cursor-pointer text-sm font-semibold px-4 py-1.5 rounded-full text-white shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {uploadingResume ? <div className="loader" /> : "+ Upload"}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                />
              </label>
            </div>

            {resumes.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No resumes yet. Upload a PDF to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {resumes.map((resume) => {
                  const isSelected = selectedResumeId === resume.id;
                  return (
                    <div
                      key={resume.id}
                      onClick={() =>
                        setSelectedResumeId(isSelected ? null : resume.id)
                      }
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer
  transition-all ${
    isSelected
      ? "border-primary bg-primary/5"
      : "border-border hover:bg-surface"
  }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
  transition-colors ${
    isSelected ? "border-primary bg-primary" : "border-muted"
  }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-xl shrink-0">📄</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {resumeLabel(resume.resumeUrl)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(resume.createdAt)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResume(resume.id);
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors text-xs px-2 py-1
  shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── STEP 2: JOBS ── */}
          <section className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center
  justify-center shrink-0"
                  >
                    2
                  </span>
                  <h2 className="font-bold text-lg">Pick a Job</h2>
                </div>
                <p className="text-xs text-muted-foreground pl-8">
                  Click a job to select it for analysis
                </p>
              </div>
              <button
                onClick={() => setShowJobForm((v) => !v)}
                className="text-sm font-semibold px-4 py-1.5 rounded-full text-white shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {showJobForm ? "Cancel" : "+ Add Job"}
              </button>
            </div>

            {showJobForm && (
              <form
                onSubmit={handleAddJob}
                className="space-y-3 border border-border rounded-xl p-4"
              >
                <div className="flex gap-2">
                  {(["text", "url"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setJobInputType(type)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        jobInputType === type
                          ? "text-white"
                          : "bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                      style={
                        jobInputType === type
                          ? { backgroundColor: "var(--color-primary)" }
                          : {}
                      }
                    >
                      {type === "text" ? "Paste Text" : "Enter URL"}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="label">JOB TITLE (optional)</label>
                  <input
                    className="input text-sm"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Senior Frontend Engineer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="label">COMPANY (optional)</label>
                  <input
                    className="input text-sm"
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                    placeholder="Vercel"
                  />
                </div>

                {jobInputType === "text" ? (
                  <div className="flex flex-col gap-1">
                    <label className="label">JOB DESCRIPTION</label>
                    <textarea
                      className="input text-sm resize-none"
                      rows={5}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      required
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="label">JOB URL</label>
                    <input
                      className="input text-sm"
                      type="url"
                      value={jobUrl}
                      onChange={(e) => {
                        setJobUrl(e.target.value);
                        setIsLinkedInUrl(
                          e.target.value.includes("linkedin.com") ||
                            e.target.value.includes("indeed.com") ||
                            e.target.value.includes("glassdoor.com"),
                        );
                      }}
                      placeholder="https://jobs.lever.co/..."
                      required
                    />
                    {isLinkedInUrl && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 space-y-2 mt-2">
                        <p className="text-xs text-yellow-700 font-semibold">
                          ⚠ LinkedIn, Indeed and Glassdoor require a login to
                          access — they can't be scraped.
                        </p>
                        <p className="text-xs text-yellow-600">
                          Open the job posting, copy the full description, and
                          paste it using the{" "}
                          <button
                            type="button"
                            className="font-bold underline"
                            onClick={() => {
                              setJobInputType("text");
                              setJobUrl("");
                              setIsLinkedInUrl(false);
                            }}
                          >
                            Paste Text
                          </button>{" "}
                          tab instead.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="btn-primary rounded-xl py-2 text-sm"
                  disabled={addingJob || isLinkedInUrl}
                >
                  {addingJob ? (
                    <div className="flex items-center justify-center">
                      <div className="loader" />
                    </div>
                  ) : (
                    "Save Job"
                  )}
                </button>
              </form>
            )}

            {jobs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No jobs added yet. Add a job description to analyze.
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.map((job) => {
                  const isSelected = selectedJobId === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() =>
                        setSelectedJobId(isSelected ? null : job.id)
                      }
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer
  transition-all ${
    isSelected
      ? "border-primary bg-primary/5"
      : "border-border hover:bg-surface"
  }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
  transition-colors ${
    isSelected ? "border-primary bg-primary" : "border-muted"
  }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-xl shrink-0">💼</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {job.title ?? "Untitled Job"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.company ? `${job.company} · ` : ""}
                            {formatDate(job.createdAt)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.id);
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors text-xs px-2 py-1
  shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── STEP 3: ANALYZE + PAST REPORTS ── */}
          <section className="space-y-6">
            <div className="card space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center
  justify-center shrink-0"
                >
                  3
                </span>
                <h2 className="font-bold text-lg">Generate Report</h2>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Selected Resume
                </p>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    selectedResumeId
                      ? "border-primary bg-primary/5"
                      : "border-dashed border-border bg-surface"
                  }`}
                >
                  <span className="text-lg">📄</span>
                  <span className="text-sm truncate flex-1">
                    {selectedResumeId ? (
                      <span className="font-medium">
                        {resumeLabel(
                          resumes.find((r) => r.id === selectedResumeId)
                            ?.resumeUrl ?? "",
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        ← Select a resume from Step 1
                      </span>
                    )}
                  </span>
                  {selectedResumeId && (
                    <span className="text-xs text-primary font-bold shrink-0">
                      ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Selected Job
                </p>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    selectedJobId
                      ? "border-primary bg-primary/5"
                      : "border-dashed border-border bg-surface"
                  }`}
                >
                  <span className="text-lg">💼</span>
                  <span className="text-sm truncate flex-1">
                    {selectedJobId ? (
                      <span className="font-medium">
                        {jobs.find((j) => j.id === selectedJobId)?.title ??
                          "Untitled Job"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        ← Select a job from Step 2
                      </span>
                    )}
                  </span>
                  {selectedJobId && (
                    <span className="text-xs text-primary font-bold shrink-0">
                      ✓
                    </span>
                  )}
                </div>
              </div>

              <button
                className="btn-primary rounded-xl py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!selectedResumeId || !selectedJobId || analyzing}
                onClick={handleAnalyze}
              >
                {analyzing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loader" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  "Generate Report →"
                )}
              </button>
            </div>

            {/* Past Reports */}
            <div className="card space-y-4">
              <h2 className="font-bold text-lg">Past Reports</h2>
              {reports.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No reports yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface
  cursor-pointer transition-colors"
                    >
                      <div
                        className="flex items-center gap-3 min-w-0 flex-1"
                        onClick={() =>
                          navigate({
                            to: "/report/$reportId",
                            params: { reportId: report.id },
                          })
                        }
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: `conic-gradient(${getScoreColor(report.score)} ${report.score}%, var(--color-border) 0)`,
                          }}
                        >
                          <div className="w-7 h-7 rounded-full bg-card flex items-center justify-center">
                            <span
                              className="text-xs font-black"
                              style={{ color: getScoreColor(report.score) }}
                            >
                              {report.score}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {report.job.title ?? "Untitled Job"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {report.job.company
                              ? `${report.job.company} · `
                              : ""}
                            {formatDate(report.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-primary text-sm"
                          onClick={() =>
                            navigate({
                              to: "/report/$reportId",
                              params: { reportId: report.id },
                            })
                          }
                        >
                          →
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report.id);
                          }}
                          className="text-muted-foreground hover:text-red-500 transition-colors text-xs px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* {reports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() =>
                        navigate({
                          to: "/report/$reportId",
                          params: { reportId: report.id },
                        })
                      }
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: `conic-gradient(var(--color-primary) ${report.score}%, var(--color-border) 0)`,
                          }}
                        >
                          <div className="w-7 h-7 rounded-full bg-card flex items-center justify-center">
                            <span className="text-primary text-xs font-black">
                              {report.score}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {report.job.title ?? "Untitled Job"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {report.job.company
                              ? `${report.job.company} · `
                              : ""}
                            {formatDate(report.createdAt)}
                          </div>
                        </div>
                      </div>
                      <span className="text-primary text-sm shrink-0">→</span>
                    </div>
                  ))} */}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
