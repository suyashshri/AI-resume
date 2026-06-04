import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  getReportById,
  enhanceResume,
  generateTexResume,
  streamCoverLetter,
  deleteReport,
} from "../services/report.service";
import { ThemeToggle } from "../../ui/ThemeToggle";
import { ReportSkeleton } from "../../ui/Skeleton";
import { toast } from "sonner";
import { exportReportPdf } from "../utils/exportPdf";

type SkillGap = {
  id: string;
  skill: string;
  severity: "Low" | "Medium" | "High";
};

type Question = {
  id: string;
  question: string;
  intention: string;
  answer: string;
};

type ReportData = {
  id: string;
  score: number;
  summary: string | null;
  enhancedResume: string | null;
  coverLetter: string | null;
  createdAt: string;
  skillGaps: SkillGap[];
  questions: Question[];
  job: { title: string | null; company: string | null; jobUrl: string | null };
};

const severityStyles: Record<string, string> = {
  High: "text-red-600 bg-red-50 border-red-200",
  Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Low: "text-green-600 bg-green-50 border-green-200",
};

const Report = () => {
  const navigate = useNavigate();
  const { reportId } = useParams({ from: "/report/$reportId" });

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const [generatingTex, setGeneratingTex] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedResume, setEnhancedResume] = useState<string | null>(null);
  // const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  useEffect(() => {
    getReportById(reportId)
      .then((data) => {
        setReport(data.report);
        if (data.report.enhancedResume) {
          setEnhancedResume(data.report.enhancedResume);
        }
        if (data.report.coverLetter) {
          setCoverLetter(data.report.coverLetter);
        }
      })
      .finally(() => setLoading(false));
  }, [reportId]);

  async function handleEnhance() {
    setEnhancing(true);
    try {
      const data = await enhanceResume(reportId);
      setEnhancedResume(data.enhancedResume);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to enhance resume",
      );
    } finally {
      setEnhancing(false);
    }
  }

  async function handleDeleteReport() {
    try {
      await deleteReport(reportId);
      toast.success("Report deleted");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to delete report");
    }
  }

  function handleCopy() {
    if (!enhancedResume) return;
    navigator.clipboard.writeText(enhancedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!enhancedResume) return;
    const blob = new Blob([enhancedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enhanced-resume-${report?.job.company ?? "hiremind"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownloadTex() {
    setGeneratingTex(true);
    try {
      const data = await generateTexResume(reportId);
      const blob = new Blob([data.texContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `enhanced-resume-${report?.job.company ?? "hiremind"}.tex`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to generate LaTeX resume");
    } finally {
      setGeneratingTex(false);
    }
  }

  async function handleGenerateCoverLetter() {
    setGeneratingCoverLetter(true);
    setCoverLetter("");
    await streamCoverLetter(
      reportId,
      (chunk) => setCoverLetter((prev) => prev + chunk),
      () => setGeneratingCoverLetter(false),
      (msg) => {
        toast.error(msg);
        setGeneratingCoverLetter(false);
      },
    );
  }

  function handleCopyCoverLetter() {
    navigator.clipboard.writeText(coverLetter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  }

  if (loading) return <ReportSkeleton />;

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Report not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground text-left">
      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight">
            <span className="text-foreground">Hire</span>
            <span className="text-primary">Mind</span>
          </span>
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              onClick={() => exportReportPdf(report)}
              className="text-sm border border-border px-4 py-1.5 rounded-full hover:bg-surface
  transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={handleDeleteReport}
              className="text-sm border border-red-300 text-red-500 px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors"
            >
              Delete Report
            </button>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="text-sm border border-border px-4 py-1.5 rounded-full hover:bg-surface
  transition-colors"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Analysis Report</p>
          <h1 className="text-3xl font-extrabold">
            {report.job.title ?? "Untitled Job"}
          </h1>
          {report.job.company && (
            <p className="text-muted-foreground mt-1">{report.job.company}</p>
          )}
        </div>

        {/* SCORE + SUMMARY */}
        <div className="card flex flex-col sm:flex-row items-center gap-8">
          <div className="shrink-0">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(var(--color-primary) ${report.score}%, var(--color-border) 0)`,
              }}
            >
              <div className="w-20 h-20 rounded-full bg-card flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-primary leading-none">
                  {report.score}
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="badge w-fit">
              {report.score >= 85
                ? "Strong Match"
                : report.score >= 70
                  ? "Good Match"
                  : "Needs Work"}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {report.summary}
            </p>
          </div>
        </div>

        {/* SKILL GAPS */}
        <div className="card space-y-4">
          <h2 className="font-bold text-xl">Skill Gaps</h2>
          {report.skillGaps.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No skill gaps found. Great match!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {report.skillGaps.map((gap) => (
                <div
                  key={gap.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border
  ${severityStyles[gap.severity]}`}
                >
                  <span className="font-medium text-sm">{gap.skill}</span>
                  <span className="text-xs font-semibold">{gap.severity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INTERVIEW QUESTIONS */}
        <div className="card space-y-4">
          <h2 className="font-bold text-xl">Interview Questions</h2>
          <div className="space-y-3">
            {report.questions.map((q, i) => {
              const isOpen = openQuestion === q.id;
              return (
                <div
                  key={q.id}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-surface
  transition-colors"
                    onClick={() => setOpenQuestion(isOpen ? null : q.id)}
                  >
                    <span className="font-medium text-sm pr-4">
                      <span className="text-primary font-bold mr-2">
                        Q{i + 1}.
                      </span>
                      {q.question}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                      <div className="bg-surface rounded-lg p-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          What they're assessing
                        </p>
                        <p className="text-sm">{q.intention}</p>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                          Suggested Answer
                        </p>
                        <p className="text-sm leading-relaxed">{q.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ENHANCED RESUME */}
        <div className="card space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-bold text-xl">Enhanced Resume</h2>
              <p className="text-sm text-muted-foreground">
                Generate a version of your resume with the missing skills
                naturally incorporated.
              </p>
            </div>

            {!enhancedResume && (
              <div className="relative group">
                {/* Ambient glow behind button on hover */}
                <div
                  className="absolute inset-0 rounded-full blur-xl scale-125 opacity-0 group-hover:opacity-40
  transition-opacity duration-500 -z-10"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />

                <button
                  onClick={handleEnhance}
                  disabled={enhancing}
                  className="relative btn-primary px-6 py-2 rounded-full text-sm w-auto shrink-0 overflow-hidden
                   transition-all duration-300
                   hover:scale-105 active:scale-95
                   disabled:opacity-70 disabled:cursor-not-allowed
                   disabled:hover:scale-100 disabled:active:scale-100"
                >
                  {/* Shimmer sweep across button while loading */}
                  {enhancing && (
                    <span
                      className="absolute inset-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent"
                      style={{
                        animation: "shimmer-sweep 1.5s ease-in-out infinite",
                      }}
                    />
                  )}

                  {enhancing ? (
                    <span className="relative flex items-center gap-2.5">
                      <span className="flex gap-1 items-end">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: "0.8s",
                            }}
                          />
                        ))}
                      </span>
                      <span>Enhancing</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="inline-block transition-transform duration-700 group-hover:rotate-360">
                        ✦
                      </span>
                      <span>Enhance Resume</span>
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {!enhancedResume && !enhancing && (
            <div
              className="border-2 border-dashed border-border rounded-xl py-10 text-center text-muted-foreground
  text-sm"
            >
              Click "Enhance Resume" to generate a version with your skill gaps
              addressed.
            </div>
          )}

          {enhancedResume && (
            <div className="space-y-3">
              <div className=" items-center ">
                <p className="text-xs text-muted-foreground mb-4">
                  Skills from your gap analysis have been incorporated.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleCopy}
                    className="text-xs border border-border text-foreground px-3 py-1.5 rounded-full
  hover:bg-surface transition-colors font-medium"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-xs border border-border text-foreground px-3 py-1.5 rounded-full
  hover:bg-surface transition-colors font-medium"
                  >
                    Download .txt
                  </button>
                  <button
                    onClick={handleDownloadTex}
                    disabled={generatingTex}
                    className="text-xs border border-border text-foreground px-3 py-1.5 rounded-full
  hover:bg-surface transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingTex ? "Generating..." : "Download .tex"}
                  </button>

                  <button
                    onClick={() => setEnhancedResume(null)}
                    className="text-xs border border-border text-muted-foreground px-3 py-1.5 rounded-full
  hover:bg-surface transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              <pre
                className="whitespace-pre-wrap text-sm leading-relaxed text-foreground bg-surface rounded-xl p-5
  border border-border font-sans max-h-125 overflow-y-auto"
              >
                {enhancedResume}
              </pre>
            </div>
          )}
        </div>

        {/* COVER LETTER */}
        <div className="card space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-bold text-xl">Cover Letter</h2>
              <p className="text-sm text-muted-foreground">
                AI-generated cover letter tailored to this role and your resume.
              </p>
            </div>

            {!coverLetter && (
              <div className="relative group">
                {/* Ambient glow behind button on hover */}
                <div
                  className="absolute inset-0 rounded-full blur-xl scale-125 opacity-0 group-hover:opacity-40
  transition-opacity duration-500 -z-10"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />

                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={generatingCoverLetter}
                  className="relative btn-primary px-6 py-2 rounded-full text-sm w-auto shrink-0 overflow-hidden
                   transition-all duration-300
                   hover:scale-105 active:scale-95
                   disabled:opacity-70 disabled:cursor-not-allowed
                   disabled:hover:scale-100 disabled:active:scale-100"
                >
                  {generatingCoverLetter && (
                    <span
                      className="absolute inset-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent"
                      style={{
                        animation: "shimmer-sweep 1.5s ease-in-out infinite",
                      }}
                    />
                  )}

                  {generatingCoverLetter ? (
                    <span className="relative flex items-center gap-2.5">
                      <span className="flex gap-1 items-end">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: "0.8s",
                            }}
                          />
                        ))}
                      </span>
                      <span>Writing</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="inline-block transition-transform duration-700 group-hover:rotate-360">
                        ✦
                      </span>
                      <span>Generate</span>
                    </span>
                  )}
                </button>
              </div>
            )}
            {/* {!coverLetter && (
              <button
                onClick={handleGenerateCoverLetter}
                disabled={generatingCoverLetter}
                className="btn-primary px-6 py-2 rounded-full text-sm w-auto shrink-0 disabled:opacity-50
  disabled:cursor-not-allowed"
              >
                {generatingCoverLetter ? "Writing..." : "✦ Generate"}
              </button>
            )} */}
          </div>

          {!coverLetter && !generatingCoverLetter && (
            <div
              className="border-2 border-dashed border-border rounded-xl py-10 text-center
  text-muted-foreground text-sm"
            >
              Click "Generate" to create a tailored cover letter.
            </div>
          )}

          {(coverLetter || generatingCoverLetter) && (
            <div className="space-y-3">
              {coverLetter && (
                <div className="flex justify-end gap-2 flex-wrap">
                  <button
                    onClick={handleCopyCoverLetter}
                    className="text-xs border border-border text-foreground px-3 py-1.5 rounded-full
  hover:bg-surface transition-colors font-medium"
                  >
                    {copiedCoverLetter ? "✓ Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() => setCoverLetter("")}
                    className="text-xs border border-border text-muted-foreground px-3 py-1.5 rounded-full
  hover:bg-surface transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              )}
              <pre
                className="whitespace-pre-wrap text-sm leading-relaxed text-foreground bg-surface
  rounded-xl p-5 border border-border font-sans max-h-125 overflow-y-auto"
              >
                {coverLetter}
                {generatingCoverLetter && (
                  <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse align-middle" />
                )}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Report;
