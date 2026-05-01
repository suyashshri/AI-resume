const Landing = () => {
  return (
    <div className="bg-background text-foreground font-sans">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <span className="text-xl font-black tracking-tight">HireMind</span>

          <div className="hidden md:flex gap-8 text-sm">
            <a className="text-primary font-semibold border-b-2 border-primary pb-1">
              Platform
            </a>
            <a className="text-muted-foreground hover:text-primary">Roadmaps</a>
            <a className="text-muted-foreground hover:text-primary">
              Interview Prep
            </a>
            <a className="text-muted-foreground hover:text-primary">
              Success Stories
            </a>
          </div>

          <div className="flex gap-4">
            <button className="text-muted-foreground hover:text-primary">
              Log In
            </button>
            <button className="btn-primary px-5 py-2 rounded-full">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* HERO */}
        <section className="min-h-screen flex items-center px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* LEFT */}
            <div className="space-y-6">
              <div className="badge w-fit">
                ⚡ Intelligence-Driven Career Growth
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight max-w-xl">
                Bridge the Gap Between Your Resume and Your{" "}
                <span className="text-primary">Dream Job.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md">
                The power of AI combined with editorial precision. Map your
                professional trajectory with a system that thinks like a
                recruiter.
              </p>

              <div className="flex gap-4 pt-4">
                <button className="btn-primary px-8 py-3 rounded-full">
                  Analyze Resume
                </button>
                <button className="border border-border px-8 py-3 rounded-full hover:bg-surface transition">
                  View Demo
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex justify-center">
              <div className="absolute w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQSyLwssaQPWZ7NbwUfnmDdz26du3q2E2-4vJ0IxM7b83_kOpfFMdrI7Q134g7ySugikU8DZGzBW24gC3aZAoqymflpN6y4V9klqsAyqcO-jgGr0g8Qs-CL5uvuy8ZtCjH3iFS1FHeEngNUeexrtmvKqhlWYUYgtg0nUpLb0RrV4Uk9zNhJ_N4TqZO10K-PyLcGgXJ70pHR3CIV9CXHwT6kC7HhaYKsUYZtVQIFqAA_05Qj272EAK-Hsy2O7JbF9vS163KDfjY_eE"
                className="relative z-10 w-80 h-80 object-cover rounded-full shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div>
              <h2 className="text-3xl font-bold">Architect Your Identity</h2>
              <p className="text-muted-foreground max-w-lg mt-3">
                Move beyond templates. Build a narrative that stands out.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="font-semibold text-lg">Skill Gap Analyzer</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Identify missing skills instantly.
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg">Interview Coach</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  AI-powered mock interviews.
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg">Roadmap Generator</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Personalized learning path.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
            <div>
              <h2 className="text-4xl font-bold">The 4-Step Blueprint</h2>
              <p className="text-muted-foreground mt-2">From scan to success</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {["Upload", "Analyze", "Roadmap", "Optimize"].map((step, i) => (
                <div key={i} className="card text-left">
                  <div className="text-4xl font-bold text-primary/20">
                    0{i + 1}
                  </div>
                  <h4 className="font-semibold mt-3">{step}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-24 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <p className="text-xl italic">
              "HireMind reshaped my entire professional journey. I got 3 offers
              in 2 weeks."
            </p>
            <p className="font-semibold">— Alex Rivera</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center space-y-6">
          <h2 className="text-4xl font-bold">Your Next Chapter Starts Here.</h2>
          <p className="text-muted-foreground">
            Join thousands of professionals using AI.
          </p>
          <button className="btn-primary px-10 py-4 rounded-full">
            Analyze My Resume
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between text-sm text-muted-foreground">
          <span>© 2024 HireMind</span>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
