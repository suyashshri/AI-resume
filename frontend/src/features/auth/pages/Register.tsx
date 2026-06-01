import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, handleRegister, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleRegister({ username, email, password });
      navigate({ to: "/dashboard" });
    } catch {
      // error is set in auth context
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between w-full bg-background text-foreground overflow-hidden">
      <div>
        <nav className="flex justify-between items-center mt-2 px-10 mx-10">
          <h2 className="font-extrabold text-2xl tracking-tighter">
            <span className="text-foreground">Hire</span>
            <span className="text-primary">Mind</span>
          </h2>
          <div className="text-sm font-semibold text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="nav-link">
              Log In
            </Link>
          </div>
        </nav>

        <div className="mt-8 flex flex-col lg:flex-row">
          {/* LEFT — brand panel */}
          <div className="w-full lg:w-1/2 mt-6 px-16">
            <div className="badge w-fit">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                <path d="M18 3L18.8 5.2L21 6L18.8 6.8L18 9L17.2 6.8L15 6L17.2 5.2L18 3Z" />
                <path d="M6 16L6.6 17.8L8.4 18.4L6.6 19L6 20.8L5.4 19L3.6 18.4L5.4 17.8L6 16Z" />
              </svg>
              INTELLIGENCE-DRIVEN
            </div>
            <h1 className="hero-title mt-4">
              Design your <span className="hero-highlight">trajectory.</span>
            </h1>
            <p className="hero-desc w-[60%]">
              Start your AI-powered career journey with HireMind. We don't just
              build resumes, we engineer professional evolution.
            </p>
            <div className="mt-8 bg-surface w-[60%] p-4 flex flex-col rounded-2xl">
              <h5 className="text-accent text-sm text-left font-semibold italic">
                AI INSIGHT
              </h5>
              <p
                className="text-sm text-left font-semibold italic text-muted-foreground tracking-tight leading-tight
  mt-1.5"
              >
                "Top 3% of candidates in Architecture & Engineering now leverage
                generative modeling for career pathing. Your journey begins
                here."
              </p>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="flex-1 mt-12 px-6">
            <div className="card w-full lg:w-[70%] mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-extrabold">
                  Create your account
                </div>
                <div className="text-sm text-muted-foreground">
                  Enter your professional details to get started.
                </div>
              </div>

              <div className="flex gap-4">
                <button className="social-btn flex-1" disabled>
                  Google
                </button>
                <button className="social-btn flex-1" disabled>
                  LinkedIn
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex-1 h-0.5 bg-border" />
                OR CONTINUE WITH
                <div className="flex-1 h-0.5 bg-border" />
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                  <label htmlFor="username" className="label">
                    USERNAME
                  </label>
                  <input
                    id="username"
                    className="input"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Alexandria Mercer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="label">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    className="input"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@kinetic.ai"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="label">
                    PASSWORD
                  </label>
                  <div className="relative w-full">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button className="btn-primary mt-2" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="loader" />
                    </div>
                  ) : (
                    "Get Started"
                  )}
                </button>
              </form>

              <div className="footer-text text-center">
                By signing up, you agree to our{" "}
                <span className="footer-link font-medium cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="footer-link font-medium cursor-pointer">
                  AI Ethics Policy
                </span>
                .
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer
        className="flex justify-between items-center mt-4 px-10 py-4 text-xs text-muted-foreground border-t
  border-border"
      >
        <div>
          <p className="font-medium">
            <span className="text-foreground">Hire</span>
            <span className="text-primary">Mind</span>
          </p>
          <p>
            © {new Date().getFullYear()} HireMind. Intelligence-driven career
            growth.
          </p>
        </div>
        <div className="flex gap-6">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="cursor-pointer">AI Ethics</span>
          <span className="cursor-pointer">Contact Support</span>
        </div>
      </footer>
    </main>
  );
};

export default Register;
