import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "../../ui/ThemeToggle";

const features = [
  {
    icon: "◎",
    title: "Resume Score",
    description:
      "Get an instant match score between your resume and any job description. Know exactly where you stand before you apply.",
  },
  {
    icon: "⚡",
    title: "Skill Gap Analysis",
    description:
      "Pinpoint the exact skills missing for your target role, ranked by severity so you know what to learn first.",
  },
  {
    icon: "◈",
    title: "Interview Coach",
    description:
      "Get 5 tailored interview questions with model answers based on your specific resume and job description gaps.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload Resume",
    desc: "Drop your PDF resume. We extract and parse the full text instantly.",
  },
  {
    number: "02",
    title: "Add Job Description",
    desc: "Paste the job description or drop a URL — we'll crawl and extract it.",
  },
  {
    number: "03",
    title: "AI Analysis",
    desc: "Our AI compares your resume against the JD and generates a full report.",
  },
  {
    number: "04",
    title: "Take Action",
    desc: "Review your score, close skill gaps, and prep with targeted questions.",
  },
];

const testimonials = [
  {
    initials: "AR",
    name: "Alex Rivera",
    role: "Senior Engineer @ Stripe",
    quote:
      "HireMind reshaped my entire job search. I went from a 5% callback rate to landing 3 offers in 2 weeks.",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "Product Manager @ Notion",
    quote:
      "The skill gap analysis was brutally accurate. It told me exactly what to learn and I got my dream role in 6 weeks.",
  },
  {
    initials: "MK",
    name: "Marcus Kim",
    role: "ML Engineer @ Anthropic",
    quote:
      "The interview questions it generates are eerily on-point. Every single one came up in my actual interview.",
  },
];

const Landing = () => {
  return (
    <div className="bg-background text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
          <span className="text-xl font-black tracking-tight">
            <span className="text-foreground">Hire</span>
            <span className="text-primary">Mind</span>
          </span>

          <div className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="hover:text-foreground transition-colors"
            >
              Stories
            </a>
          </div>
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link to="/register">
              <button className="btn-primary px-5 py-2 rounded-full text-sm">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl
  pointer-events-none"
          />

          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center py-20">
            {/* LEFT */}
            <div className="space-y-8">
              <div className="badge w-fit">
                ⚡ Intelligence-Driven Career Growth
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                Bridge the gap between your resume and your{" "}
                <span className="text-primary">dream job.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Upload your resume, drop a job description, and get an instant
                AI-powered report — match score, skill gaps, and tailored
                interview questions in seconds.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <button className="btn-primary px-8 py-3 rounded-full">
                    Analyze My Resume →
                  </button>
                </Link>
                <a href="#how-it-works">
                  <button
                    className="border border-border px-8 py-3 rounded-full hover:bg-surface transition-colors
  text-sm font-semibold"
                  >
                    See How It Works
                  </button>
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-10 pt-6 border-t border-border">
                {[
                  { value: "10k+", label: "Resumes Analyzed" },
                  { value: "94%", label: "Interview Rate" },
                  { value: "3.2x", label: "Faster Offers" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-black text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — mock report preview */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl" />
              <div className="relative card p-6 w-full max-w-sm space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Resume Analysis</span>
                  <span className="badge text-xs py-1">⚡ Live Report</span>
                </div>

                {/* Score donut */}
                <div className="flex items-center gap-5">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "conic-gradient(var(--color-primary) 87%, var(--color-border) 0)",
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center">
                      <span className="text-xl font-black text-primary">
                        87
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Strong Match</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Senior Frontend Engineer
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @ Vercel
                    </div>
                  </div>
                </div>

                {/* Skill gaps */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Skill Gaps
                  </div>
                  {[
                    {
                      skill: "Kubernetes",
                      color: "text-red-500 bg-red-50",
                      label: "High",
                    },
                    {
                      skill: "GraphQL",
                      color: "text-yellow-600 bg-yellow-50",
                      label: "Medium",
                    },
                    {
                      skill: "Turborepo",
                      color: "text-green-600 bg-green-50",
                      label: "Low",
                    },
                  ].map((gap) => (
                    <div
                      key={gap.skill}
                      className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <span className="text-sm">{gap.skill}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${gap.color}`}
                      >
                        {gap.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Questions teaser */}
                <div className="bg-surface rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-accent)" }}
                    >
                      5 Interview Questions Ready
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Tailored to your skill gaps
                    </div>
                  </div>
                  <span className="text-primary font-bold">→</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-4">
              <div className="badge mx-auto w-fit">Core Features</div>
              <h2 className="text-4xl font-bold">
                Everything you need to land the role
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Three powerful tools that work together to give you an unfair
                advantage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="card p-8 space-y-4 hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl text-primary">{feature.icon}</div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-4">
              <div className="badge mx-auto w-fit">Process</div>
              <h2 className="text-4xl font-bold">
                From upload to offer in 4 steps
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step) => (
                <div key={step.number} className="card p-6 space-y-3">
                  <div
                    className="text-4xl font-black"
                    style={{ color: "var(--color-primary)", opacity: 0.25 }}
                  >
                    {step.number}
                  </div>
                  <h4 className="font-bold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-4">
              <div className="badge mx-auto w-fit">Success Stories</div>
              <h2 className="text-4xl font-bold">People who made the leap</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-6 space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white
  flex-shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 text-center px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-5xl font-extrabold tracking-tight">
              Your next chapter{" "}
              <span className="text-primary">starts here.</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of professionals using AI to accelerate their
              careers.
            </p>
            <Link to="/register">
              <button className="btn-primary px-12 py-4 rounded-full text-base mt-4">
                Analyze My Resume — It's Free
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div
          className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm
  text-muted-foreground"
        >
          <div>
            <span className="font-black text-base">
              <span className="text-foreground">Hire</span>
              <span className="text-primary">Mind</span>
            </span>
            <p className="text-xs mt-1">
              © {new Date().getFullYear()} HireMind. Intelligence-driven career
              growth.
            </p>
          </div>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Privacy
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Terms
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              AI Ethics
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Support
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
