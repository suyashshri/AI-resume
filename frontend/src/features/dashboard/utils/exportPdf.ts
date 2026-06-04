import jsPDF from "jspdf";

type SkillGap = { skill: string; severity: string };
type Question = { question: string; intention: string; answer: string };

export function exportReportPdf(report: {
  score: number;
  summary: string | null;
  skillGaps: SkillGap[];
  questions: Question[];
  job: { title: string | null; company: string | null };
}) {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = margin;

  function addText(
    text: string,
    size: number,
    style: "normal" | "bold" = "normal",
    color: [number, number, number] = [15, 23, 42],
  ) {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    if (y + lines.length * size * 0.4 > 270) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines, margin, y);
    y += lines.length * size * 0.4 + 4;
  }

  function addDivider() {
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("HireMind — Analysis Report", margin, 12);
  y = 28;

  addText(
    `${report.job.title ?? "Job"} ${report.job.company ? `at ${report.job.company}` : ""}`,
    16,
    "bold",
  );
  addText(`Match Score: ${report.score}/100`, 12, "bold", [37, 99, 235]);
  y += 4;

  addDivider();
  addText("Summary", 13, "bold");
  addText(report.summary ?? "", 10);
  y += 4;

  addDivider();
  addText("Skill Gaps", 13, "bold");
  report.skillGaps.forEach((gap) => {
    const color: [number, number, number] =
      gap.severity === "High"
        ? [220, 38, 38]
        : gap.severity === "Medium"
          ? [202, 138, 4]
          : [22, 163, 74];
    addText(`• ${gap.skill} — ${gap.severity}`, 10, "normal", color);
  });
  y += 4;

  addDivider();
  addText("Interview Questions", 13, "bold");
  report.questions.forEach((q, i) => {
    y += 2;
    addText(`Q${i + 1}. ${q.question}`, 10, "bold");
    addText(
      `What they're assessing: ${q.intention}`,
      9,
      "normal",
      [100, 116, 139],
    );
    addText(`Suggested answer: ${q.answer}`, 9);
    y += 2;
  });

  doc.save(`hiremind-report-${report.job.company ?? "report"}.pdf`);
}
