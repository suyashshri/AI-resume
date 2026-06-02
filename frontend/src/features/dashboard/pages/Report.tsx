import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { getReportById } from "../services/report.service";

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

  useEffect(() => {
    getReportById(reportId)
      .then((data) => setReport(data.report))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

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
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="text-sm border border-border px-4 py-1.5 rounded-full hover:bg-surface transition-colors"
          >
            ← Back to Dashboard
          </button>
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
              {report.score >= 80
                ? "Strong Match"
                : report.score >= 60
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
      </main>
    </div>
  );
};

export default Report;
